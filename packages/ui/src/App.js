import { useSelector } from 'react-redux'

import { CssBaseline, StyledEngineProvider } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'

// routing
import Routes from 'routes'

// defaultTheme
import themes from 'themes'

// project imports
import Init from 'Init'
import NavigationScroll from 'layout/NavigationScroll'

// ==============================|| APP ||============================== //

const App = () => {
    const customization = useSelector((state) => state.customization)

    return (
        // <>
        //     {' '}
        //     {localStorage.getItem('account') == null ? (
        //         <>
        //             {' '}
        //             <Init />{' '}
        //         </>
        //     ) : (
        <>
            <Init />
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={themes(customization)}>
                    <CssBaseline />
                    <NavigationScroll>
                        <Routes />
                    </NavigationScroll>
                </ThemeProvider>
            </StyledEngineProvider>
        </>
        //     )}
        // </>
    )
}

export default App
