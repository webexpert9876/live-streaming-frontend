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

console.log('props', props)
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
        query Query {
          channels {
            _id
            channelPicture
            channelName
          }
          tattooCategories {
            _id
            profilePicture
            tags
            title
            urlSlug
          }
          liveStreamings {
            _id
            title
            tattooCategory
            videoId
            viewers
            videoPoster
            tags
            channelDetails {
              _id
              channelPicture
            }
            description
            _id
            tattooCategoryDetails {
              _id
              title
              urlSlug
            }
            
          }
        }
      `,
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

// export async function getStaticProps() {

//   let data = await client.query({
//     query: gql`
//           query Query {
//             channels {
//               channelName
//               channelPicture
//             }
//             tattooCategories {
//               _id
//               profilePicture
//               tags
//               title
//             }
//             liveStreamings {
//               _id
//               title
//               tattooCategory
//               videoId
//               viewers
//             }
//           }
//       `,
//   })
//     .then((result) => {
//       console.log('result.data', result.data)
//       // setChannels(result.data.channels)
//       // setTattooCategories(result.data.tattooCategories)
//       // setLiveStreamings(result.data.liveStreamings)
//       return result.data
//     });
//     // data = JSON.stringify(data);
//     // const LiveChannelsList = [{
//     //   channelName: "StreamerHouse",
//     //   channelPicture: "https://static-cdn.jtvnw.net/jtv_user_pictures/c71b60fc-4215-4c41-aaaa-17908502babf-profile_image-70x70.png",
//     //   channelCategory: "Remnant II",
//     //   channelViewers: "340"
//     // },
//     // {
//     //   channelName: "VeliaInn",
//     //   channelPicture: "https://static-cdn.jtvnw.net/jtv_user_pictures/6eadc3b0-61dc-4d11-8e14-924bbfa35664-profile_image-70x70.png",
//     //   channelCategory: "New World",
//     //   channelViewers: "470"
//     // },
//     // {
//     //   channelName: "MikaRS",
//     //   channelPicture: "https://static-cdn.jtvnw.net/jtv_user_pictures/fd9521c0-018f-4d93-ab0d-44d2a00a00ef-profile_image-70x70.png",
//     //   channelCategory: "New World",
//     //   channelViewers: "292"
//     // },
//     // {
//     //   channelName: "KatContii",
//     //   channelPicture: "https://static-cdn.jtvnw.net/jtv_user_pictures/0303d2c5-5e4f-4138-9919-976285515616-profile_image-70x70.png",
//     //   channelCategory: "Remnant II",
//     //   channelViewers: "268"
//     // },
//     // {
//     //   channelName: "KROTHA",
//     //   channelPicture: "https://static-cdn.jtvnw.net/jtv_user_pictures/a9ce83ba-c0bd-49cc-83bd-9d17647a211a-profile_image-70x70.png",
//     //   channelCategory: "New World",
//     //   channelViewers: "77"
//     // },
//     // {
//     //   channelName: "zackrawrr",
//     //   channelPicture: "https://static-cdn.jtvnw.net/jtv_user_pictures/946c7e72-d500-47d9-a8a4-5597ba0b76f8-profile_image-70x70.png",
//     //   channelCategory: "Just Chatting",
//     //   channelViewers: "22.5K"
//     // },
//     // {
//     //   channelName: "AzzeyUK",
//     //   channelPicture: "https://static-cdn.jtvnw.net/jtv_user_pictures/e66515cc-b8aa-485b-82fa-f26b3f4adca0-profile_image-70x70.png",
//     //   channelCategory: "Just Chatting",
//     //   channelViewers: "142"
//     // },
//     // {
//     //   channelName: "M3LFUNCTION",
//     //   channelPicture: "https://static-cdn.jtvnw.net/jtv_user_pictures/8617132c-dfab-4c76-a20a-420781b8adb0-profile_image-70x70.png",
//     //   channelCategory: "New World",
//     //   channelViewers: "15"
//     // },
//     // {
//     //   channelName: "KatContii",
//     //   channelPicture: "https://static-cdn.jtvnw.net/jtv_user_pictures/0303d2c5-5e4f-4138-9919-976285515616-profile_image-70x70.png",
//     //   channelCategory: "Remnant II",
//     //   channelViewers: "268"
//     // },
//     // {
//     //   channelName: "KROTHA",
//     //   channelPicture: "https://static-cdn.jtvnw.net/jtv_user_pictures/a9ce83ba-c0bd-49cc-83bd-9d17647a211a-profile_image-70x70.png",
//     //   channelCategory: "New World",
//     //   channelViewers: "77"
//     // },
//     // {
//     //   channelName: "zackrawrr",
//     //   channelPicture: "https://static-cdn.jtvnw.net/jtv_user_pictures/946c7e72-d500-47d9-a8a4-5597ba0b76f8-profile_image-70x70.png",
//     //   channelCategory: "Just Chatting",
//     //   channelViewers: "22.5K"
//     // },
//     // {
//     //   channelName: "AzzeyUK",
//     //   channelPicture: "https://static-cdn.jtvnw.net/jtv_user_pictures/e66515cc-b8aa-485b-82fa-f26b3f4adca0-profile_image-70x70.png",
//     //   channelCategory: "Just Chatting",
//     //   channelViewers: "142"
//     // },
//     // {
//     //   channelName: "M3LFUNCTION",
//     //   channelPicture: "https://static-cdn.jtvnw.net/jtv_user_pictures/8617132c-dfab-4c76-a20a-420781b8adb0-profile_image-70x70.png",
//     //   channelCategory: "New World",
//     //   channelViewers: "15"
//     // }
//     // ]
//   return {
//     props: { data },
//   }
// }

