import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { CustomThemeProvider } from './context/ThemeContext';
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter } from 'react-router-dom';

const domain = process.env.REACT_APP_AUTH0_DOMAIN!;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID!;
const audience = process.env.REACT_APP_AUTH0_AUDIENCE!;
const apiUrl = process.env.REACT_APP_API_URL!;

if (!domain || !clientId || !apiUrl) {
  throw new Error("Missing Auth0 environment variables");
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          redirect_uri: window.location.origin + '/dashboard',
          audience: audience,
          scope: 'openid profile email offline_access'
        }}
        useRefreshTokens={true}
        cacheLocation="localstorage"
      >
        <CustomThemeProvider>
          <App />
        </CustomThemeProvider>
      </Auth0Provider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
