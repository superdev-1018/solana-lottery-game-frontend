import '@/lib/i18n'
import { Suspense, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import 'react-lazy-load-image-component/src/effects/opacity.css'
import AppLoading from '@/components/loading/AppLoading'
import { SnackbarProvider } from 'notistack'
import { makeTheme } from '@/constants/theme'
import DefaultLayout from '@/layouts/default/DefaultLayout'
import DefaultRoute from '@/routes/DefaultRoute'
import { RecoilRoot, useRecoilValue } from 'recoil'
import { colorModeState } from '@/store/colorMode'
import SolanaWalletProvider from '@/components/provider/SolanaWalletProvider'
import "@solana/wallet-adapter-react-ui/styles.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SocketProvider } from '@/context/SocketContext'


function InnerApp() {
  const { i18n } = useTranslation()
  const isEnglish = useMemo(() => i18n.language === 'en-US', [i18n])
  const colorMode = useRecoilValue(colorModeState)
  const theme = makeTheme(isEnglish, colorMode);


  return (

          <SocketProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
          >
            <SolanaWalletProvider>
            <ToastContainer />
              <BrowserRouter>
                <Routes>
                  <Route
                    path="*"
                    element={
                      <DefaultLayout>
                        <DefaultRoute />
                      </DefaultLayout>
                    }
                  />
                </Routes>
              </BrowserRouter>
            </SolanaWalletProvider>
          </SnackbarProvider>
        </ThemeProvider>
                </SocketProvider>
  )
}

export default function App() {
  return (
    <RecoilRoot>
      <Suspense fallback={<AppLoading />}>
        <InnerApp />
      </Suspense>
    </RecoilRoot>
  )
}
