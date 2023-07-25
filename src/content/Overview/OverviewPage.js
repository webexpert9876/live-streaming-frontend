import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { ApolloClient, InMemoryCache, useQuery, gql } from '@apollo/client';
import { useState } from 'react';
import { useEffect } from 'react';
import SimpleSlider from './Slider/index';
import Recommended from './Recommended/index';
// import LiveStreamings from './LiveStreamings/LiveStreamings';
import ChannelCategory from './ChannelCategory';
import LiveStreamings from './LiveStreamings/index'
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { Container, Link } from '@mui/material';
import {liveChannelViewersStyle, liveChannelStatus} from "./OverviewStyle"
import client from 'src/graphql';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

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
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function OverviewPage() {

  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [channels, setChannels] = useState([]);
  const [tattooCategories, setTattooCategories] = useState([]);
  const [liveStreamings, setLiveStreamings] = useState([])

//   const { data, loading, error } = useQuery(gql`
//   query Query {
//     channels {
//       _id
//       channelPicture
//       channelName
//     }
//   }
// `,);

//   if (loading) {
//     return <div>loading</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // const client = new ApolloClient({
  //   uri: 'https://tattoo-live-streaming-api-server.onrender.com/graphql',
  //   cache: new InMemoryCache(),
  // });
//   useEffect(async ()=>{
//    const gqlQuery = `query Query {
//      channels {
//        _id
//        channelPicture
//        channelName
//      }
//    }`
 
//    const data =await fetchGql(gqlQuery);
//     console.log(data);
//     setChannelData(data)

//  },[]);

//  async function fetchGql(gqlQuery){
//   const data = await graphql(gqlQuery);
//   console.log('graphql', data);
//   return data
  
// }

useEffect(()=>{
  client.query({
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
            }
            liveStreamings {
              _id
              title
              tattooCategory
              videoId
              viewers
            }
          }
      `,
  })
    .then((result) => {
      console.log('result.data', result.data)
      setChannels(result.data.channels)
      setTattooCategories(result.data.tattooCategories)
      setLiveStreamings(result.data.liveStreamings)
    });
}, [])

  const LiveChannelsList = [{
    channelName: "StreamerHouse",
    channelPicture: "https://static-cdn.jtvnw.net/jtv_user_pictures/c71b60fc-4215-4c41-aaaa-17908502babf-profile_image-70x70.png",
    channelCategory: "Remnant II",
    channelViewers: "340"
  },
  {
    channelName: "VeliaInn",
    channelPicture: "https://static-cdn.jtvnw.net/jtv_user_pictures/6eadc3b0-61dc-4d11-8e14-924bbfa35664-profile_image-70x70.png",
    channelCategory: "New World",
    channelViewers: "470"
  },
  {
    channelName: "MikaRS",
    channelPicture: "https://static-cdn.jtvnw.net/jtv_user_pictures/fd9521c0-018f-4d93-ab0d-44d2a00a00ef-profile_image-70x70.png",
    channelCategory: "New World",
    channelViewers: "292"
  },
  {
    channelName: "KatContii",
    channelPicture: "https://static-cdn.jtvnw.net/jtv_user_pictures/0303d2c5-5e4f-4138-9919-976285515616-profile_image-70x70.png",
    channelCategory: "Remnant II",
    channelViewers: "268"
  },
  {
    channelName: "KROTHA",
    channelPicture: "https://static-cdn.jtvnw.net/jtv_user_pictures/a9ce83ba-c0bd-49cc-83bd-9d17647a211a-profile_image-70x70.png",
    channelCategory: "New World",
    channelViewers: "77"
  },
  {
    channelName: "zackrawrr",
    channelPicture: "https://static-cdn.jtvnw.net/jtv_user_pictures/946c7e72-d500-47d9-a8a4-5597ba0b76f8-profile_image-70x70.png",
    channelCategory: "Just Chatting",
    channelViewers: "22.5K"
  },
  {
    channelName: "AzzeyUK",
    channelPicture: "https://static-cdn.jtvnw.net/jtv_user_pictures/e66515cc-b8aa-485b-82fa-f26b3f4adca0-profile_image-70x70.png",
    channelCategory: "Just Chatting",
    channelViewers: "142"
  },
  {
    channelName: "M3LFUNCTION",
    channelPicture: "https://static-cdn.jtvnw.net/jtv_user_pictures/8617132c-dfab-4c76-a20a-420781b8adb0-profile_image-70x70.png",
    channelCategory: "New World",
    channelViewers: "15"
  },
  {
    channelName: "KatContii",
    channelPicture: "https://static-cdn.jtvnw.net/jtv_user_pictures/0303d2c5-5e4f-4138-9919-976285515616-profile_image-70x70.png",
    channelCategory: "Remnant II",
    channelViewers: "268"
  },
  {
    channelName: "KROTHA",
    channelPicture: "https://static-cdn.jtvnw.net/jtv_user_pictures/a9ce83ba-c0bd-49cc-83bd-9d17647a211a-profile_image-70x70.png",
    channelCategory: "New World",
    channelViewers: "77"
  },
  {
    channelName: "zackrawrr",
    channelPicture: "https://static-cdn.jtvnw.net/jtv_user_pictures/946c7e72-d500-47d9-a8a4-5597ba0b76f8-profile_image-70x70.png",
    channelCategory: "Just Chatting",
    channelViewers: "22.5K"
  },
  {
    channelName: "AzzeyUK",
    channelPicture: "https://static-cdn.jtvnw.net/jtv_user_pictures/e66515cc-b8aa-485b-82fa-f26b3f4adca0-profile_image-70x70.png",
    channelCategory: "Just Chatting",
    channelViewers: "142"
  },
  {
    channelName: "M3LFUNCTION",
    channelPicture: "https://static-cdn.jtvnw.net/jtv_user_pictures/8617132c-dfab-4c76-a20a-420781b8adb0-profile_image-70x70.png",
    channelCategory: "New World",
    channelViewers: "15"
  }
  ]

  
  const scrollBar = {
    '&::-webkit-scrollbar': {
      width: '1px'
    },
    '&::-webkit-scrollbar-track': {
      background: '#f00'
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#f00'
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#f000'
    }
  };


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* <AppBar position="fixed" open={open} className='topmargin' sx={{ mt: '100px', left: 0 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>          
        </Toolbar>
      </AppBar> */}
      <Drawer variant="permanent" open={open} className='topmargin'>
        <DrawerHeader sx={{ mt: '1000', }}>
          <IconButton onClick={handleDrawerClose}>
          <div style={{fontSize:"12px"}}>RECOMMENDED CHANNELS</div> {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}>
            <ChevronRightIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List style={scrollBar}>
          {LiveChannelsList.map((channelList) => (

            <Grid container direction="row" alignItems="center" mt={"0px"} ml={"8px"} pb={"15px"} style={{ display: "flex", alignItems: "flex-start" }} >
              <Grid item>
                <img src={channelList.channelPicture} className='br100 listChannelIconSize' style={{ width: "30px" }} />
              </Grid>

              <Grid item ml={"15px"} style={{ width: "74%" }}>
                <ListItemText sx={{ display: open ? "block" : "none" }} style={{position:"relative"}}>
                  <div className='channelListChannelName'><Link href="#" color={'white'}>{channelList.channelName}</Link></div>
                  <div style={{fontSize:"12px"}}>{channelList.channelCategory}</div>
                  <div style={liveChannelViewersStyle}><div style={liveChannelStatus}></div>{channelList.channelViewers}</div>
                </ListItemText>
              </Grid>
            </Grid>
          ))}
        </List>
        <Divider />




      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <SimpleSlider />
        <Recommended channels = {channels} />        
        <LiveStreamings liveStreamings = {liveStreamings} />
        <ChannelCategory tattooCategories = {tattooCategories} />
        {/* {channelData?<div className='test'>
          {channelData.map((item)=>{
            <p>{item}</p>
          })}
        </div>: null} */}
      </Box>
    </Box >
  );
}
