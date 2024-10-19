import { Box, Button, useMediaQuery, Modal, TextField, Typography } from "@mui/material"
import { useTheme } from '@mui/material/styles'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { useEffect, useState } from "react"
import { useGlobalState } from "@/hooks/useGlobalState"
import { useWallet } from "@solana/wallet-adapter-react"

type ReferralModalProps = {
    openModal: boolean,
    handleClose: () => void,
    referralLink: string | null
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
      sm: '60%',
      md: '60%',
      lg: '40%',
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


export function ReferralModal({openModal, handleClose, referralLink}:ReferralModalProps){
    const [referral, setReferral] = useState<any | "">("");
    const theme = useTheme()
    const xsDisplay = useMediaQuery(theme.breakpoints.down('sm'))

    const {setUserReferral} = useGlobalState();

    const handleChange = (e:any) => {
      setReferral(e);
    }

    const setFunc = () => {
      setUserReferral(referral);
      handleClose();
    }

    useEffect(()=>{
      setReferral(referralLink)
    },[]);

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
            Set Referral Link
          </Typography>

          <Box
            sx={{        
              paddingY: 2,
              display:'flex',
              flexDirection: xsDisplay? 'column':'row'
            }}
          >
            <TextField
              label="Referral ID"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '5px',
                  backgroundColor: 'white',
                },
                width: xsDisplay ? '100%' : '70%',
                '& .MuiInputLabel-root': { 
                  color: 'black',
                  transition: 'all 0.2s ease', 
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'white',
                  fontSize: '20px',
                  fontWeight:'bold',
                  transform: 'translate(0, -20px) scale(0.8)',
                },
                '& .MuiInputLabel-root.Mui-shrink': {
                  transform: 'translate(0, -1.5px) scale(0.75)',
              },
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
              },
              }}
              value={referral}
              onChange={(e) => handleChange(e.target.value)}
            />
            <Button 
              variant="contained" 
              sx={{
                width:xsDisplay?'100%':'25%', 
                marginX:xsDisplay?'0':'10px', 
                marginY:xsDisplay?'10px':'0', 
                borderRadius:'5px',
                boxShadow:'none',
                backgroundColor:'#512da8'
              }}
              onClick={setFunc}
            >
                Set
              </Button>
          </Box>
        </Box>
      </Modal>
        </>
    )
   
}