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
import { gql } from '@apollo/client';
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
import { liveChannelViewersStyle, liveChannelStatus } from "./OverviewStyle"
import client from '../../../graphql';
import Tooltip from '@mui/material/Tooltip';
import LeftMenu from './LeftMenu';
import { useRouter } from 'next/router';
import { setCurrentRoute } from '../../../store/slices/routeSlice';
import { useDispatch, useSelector } from 'react-redux';

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

export default function OverviewPage({homeData}) {

  const theme = useTheme();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(true);
  // const [channels, setChannels] = useState([]);
  // const [tattooCategories, setTattooCategories] = useState([]);
  // const [liveStreamings, setLiveStreamings] = useState([])

  const [channels, setChannels] = useState(homeData.channels);
  const [tattooCategories, setTattooCategories] = useState(homeData.tattooCategories);
  const [liveStreamings, setLiveStreamings] = useState(homeData.liveStreamings)
  const router = useRouter()

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    // client.query({
    //   query: gql`
    //       query Query {
    //         channels {
    //           _id
    //           channelPicture
    //           channelName
    //         }
    //         tattooCategories {
    //           _id
    //           profilePicture
    //           tags
    //           title
    //           urlSlug
    //         }
    //         liveStreamings {
    //           _id
    //           title
    //           tattooCategory
    //           videoId
    //           viewers
    //           videoPoster
    //           tags
    //           channelDetails {
    //             _id
    //             channelPicture
    //           }
    //           description
    //           _id
    //           tattooCategoryDetails {
    //             _id
    //             title
    //             urlSlug
    //           }
              
    //         }
    //       }
    //   `,
    // })
    //   .then((result) => {
    //     console.log('result.data', result.data)
    //     setChannels(result.data.channels)
    //     setTattooCategories(result.data.tattooCategories)
    //     setLiveStreamings(result.data.liveStreamings)
    //   });
    dispatch(setCurrentRoute(router.pathname));
  }, [])




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
      <LeftMenu />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <SimpleSlider />
        {/* <Recommended channels = {channels} />         */}
        <LiveStreamings liveStreamings={liveStreamings} />
        <ChannelCategory tattooCategories={tattooCategories} />
        {/* {channelData?<div className='test'>
          {channelData.map((item)=>{
            <p>{item}</p>
          })}
        </div>: null} */}
      </Box>
    </Box >
  );
}
