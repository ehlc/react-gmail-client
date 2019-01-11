export const signIn = () => {
  return window.gapi.auth2
    .getAuthInstance()
    .signIn()
}

export const initGmailClient = (apiKey, clientId) => {
  const API_KEY = process.env.REACT_APP_API_KEY;
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

  // Array of API discovery doc URLs for APIs
  const DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"
  ];

  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  // More info: https://developers.google.com/identity/protocols/googlescopes
  const SCOPES = "https://mail.google.com/"; // Scope for Read, send, delete, and manage your email

  const gapi = window.gapi;

  return gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  });
};

export const checkSignInStatus = () => {  

  return new Promise((resolve, reject) => {
    initGmailClient().then(_ => {
      const gapi = window.gapi;

      const googleAuthInstance = gapi.auth2.getAuthInstance();

      const isSignedIn = googleAuthInstance.isSignedIn.get();

      if (isSignedIn) {
        // Listen for sign-in state changes.
        googleAuthInstance.isSignedIn.listen(isSignedIn => {
          updateSigninStatus(isSignedIn);
        });

        console.log("AUTH_SUCCESS from checkSignInStatus");

        resolve(googleAuthInstance.currentUser.Ab);

      } else {
        reject();
      }
    })
      .catch(error => {
        reject(error);
      });
  })

    
  
};

// Listener for sign-in state
export const updateSigninStatus = (isSignedIn) => {
  if (!isSignedIn) {
    // TODO: react to logged out status
  }
};

export const signOut = () => {
  return window.gapi.auth2
    .getAuthInstance()
    .signOut()
};