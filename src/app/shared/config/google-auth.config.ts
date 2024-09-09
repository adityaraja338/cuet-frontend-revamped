import { AuthConfig } from 'angular-oauth2-oidc';

export const googleAuthConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  redirectUri: 'http://localhost:4200/',
  clientId:
    '341324670238-tbad5skqcecnhfnjgjofi9dpeh9c2pfj.apps.googleusercontent.com',
  strictDiscoveryDocumentValidation: false,
  scope: 'openid profile email',
  responseType: 'code token id_token',
  showDebugInformation: true,
};
