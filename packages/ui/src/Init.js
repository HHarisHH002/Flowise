import * as React from 'react'
import { AuthenticationState, AzureAD, LoginType } from 'react-aad-msal'

// Import the authentication provider which holds the default settings
import { authProvider } from './authProvider'

class Init extends React.Component {
    constructor(props) {
        super(props)
        const options = authProvider.getProviderOptions()
        options.loginType = LoginType.Popup
        authProvider.setProviderOptions(options)
    }

    render() {
        return (
            <AzureAD provider={authProvider} forceLogin={true}>
                {({ login, logout, authenticationState }) => {
                    const isInProgress = authenticationState === AuthenticationState.InProgress
                    const isAuthenticated = authenticationState === AuthenticationState.Authenticated
                    const isUnauthenticated = authenticationState === AuthenticationState.Unauthenticated

                    if (isAuthenticated) {
                        if (localStorage.getItem('account') === null || localStorage.getItem('token') === null) {
                            localStorage.setItem('account', JSON.stringify(authProvider.getAccount()))
                            authProvider.getIdToken().then((token) => {
                                localStorage.setItem('token', token.idToken.rawIdToken)
                            })
                        }

                        return <></>
                    } else if (isUnauthenticated || isInProgress) {
                        return null
                    }
                }}
            </AzureAD>
        )
    }
}
export default Init
