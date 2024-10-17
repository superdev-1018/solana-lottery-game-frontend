import {
  Box,
  Button,
  Modal,
  Stack,
  Typography,
  TextField,
  useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { useGlobalState } from '@/hooks/useGlobalState'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'

type TicketModalProps = {
  openModal: boolean
  handleClose: () => void
  lotteryPubkey: string
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
    sm: '70%',
    md: '60%',
    lg: '40%',
    xl:'30%'
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

export function TicketModal({ openModal, handleClose , lotteryPubkey}: TicketModalProps) {
  const theme = useTheme()
  const xsDisplay = useMediaQuery(theme.breakpoints.down('sm'))
  const [ticketNumber, setTicketNumber] = useState<number>(1);
  const location = useLocation();

  const getQueryParam = (param: string) => {
    const params = new URLSearchParams(location.search);
    return params.get(param);
  };

  const handleRemove = () => {
    if (ticketNumber > 1) {
        setTicketNumber((prev:number) => prev - 1); 
    }
};

const buy = () =>{
  handleClose()
  let referralID = getQueryParam('ref');
  if (!referralID) {referralID = "";}
  buyTicket(lotteryPubkey, ticketNumber, referralID)
}

const handleAdd = () => {
    setTicketNumber((prev:number) => prev + 1);
};

  const { buyTicket } = useGlobalState()

  return (
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
            right: 10,
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
          sx={{ backgroundColor: '#1c1b20', color: 'white' }}
        >
          Buy Tickets
        </Typography>
        <Box
          sx={{
            padding: { xs: '4px', sm: '8px', md: '10px' },
            backgroundColor: 'white',
            borderRadius: '10px',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              padding: '10px 5px',
              color: 'black',
              fontSize: xsDisplay ? '14px' : '20px',
            }}
          >
            Buy Ticket and Join Lottery
          </Typography>

          <Stack
            display="flex"
            flexDirection={{ xs: 'column', sm: 'row' }}
            sx={{
              p: 1,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                flexDirection: { xs: 'column', sm: 'row' },
              }}
            >
              <Button
                variant="outlined"
                sx={{
                    borderRadius: '5px',
                    height: { xs: '50px', sm: '60px' },
                    mb: { xs: '6px', sm: 0 },
                    width: xsDisplay ? '100%' : '',
                }}
                onClick={handleRemove}
            >
                <RemoveIcon />
            </Button>

            <TextField
                label="Ticket Number"
                variant="outlined"
                type="number"
                value={ticketNumber}
                onChange={(e) => setTicketNumber(Math.max(1, Number(e.target.value)))}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '5px',
                    },
                    mx: '6px',
                    height: { xs: '50px', sm: '60px' },
                    flexGrow:1,
                    width: xsDisplay ? '100%' : '',
                }}
                InputProps={{
                    sx: {
                        paddingY: '0',
                        paddingX:'20px',
                        height: '100%',
                        '& input': {
                            padding: '0',
                        },
                    },
                }}
            />

            <Button
                variant="outlined"
                sx={{
                    borderRadius: '5px',
                    height: { xs: '50px', sm: '60px' },
                    mb: { xs: '6px', sm: 0 },
                    width: xsDisplay ? '100%' : '',
                }}
                onClick={handleAdd}
            >
                <AddIcon />
            </Button>

              {!xsDisplay && <Button
                variant="outlined"
                onClick={buy}
                sx={{
                  borderRadius: '5px',
                  fontSize: { xs: '14px', sm: '16px' },
                  marginLeft: '6px',
                  height: { xs: '50px', sm: '60px' },
                }}
              >
                <ShoppingCartIcon />
                Buy Ticket
              </Button>}

              {xsDisplay && <Button
                variant="outlined"
                onClick={buy}
                sx={{
                  borderRadius: '5px',
                  fontSize: { xs: '14px', sm: '16px' },
                  marginLeft: '6px',
                  height: { xs: '50px', sm: '60px' },
                  width:'100%'
                }}
              >
                <ShoppingCartIcon />
                Buy Ticket
              </Button>}
            </Box>
          </Stack>
        </Box>
      </Box>
    </Modal>
  )
}
