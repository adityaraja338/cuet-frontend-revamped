import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from '../../../environments/environment';

export const googleAuthConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  redirectUri: environment.redirectUri,
  clientId: environment.clientId,
  strictDiscoveryDocumentValidation: false,
  scope: 'openid profile email',
  responseType: 'code token id_token',
  showDebugInformation: true,
};
