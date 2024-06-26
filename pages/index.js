import * as React from 'react';
import { useEffect } from 'react';
import {
  Typography,
  Box,
  Card,
  Container,
  Button,
  styled
} from '@mui/material';
import BaseLayout from 'src/layouts/BaseLayout';
import { useState } from 'react';
import Link from 'src/components/Link';
import Head from 'next/head';

import Logo from 'src/components/LogoSign';
import Hero from 'src/content/Overview/Hero';
import OverviewPage from 'src/content/Overview/OverviewPage';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { gql } from '@apollo/client';
import client from '../graphql';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


function Overview(props) {
  const drawerWidth = 240;

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));

  const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      '& .MuiDrawer-paper': {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        boxSizing: 'border-box',
        ...(!open && {
          overflowX: 'hidden',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          width: theme.spacing(7),
          [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
          },
        }),
      },
    }),
  );

  const HeaderWrapper = styled(Card)(
    ({ theme }) => `
  width: 100%;
  display: flex;
  align-items: center;
  height: ${theme.spacing(10)};
  margin-bottom: ${theme.spacing(10)};
`
  );

  const OverviewWrapper = styled(Box)(
    ({ theme }) => `
    overflow: auto;
    background: ${theme.palette.common.white};
    flex: 1;
    overflow-x: hidden;
`
  );

  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };


  useEffect(() => {
    document.body.classList.add("lightVersion0");
  });

  /////// skeleton ///////

    
  
  


  return (
    <OverviewWrapper>
      <Head>
        <title>Tattoo Streaming</title>
      </Head>
      {/* <HeaderWrapper className='stickyHeader'>
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
        </HeaderWrapper> */}
        
      {/* <HeaderWrapper className='stickyHeader'>
        <Container maxWidth="false">
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
      </HeaderWrapper> */}
      {/* <Hero /> */}

      {props.data? <OverviewPage homeData={props.data}/>:null}

      {/* <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Typography textAlign="center" variant="subtitle1">
          Crafted by{' '}
          <Link
            href="https://bloomui.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Tatto
          </Link>
        </Typography>
      </Container> */}
    </OverviewWrapper>
  );
}

export default Overview;

export async function getStaticProps() {
  try {
    const { data } = await client.query({
      query: gql`
        query Query ($size: Int) {
          channels {
            _id
            channelPicture
            channelName
            urlSlug
          }
          tattooCategories {
            _id
            profilePicture
            tags
            title
            urlSlug
          }
          liveStreamings(size: $size) {
            _id
            title
            tattooCategory
            videoId
            viewers
            videoPoster
            tags
            channelDetails {
              _id
              channelName
              channelPicture
              urlSlug
            }
            description
            _id
            tattooCategoryDetails {
              _id
              title
              urlSlug
            } 
          }
          getSliderLiveStreams {
            viewers
            videoId
            channelDetails {
              urlSlug
              channelName
              channelPicture
              description
              _id
            }
            streamUrl
            tags
            tattooCategoryDetails {
              title
              urlSlug
            }
            _id
            description
            title
            videoPoster
          }
        }
      `,
      variables: {
        "size": 10
      }
    });

    return {
      props: { data }, // No need to stringify the data
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: { data: null }, // Handle error case gracefully in your component
    };
  }
}


Overview.getLayout = function getLayout(page) {
  return <BaseLayout>{page}</BaseLayout>;
};

