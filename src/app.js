import { h, Component } from 'preact';
import { Router, route } from 'preact-router';
import Promise from 'promise-polyfill'; 

import AWS from "aws-sdk";
import AWSMqtt from 'aws-mqtt';
import { CognitoUserPool, AuthenticationDetails, CognitoUser }
	from "amazon-cognito-identity-js";

import { Login } from './scenes/login';
import { Overview } from './scenes/overview';
const config = require('./config');

// To add to window
if (!window.Promise) {
  window.Promise = Promise;
}

export default class App extends Component {
	constructor(props) {
		super(props);

		AWS.config.region = config.REGION;

		this.state = {
			AWS,
			devices: [],
			iotdata: {},
			mqttClient: {}
		};
	}


	/**
	 * Handle login event
	 */
	login = (username, password) => {
		return new Promise((resolve, reject) => {
			var poolData = {
				UserPoolId : config.USER_POOL_ID,
				ClientId   : config.USER_POOL_CLIENT_ID
			};
			
			var userPool = 
				new CognitoUserPool(poolData);
			
			var userData = {
				Username : username,
				Pool     : userPool
			};

			var authenticationData = {
				Username : username,
				Password : password,
			};

			var authenticationDetails = 
				new AuthenticationDetails(authenticationData);

			var cognitoUser = 
				new CognitoUser(userData);

			cognitoUser.authenticateUser(authenticationDetails, {
				onSuccess: result => {
					this.successfulLogin(cognitoUser, resolve, reject);
				},

				onFailure: err => {
					reject(err);
				},

				newPasswordRequired: (userAttributes, requiredAttributes) => {
					let newPassword = password;
					let attributesData = {};
					
					cognitoUser.completeNewPasswordChallenge(
						newPassword, attributesData, this);
				}
			});
		});
	};


	/**
	 * Handler for successful logins
	 */
	successfulLogin = (cognitoUser, resolve, reject) => {
		cognitoUser.getSession((err, res) => {
			if (err) {
				reject(err);
			}
			
			// Add the User's Id Token to the Cognito credentials login map.
			AWS.config.credentials = 
				new AWS.CognitoIdentityCredentials({
					IdentityPoolId: config.IDENTITY_POOL_ID,
					Logins: {
						[config.PROVIDER_ID]: 
							res.getIdToken().getJwtToken()
					}
				});

			// Make the call to obtain credentials
			AWS.config.credentials.get(() => {
				const mqttClient = AWSMqtt.connect({
					WebSocket	: window.WebSocket,
					region		: AWS.config.region,
					credentials	: AWS.config.credentials,
					endpoint	: config.IOT_ENDPOINT,
					clientId	: config.MQTT_CLIENT_ID
				});

				this.setState({ mqttClient });
			
				// handler for incoming device updates
				mqttClient.on('message', this.handleDeviceUpdate);

				this.fetchDevices();
				route('/overview');
				resolve();
			});
		});
	};


	/**
	 * Retrieve devices from AWS
	 */
    fetchDevices = () => {
		new AWS.Iot().listThings({}, (err, data) => {
			if (err) {
				console.log(err, err.stack);
				return;
			}
			
			const iotdata = new AWS.IotData({ endpoint: config.IOT_ENDPOINT });
			let promises = [];

			// fetch the device shadow for each device
			data.things.map(device => {
				promises.push(new Promise((resolve, reject) => {
					const params = { thingName: device.thingName };

					iotdata.getThingShadow(params, (err, data) => {
						if (err) {
							reject(err);
						}

						let state = Object.assign(
							JSON.parse(data.payload).state.reported || {}, 
							JSON.parse(data.payload).state.desired || {}
						);

						device.state = state;

						resolve(device);
					});
				}));
			});

			Promise.all(promises).then(devices => {
				this.setState({ 
					devices,
					iotdata
				});
			}).catch(ex => {
				console.log(ex);
			});
        });
	};
	

	/**
	 * Handle incoming device updates
	 */
	handleDeviceUpdate = (topic, message) => {
		const thingName = topic.split('/')[2];
		const type      = topic.split('/')[4];
		const status    = topic.split('/')[5];

		if (type === 'update' && status === 'accepted') {
			const payload = JSON.parse(message.toString());
			const devices = this.state.devices;

			// TODO use a map instead of interating
			// over a list
			devices.map(device => {
				// look for the matching device
				if (device.thingName === thingName) {
					// either use the entire state, or map over
					// the changes
					if (payload.state.reported) {
						device.state = payload.state.reported;
					} else if (payload.state.desired) {
						device.state = 
							Object.assign(device.state, payload.state.desired);
					}
				}
			});

			this.setState({ devices });
		}
	};


	handleRoute = e => {
		this.currentUrl = e.url;
	};


	render({}, { AWS, devices, iotdata, mqttClient }) {
		return (
			<div id="app">
				<Router onChange={this.handleRoute}>
					<Login
						default
						login={ this.login }
					/>

					<Overview
						path='overview'
						aws={ AWS }
						devices={ devices }
						iotdata={ iotdata }
						mqttClient={ mqttClient }
					/>
				</Router>
			</div>
		);
	}
}