import { ReactNode } from 'react'
import {Box} from '@mui/material'

import DefaultHeader from './DefaultHeader'
import DefaultFooter from './DefaultFooter'

type Props = {
  children: ReactNode
}

export default function DefaultLayout({ children }: Props) {
  return (
    <>
      <header>
        <DefaultHeader />
      </header>
      <main
        id="page-component"
        style={{
          wordWrap: 'break-word',
          minHeight: 'calc(100vh - 128px)',
          backgroundColor: `#1c1b20`
        }}
      >
        <Box>{children}</Box>
      </main>
      <footer>
        <DefaultFooter />
      </footer>
    </>
  )
}
