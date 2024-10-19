import { Box, Button, List, ListItem, ListItemText, Modal, Typography } from "@mui/material"
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { useGlobalState } from "@/hooks/useGlobalState"
import { useEffect, useState } from "react"
import { formatDate, formatTime } from "@/utils/util"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"

type InfoModalProps = {
    openModal: boolean,
    handleClose: () => void,
    history: any,
    timeframe: number
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


export function InfoModal({openModal, handleClose, history, timeframe}:InfoModalProps){

  const [winHistory, setWinHistory] = useState<any | null>(null);

  useEffect(()=>{
    if(history){
      setWinHistory(history);
    }
  }, [history])

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
            {formatTime(timeframe)} Winners
          </Typography>

          <Box
            sx={{
              
              paddingY: 2,
              overflowY: 'auto', 
                overflowX: 'hidden', 
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
                scrollbarWidth: 'thin', 
                scrollbarColor: '#888 #f1f1f1', 
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
                key = {index}
              >
                <ListItem sx={{ margin: 0, padding: '1px 8px' }}>
                  <ListItemText primary={`Period: ${formatDate(Number(lottery.account.startTime))}`} />
                </ListItem>
                <ListItem sx={{ margin: 0, padding: '1px 8px' }}>
                  <ListItemText primary={`Number of participants: ${lottery.account.realCount} spots`} />
                </ListItem>
                <ListItem sx={{ margin: 0, padding: '1px 8px' }}>
                  <ListItemText primary={`Prize pool: ${(lottery.account.realPoolAmount/LAMPORTS_PER_SOL).toFixed(3)} USDT`} />
                </ListItem>
                <ListItem sx={{ margin: 0, padding: '1px 8px' }}>
                  <ListItemText primary={`Winning tax: ${lottery.account.devFee}%`} />
                </ListItem>
                <ListItem sx={{ margin: 0, padding: '1px 8px' }}>
                  <ListItemText primary={`1: ${lottery.account.winner[0]} = ${(lottery.account.winnerPrize[0]/LAMPORTS_PER_SOL).toFixed(3)} USDT`} />
                </ListItem>
                <ListItem sx={{ margin: 0, padding: '1px 8px' }}>
                  <ListItemText primary={`2: ${lottery.account.winner[1]} = ${(lottery.account.winnerPrize[1]/LAMPORTS_PER_SOL).toFixed(3)} USDT`} />
                </ListItem>
                <ListItem sx={{ margin: 0, padding: '1px 8px' }}>
                  <ListItemText primary={`3: ${lottery.account.winner[2]} = ${(lottery.account.winnerPrize[2]/LAMPORTS_PER_SOL).toFixed(3)} USDT`} />
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