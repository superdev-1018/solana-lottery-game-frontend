import { useState, useEffect, useContext } from 'react'
import { Program } from '@coral-xyz/anchor'
import { Lottery } from '@/anchor/idl'
import {
  Container,
  Grid,
  Paper,
  Typography,
  useMediaQuery,
  Link,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Modal,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useTranslation } from 'react-i18next'
import { useRecoilValue } from 'recoil'
import { walletState } from '@/store/wallet'
import { useSnackbar } from 'notistack'
import AppLoading from '@/components/loading/AppLoading'
import GameCard from '@/components/main/game_card'
import * as imgList from '@/assets'
import { useGlobalState } from '@/hooks/useGlobalState'
import { formatTime } from '@/utils/util'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { SocketContext } from '@/context/SocketContext'
import { toast } from 'react-toastify'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'


const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 2,
  borderRadius: '20px',
  maxWidth: {
    xs: '90%',
    sm: '80%',
    md: '60%',
    lg: '50%',
  },
  width: '100%',
  maxHeight: '80vh',
  overflowY: 'auto',
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  backgroundColor: '#1c1b20',
  color: 'white',
}

export default function IndexPage() {
  const wallet = useWallet()
  const [loading, setLoading] = useState(true)
  const [lotteryList, setLotteryList] = useState<any[]>([])
  const [winnerTicker, setWinnerTicker] = useState<any | null>(null)
  const [depositeTicker, setDepositeTicker] = useState<any | null>(null)
  const [openModal, setOpenModal] = useState(false)

  const {newGame, message, state} = useContext(SocketContext);

  const handleClose = () => setOpenModal(false)

  const theme = useTheme()
  const { connection } = useConnection()
  const { getDepositeTicker, getWinnerTicker, getOpenedLottery } = useGlobalState()

  useEffect(() => {
    const setLottery = async () => {
      let lotterys = await getOpenedLottery()
      setLotteryList(lotterys)
    }
    const fetchLottery = async () => {
      setLoading(true)
      try {
        await setLottery()
      } catch {
        console.log('Error')
      } finally {
        setLoading(false)
        setOpenModal(true)
      }
    }
    fetchLottery()
    // const interval = setInterval(() => {
    //   setLottery()
    // }, 60000)

    // return () => {
    //   clearInterval(interval)
    // }
  }, [connection]);


  useEffect(() => {
    const setLottery = async () => {
      let lotterys = await getOpenedLottery()
      setLotteryList(lotterys)
    }
    setLottery()
  }, [newGame]);

  useEffect(() => {
    const winnerTickerFn = async () => {
      let winnerTicker = await getWinnerTicker()
      let depositeTicker = await getDepositeTicker()
      setWinnerTicker(winnerTicker)
      setDepositeTicker(depositeTicker)
    }
    if (!loading) {
      winnerTickerFn()
      const interval = setInterval((loading) => {
        if (!loading) {
          winnerTickerFn()
        }
      }, 60000)
      return () => {
        clearInterval(interval)
      }
    }
  }, [loading])

  useEffect(()=>{
    if(message != ""){
      if(state == "success"){
        toast.success(message, {position:'top-center', autoClose:5000});
      } else if (state == "warning"){
        toast.warning(message, {position:'top-center', autoClose:5000});
      }
    }
  },[message])

  return (
    <>
      {loading == false ? (
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
              <Link
                href={`https://explorer.solana.com/address/${winnerTicker?.winner.toString()}?cluster=devnet`}
                target="_blank"
              >
                {winnerTicker?.winner.toString()}
              </Link>{' '}
              won the {formatTime(Number(winnerTicker?.timeFrame))} pool at{' '}
              <Link href="#">
                {(winnerTicker?.prize/LAMPORTS_PER_SOL).toFixed(2)}{' '}
                USDT
              </Link>
            </Typography>
          </Paper>
          <Grid
            container
            spacing={{ xs: 2, md: 4 }}
            columns={{ xs: 12, sm: 8, md: 12, lg: 20 }}
            paddingTop={3}
          >
            {lotteryList && lotteryList.length > 0
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
              <Link
                href={`https://explorer.solana.com/address/${depositeTicker?.depositer.toString()}?cluster=devnet`}
                target="_blank"
              >
                {depositeTicker?.depositer.toString()}
              </Link>{' '}
              just deposited{' '}
              <Link href="#">
                {Number(depositeTicker?.amount)} USDT ({depositeTicker?.spots}{' '}
                spots)
              </Link>{' '}
              at {formatTime(Number(depositeTicker?.timeFrame))} pool
            </Typography>
          </Paper>

          <Modal
          open={openModal}
          onClose={handleClose}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box sx={{ ...modalStyle }}>
            <Box
              sx={{
                position: 'absolute',
                top: 10,
                right: 10
              }}
            >
              <Button
                onClick={handleClose}
                variant="text"
                sx={{
                  padding: 0,
                  margin: 0,
                  minWidth: 'auto',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                }}
              >
                <HighlightOffIcon sx={{ fontSize: '40px' }} />
              </Button>
            </Box>

            <Typography
              id="modal-title"
              variant="h6"
              component="h2"
              paddingY={2}
              sx={{ backgroundColor: '#1c1b20' }}
            >
              About
            </Typography>

            <Typography id="modal-description">
              Pool Party is a user-friendly crypto lottery platform that allows
              people to participate in various prize pools, which are based on
              different timeframes like hourly, daily, or monthly. Players can
              join by purchasing tickets using USDT, and winners are chosen
              fairly through random selection. Prizes are automatically sent to
              the winners' wallets after a small fee is deducted. The platform
              also has a referral system where users can earn rewards by
              inviting others, and winners can easily share their results on
              social media. Pool Party is currently on the Solana blockchain but
              plans to expand to other networks soon.
            </Typography>

            <Typography
              id="modal-title"
              variant="h6"
              component="h2"
              sx={{ mt: 2 }}
            >
              How to Play
            </Typography>

            <Box>
            <List
                sx={{
                  width: '100%',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  overflowX:'hidden',
                  '&::-webkit-scrollbar': {
                    width: '12px',
                },
                '&::-webkit-scrollbar-track': {
                    background: '#f1f1f1', 
                    borderRadius: '10px'
                },
                '&::-webkit-scrollbar-thumb': {
                    background: '#888', 
                    borderRadius: '10px',
                    '&:hover': {
                        background: '#555', 
                    },
                },
                scrollbarWidth: 'thin',
                scrollbarColor: '#888 #f1f1f1', 
                }}
              >
                <ListItem>
                  <ListItemText>
                    1. Connect Your Wallet: Connect your crypto wallet to the
                    platform. Pool Party currently operates on the Solana
                    network, and you’ll need USDT (Tether) to participate in the
                    lotteries
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText>
                    2. Choose a Pool: Select a prize pool based on the time
                    duration you prefer. Options range from hourly, daily,
                    weekly, to monthly and more. Each pool has a set ticket
                    price, so choose according to your budget.
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText>
                    3. Buy Tickets: Purchase tickets for your chosen pool. Each
                    ticket will cost a certain amount in USDT, depending on the
                    pool’s duration. For example, hourly pools cost 1 USDT per
                    ticket, while longer-duration pools may cost more.
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText>
                    4. Wait for the Draw: After buying your ticket(s), wait for
                    the pool’s duration to end. Once the timer runs out, winners
                    are selected using a fair randomization process.
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText>
                    5. Check Results: If you win, Pool Party will automatically
                    deposit your prize into your connected wallet. Prizes are
                    distributed proportionately, with 50% going to the
                    first-place winner, 30% to the second, and 20% to the third.
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText>
                    6. Share and Refer: You can share your winnings on social
                    media using pre-made images, or refer friends to earn
                    rewards. For each successful referral, you’ll gain a spot in
                    the hourly pool.
                  </ListItemText>
                </ListItem>
              </List>

              <Typography variant="h6" sx={{ mt: 2 }}>
                That’s it! You’re ready to enjoy Pool Party and increase your
                chances of winning exciting prizes!
              </Typography>

              <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
                Disclaimer
              </Typography>

              <Typography id="modal-description" sx={{ mt: 2 }}>
                Pool Party is a decentralized crypto lottery platform, and
                participation is at your own risk. The value of cryptocurrency
                can fluctuate, and there is no guarantee of winning or
                recovering funds spent on tickets. Please ensure you understand
                the risks involved with using cryptocurrency and blockchain
                technology. Pool Party operates transparently and fairly, but we
                cannot be held responsible for any technical issues, network
                errors, or losses resulting from third-party wallets or
                blockchain instability. Participation may be subject to local
                laws and regulations, so it is your responsibility to comply
                with them. Always play responsibly and only use funds you can
                afford to lose.
              </Typography>
            </Box>
          </Box>
        </Modal>
        </Container>
      ) : (
        <AppLoading />
      )}
    </>
  )
}
