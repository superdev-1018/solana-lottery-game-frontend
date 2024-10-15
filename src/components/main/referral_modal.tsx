import { Box, Button, List, ListItem, ListItemText, Modal, Typography } from "@mui/material"

import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import React from "react"

type ReferralModalProps = {
    openModal: boolean,
    handleClose: () => void
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


export function ReferralModal({openModal, handleClose}:ReferralModalProps){
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
            
          </Box>
        </Box>
      </Modal>
        </>
    )
   
}