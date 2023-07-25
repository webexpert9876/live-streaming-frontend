import { useRouter } from 'next/router'
import PageHeader from 'src/content/Dashboards/Tasks/PageHeader';
import {
  Typography,
  Box,
  Card,
  Container,
  Button,
  styled,
  Grid,
  Paper
} from '@mui/material';
import Logo from 'src/components/LogoSign';
import Link from 'src/components/Link';
import Head from 'next/head';

export default function Category() {
  const HeaderWrapper = styled(Card)(
    ({ theme }) => `
    width: 100%;
    display: flex;
    align-items: center;
    height: ${theme.spacing(10)};
    margin-bottom: ${theme.spacing(10)};
    border-radius:0;
  `
  );
  const router = useRouter()
  return (
    <>

      <HeaderWrapper>
        <Container maxWidth="lg">
          <Box display="flex" alignItems="center">
            <Logo />
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              flex={1}
            >
              <Box />
              <Box>
                <Button
                  component={Link}
                  href="/auth/login"
                  variant="contained"
                  sx={{ ml: 2 }}
                >
                  Login
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </HeaderWrapper>

      <Grid container spacing={2}>
        {/* Left Image Section */}
        <Grid item xs={12} sm={6}>
          <img
            src="https://static-cdn.jtvnw.net/ttv-boxart/493597_IGDB.jpg"
            alt="Left Image"
            style={{ width: '100%', height: 'auto' }}
          />
        </Grid>

        {/* Right Text Section */}
              
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} style={{ padding: '16px' }}>
            <Typography variant="h5">Heading</Typography>
            <Typography variant="body1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
              pulvinar erat ut sapien mattis scelerisque. Sed quis est sit amet
              nibh blandit lobortis.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <p>Post: {router.query.category}</p>
    </>
  )
}