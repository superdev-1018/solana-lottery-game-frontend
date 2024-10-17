import { ReactNode, useMemo, useCallback } from 'react'
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletError } from '@solana/wallet-adapter-base'
import {
  GlowWalletAdapter,
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import '@/assets/style/WalletAdapter.css'
import { useSnackbar } from 'notistack'
import { useRecoilValue } from 'recoil'
import { walletState } from '@/store/wallet'
import { RPC_ENDPOINT } from '@/anchor/constants';
import { GlobalContext, GlobalStateContext } from '@/anchor/global'

type Props = {
  children: ReactNode
}

export default function SolanaWalletProvider({ children }: Props) {
  const { network, endpoint } = useRecoilValue(walletState)

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new LedgerWalletAdapter(),
      new TorusWalletAdapter(),
    ],
    [network]
  )

  const { enqueueSnackbar } = useSnackbar()
  const onError = useCallback(
    (error: WalletError) => {
      enqueueSnackbar(
        error.message ? `${error.name}: ${error.message}` : error.name,
        { variant: 'error' }
      )
      console.error(error)
    },
    [enqueueSnackbar]
  )

  return (
    <>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} onError={onError}>
          <WalletModalProvider>
            <GlobalStateContext>
              {children}
            </GlobalStateContext>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  )
}
