A simple Gmail client made with [Create-React-App](https://github.com/facebook/create-react-app) + [React-Redux](https://github.com/reduxjs/react-redux), using [Gmail's public Javascript API](https://developers.google.com/gmail/api/). It also uses [React Router](https://github.com/ReactTraining/react-router) to add some routing features.

It is meant to be a simple demo of utilizing live data from a RESTful API by using React development tools. It can be useful as a starting point for anyone wanting to fork it and extend it for their own ideas of a custom JavaScript Gmail client; or simply as a reference on using client-side Javascript to consume Gmail data. It is a non-ejected [Create-React-App v2](https://github.com/facebook/create-react-app) app; convenient as you can [customize](https://facebook.github.io/create-react-app/docs/available-scripts#npm-run-eject) project configs if you need to.


**How does it work?**  
The account sign-in and authentication process is **totally managed by Gmail's secure protocols**.  The workflow is as follows:

 - First-time users will see a landing page with a button to sign in to
   Gmail.
 - Once successfully signed-in, Gmail will display a screen asking the
   user for permission to use the account in the application.
  - After permission is granted, the application will load all account data and display the Inbox folder.

**IMPORTANT:** The application does **NOT** store or persist any account or user data in any way at all. It simply fetches data from Gmail's API and displays it in the browser.


  
  

**Requirements:**

  

- All Gmail API requests require an ***API Key*** and an ***OAuth 2.0 Client ID***. You can follow [these instructions](https://developers.google.com/fit/android/get-api-key) to obtain those credentials. Then, store those two values in the ***[.env](https://facebook.github.io/create-react-app/docs/adding-custom-environment-variables)*** file located in the root folder by replacing `<YOUR_API_KEY>` and `<YOUR_CLIENT_ID>` respectively.

  

  

Features:

- Responsive Viewport (with Bootstrap and CSS3 flexbox styling)

- Read, Send, Reply, Move to Trash.

  

TODO Features:

- [ ] Caching / memoizing fetched data (important due to [Gmail API Usage Limits](https://developers.google.com/gmail/api/v1/reference/quota))

- [ ] Add support for push notifications

- [ ] Improve responsive layout for mobile devices

- [ ] TDD tests

- [ ] Display message label markers

- [ ] Add message forwarding functionality

- [x] Add message search functionality

- [ ] Add hover action buttons for each message in list view

- [ ] Add support for sending message attachments

- [ ] Add support for label create/edit

- [ ] Add support for changing message labels

- [ ] Add advanced WYSIWYG text editor

- [ ] Move / Drag & Drop messages into folders/labels

- [ ] Add support for theming

- [ ] Add support for localization


---
LICENSE: [MIT License](https://opensource.org/licenses/MIT)
