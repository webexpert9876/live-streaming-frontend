import client from "../../graphql";
import { gql } from "@apollo/client";
import { useState, useEffect } from "react";
import LeftMenu from '../../src/content/Overview/LeftMenu/index';
import Paper from '@mui/material/Paper';
import { Box, Grid, Link, Typography, Container, Button, Card, CardMedia, Tooltip, MenuItem , Avatar, Menu, Toolbar, AppBar, Tab} from "@mui/material";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import styled from "@emotion/styled";
import React from 'react';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AdbIcon from '@mui/icons-material/Adb';
import VideoJS from '../../src/content/Overview/Slider/VideoJS';
import videojs from 'video.js';
import Image from 'next/image'
import LiveStreamChat from '../../src/content/Channel/LiveStreamChat'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
// import '../../src/content/Overview/Slider/videoPlayer.css'
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { setAuthUser, setAuthState, selectAuthState, selectAuthUser } from '../../store/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
// import BiLogoDiscord from 'react-icons/fa';
// import { FaBeer } from "@react-icons/fa";


const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function ChannelName(props) {
    const channelInfo = JSON.parse(props.channelInfo);
    const [channelDetails, setChannelDetails] = useState(...channelInfo.channels);
    const [recentLiveStreamVideos, setRecentLiveStreamVideos] = useState(channelInfo.recentLiveStreamVideos);
    const [recentUploadedVideos, setRecentUploadedVideos] = useState(channelInfo.recentUploadedVideos);
    const [allVideos, setAllVideos] = useState(channelInfo.videos);
    const [currentBroadcast, setCurrentBroadcast] = useState(...channelInfo.liveStreamings);
    const [channelTotalFollower, setChannelTotalFollower] = useState(...channelInfo.countChannelTotalFollowers);
    const [streams, setStreams] = useState(channelInfo.streams);
    const [showAllRecentBroadcast, setShowAllRecentBroadcast] = useState(true);
    const [showAllVideos, setShowAllVideos] = useState(true);
    const [noVideoFound, setNoVideoFound] = useState(false);
    const [isClickOnChannel, setIsClickOnChannel] = useState(false);
    const [oldReceivedMessages, setOldReceivedMessages] = React.useState([]);
    const [value, setValue] = React.useState('1');
    const [isChannelFollowing, setIsChannelFollowing] = useState({});
    let userDetails = useSelector(selectAuthUser);
    let userIsLogedIn = useSelector(selectAuthState);
    // console.log('authUser userDetails', userDetails);
    const [userDetail, setUserDetail] = useState(userDetails);
    const [userAuthState, setUserAuthState] = useState(userIsLogedIn);
    
    // console.log('currentBroadcast', currentBroadcast)
    React.useEffect(()=>{
        client.query({
            variables: {
                // videoId: '649e6a81509b35397cc26534', use this not found
                videoId: currentBroadcast.videoId,
            },
            query: gql`
                query Query($videoId: String!) {
                    chatMessages(videoId: $videoId) {
                        userDetail {
                            firstName
                            lastName
                            _id
                        }
                        message
                        videoId
                        hours
                        mins
                    }

                }
            `,
        })
        .then((result) => {
            // console.log('result', result)
            setOldReceivedMessages(result.data.chatMessages)
        });
    }, [])

    useEffect( ()=>{
        if(userDetails && userIsLogedIn){
          client.query({
            query: gql`
                query Query ($channelId: String!, $userId: String!) {
                    isChannelFollowing(channelId: $channelId, userId: $userId) {
                    isFollowing
                    channelId
                    userId
                    _id
                    }
                }
            `,
            variables: {
              "channelId": channelDetails._id,
              "userId": userDetails._id
            }
          }).then((result) => {
            setIsChannelFollowing(result.data.isChannelFollowing[0])
            setUserDetail(userDetails);
            return result.data
          });
        }
      }, [userDetails])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // console.log('main channel', channelInfo);
    // console.log('main channelDetails', channelDetails);
    // console.log('main recentLiveStreamVideos', recentLiveStreamVideos);
    // console.log('main recentUploadedVideos', recentUploadedVideos);
    // console.log('streams', streams);
    // console.log('currentBroadcast', currentBroadcast);
    // console.log('countChannelTotalFollowers', channelInfo.countChannelTotalFollowers);

    // useEffect(()=>{
    //     if(recentLiveStreamVideos.length == 0 && recentUploadedVideos.length == 0){
    //         console.log('noVideoFound', noVideoFound)
    //         setNoVideoFound(true);
    //         console.log('noVideoFound', noVideoFound)
    //     }
    // }, [])
    const playerRef = React.useRef(null);

    const handlePlayerReady = (player) => {
        playerRef.current = player;

        // You can handle player events here, for example:
        player.on('waiting', () => {
            videojs.log('player is waiting');
        });

        player.on('dispose', () => {
            videojs.log('player will dispose');
        });
    };

    const handleChatClick = ()=>{
        setIsClickOnChannel(true);
        setShowAllRecentBroadcast(true)
    }
    const closeChat = ()=>{
        setIsClickOnChannel(false);
        setShowAllRecentBroadcast(true)
    }

    const handleAllRecentBroadcast= ()=>{
        setShowAllRecentBroadcast(!showAllRecentBroadcast)
    }
    
    const handleShowAllVideo= ()=>{
        setShowAllVideos(!showAllVideos)
    }

    // This function calculate how many days ago video uploaded or stream
    function calculateDaysAgo(uploadDate) {
        const currentDate = new Date();
        const uploadDateTime = new Date(parseInt(uploadDate));
        const timeDifference = currentDate - uploadDateTime;
        const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        return daysAgo;
    }
    
    const responsive = {
        superLargeDesktop: {
          // the naming can be any, depends on you.
          breakpoint: { max: 4000, min: 3000 },
          items: 7
        },
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 5
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 2
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1
        }
    };

    const offline = {
        backgroundColor: "#3d3d3d",
        fontSize:"12px",
        color:"#fff",
        padding: "5px",
        textAlign: "center"
    }

    const countLiveViewing = (viewers) => {
        if(viewers > 999 && viewers < 1000000){
          const viewing = (Math.floor(viewers / 100) / 10).toFixed(1) + "K";
          return viewing
        } else if(viewers > 999999){
          const viewing = (Math.floor(viewers / 100000) / 10).toFixed(1) + "M";
          return viewing
        } else {
          return `${viewers}`
        } 
    }


    const handleFollow = async(checkFollow) => {
        
        if(checkFollow){
            try{
                const result = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create/follower`, {userId: userDetail._id, channelId: channelDetails._id, isFollowing: true}, {headers: {'x-access-token': userDetail.jwtToken}});
                if(result){
                    setIsChannelFollowing(result.data.followingDetails)
                }
            } catch( error){
                console.log('error', error)
            }
        } else {
            try{
                const result = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/follower/${isChannelFollowing._id}`, {headers: {'x-access-token': userDetail.jwtToken}});
                
                if(result){
                    setIsChannelFollowing(result.data.followingDetails)
                }
            } catch( error){
                console.log('error', error)
            }
        }
    
      }


    return (
        <>
            <Box sx={{ display: 'flex', paddingTop: '100px' }}>
                <LeftMenu />
                <Box component="main" sx={{ flexGrow: 1, marginTop: '-8px', width: '100%'  }}>
                    {currentBroadcast?
                        <Typography variant="body1" component={'div'} sx={{ paddingBottom: '10px' }}>
                            <VideoJS  options={{
                                autoplay: true,
                                controls: true,
                                responsive: true,
                                fluid: true,
                                className: 'online-video',
                                sources: [{
                                    // src: 'https://5b44cf20b0388.streamlock.net:8443/vod/smil:bbb.smil/playlist.m3u8',
                                    src: currentBroadcast.streamUrl,
                                    type: 'application/x-mpegURL'
                                }]
                            }} onReady={handlePlayerReady} />
                        </Typography>:
                        <Box>
                            <Typography variant="body1" component={'div'} sx={{backgroundImage: "url(https://dummyimage.com/1835x550/000/fff)", width: '100%',height: '550px',backgroundRepeat: 'no-repeat'}}>
                                {/* <Typography variant="p" component={'p'}>Artist {channelDetails.channelName} is offline</Typography> */}
                                <Typography variant="p" component={'p'} style={offline}>Offline</Typography>
                                {/* <Typography variant="body1" component={'div'} sx={{display: 'flex', justifyContent: 'center', position: "relative", top: '25%'}}>
                                    <Typography variant="body1" component={'div'} sx={{width: '20%', background: '#fff', marginRight: '10px', padding: '1%'}}>
                                        <Box sx={{position: 'relative', top: '25%', padding: '10px'}}>
                                            <Typography sx={{ background: '#000', color: '#fff', textAlign: 'center', width: '30%', borderRadius: '9px', padding: '5px' }}>OFFLINE</Typography>
                                            <Typography sx={{marginTop: '5px', fontSize:"25px", color: '#000', fontWeight: 800}}>{channelDetails.channelName} is offline.</Typography>
                                        </Box>
                                    </Typography>
                                    <VideoJS options={{
                                        autoplay: true,
                                        controls: true,
                                        responsive: true,
                                        fluid: true,
                                        className: 'offline-video',
                                        sources: [{
                                            src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                                            // src: currentBroadcast.streamUrl,
                                            type:"video/mp4"
                                        }]
                                    }} onReady={handlePlayerReady} />
                                </Typography> */}
                            </Typography>
                            {/* <Typography variant="p" component={'p'}>No live Streaming</Typography> */}
                        </Box>
                    }
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '10px'
                        }}
                    >
                        <Item sx={{ border: '0px', boxShadow: 'none', backgroundColor: 'transparent !important' }}>
                            <Typography variant="body1" component={'div'} sx={{ display: 'flex' }}>
                                <Typography variant="body1" component={'div'} sx={{}}>
                                    {/* <Image
                                        src="https://picsum.photos/536/354"
                                        width={500}
                                        height={500}
                                        alt="Picture of the author"
                                    /> */}
                                    <img src={`${process.env.NEXT_PUBLIC_S3_URL}/${channelDetails.channelPicture}`} style={{ borderRadius: '100%', height: '65px', width: '65px', margin: '8px 12px 18px 18px' }} width="500" height="600"></img>
                                </Typography>

                                <Typography variant="body1" component={'div'} sx={{  }}>
                                    <Typography variant="h3" component="h3" sx={{ fontWeight: 600, fontSize: '20px', cursor: 'pointer' }} align="left">{channelDetails.channelName}</Typography>
                                    {currentBroadcast?<Typography variant="body1" component={'div'} sx={{}}>
                                        <Typography variant="h4" component="h4" sx={{ fontWeight: 600, fontSize: '15px', marginTop:'8px' }} align="left">{currentBroadcast.description}</Typography>
                                        <Typography variant="body1" component={'div'} sx={{ display: 'flex', marginTop: '5px' }}>
                                            <Link href={`/single-category/${currentBroadcast.tattooCategoryDetails[0].urlSlug}`} sx={{ fontWeight: 400, paddingRight: '10px', cursor: 'pointer' }} align="left">{currentBroadcast.tattooCategoryDetails[0].title}</Link>
                                            {/* <Typography variant="h6" component="h6" sx={{ fontWeight: 400, fontSize: '12px', borderRadius: '50px', backgroundColor: 'grey', padding: '2px 10px 2px 10px' }}>Tattoo</Typography> */}
                                            {currentBroadcast.tags.map((tag, index)=>{
                                                return (<Button key={index} variant="contained" sx={{ fontWeight: 400, fontSize: '12px', borderRadius: '50px', backgroundColor: 'grey', padding: '0px', margin: '0px 2px' }}>
                                                        <Link href={`/tags/`} sx={{color: '#fff'}}>{tag}</Link>
                                                    </Button>)
                                            })}
                                        </Typography>
                                    </Typography>:
                                        <Typography variant="h5" component={"h5"} sx={{fontSize:'15px', marginTop:'8px' }}>
                                        {countLiveViewing(channelTotalFollower.countFollower)} followers
                                    </Typography>
                                    }
                                </Typography>
                            </Typography>
                        </Item>

                        <Item sx={{ border: '0px', boxShadow: 'none', backgroundColor: 'transparent !important' }}>
                            <Typography variant="body1" component={'div'} sx={{ gap: "15px", display: "flex" }}>
                                {/* <Button variant="contained" startIcon={<FavoriteBorderIcon />} sx={{ fontWeight: 400, fontSize: '12px', backgroundColor: 'rgb(112, 99, 192)', padding: '8px 30px', borderRadius: '5px' }}>Follow</Button> */}
                                {isChannelFollowing?
                                    (isChannelFollowing.isFollowing?
                                        <Button variant="contained" startIcon={<FavoriteIcon />} onClick={()=>handleFollow(false)} sx={{ fontWeight: 400, fontSize: '12px', backgroundColor: 'rgb(112, 99, 192)', padding: '8px 30px', borderRadius: '5px' }}>Following</Button>
                                        :
                                        ( Object.keys(userDetail).length === 0? 
                                            <Tooltip title={<React.Fragment>Please <Link href={`/auth/login`}>login</Link> to follow channel</React.Fragment>} placement="right-start">
                                                <Button variant="contained" startIcon={<FavoriteBorderIcon />} sx={{ fontWeight: 400, fontSize: '12px', backgroundColor: 'rgb(112, 99, 192)', padding: '8px 30px', borderRadius: '5px' }}>Follow</Button>
                                            </Tooltip>
                                        : 
                                            <Button variant="contained" startIcon={<FavoriteBorderIcon />} onClick={()=>handleFollow(true)} sx={{ fontWeight: 400, fontSize: '12px', backgroundColor: 'rgb(112, 99, 192)', padding: '8px 30px', borderRadius: '5px' }}>Follow</Button>
                                        )
                                    )
                                : null}
                                <Button variant="contained" sx={{ fontWeight: 400, fontSize: '12px', backgroundColor: 'grey', padding: '8px 30px', borderRadius: '5px' }}>Subscribe</Button>
                            </Typography>
                            <Typography variant="body1" component={'div'} sx={{ gap: "50px", display: "flex", margin: '10px 40px'}}>
                                <Typography variant="body1" component={'span'}>
                                    123
                                </Typography>
                                <Typography variant="body1" component={'span'}>
                                    123
                                </Typography>
                            </Typography>
                        </Item>
                    </Box>
                    {/* { !isClickOnChannel?  */}
                        <Container maxWidth="xl">
                            <Box sx={{ width: '100%', typography: 'body1' }}>
                                <TabContext value={value}>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider', paddingBottom: '10px' }}>
                                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                                            <Tab label="Home" value="1" onClick={closeChat}/>
                                            <Tab label="About" value="2" onClick={closeChat}/>
                                            <Tab label="Videos" value="3" onClick={closeChat}/>
                                            <Tab label="Chat" onClick={handleChatClick}/>
                                        </TabList>
                                    </Box>
                                    {/* Home tab section */}
                                    <TabPanel value="1">

                                    </TabPanel>

                                    {/* About tab section */}
                                    <TabPanel value="2">
                                        <Container maxWidth="lg" sx={{padding: '20px'}}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    marginTop:'20px',
                                                    paddingBottom: '30px'
                                                }}
                                            >
                                                <Item sx={{ border: '0px', boxShadow: 'none', backgroundColor: 'transparent !important' }}>
                                                    <Box sx={{'textAlign': 'left'}}>
                                                        <Typography variant="h5" component={"h5"} sx={{fontSize:'25px'}}>
                                                            About {channelDetails.channelName}
                                                        </Typography>
                                                        <Typography variant="h5" component={"h5"} sx={{fontSize:'15px', marginTop:'8px' }}>
                                                            {countLiveViewing(channelTotalFollower.countFollower)} followers
                                                        </Typography>
                                                        <Typography variant="h5" component={"h5"} sx={{fontSize:'15px', marginTop:'8px'}}>
                                                            {channelDetails.description}
                                                        </Typography>
                                                    </Box>
                                                </Item>

                                                <Item sx={{ border: '0px', boxShadow: 'none', backgroundColor: 'transparent !important' }}>
                                                    <Box sx={{'textAlign': 'left'}}>
                                                        <Typography variant="body1" component={'div'} sx={{fontSize:'15px', marginTop:'8px'}}>
                                                            <Link href="#"><FacebookIcon /> Facebook</Link>
                                                        </Typography>
                                                        <Typography variant="body1" component={'div'} sx={{fontSize:'15px', marginTop:'8px'}}>
                                                            <Link href="#" ><YouTubeIcon /> YouTube</Link>
                                                        </Typography>
                                                        <Typography variant="body1" component={'div'} sx={{fontSize:'15px', marginTop:'8px'}}>
                                                            <Link href="#">
                                                            {/* <BiLogoDiscord /> */}
                                                            {/* <FaBeer /> */}
                                                            {/* <FontAwesomeIcon icon="fa-brands fa-discord" /> */}
                                                            Discord
                                                            </Link>
                                                        </Typography>
                                                    </Box>
                                                </Item>
                                            </Box>
                                        </Container>
                                    </TabPanel>

                                    {/* Videos tab section */}
                                    <TabPanel value="3" sx={{ padding:'20px 0px', textAlign: 'left' }}>
                                    {(recentLiveStreamVideos.length != 0 && recentUploadedVideos.length != 0) ? <>
                                        <Box>
                                            {recentLiveStreamVideos.length != 0 ? <>
                                                <Typography variant="body1" component="div" sx={{ display: 'flex', alignItems: 'baseline' }}>
                                                    <Typography variant="h4" component="h4" sx={{ fontWeight: 600, fontSize: '17px', marginRight: "10px" }}>Recent Broadcasts</Typography>
                                                    {showAllRecentBroadcast ? <Button sx={{ fontWeight: 600, fontSize: '15px' }} onClick={handleAllRecentBroadcast}>View All</Button> : <Button sx={{ fontWeight: 600, fontSize: '15px' }} onClick={handleAllRecentBroadcast}>View less</Button>}
                                                </Typography>

                                                <Box sx={{ paddingTop: '5px' }}>
                                                    {/* <Grid className='desktop5'> */}
                                                    {showAllRecentBroadcast ?
                                                        <Carousel swipeable={false} responsive={responsive}>
                                                            {recentLiveStreamVideos.slice(0, 10).map((streamsInfo, index) => (
                                                                <Grid item xs={12} sm={6} md={4} key={index} style={{ maxWidth: "100%" }}>
                                                                    <Card sx={{ maxWidth: 345 }}>
                                                                        <div style={{ position: 'relative' }}>
                                                                            <CardMedia
                                                                                sx={{ height: 140 }}
                                                                                image={`${process.env.NEXT_PUBLIC_S3_URL}/${streamsInfo.videoPreviewImage}`}
                                                                            >
                                                                            </CardMedia>
                                                                            <Typography variant="body1" component="div" sx={{}}>
                                                                                <div className=''>{countLiveViewing(streamsInfo.views)} viewers</div>
                                                                                <div className=''>{calculateDaysAgo(streamsInfo.createdAt)} days ago</div>
                                                                            </Typography>
                                                                        </div>
                                                                        <Grid container direction="row" alignItems="center" mt={"15px"} ml={"15px;"} pb={"15px"} style={{ display: "flex", alignItems: "flex-start" }}>
                                                                            <Grid item>
                                                                                <img src={`${process.env.NEXT_PUBLIC_S3_URL}/${channelDetails.channelPicture}`} className='br100 listChannelIconSize' />
                                                                            </Grid>
                                                                            <Grid item ml={"15px"} style={{ width: "75%" }}>
                                                                                <Typography gutterBottom variant="h5" component="div">
                                                                                    <Link href={`/video/${streamsInfo._id}`} color={'white'}>{streamsInfo.description}</Link>
                                                                                </Typography>
                                                                                <Typography gutterBottom variant="p" component="div">
                                                                                    <Link href="#" color={'#999'}>{channelDetails.channelName}</Link>
                                                                                </Typography>
                                                                                {streamsInfo.tags ? <ul className='videoTags'>
                                                                                    {streamsInfo.tags.map((tag, index) => (
                                                                                        <li key={index}>
                                                                                            <Link href="/tags/">{tag}</Link>
                                                                                        </li>
                                                                                    ))}
                                                                                </ul> : null}
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Card>
                                                                </Grid>
                                                            ))}
                                                        </Carousel> :
                                                        // <Box sx={{display:'flex', flexWrap: 'wrap'}}>
                                                        <Box sx={{ width: '100%' }}>
                                                            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12, lg: 26 }}>
                                                                {/* <Grid item xs={12} sm={6} md={4} style={{ maxWidth: "100%", margin: '0px 25px 25px 25px', flex: 1,  }}> */}
                                                                {recentLiveStreamVideos.map((streamsInfo, index) => (
                                                                    <Grid item xs={2} sm={4} md={4} lg={6} key={index}>
                                                                        <Card sx={{ width: '100%', margin: '0px 174px 0px 0px' }}>
                                                                            <div style={{ position: 'relative' }}>
                                                                                <CardMedia
                                                                                    sx={{ height: 140 }}
                                                                                    image={`${process.env.NEXT_PUBLIC_S3_URL}/${streamsInfo.videoPreviewImage}`}
                                                                                >

                                                                                </CardMedia>
                                                                                <Typography variant="body1" component="div" sx={{}}>
                                                                                    <div className=''>{countLiveViewing(streamsInfo.views)} viewers</div>
                                                                                    <div className=''>{calculateDaysAgo(streamsInfo.createdAt)} days ago</div>
                                                                                </Typography>
                                                                            </div>
                                                                            <Grid container direction="row" alignItems="center" mt={"15px"} ml={"15px;"} pb={"15px"} style={{ display: "flex", alignItems: "flex-start" }}>
                                                                                <Grid item>
                                                                                    <img src={`${process.env.NEXT_PUBLIC_S3_URL}/${channelDetails.channelPicture}`} className='br100 listChannelIconSize' />
                                                                                </Grid>
                                                                                <Grid item ml={"15px"} style={{ width: "75%" }}>
                                                                                    <Typography gutterBottom variant="h5" component="div">
                                                                                        <Link href={`/video/${streamsInfo._id}`} color={'white'}>{streamsInfo.description}</Link>
                                                                                    </Typography>
                                                                                    <Typography gutterBottom variant="p" component="div">
                                                                                        <Link href="#" color={'#999'}>{channelDetails.channelName}</Link>
                                                                                    </Typography>
                                                                                    {streamsInfo.tags ? <ul className='videoTags'>
                                                                                        {streamsInfo.tags.map((tag, index) => (
                                                                                            <li key={index}>
                                                                                                <Link href="/tags/">{tag}</Link>
                                                                                            </li>
                                                                                        ))}
                                                                                    </ul> : null}
                                                                                </Grid>
                                                                            </Grid>
                                                                        </Card>
                                                                    </Grid>
                                                                ))}
                                                            </Grid>
                                                            {/* // <Grid item xs={12} sm={6} md={4} style={{ maxWidth: "100%", margin: '0px 25px 25px 25px', flex: 1,  }}>
                                                                        //     <Card sx={{ width: '100%', margin: '0px 174px 0px 0px' }}>
                                                                        //         <div style={{ position: 'relative' }}>
                                                                        //             <CardMedia
                                                                        //                 sx={{ height: 140 }}
                                                                        //                 image={`${process.env.NEXT_PUBLIC_S3_URL}/${streamsInfo.videoPreviewImage}`}
                                                                        //             >
                                                                                        
                                                                        //             </CardMedia>
                                                                        //             <Typography variant="body1" component="div" sx={{}}>
                                                                        //                 <div className=''>{streamsInfo.views} viewers</div>
                                                                        //                 <div className=''>{calculateDaysAgo(streamsInfo.createdAt)} days ago</div>
                                                                        //             </Typography>
                                                                        //         </div>
                                                                        //         <Grid container direction="row" alignItems="center" mt={"15px"} ml={"15px;"} pb={"15px"} style={{ display: "flex", alignItems: "flex-start" }}>
                                                                        //             <Grid item>
                                                                        //                 <img src={`${process.env.NEXT_PUBLIC_S3_URL}/${channelDetails.channelPicture}`} className='br100 listChannelIconSize' />
                                                                        //             </Grid>
                                                                        //             <Grid item ml={"15px"} style={{ width: "75%" }}>
                                                                        //                 <Typography gutterBottom variant="h5" component="div">
                                                                        //                     <Link href={`/video/${streamsInfo._id}`} color={'white'}>{streamsInfo.description}</Link>
                                                                        //                 </Typography>
                                                                        //                 <Typography gutterBottom variant="p" component="div">
                                                                        //                     <Link href="#" color={'#999'}>{channelDetails.channelName}</Link>
                                                                        //                 </Typography>
                                                                        //                 {streamsInfo.tags ? <ul className='videoTags'>
                                                                        //                     {streamsInfo.tags.map((tag) => (
                                                                        //                         <li key={tag}>
                                                                        //                             <Link href="#">{tag}</Link>
                                                                        //                         </li>
                                                                        //                     ))}
                                                                        //                 </ul> : null}
                                                                        //             </Grid>
                                                                        //         </Grid>
                                                                        //     </Card>
                                                                        // </Grid> */}

                                                        </Box>
                                                    }
                                                    {/* // </Grid> */}
                                                </Box>
                                            </>
                                                : null}
                                        </Box>

                                        <Box sx={{ marginTop: '25px' }}>
                                            {recentLiveStreamVideos.length != 0 ? <>
                                                <Typography variant="body1" component="div" sx={{ display: 'flex', alignItems: 'baseline' }}>
                                                    <Typography variant="h4" component="h4" sx={{ fontWeight: 600, fontSize: '17px', marginRight: "10px" }}>All Videos</Typography>
                                                    {showAllVideos ? <Button sx={{ fontWeight: 600, fontSize: '15px' }} onClick={handleShowAllVideo}>View All</Button> : <Button sx={{ fontWeight: 600, fontSize: '15px' }} onClick={handleShowAllVideo}>View less</Button>}
                                                </Typography>

                                                <Box sx={{ paddingTop: '5px' }}>
                                                    {showAllVideos ?
                                                        <Carousel swipeable={false} responsive={responsive}>
                                                            {allVideos.slice(0, 10).map((streamsInfo, index) => (
                                                                <Grid item xs={12} sm={6} md={4} key={index} style={{ maxWidth: "100%" }}>
                                                                    <Card sx={{ maxWidth: 345 }}>
                                                                        <div style={{ position: 'relative' }}>
                                                                            <CardMedia
                                                                                sx={{ height: 140 }}
                                                                                image={`${process.env.NEXT_PUBLIC_S3_URL}/${streamsInfo.videoPreviewImage}`}
                                                                            >
                                                                            </CardMedia>
                                                                            <Typography variant="body1" component="div" sx={{}}>
                                                                                <div className=''>{countLiveViewing(streamsInfo.views)} viewers</div>
                                                                                <div className=''>{calculateDaysAgo(streamsInfo.createdAt)} days ago</div>
                                                                            </Typography>
                                                                        </div>
                                                                        <Grid container direction="row" alignItems="center" mt={"15px"} ml={"15px;"} pb={"15px"} style={{ display: "flex", alignItems: "flex-start" }}>
                                                                            <Grid item>
                                                                                <img src={`${process.env.NEXT_PUBLIC_S3_URL}/${channelDetails.channelPicture}`} className='br100 listChannelIconSize' />
                                                                            </Grid>
                                                                            <Grid item ml={"15px"} style={{ width: "75%" }}>
                                                                                <Typography gutterBottom variant="h5" component="div">
                                                                                    <Link href={`/video/${streamsInfo._id}`} color={'white'}>{streamsInfo.description}</Link>
                                                                                </Typography>
                                                                                <Typography gutterBottom variant="p" component="div">
                                                                                    <Link href="#" color={'#999'}>{channelDetails.channelName}</Link>
                                                                                </Typography>
                                                                                {streamsInfo.tags ? <ul className='videoTags'>
                                                                                    {streamsInfo.tags.map((tag, index) => (
                                                                                        <li key={index}>
                                                                                            <Link href="/tags/">{tag}</Link>
                                                                                        </li>
                                                                                    ))}
                                                                                </ul> : null}
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Card>
                                                                </Grid>
                                                            ))}
                                                        </Carousel> :
                                                        <Box sx={{ width: '100%' }}>
                                                            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12, lg: 26 }}>
                                                                {allVideos.map((streamsInfo, index) => (
                                                                    <Grid item xs={2} sm={4} md={4} lg={6} key={index}>
                                                                        <Card sx={{ width: '100%', margin: '0px 174px 0px 0px' }}>
                                                                            <div style={{ position: 'relative' }}>
                                                                                <CardMedia
                                                                                    sx={{ height: 140 }}
                                                                                    image={`${process.env.NEXT_PUBLIC_S3_URL}/${streamsInfo.videoPreviewImage}`}
                                                                                >

                                                                                </CardMedia>
                                                                                <Typography variant="body1" component="div" sx={{}}>
                                                                                    <div className=''>{countLiveViewing(streamsInfo.views)} viewers</div>
                                                                                    <div className=''>{calculateDaysAgo(streamsInfo.createdAt)} days ago</div>
                                                                                </Typography>
                                                                            </div>
                                                                            <Grid container direction="row" alignItems="center" mt={"15px"} ml={"15px;"} pb={"15px"} style={{ display: "flex", alignItems: "flex-start" }}>
                                                                                <Grid item>
                                                                                    <img src={`${process.env.NEXT_PUBLIC_S3_URL}/${channelDetails.channelPicture}`} className='br100 listChannelIconSize' />
                                                                                </Grid>
                                                                                <Grid item ml={"15px"} style={{ width: "75%" }}>
                                                                                    <Typography gutterBottom variant="h5" component="div">
                                                                                        <Link href={`/video/${streamsInfo._id}`} color={'white'}>{streamsInfo.description}</Link>
                                                                                    </Typography>
                                                                                    <Typography gutterBottom variant="p" component="div">
                                                                                        <Link href="#" color={'#999'}>{channelDetails.channelName}</Link>
                                                                                    </Typography>
                                                                                    {streamsInfo.tags ? <ul className='videoTags'>
                                                                                        {streamsInfo.tags.map((tag, index) => (
                                                                                            <li key={index}>
                                                                                                <Link href="/tags/">{tag}</Link>
                                                                                            </li>
                                                                                        ))}
                                                                                    </ul> : null}
                                                                                </Grid>
                                                                            </Grid>
                                                                        </Card>
                                                                    </Grid>
                                                                ))}
                                                            </Grid>
                                                        </Box>
                                                    }
                                                </Box>
                                            </>
                                                : null}
                                        </Box>
                                    </> : <Typography variant="body1" component={'div'} sx={{textAlign: 'center', marginTop: '15px', padding: '100px'}}>Looks like you don't have any videos yet...</Typography>}
                                    </TabPanel>
                                </TabContext>
                            </Box>
                        </Container>
                        {/* :
                    } */}
                </Box>
                {isClickOnChannel?<LiveStreamChat oldReceivedMessages={oldReceivedMessages}/>:null}
            </Box >
        </>
    )
}

export async function getStaticPaths() {
    let channelData = await client.query({
        query: gql`
            query Query {
                channels {
                    _id
                    urlSlug
                }
            }
        `
    }).then((result) => {
        let channelIds = result.data.channels.map((item) => {
            return {
                params: {
                    channelName: `${item.urlSlug}`
                }
            }
        })
        return channelIds;
    });

    return {
        paths: channelData,
        fallback: false,
    };
}

export async function getStaticProps({ params }) {

    let channelInfo = await client.query({
        query: gql`
            query Query ($urlSingleSlug: String) {
                channels(urlSlug: $urlSingleSlug) {
                    _id
                    channelName
                    channelPicture
                    description
                    subscribers
                    urlSlug
                    location
                    createdAt
                    userId
                }
            }
        `,
        variables: {
            "urlSingleSlug": params.channelName
        }
    }).then((result) => {
        return result.data
    });

    let streamInfo = await client.query({
        query: gql`
        query Query ($artistId: String!, $recentLiveStreamVideosUserId2: String!, $recentUploadedVideosUserId2: String!, $channelId: String, $channelId2: String!, $userIdForVideo: String) {
            streams(artistId: $artistId) {
                title
                streamCategory
                tags
                description
            }
            recentLiveStreamVideos(userId: $recentLiveStreamVideosUserId2) {
                _id
                title
                description
                videoPreviewImage
                views
                isStreamed
                isUploaded
                tags
                isPublished
                createdAt
            }
            recentUploadedVideos(userId: $recentUploadedVideosUserId2) {
                _id
                title
                videoPreviewImage
                views
                isStreamed
                isUploaded
                isPublished
                createdAt
            }
            liveStreamings(channelId: $channelId) {
                title
                description
                _id
                userId
                videoPoster
                channelId
                viewers
                videoId
                tags
                tattooCategory
                streamUrl
                tattooCategoryDetails {
                  title
                  urlSlug
                }
            }
            countChannelTotalFollowers(channelId: $channelId2) {
                countFollower
            }
            videos(userId: $userIdForVideo) {
                _id
                title
                videoPreviewImage
                views
                isPublished
                createdAt
                description
                tags
            }
        }
        `,
        variables: {
            // "artistId": channelInfo.channels[0].userId,
            // "userId": channelInfo.channels[0].userId
            // "artistId": "647f15e80d8b7330ed890da6",
            // "userId": "647f15e80d8b7330ed890da6",
            // "recentLiveStreamVideosUserId2": "647f15e80d8b7330ed890da6",
            // "recentUploadedVideosUserId2": "647f15e80d8b7330ed890da6"
            "artistId": channelInfo.channels[0].userId,
            "userId": channelInfo.channels[0].userId,
            "recentLiveStreamVideosUserId2": channelInfo.channels[0].userId,
            "recentUploadedVideosUserId2": channelInfo.channels[0].userId,
            "channelId": channelInfo.channels[0]._id,
            "channelId2": channelInfo.channels[0]._id,
            // "channelId": "648174e0bed9a5f8f56950e1",
            // "channelId2": "648174e0bed9a5f8f56950e1",
            "userIdForVideo": channelInfo.channels[0].userId
        }
    }).then((result) => {
        // console.log('channelInfo.channels[0].userId', channelInfo.channels[0].userId)
        // console.log('channelInfo.channels[0].userId result', result.data)
        return result.data
    });

    let allData = { ...channelInfo, ...streamInfo };
    channelInfo = JSON.stringify(allData);
    return {
        props: {
            channelInfo: channelInfo
        },
    }
}