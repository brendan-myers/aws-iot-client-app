import { h, Component } from 'preact';
import style from './style';
import { route } from 'preact-router';
import { Lightbulb } from 'components/device';

export default class Overview extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: true
		};
	}
	
    
    renderDevices = devices => {
        const rendered = [];

        this.props.devices.map(device => {
            rendered.push(
				<Lightbulb
					aws={ this.props.aws }
					iotdata={ this.props.iotdata }
					device={ device }
					mqttClient={ this.props.mqttClient }
				/>
            );
		});

        return rendered;
	};


	render = ({ aws, devices, iotdata }, { loading }) => {
		return (
			<div class={ style.container }>
				<div class={ style.row }>
					<div class={ style.eight + ' ' + style.columns }>
						<h1 class={ style.nomargin }>Devices</h1>
						<a href="/">Logout</a><br/>
					</div>
				</div>
				<div class={ style.row }>
					<div class={ style.twelve + ' ' + style.columns }>
                        { this.renderDevices(devices) }
					</div>
				</div>
			</div>
		);
	}
}