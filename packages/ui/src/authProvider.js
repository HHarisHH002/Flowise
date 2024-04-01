import { MsalAuthProvider, LoginType } from 'react-aad-msal'

// The auth provider should be a singleton. Best practice is to only have it ever instantiated once.
// Avoid creating an instance inside the component it will be recreated on each render.
// If two providers are created on the same page it will cause authentication errors.
export const authProvider = new MsalAuthProvider(
    {
        auth: {
            authority: 'https://login.microsoftonline.com/906aefe9-76a7-4f65-b82d-5ec20775d5aa',
            clientId: 'b113ebb6-c0be-47b7-8b3d-57ab2e28d203',
            postLogoutRedirectUri: window.location.origin + '/chatflows',
            redirectUri: window.location.origin + '/chatflows',
            validateAuthority: true,
            navigateToLoginRequestUrl: true
        },
        cache: {
            cacheLocation: 'sessionStorage',
            storeAuthStateInCookie: false
        }
    },
    {
        scopes: ['openid', 'user.read']
    },
    {
        loginType: LoginType.Redirect
        // tokenRefreshUri: window.location.origin + "/auth.html"
    },
    {
        redirectUri: window.location.origin + '/chatflows',
        redirectStartPage: window.location.origin + '/chatflows'
    }
)
