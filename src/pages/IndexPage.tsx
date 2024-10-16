import { useState, useEffect, useCallback, Key } from 'react'
import { Program } from '@coral-xyz/anchor'
import { Lottery } from '@/anchor/idl'
import {
  Container,
  Grid,
  Paper,
  Typography,
  useMediaQuery,
  Link,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import DataLoading from '@/components/loading/DataLoading'
import BlockLoading from '@/components/loading/BlockLoading'

import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useTranslation } from 'react-i18next'
import {
  getTransactions,
  TransactionWithSignature,
} from '@/model/transaction/Transaction'
import { useRecoilValue } from 'recoil'
import { walletState } from '@/store/wallet'
import { useSnackbar } from 'notistack'
import GameCard from '@/components/main/game_card'
import * as imgList from '@/assets'
import { useGlobalState } from '@/hooks/useGlobalState'
import { getProgram } from '@/anchor/program'
import { formatTime } from '@/utils/util'

export default function IndexPage() {
  const { t } = useTranslation(['translation'])

  const wallet = useWallet()
  const { network } = useRecoilValue(walletState)
  const [transactionsWS, setTransactionsWS] =
    useState<TransactionWithSignature[]>()
  const [loading, setLoading] = useState(false)
  const [lotteryList, setLotteryList] = useState<any[]>([])
  const [program, setProgram] = useState<Program<Lottery> | null>(null)
  const [winnerTicker, setWinnerTicker] = useState<any | null>(null)
  const [depositeTicker, setDepositeTicker] = useState<any | null>(null)

  const theme = useTheme()
  const xsDisplay = useMediaQuery(theme.breakpoints.down('sm'))
  const { enqueueSnackbar } = useSnackbar()
  const { connection } = useConnection()
  const { getDepositeTicker, getWinnerTicker } = useGlobalState()

  useEffect(() => {
    if (!wallet) return
    if (connection) {
      setProgram(getProgram(connection, wallet ?? {}))
    } else {
      setProgram(null)
    }
  }, [connection, wallet])

  useEffect(() => {
    const getLottery = async () => {
      const lotteryData = await program?.account.lottery.all()

      if (!lotteryData) return
      const openedLottery = lotteryData
        .filter((lottery) => lottery.account.state === 0)
        .map((lottery) => ({
          account: {
            id: lottery.account.id,
            timeFrame: lottery.account.timeFrame,
            ticketPrice: lottery.account.ticketPrice,
            maxTicket: lottery.account.maxTicket,
            devFee: lottery.account.devFee,
            startTime: lottery.account.startTime,
            endTime: lottery.account.endTime,
            state: lottery.account.state,
            participants: lottery.account.participants.map((pubkey) =>
              pubkey.toString()
            ),
            winner: lottery.account.winner,
            prizePercent: lottery.account.prizePercent,
            winnerPrize: lottery.account.winnerPrize,
            realPoolAmount: lottery.account.realPoolAmount,
            realCount: lottery.account.realCount,
            round: lottery.account.round,
          },
          publicKey: lottery.publicKey,
        }))
      setLotteryList(openedLottery)
    }
    getLottery()
  }, [wallet])

  useEffect(() => {
    const winnerTickerFn = async () => {
      let winnerTicker = await getWinnerTicker()
      let depositeTicker = await getDepositeTicker()
      console.log(winnerTicker, depositeTicker, '******')
      setWinnerTicker(winnerTicker)
      setDepositeTicker(depositeTicker)
    }
    winnerTickerFn()

    const interval = setInterval(() => {
      winnerTickerFn()
    }, 60000)

    return () => {
      clearInterval(interval)
    }
  }, [wallet, connection])

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    try {
      if (wallet.publicKey) {
        const transactionsWS = await getTransactions(
          connection,
          wallet.publicKey
        )
        setTransactionsWS(transactionsWS)
      }
    } catch {
      // enqueueSnackbar(`${t('sendTokenError')}`, { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }, [wallet.publicKey])

  useEffect(() => {
    fetchTransactions()
  }, [wallet.publicKey])

  return (
    <>
      <Container maxWidth={false} sx={{ padding: '20px' }}>
        <Paper
          elevation={3}
          sx={{
            borderRadius: '5px',
            padding: '5px',
            backgroundColor: 'transparent',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontFamily: 'Roboto,sans-serif',
              fontSize: {
                xs: '15px',
                sm: '20px',
                md: '20px',
                lg: '24px',
                color: 'white',
              },
            }}
          >
            Winners ticker:{' '}
            <Link href="#">{winnerTicker?.winner.toString()}</Link> won the
            {formatTime(Number(winnerTicker?.timeFrame))} pool at{' '}
            <Link href="#">
              {Number(winnerTicker?.prize / 1_000_000_000_000)} USDT
            </Link>
          </Typography>
        </Paper>
        <Grid
          container
          spacing={{ xs: 2, md: 4 }}
          columns={{ xs: 12, sm: 8, md: 12, lg: 20 }}
          paddingTop={3}
        >
          {lotteryList.length > 0
            ? lotteryList.map((lottery: LotteryData, index: number) => (
                <Grid item xs={12} sm={4} md={4} lg={4} key={index}>
                  <GameCard
                    lottery={lottery}
                    source={imgList.source.games[index]}
                  />
                </Grid>
              ))
            : null}
        </Grid>
        <Paper
          elevation={3}
          sx={{
            borderRadius: '5px',
            padding: '5px',
            marginTop: '30px',
            backgroundColor: 'transparent',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontFamily: 'Roboto,sans-serif',
              fontSize: {
                xs: '15px',
                sm: '20px',
                md: '20px',
                lg: '24px',
                color: 'white',
              },
            }}
          >
            Deposit ticker:{' '}
            <Link href="#">{depositeTicker?.depositer.toString()}</Link> just
            deposited{' '}
            <Link href="#">
              {Number(depositeTicker?.amount)} USDT ({depositeTicker?.spots}{' '}
              spots)
            </Link>{' '}
            at {formatTime(Number(depositeTicker?.timeFrame))} pool
          </Typography>
        </Paper>
      </Container>
    </>
  )
}
