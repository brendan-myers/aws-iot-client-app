import { h, Component } from 'preact';
import style from './style';

export default class Lightbulb extends Component {
	constructor(props) {
		super(props);

		// subscribe to updates for this device
		this.props.mqttClient.subscribe(
			'$aws/things/' + props.device.thingName + '/shadow/+');
		this.props.mqttClient.subscribe(
			'$aws/things/' + props.device.thingName + '/shadow/+/+');
	}


	/**
	 * 
	 */
	updateDevice = e => {
		e.preventDefault();

		const payload = {
			state: {
				desired: {
					[e.target.dataset.param]: e.target.value
				}
			}
		};

		const params = {
			payload   : JSON.stringify(payload),
			thingName : this.props.device.thingName
		};

		this.props.iotdata.updateThingShadow(params, () => {});
	};


	renderState = deviceState => {
		if (deviceState) {
			let redStyle   = 
				deviceState.colour === 'red'   ? 'button-primary' : 'button';
			let greenStyle =
				deviceState.colour === 'green' ? 'button-primary' : 'button';
			let blueStyle  =
				deviceState.colour === 'blue'  ? 'button-primary' : 'button';

			let onStyle = 
				deviceState.powered === true || deviceState.powered === 'true' ?
					'button-primary' : 'button';
			let offStyle = 
				!deviceState.powered || deviceState.powered === 'false' ?
					'button-primary' : 'button';

			return (
				<div>
					<div class={ style.row }>
						<div class={ style.twelve + ' ' + style.columns }>
							Brightness:
						</div>
					</div>

					<div class={ style.row }>
						<div class={ style.twelve + ' ' + style.columns }>
							<input
								data-param='brightness' 
								onclick={ this.updateDevice }
								type='number'
								value={ deviceState.brightness }
							/>
						</div>
					</div>

					<div class={ style.row }>
						<div class={ style.twelve + ' ' + style.columns }>
							<button
								data-param='brightness' 
								value={ parseInt(deviceState.brightness) + 1 }
								onclick={ this.updateDevice } 
								class={ style['button'] }>
								+
							</button>
							<button
								data-param='brightness' 
								value={ parseInt(deviceState.brightness) - 1 }
								onclick={ this.updateDevice } 
								class={ style['button'] }>
								-
							</button>
						</div>
					</div>
					
					<div class={ style.row }>
						<div class={ style.twelve + ' ' + style.columns }>
							Colour:
						</div>
					</div>
					
					<div class={ style.row }>
						<div class={ style.twelve + ' ' + style.columns }>
							<button
								data-param='colour' 
								value='red'
								onclick={ this.updateDevice } 
								class={ style[redStyle] }>
								Red
							</button>
							<button
								data-param='colour' 
								value='green'
								onclick={ this.updateDevice } 
								class={ style[greenStyle] }>
								Green
							</button>
							<button
								data-param='colour' 
								value='blue'
								onclick={ this.updateDevice } 
								class={ style[blueStyle] }>
								Blue
							</button>
						</div>
					</div>

					<div class={ style.row }>
						<div class={ style.twelve + ' ' + style.columns }>
							Powered:
						</div>
					</div>
					
					<div class={ style.row }>
						<div class={ style.twelve + ' ' + style.columns }>
							<button
								data-param='powered' 
								value={ 'true' }
								onclick={ this.updateDevice } 
								class={ style[onStyle] }>
								On
							</button>
							<button
								data-param='powered' 
								value={ 'false' }
								onclick={ this.updateDevice } 
								class={ style[offStyle] }>
								Off
							</button>
						</div>
					</div>
				</div>
			);
		}
	};


	render = ({ device }, {}) => {
		return (
			<div class={ style.device }>
				<div class={ style.type }>
					{ device.thingTypeName }
				</div>
				
				<div class={ style.name }>
					{ device.thingName }
				</div>
				
				Location: { device.attributes.location }
				
				{ this.renderState(device.state) }
			</div>
		);
	};
}