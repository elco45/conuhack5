var environments = {
  staging: {
    FIREBASE_API_KEY: 'AIzaSyCaDXt48MJ-SQIniEWlHOslYketW1GHZro',
    FIREBASE_AUTH_DOMAIN: 'lingoexplore-89549.firebaseapp.com',
    FIREBASE_DATABASE_URL: 'https://lingoexplore-89549.firebaseio.com',
    FIREBASE_PROJECT_ID: 'lingoexplore-89549',
    FIREBASE_STORAGE_BUCKET: 'lingoexplore-89549.appspot.com',
    FIREBASE_MESSAGING_SENDER_ID: '226301604773',
    FIREBASE_APP_ID: '1:226301604773:web:0ac52c829315c138cc2e4c',
    SHUTTERSTOCK_CUSTOMER_ID: '98348-1cfd2-68af7-46bf1-1a184-4e86c',
    SHUTTERSTOCK_CUSTOMER_SECRET: 'f8fe9-4e945-c14f0-fb16d-1545d-59e86'
  },
  production: {
    // Warning: This file still gets included in your native binary and is not a secure way to store secrets if you build for the app stores. Details: https://github.com/expo/expo/issues/83
  }
};

function getReleaseChannel() {
  let releaseChannel = Expo.Constants.manifest.releaseChannel;
  if (releaseChannel === undefined) {
    return 'staging';
  } else if (releaseChannel === 'staging') {
    return 'staging';
  } else {
    return 'staging';
  }
}
function getEnvironment(env) {
  console.log('Release Channel: ', getReleaseChannel());
  return environments[env];
}
var Environment = getEnvironment(getReleaseChannel());
export default Environment;
