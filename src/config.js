export const REGION              = '<aws region>';
export const USER_POOL_ID        = '<cognito user pool id>';
export const USER_POOL_CLIENT_ID = '<cognito app client id>';
export const IDENTITY_POOL_ID    = '<cognito identity pool id>>';
export const PROVIDER_ID         = 'cognito-idp.' + REGION + '.amazonaws.com/' + USER_POOL_ID;
export const IOT_ENDPOINT        = '<awsiot custom endpoint>';
export const MQTT_CLIENT_ID      = 'mqtt-client-' + (Math.floor((Math.random() * 100000) + 1));