import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  Button,
  CardContent,
  Box,
  Typography,
  Stack,
  List,
  ListItem,
  ListItemText,
  Modal,
  CardHeader,
  Link,
} from '@mui/material'
import Countdown from 'react-countdown'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AccessAlarmOutlinedIcon from '@mui/icons-material/AccessAlarmOutlined';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import * as imgList from '@/assets'
import { useWallet } from '@solana/wallet-adapter-react'
import { useGlobalState } from '@/hooks/useGlobalState'

const card_style = {
  borderRadius: '20px',
  backgroundColor: '#1c1b20',
  padding: '0px',
  color: 'white',
  transition: 'transform 0.3s ease',
  cursor: 'pointer',
}

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

export default function GameCard({ lottery, source }: GameCardProp) {
  const [openModal, setOpenModal] = useState(false)
  const handleClose = () => setOpenModal(false)
  const [hovered, setHovered] = useState(false)
  const [lotteryData, setLotteryData] = useState<LotteryCtx | {}>({})

  const wallet = useWallet()
  const { buyTicket } = useGlobalState()

  const playGame = async () => {
    await buyTicket(4)
  }

  const gethistory = async () => {}

  useEffect(() => {}, [openModal])

useEffect(() => {
  setLotteryData(lottery);
  console.log(lotteryData,"lotteryData")
  console.log(Object.keys(lotteryData).length)
}, [lottery]);

  return (
    <>
      {/* {Object.keys(lotteryData).length > 0 ? ( */}
      {lottery ?(
        <Card
          sx={{...card_style}}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <CardContent sx={{ padding: '0px'}}>
          
            <Box sx={{position :'relative',backgroundColor:`rgb(0, 38, 153)`, backgroundImage: `url('/cardbg.svg')`,display:'flex',alignItems:'center',paddingY:'30px', justifyContent:'center',backgroundPosition: 'center',
                    backgroundSize: 'auto'}}>
              <InfoOutlinedIcon sx={{position:'relative', left:'60%', top:'-60px', transform: hovered ? 'scale(1.2)' : 'scale(1)'}} onClick={() => setOpenModal(true)}/>
              <LazyLoadImage 
                alt="card-bg"
                src={source}
                style={{width:'120px',height:'120px',transform: hovered ? 'scale(1.4)' : 'scale(1)',
                transition: 'transform 0.3s ease',}}
              />
            </Box>
            {/* <LazyLoadImage
              alt="Logo"
              src={source}
              style={{
                width: '100%',
                transform: hovered ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 0.3s ease',
              }}
            /> */}
            <Box padding={2} sx={{textAlign:'center',fontFamily:'Roboto,sans-serif'}}>
              <Typography variant="h2" color={'white'}>
                3 - hourly
              </Typography>
              <Box display={'flex'} alignItems={'center'} justifyContent={'center'} marginTop={'7px'}>
                <AccessAlarmOutlinedIcon sx={{mr:'6px'}}/>
                <Countdown date={Date.now() + 100000000} />
              </Box>
              <Box display={'flex'} justifyContent={'center'} marginTop={'7px'}>
                <ConfirmationNumberOutlinedIcon />
                <Typography
                  variant="h5"
                  sx={{ alignItems: 'center', marginBottom: '14px', textAlign:'center',fontFamily:'Roboto,sans-serif'}}
                >
                  : 10 USDT
                </Typography>
              </Box>

              <Stack
                display={'flex'}
                flexDirection={'row'}
                alignItems={'center'}
                justifyContent={'center'}
              >
                <Typography sx={{ color: '#ffcb52 ', fontSize: '30px', fontFamily:'Roboto,sans-serif',fontWeight:'bold'}}>
                  $ 2000
                </Typography>
              </Stack>

              <Typography variant="h5" color={'white'} sx={{fontFamily:'Roboto,sans-serif'}}>
                500 Spots
              </Typography>

              <Stack sx={{ marginTop: '10px'}} display={'flex'} alignItems={'center'}>
                <Button variant="contained" onClick={playGame} sx={{backgroundColor:'#0eae07', width:'160px', height:'40px', borderRadius:'10px', fontFamily:'Roboto,sans-serif',fontSize:'18px'}}>
                  Join
                </Button>
              </Stack>

              {/* <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: '10px',

                }}
              >
                <Link
                  href="#"
                  onClick={() => setOpenModal(true)}
                  sx={{ marginLeft: '0' }}
                >
                  Winning History
                </Link>
              </Box> */}
            </Box>
          </CardContent>
        </Card>
      ) : null}

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
              Hourly Winners
            </Typography>

            <Box  sx={{
        borderTop: '2px dotted white', 
        borderBottom: '2px dotted white',
        paddingY: 2,
    }}>
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
                      Period: 24th August, 2024 16:00 GMT
                    </ListItemText>
                </ListItem>
                <ListItem>
                    <ListItemText>
                      Number of participants: 56 spots
                    </ListItemText>
                </ListItem>
                <ListItem>
                    <ListItemText>
                      Prize pool: 560 USDT
                    </ListItemText>
                </ListItem>
                <ListItem>
                    <ListItemText>
                      Winning tax: 10%
                    </ListItemText>
                </ListItem>
                <ListItem>
                    <ListItemText>
                      1: 0x66e88552a78B40740314e695629f4d8D8C12A533 = 67 USDT
                    </ListItemText>
                </ListItem>
                <ListItem>
                    <ListItemText>
                      2: 0x66e88552a78B40740314e695629f4d8D8C12A533 = 32 USDT
                    </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText>
                    3: 0x66e88552a78B40740314e695629f4d8D8C12A533 = 13 USDT
                  </ListItemText>
                </ListItem>
              </List>
            </Box>
          </Box>
        </Modal>
    </>
  )
}
