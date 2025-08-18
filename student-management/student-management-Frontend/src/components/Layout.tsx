import type { PropsWithChildren } from 'react'
import { AppBar, Toolbar, Typography, Container } from '@mui/material'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Student Management</Typography>
        </Toolbar>
      </AppBar>
      <Container className="container" maxWidth="lg">
        {children}
      </Container>
    </>
  )
}
