import { useEffect, useState } from 'react'
import {
  Card,
  Button,
  CardContent,
  Box,
  Typography,
  Stack,
} from '@mui/material'
import Countdown from 'react-countdown'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import AccessAlarmOutlinedIcon from '@mui/icons-material/AccessAlarmOutlined'
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined'
import { useWallet } from '@solana/wallet-adapter-react'
import { useGlobalState } from '@/hooks/useGlobalState'
import { InfoModal } from './info_modal'
import {TicketModal} from './ticket_modal'
import {TimeFrame} from '../../anchor/constants';


const card_style = {
  borderRadius: '20px',
  backgroundColor: '#1c1b20',
  padding: '0px',
  color: 'white',
  transition: 'transform 0.3s ease',
  cursor: 'pointer',
}

const formatTime = (hours: number): string => {
  if (hours ==1 ) {
    return `HOURLY`;
  } else if (hours != 1 && hours < 24) {
    return `${hours}-HOURLY`;
  } else if (hours == 24) {
    return `DAILY`;
  } else if (hours == 168) {
    return `WEEKLY`;
  } else if (hours == 720) {
    return `MONTHLY`;
  } else if (hours == 2160) {
    return `QUARTERLY`;
  } else if (hours == 4320) {
    return `HALF-YEARLY`;
  } else if (hours == 8640) {
    return `ANNUALLY`;
  }else {
    const years = Math.floor(hours / 8760);
    return `${years} ${years === 1 ? 'year' : 'years'}`;
  }
};


export default function GameCard({ lottery, source }: any) {
  const [openModal, setOpenModal] = useState(false)
  const [openTicketModal, setOpenTicketModal] = useState(false)
  const handleClose = () => setOpenModal(false)
  const handleTicketClose = () => setOpenTicketModal(false)
  const [hovered, setHovered] = useState(false)
  const [lotteryData, setLotteryData] = useState<any>()
  const [selectedLottery, setSelectLottery] = useState('')

  const wallet = useWallet()

  const { buyTicket, getUserData, getLotteryData, joinToLottery} = useGlobalState()

  const joinLottery = async () => {
    let userData = await getUserData();
    let lotteryData = await getLotteryData(lottery.publicKey.toString());
    console.log(userData,"in joinlottery")
    console.log(lotteryData);
    let userSpotIndex = await TimeFrame.findIndex(timeframe => timeframe == Number(lotteryData.timeFrame));
    
    let userLotterySpot = userData?.spot[userSpotIndex];
    if(userLotterySpot > 0){
      console.log("have ticket")
      let lotteryId = lotteryData.id;
      joinToLottery(lottery.publicKey.toString(), userSpotIndex);
    } else {

      setOpenTicketModal(true); 
      setSelectLottery(lottery.publicKey.toString())
    }
  }

  useEffect(() => {}, [openModal])

  useEffect(() => {
    console.log(lottery)
    setLotteryData(lottery)
  }, [lottery])

  return (
    <>
      {lottery ? (
        <Card
          sx={{ ...card_style }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <CardContent sx={{ padding: '0px' }}>
            <Box
              sx={{
                position: 'relative',
                backgroundColor: `rgb(0, 38, 153)`,
                backgroundImage: `url('/cardbg.svg')`,
                display: 'flex',
                alignItems: 'center',
                paddingY: '30px',
                justifyContent: 'center',
                backgroundPosition: 'center',
                backgroundSize: 'auto',
              }}
            >
              <InfoOutlinedIcon
                sx={{
                  position: 'relative',
                  left: '60%',
                  top: '-60px',
                  transform: hovered ? 'scale(1.2)' : 'scale(1)',
                }}
                onClick={() => setOpenModal(true)}
              />
              <LazyLoadImage
                alt="card-bg"
                src={source}
                style={{
                  width: '120px',
                  height: '120px',
                  transform: hovered ? 'scale(1.4)' : 'scale(1)',
                  transition: 'transform 0.3s ease',
                }}
              />
            </Box>
            <Box
              padding={2}
              sx={{ textAlign: 'center', fontFamily: 'Roboto,sans-serif' }}
            >
              <Typography variant="h2" color={'white'}>
                {formatTime(Number(lottery.account.timeFrame))}
              </Typography>
              <Box
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
                marginTop={'7px'}
              >
                <AccessAlarmOutlinedIcon sx={{ mr: '6px' }} />
                <Countdown date={Date.now() + (Number(lottery.account.timeFrame)) * 3600000} />
              </Box>
              <Box display={'flex'} justifyContent={'center'} marginTop={'7px'}>
                <ConfirmationNumberOutlinedIcon />
                <Typography
                  variant="h5"
                  sx={{
                    alignItems: 'center',
                    marginBottom: '14px',
                    textAlign: 'center',
                    fontFamily: 'Roboto,sans-serif',
                  }}
                >
                  : {lottery.account.ticketPrice} USDT
                </Typography>
              </Box>

              <Stack
                display={'flex'}
                flexDirection={'row'}
                alignItems={'center'}
                justifyContent={'center'}
              >
                <Typography
                  sx={{
                    color: '#ffcb52 ',
                    fontSize: '30px',
                    fontFamily: 'Roboto,sans-serif',
                    fontWeight: 'bold',
                  }}
                >
                  $ {lottery.account.ticketPrice * lottery.account.maxTicket}
                </Typography>
              </Stack>

              <Typography
                variant="h5"
                color={'white'}
                sx={{ fontFamily: 'Roboto,sans-serif' }}
              >
                {Number(lottery.account.maxTicket)} Spots
              </Typography>

              <Stack
                sx={{ marginTop: '10px' }}
                display={'flex'}
                alignItems={'center'}
              >
                <Button
                  variant="contained"
                  onClick={joinLottery}
                  sx={{
                    backgroundColor: '#0eae07',
                    width: '160px',
                    height: '40px',
                    borderRadius: '10px',
                    fontFamily: 'Roboto,sans-serif',
                    fontSize: '18px',
                  }}
                >
                  Join
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      ) : null}

      <InfoModal openModal={openModal} handleClose={handleClose} />
      <TicketModal openModal={openTicketModal} handleClose={handleTicketClose} lotteryPubkey ={selectedLottery}/>
    </>
  )
}
