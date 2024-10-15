import {
  Box,
  Container,
  Grid,
  Link,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { useNavigate } from 'react-router'

import LanguageChanger from '@/components/theme/LanguageChanger'
import ColorModeChanger from '@/components/theme/ColorModeChanger'

import logoHorizontal from '@/assets/img/logo/logo1.png'
import logoHorizontalWhite from '@/assets/img/logo/Epics-logo-horizontal-white.svg'

import logo from '@/assets/img/logo/Epics-logo.svg'
import logoWhite from '@/assets/img/logo/Epics-logo-white.svg'

import { useRecoilValue } from 'recoil'
import { colorModeState } from '@/store/colorMode'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import TwitterIcon from '@mui/icons-material/Twitter'
import TelegramIcon from '@mui/icons-material/Telegram'
import  * as style from '@/assets'
import '@/assets/style/CustomWalletAdapter.css'
import { useWallet } from '@solana/wallet-adapter-react'
import {ReferralModal} from '../../components/main/referral_modal'
import { useState } from 'react'

export default function DefaultHeader() {
  const [openModal, setOpenModal] = useState(false)
  const handleClose = () => setOpenModal(false)
  const colorMode = useRecoilValue(colorModeState)
  const navigate = useNavigate()
  const theme = useTheme()
  const smDisplay = useMediaQuery(theme.breakpoints.down('md'))
  const { connected, publicKey } = useWallet()

  return (
    <>
      <Container maxWidth={false} sx={style.header.container}>
        <Grid container>
          <Grid item xs={12} sm={12} md={4}>
            <Box display={'flex'}  sx={style.header.logo}>
              <img src={logoHorizontal} alt="Logo"/>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={4} sx={{...style.header.titleContainer, paddingY:smDisplay?'20px':''}}>
            <Typography variant="h1" align="center" sx={{...style.header.title}}>
                Pool Party
            </Typography>
            <Typography variant="h3" align="center" sx={style.header.subtitle}>
              Choose your chances
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <Box display={'flex'} flexDirection={"column"} sx={{alignItems:smDisplay?'center':'flex-end', justifyContent: 'center', height: '100%',}}>
            <WalletMultiButton/>
            {connected ? (
            <Stack sx={{ width: '250px', textAlign: 'right',marginY:'6px', paddingX:'2px',backgroundColor:'#512da8', borderRadius:'5px'}}>
                <Link 
                    href="#" 
                    sx={{
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',  
                        textOverflow: 'ellipsis',
                        color:'white'
                    }}
                    onClick={() => setOpenModal(true)}
                >
                    Referral Link: https://poolparty/kjhiucis
                </Link>
            </Stack>
        ) : null}
            </Box>
          </Grid>
        </Grid>
      </Container>

      <ReferralModal openModal={openModal} handleClose={handleClose}/>
    </>
  )
}
