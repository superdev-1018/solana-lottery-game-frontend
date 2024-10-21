import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Container,
  Grid,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useNavigate } from 'react-router'
import logoImg from '@/assets/img/logo/logo1.png'
import { useRecoilValue } from 'recoil'
import { colorModeState } from '@/store/colorMode'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import  * as style from '@/assets'
import '@/assets/style/CustomWalletAdapter.css'
import { useWallet } from '@solana/wallet-adapter-react'
import {ReferralModal} from '@/components/main/referral_modal'
import { useGlobalState } from '@/hooks/useGlobalState'
import { toast } from 'react-toastify'
import { SiteUrl } from '@/anchor/constants'



export default function DefaultHeader() {
  const [openModal, setOpenModal] = useState(false)
  const [referral, setReferralLink] = useState(null)
  const handleClose = () => setOpenModal(false)
  const theme = useTheme()
  const smDisplay = useMediaQuery(theme.breakpoints.down('md'))
  const { connected, publicKey } = useWallet()
  const {getUserData} = useGlobalState();

  useEffect(() => {
    const setUserLink = async() => {
      if(!connected) return;
      const userData = await getUserData();
      const userReferralLink = userData?.referralLink;
      setReferralLink(userReferralLink);
    }
    setUserLink()
  }, [connected])

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Referral link Copyed!", {position:'top-center', autoClose:3000})
    }).catch((err) => {
      console.error('Failed to copy: ', err);
    });
  };
 
  const referralLink = referral ? `${SiteUrl}/?ref=${referral}` : "";
  return (
    <>
      <Container maxWidth={false} sx={style.header.container}>
        <Grid container>
          <Grid item xs={12} sm={12} md={4}>
            <Box display={'flex'}  sx={style.header.logo}>
              <Link to="/"><img src={logoImg} alt="Logo"/></Link>
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
            <Stack sx={{ width: '250px', textAlign: 'right',marginY:'6px', paddingX:'2px',backgroundColor:'#512da8', borderRadius:'5px', '&:hover': {
              backgroundColor: '#121212',
            },}}>
                <Link 
                    to="/" 
                    style={{
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',  
                        textOverflow: 'ellipsis',
                        color:'white',
                        textAlign:'center',
                        textDecoration:'none'
                    }}
                    
                >
                    {referral? (
                      <Stack 
                        display={'flex'} 
                        flexDirection={'row'}
                        sx={{paddingX:'3px'}}
                      >
                        <Typography sx={{width:'90%', overflow: 'hidden', textOverflow: 'ellipsis',}}>
                          link: {SiteUrl}/?ref=${referral}
                        </Typography>
                        <IconButton
                          sx={{
                            width: '10%',
                            padding: 0, 
                            margin: 0, 
                            minWidth: 0, 
                          }}
                          onClick={() => handleCopyToClipboard(referralLink)}
                        >
                          <ContentCopyIcon 
                            sx={{
                              margin: 0, 
                              padding: 0,
                              fontSize: '1.2rem',
                              color:'white'
                            }}
                          />
                        </IconButton>

                    </Stack>):<Typography onClick={() => setOpenModal(true)}>Set Referral ID</Typography>}
                </Link>
              </Stack>
              ) : null}
            </Box>
          </Grid>
        </Grid>
      </Container>

      <ReferralModal openModal={openModal} handleClose={handleClose} referralLink = {referral}/>
    </>
  )
}
