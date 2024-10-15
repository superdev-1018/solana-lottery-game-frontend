import { useState, useEffect, useCallback, Key } from 'react'
import { IdlAccounts, Program, AnchorProvider, web3 } from '@coral-xyz/anchor'
import { Lottery } from '@/anchor/idl'
import {
  Container,
  Box,
  Grid,
  Paper,
  Typography,
  useMediaQuery,
  Chip,
  Toolbar,
  Tooltip,
  IconButton,
  Link,
  Button,
  List,
  ListItem,
  ListItemText,
  Modal,
} from '@mui/material'
import { RefreshRounded } from '@mui/icons-material'

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
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useSnackbar } from 'notistack'

import TransactionsList from '@/model/transaction/TransactionsList'
import TransferForm from '@/model/transaction/TransferForm'
import GameCard from '@/components/main/game_card'
import * as imgList from "@/assets";
import { useGlobalState } from '@/hooks/useGlobalState'
import { getProgram } from '@/anchor/program'
import { PublicKey } from '@solana/web3.js'
import { BN } from "@coral-xyz/anchor"; 



export default function IndexPage() {
  const { t } = useTranslation(['translation'])

  const wallet = useWallet()
  const { network } = useRecoilValue(walletState)
  const [transactionsWS, setTransactionsWS] =
    useState<TransactionWithSignature[]>()
  const [loading, setLoading] = useState(false)
  const [lotteryList, setLotteryList] = useState<LotteryData[]>([]);
  const [program, setProgram] = useState<Program<Lottery> | null>(null)

  const theme = useTheme()
  const xsDisplay = useMediaQuery(theme.breakpoints.down('sm'))
  const { enqueueSnackbar } = useSnackbar()
  const {connection} = useConnection();
  
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
        const lotteryData = await program?.account.lottery.all();

        if (!lotteryData) return;
        const openedLottery: LotteryData[] = lotteryData
            .filter(lottery => lottery.account.state === 0)
            .map(lottery => ({
                account: {
                    id: lottery.account.id,
                    timeFrame: lottery.account.timeFrame,
                    ticketPrice: lottery.account.ticketPrice,
                    maxTicket: lottery.account.maxTicket,
                    devFee: lottery.account.devFee,
                    startTime: lottery.account.startTime,
                    endTime: lottery.account.endTime,
                    state: lottery.account.state,
                    participants: lottery.account.participants.map(pubkey => pubkey.toString()),
                    winner: lottery.account.winner,
                    prizePercent: lottery.account.prizePercent,
                    winnerPrize: lottery.account.winnerPrize,
                    realPoolAmount: lottery.account.realPoolAmount,
                    realCount: lottery.account.realCount,
                    round: lottery.account.round,
                },
                publicKey: lottery.publicKey,
            }));
        setLotteryList(openedLottery);
    };
    getLottery();
}, [wallet]);


  
  
  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    try {
      if (wallet.publicKey) {
        const transactionsWS = await getTransactions(connection, wallet.publicKey)
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
      <Container maxWidth={false} sx={{padding:"20px"}}>

        <Paper elevation={3} sx={{ borderRadius: '5px', padding:"5px", backgroundColor:'transparent'}}>
          <Typography variant="h3" sx={{fontFamily:'Roboto,sans-serif', fontSize:{xs:'15px', sm:'20px', md:'20px', lg:'24px', color:'white'}}}>
            Winners ticker: <Link href="#">0xD0A396472A8Acb3ccB9432bA468ae2FdFFb60FfF</Link> won the
            Hourly pool at <Link href="#">4687 USDT</Link>
          </Typography>
        </Paper>
        <Grid container spacing={{ xs: 2,md: 4 }} columns={{xs:12, sm:8, md: 12, lg: 20}} paddingTop={3}>
          {/* {lotteryList.length > 0 ? lotteryList.map((lottery: LotteryData, index: number) => (
            <Grid item xs={12} sm={4} md={4} lg={4} key={index}>
              <GameCard lottery = {lottery} source = {imgList.source.games[index]}/>
            </Grid>
          )): null} */}

          {imgList.source.games.map((img, index) => (
            <Grid item xs={12} sm={4} md={4} lg={4} key={index}>
              <GameCard  lottery={"lottery"} source = {img}/>
            </Grid>
          ))}
        </Grid>
        <Paper elevation={3} sx={{ borderRadius: '5px', padding:"5px", marginTop: "30px", backgroundColor:'transparent'}}>
          <Typography variant="h3" sx={{fontFamily:'Roboto,sans-serif', fontSize:{xs:'15px', sm:'20px', md:'20px', lg:'24px', color:'white'}}}>
            Deposit ticker: <Link href="#">0x867fychfy5j…g86n</Link> just deposited <Link href="#">30 USDT (3 spots)</Link> at Hourly pool
          </Typography>
        </Paper>
      </Container>
    </>
  )
}
