import React, { useState, useEffect } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import {
  useTheme,
  createTheme,
  ThemeProvider,
  styled,
  ListItemText
} from '@mui/material';
import List from '@mui/material/List';

import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import { gql } from '@apollo/client';
import client from '../../../../graphql';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import { Container, Link } from '@mui/material';
import { liveChannelViewersStyle, liveChannelStatus } from "../OverviewStyle"

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

const LiveStreamingSkeletonItem = ({ open }) => {
  return (
    <SkeletonTheme color="#222956" highlightColor="#222956" style={{background:"#222956"}}> {/* Set background color to #f00 */}
      
    <Grid
      container
      className="tooltip"
      direction="row"
      alignItems="center"
      mt={"0px"}
      ml={"8px"}
      pb={"15px"}
      style={{ display: "flex", alignItems: "flex-start" }}
    >
      <Grid item>
        <Skeleton
          className='br100 listChannelIconSize'
          style={{ width: "30px", color:"#000", backgroundColor: '#0c1028' }} // Set background color here
          height={30}
        />
      </Grid>
      <Grid item ml={"15px"} style={{ width: "74%" }}>
        <ListItemText sx={{ display: open ? "block" : "none" }} style={{ position: "relative" }}>
          <div className='channelListChannelName'>
            <Skeleton height={16} width={100} highlightColor="#222956"  style={{ backgroundColor: '#0c1028' }} /> {/* Set background color here */}
          </div>
          <Skeleton height={16} width={100}  highlightColor="#222956"  style={{ backgroundColor: '#0c1028' }} /> {/* Set background color here */}
          <span className="tooltiptext"  style={{ textAlign: "left", padding: "10px", backgroundColor: '#0c1028' }}> {/* Set background color here */}
            <Skeleton height={16} width={100} highlightColor="#222956"  style={{ backgroundColor: '#0c1028' }} /> {/* Set background color here */}
          </span>
          <div style={liveChannelViewersStyle}>
            <div style={liveChannelStatus}></div>
            <Skeleton height={16} width={50} highlightColor="#222956"  style={{ backgroundColor: '#0c1028' }} /> {/* Set background color here */}
          </div>
        </ListItemText>
      </Grid>
    </Grid>
    </SkeletonTheme>
  );
};

const LiveStreamingsSkeleton = ({ open }) => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <LiveStreamingSkeletonItem key={index} open={open} />
      ))}
    </>
  );
};


export default function LeftMenu(props) {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [channels, setChannels] = useState([]);
  const [tattooCategories, setTattooCategories] = useState([]);
  const [liveStreamings, setLiveStreamings] = useState([]);
  console.log('props', props)

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false); // Set isLoading to false when data is loaded
    }, 2000); // Replace 2000ms with your actual loading time (if you have data fetching)
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
              }
              
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
    return () => clearTimeout();
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

  // const PrimaryMainTheme = createTheme({
  //   palette: {
  //     primary: {
  //       main: '#111633',
  //     },
  //   },
  // });

  const PrimaryMainTheme = createTheme({
    components: {
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: '#111633', // Set the background color to dark blue
          },
        },
      },
    },
  });

  // function LeftMenu() {
  return (
    <div>
      <ThemeProvider theme={PrimaryMainTheme}>
        <React.Fragment>
          <Drawer variant="permanent" open={open} className='topmargin' style={{ backgroundColor: '#0c1028' }}> {/* Set the background color of the Drawer */}
            <DrawerHeader sx={{ mt: '1000', }} className='minHeightTitleMenu'>
              <IconButton onClick={handleDrawerClose}>
                <div style={{ fontSize: "12px", color:"#fff" }}>RECOMMENDED CHANNELS</div> {theme.direction === 'rtl' ? <ChevronRightIcon style={{color:"#fff"}} /> : <ChevronLeftIcon style={{color:"#fff"}} />}
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{
                  marginRight: 5,
                  ...(open && { display: 'none' }),
                }}
                style={{color:"#fff"}}>
                <ChevronRightIcon />
              </IconButton>
            </DrawerHeader>
            <Divider />
            <List style={scrollBar}>
              {isLoading ? (
                <LiveStreamingsSkeleton open={open} />
              ) : (
                // Render the actual liveStreamings data if isLoading is false
                liveStreamings.map((channelList) => (
                  <Grid
                    key={channelList._id}
                    container
                    className="tooltip"
                    direction="row"
                    alignItems="center"
                    mt={"0px"}
                    ml={"8px"}
                    pb={"15px"}
                    style={{ display: "flex", alignItems: "flex-start" }}
                  >
                    <Grid item>
                      <img src={`${process.env.NEXT_PUBLIC_S3_URL}/${channelList.channelDetails[0].channelPicture}`} className='br100 listChannelIconSize' style={{ width: "30px" }} />
                    </Grid>
                    <Grid item ml={"15px"} style={{ width: "74%" }}>
                      <ListItemText sx={{ display: open ? "block" : "none" }} style={{ position: "relative" }}>
                        <div className='channelListChannelName'>
                          <Link href="#" style={{ color: 'white', textDecoration:"none" }}>
                            {channelList.title.slice(0, 15)}
                          </Link>
                        </div>
                        <Link href="#" style={{ color: 'white', fontSize:"12px", textDecoration:"none" }}>
                        {channelList.tattooCategoryDetails[0].title.length > 20
                          ? `${channelList.tattooCategoryDetails[0].title.slice(0, 15)}...`
                          : channelList.tattooCategoryDetails[0].title}
                        </Link>

                        <span className="tooltiptext" style={{ textAlign: "left", padding: "10px"}}>
                          {channelList.title}<br />
                          {channelList.tattooCategoryDetails[0].title.length > 20
                            ? `${channelList.tattooCategoryDetails[0].title}`
                            : channelList.tattooCategoryDetails[0].title}
                        </span>
                        <div style={liveChannelViewersStyle}><div style={liveChannelStatus}></div><span style={{color:"#fff"}}>{channelList.viewers}</span></div>
                      </ListItemText>
                    </Grid>
                  </Grid>
                ))
              )}
            </List>
            <Divider />
          </Drawer>
        </React.Fragment>
      </ThemeProvider>
    </div>
  );
}