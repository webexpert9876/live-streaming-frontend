import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import { useState } from 'react';
import { useEffect } from 'react';
import SimpleSlider from './Slider/index';
import Recommended from './Recommended/index';
// import LiveStreamings from './LiveStreamings/LiveStreamings';
import ChannelCategory from './ChannelCategory';
import LiveStreamings from './LiveStreamings/index';
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
console.log('homeData', homeData)
  const theme = useTheme();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(true);
  const [channels, setChannels] = useState(homeData.channels);
  const [tattooCategories, setTattooCategories] = useState(homeData.tattooCategories);
  const [liveStreamings, setLiveStreamings] = useState(homeData.liveStreamings)
  const [sliderData, setSliderData] = useState(homeData.getSliderLiveStreams)
  const router = useRouter()

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {    
    dispatch(setCurrentRoute(router.pathname));
  }, [])


  const scrollBar = {
    '&::-webkitScrollbar': {
      width: '1px'
    },
    '&::WebkitScrollbarTrack': {
      background: '#f00'
    },
    '&::-WebkitScrollbarThumb': {
      background: '#f00'
    },
    '&::-WebkitScrollbarThumb:hover': {
      background: '#f000'
    }
  };
  const headerMargin = {
      marginTop: "90px"
  }


  return (
    <Box sx={{ display: 'flex' }} style={{padding: "50px 0 0 0",  background: "#0c1028"}}>
      <CssBaseline />
      <LeftMenu />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }} style={headerMargin}>
        <SimpleSlider sliderData={sliderData}/>
        {/* <Recommended channels = {channels} />         */}
        <LiveStreamings liveStreamings={liveStreamings} />
        <ChannelCategory tattooCategories={tattooCategories} />        
      </Box>
    </Box >
  );
}
