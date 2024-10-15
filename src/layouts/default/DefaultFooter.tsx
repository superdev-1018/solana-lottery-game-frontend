import { Container, Toolbar, Typography, Box, IconButton, Stack } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faTwitter, faTelegram } from '@fortawesome/free-brands-svg-icons'
import { useRecoilValue } from 'recoil'
import { colorModeState } from '@/store/colorMode'
import { EpicsGrey } from '@/constants/colors'
import * as style from '@/assets/index'

export default function DefaultFooter() {
  const colorMode = useRecoilValue(colorModeState);
  let date = new Date();
  let year = date.getFullYear();
  return (
    <>
      <Container maxWidth={false} sx={style.footer.container}>
    <Stack 
        display="flex" 
        flexDirection="row" 
        justifyContent="center" 
        alignItems="center"
        spacing={1}
    >
        <Typography variant="h6" color={'white'}>©{year} Pool Party Communicity</Typography>

        <Box>
            <IconButton
                href={`https://twitter.com/EpicsDAO`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter link"
            >
                <FontAwesomeIcon
                    color={'white'}
                    icon={faTwitter}
                    size="sm"
                    aria-label="Twitter icon"
                />
            </IconButton>
        </Box>

        <Box>
            <IconButton
                href={`https://twitter.com/EpicsDAO`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram link"
            >
                <FontAwesomeIcon
                    color={'white'}
                    icon={faTelegram}
                    size="sm"
                    aria-label="Telegram icon"
                />
            </IconButton>
        </Box>
    </Stack>
</Container>

    </>
  )
}
