import { Box, Button, List, ListItem, ListItemText, Modal, Typography } from "@mui/material"

import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { useGlobalState } from "@/hooks/useGlobalState"
import { useEffect, useState } from "react"

type InfoModalProps = {
    openModal: boolean,
    handleClose: () => void,
    lottery: any
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


export function InfoModal({openModal, handleClose, lottery}:InfoModalProps){

  const [winHistory, setWinHistory] = useState<any | null>(null);

  const {getHistory} = useGlobalState();

  useEffect(()=>{
    const setHistory = async () => {
      let historyData = await getHistory(Number(lottery?.account.timeFrame));
      console.log(historyData,"************");
      setWinHistory(historyData);
    }
    setHistory();
  }, [lottery])

    return (
        <>
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
            sx={{ backgroundColor: '#1c1b20' }}
          >
            Hourly Winners
          </Typography>

          <Box
            sx={{
              
              paddingY: 2,
              overflowY: 'auto', // Enables vertical scrolling
                overflowX: 'hidden', // Hides horizontal scrolling if not needed
                '&::-webkit-scrollbar': {
                  width: '12px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f1f1',
                  borderRadius: '10px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#888',
                  borderRadius: '10px',
                  '&:hover': {
                    background: '#555',
                  },
                },
                scrollbarWidth: 'thin', // For Firefox
                scrollbarColor: '#888 #f1f1f1', // For Firefox
            }}
          >
            {
              winHistory? winHistory.map((lottery:any, index:number)=>(
                <List
                sx={{
                  borderTop: '2px dotted white',
                borderBottom: '2px dotted white',
                  width: '100%',
                }}
              >
                <ListItem sx={{ margin: 0, padding: '1px 8px' }}>
                  <ListItemText primary="Period: 24th August, 2024 16:00 GMT" />
                </ListItem>
                <ListItem sx={{ margin: 0, padding: '1px 8px' }}>
                  <ListItemText primary={`Number of participants: ${lottery.account.realCount} spots`} />
                </ListItem>
                <ListItem sx={{ margin: 0, padding: '1px 8px' }}>
                  <ListItemText primary={`Prize pool: ${lottery.account.realPoolAmount/10000000000} USDT`} />
                </ListItem>
                <ListItem sx={{ margin: 0, padding: '1px 8px' }}>
                  <ListItemText primary={`Winning tax: ${lottery.account.devFee}%`} />
                </ListItem>
                <ListItem sx={{ margin: 0, padding: '1px 8px' }}>
                  <ListItemText primary={`1: ${lottery.account.winner[0]} = ${(lottery.account.winnerPrize[0]/10000000000).toFixed(2)} USDT`} />
                </ListItem>
                <ListItem sx={{ margin: 0, padding: '1px 8px' }}>
                  <ListItemText primary={`1: ${lottery.account.winner[1]} = ${(lottery.account.winnerPrize[1]/10000000000).toFixed(2)} USDT`} />
                </ListItem>
                <ListItem sx={{ margin: 0, padding: '1px 8px' }}>
                  <ListItemText primary={`1: ${lottery.account.winner[2]} = ${(lottery.account.winnerPrize[2]/10000000000).toFixed(2)} USDT`} />
                </ListItem>
              </List>
              )): null
            }
          </Box>
        </Box>
      </Modal>
        </>
    )
   
}