import client from "../../graphql";
import { gql } from "@apollo/client";
import { useState, useEffect } from "react";
import LeftMenu from '../../src/content/Overview/LeftMenu/index';
import Paper from '@mui/material/Paper';
import { Box, Grid, Link, Typography, Container, Button, Card, CardMedia, Tooltip, MenuItem, Avatar, Menu, Toolbar, AppBar, Tab, Backdrop  } from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import styled from "@emotion/styled";
import React from 'react';
import VideoJS from '../../src/content/Overview/Slider/VideoJS';
import videojs from 'video.js';
import LiveStreamChat from '../../src/content/Channel/LiveStreamChat'
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { setAuthUser, setAuthState, selectAuthState, selectAuthUser } from '../../store/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import { useRouter } from 'next/router';
import CircularProgress from '@mui/material/CircularProgress';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function ChannelName() {
    const [channelDetails, setChannelDetails] = useState({});
    const [recentLiveStreamVideos, setRecentLiveStreamVideos] = useState([]);
    const [recentUploadedVideos, setRecentUploadedVideos] = useState([]);
    const [allVideos, setAllVideos] = useState([]);
    const [currentBroadcast, setCurrentBroadcast] = useState({});
    const [channelTotalFollower, setChannelTotalFollower] = useState({});
    const [streams, setStreams] = useState({});
    const [showAllRecentBroadcast, setShowAllRecentBroadcast] = useState(true);
    const [showRecentBroadcastCount, setShowRecentBroadcastCount] = useState(5);
    const [showAllVideos, setShowAllVideos] = useState(true);
    const [showAllVideosCount, setShowAllVideosCount] = useState(5);
    const [isClickOnChannel, setIsClickOnChannel] = useState(true);
    const [oldReceivedMessages, setOldReceivedMessages] = React.useState([]);
    const [value, setValue] = React.useState('1');
    const [isChannelFollowing, setIsChannelFollowing] = useState({});
    const [isChannelSubscribed, setIsChannelSubscribed] = useState({});
    const [isSubscribedUser, setIsSubscribedUser] = useState(false);
    let userDetails = useSelector(selectAuthUser);
    let userIsLogedIn = useSelector(selectAuthState);
    const [userDetail, setUserDetail] = useState(userDetails);
    const [userAuthState, setUserAuthState] = useState(userIsLogedIn);
    const router = useRouter();
    const [isFetchingChannel, setIsFetchingChannel] = useState(false);
    const [channelSlug, setChannelSlug ] = useState('');
    const [isPageLoading, setIsPageLoading]= useState(true);
    const [viewers, setViewers]= useState(0);

    useEffect(async ()=>{
        if(!router.query.channelName) {
            return;
        }

        // setSlug(router.query.channelName[0].toUpperCase() + router.query.channelName.slice(1));
        
        setChannelSlug(router.query.channelName);
        setIsFetchingChannel(true)

    }, [router.query.channelName]);

    useEffect(async ()=>{

        if(isFetchingChannel){
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
                            socialLinks {
                                platform
                                url
                            }
                        }
                    }
                `,
                variables: {
                    "urlSingleSlug": channelSlug
                }
            }).then((result) => {
                return result.data
            });
            console.log('channelInfo', channelInfo)
            
            if(channelInfo.channels.length > 0 ){
                let streamInfo = await client.query({
                    query: gql`
                    query Query ($artistId: String!, $recentLiveStreamVideosChannelId2: String!, $recentUploadedVideosChannelId2: String!, $channelId: String, $channelId2: String!, $channelIdForVideo: String) {
                        streams(artistId: $artistId) {
                            title
                            streamCategory
                            tags
                            description
                        }
                        recentLiveStreamVideos(channelId: $recentLiveStreamVideosChannelId2) {
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
                            videoPreviewStatus
                            videoServiceType
                        }
                        recentUploadedVideos(channelId: $recentUploadedVideosChannelId2) {
                            _id
                            title
                            videoPreviewImage
                            views
                            isStreamed
                            isUploaded
                            isPublished
                            videoServiceType
                            videoPreviewStatus
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
                        videos(channelId: $channelIdForVideo) {
                            _id
                            title
                            videoPreviewImage
                            views
                            isPublished
                            createdAt
                            description
                            tags
                            videoServiceType
                            videoPreviewStatus
                        }
                    }
                    `,
                    variables: {
                        "artistId": channelInfo.channels[0].userId,
                        "userId": channelInfo.channels[0].userId,
                        "recentLiveStreamVideosChannelId2": channelInfo.channels[0]._id,
                        "recentUploadedVideosChannelId2": channelInfo.channels[0]._id,
                        "channelId": channelInfo.channels[0]._id,
                        "channelId2": channelInfo.channels[0]._id,
                        "channelIdForVideo": channelInfo.channels[0]._id
                    }
                }).then((result) => {
                    return result.data
                });
                
                console.log('-----------------------------------------------streamInfo', streamInfo)
    
                setChannelDetails(...channelInfo.channels);
                setRecentLiveStreamVideos(streamInfo.recentLiveStreamVideos);
                setRecentUploadedVideos(streamInfo.recentUploadedVideos);
                setAllVideos(streamInfo.videos);
                setCurrentBroadcast(...streamInfo.liveStreamings);
                setChannelTotalFollower(...streamInfo.countChannelTotalFollowers);
                setStreams(streamInfo.streams);
                if(streamInfo.liveStreamings.length > 0){
                    setViewers(streamInfo.liveStreamings[0].viewers);
                }
    
                if (streamInfo.liveStreamings.length > 0) {
                    client.query({
                        variables: {
                            videoId: streamInfo.liveStreamings[0].videoId,
                        },
                        query: gql`
                            query Query($videoId: String!) {
                                chatMessages(videoId: $videoId) {
                                    userDetail {
                                        firstName
                                        lastName
                                        username
                                        _id
                                    }
                                    message
                                    videoId
                                    hours
                                    mins
                                    _id
                                    userId
                                    liveStreamId
                                    isPinned
                                }
            
                            }
                        `,
                    })
                        .then((result) => {
                            setOldReceivedMessages(result.data.chatMessages)
                            console.log(' old result.data.chatMessages', result.data.chatMessages)
                        });
                }
    
                if (userDetails && userIsLogedIn) {
                    client.query({
                        query: gql`
                        query Query ($channelId: String!, $userId: String!, $channelId2: String, $userId2: String) {
                            isChannelFollowing(channelId: $channelId, userId: $userId) {
                                isFollowing
                                channelId
                                userId
                                _id
                            }
                            subscriptionDetails(channelId: $channelId2, userId: $userId2) {
                                isActive
                            }
                        }
                    `,
                        variables: {
                            "channelId": channelInfo.channels[0]._id,
                            "userId": userDetails._id,
                            "channelId2": channelInfo.channels[0]._id,
                            "userId2": userDetails._id
                        }
                    }).then((result) => {
                        console.log('subscription detail', result.data);
                        setIsChannelFollowing(result.data.isChannelFollowing[0])
                        setUserDetail(userDetails);
                        if(result.data.subscriptionDetails.length > 0){
                            setIsChannelSubscribed(result.data.subscriptionDetails[0])
                            if(result.data.subscriptionDetails[0].isActive){
                                console.log("in if sdddd f ff f ff ff ffffff ffff jasdf asdf asjld f;alsd flkasdj f")
                                setIsSubscribedUser(true)
                            } else {
                                console.log("else sdddd felse f ff ffelse ffff jasdf asdfelse else flkasdj f")
                                
                            }
                        } else {
                            setIsSubscribedUser(false)
                            setIsChannelSubscribed({})
                        }
                        return result.data
                    });
                }
            }

            
            setIsFetchingChannel(false)
            setIsPageLoading(false)
        }
    }, [isFetchingChannel])
    

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

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

    const handleChatClick = () => {
        setIsClickOnChannel(true);
        setShowAllRecentBroadcast(true)
    }
    const closeChat = () => {
        setIsClickOnChannel(false);
        setShowAllRecentBroadcast(true)
    }

    const handleAllRecentBroadcast = (count) => {
        // setShowAllRecentBroadcast(!showAllRecentBroadcast)
        setShowRecentBroadcastCount(count);
    }

    const handleShowAllVideo = (count) => {
        // setShowAllVideos(!showAllVideos)
        setShowAllVideosCount(count)
    }

    // This function calculate how many days ago video uploaded or stream
    function calculateDaysAgo(uploadDate) {
        const currentDate = new Date();
        const uploadDateTime = new Date(parseInt(uploadDate));
        const timeDifference = currentDate - uploadDateTime;
        const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

        if (daysAgo === 0) {
            const hoursAgo = Math.floor(timeDifference / (1000 * 60 * 60));
            if (hoursAgo === 0) {
                const minutesAgo = Math.floor(timeDifference / (1000 * 60));
                if (minutesAgo === 0) {
                    const secondsAgo = Math.floor(timeDifference / 1000);
                    return `${secondsAgo} seconds ago`;
                }
                return `${minutesAgo} minutes ago`;
            }
            return `${hoursAgo} hours ago`;
        }

        return `${daysAgo} days ago`;
    }

    const responsive = {
        superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 4000, min: 1200 },
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
        fontSize: "12px",
        color: "#fff",
        padding: "5px",
        textAlign: "center"
    }

    const countLiveViewing = (viewers) => {
        if (viewers > 999 && viewers < 1000000) {
            const viewing = (Math.floor(viewers / 100) / 10).toFixed(1) + "K";
            return viewing
        } else if (viewers > 999999) {
            const viewing = (Math.floor(viewers / 100000) / 10).toFixed(1) + "M";
            return viewing
        } else {
            return `${viewers}`
        }
    }

    const handleLiveStreamViewers = (viewer) =>{
        setViewers(viewer);
    }


    const handleFollow = async (checkFollow) => {

        if (checkFollow) {
            try {
                const result = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create/follower`, { userId: userDetail._id, channelId: channelDetails._id, isFollowing: true }, { headers: { 'x-access-token': userDetail.jwtToken } });
                if (result) {
                    setIsChannelFollowing(result.data.followingDetails)
                }
            } catch (error) {
                console.log('error', error)
            }
        } else {
            try {
                const result = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/follower/${isChannelFollowing._id}`, { headers: { 'x-access-token': userDetail.jwtToken } });

                if (result) {
                    setIsChannelFollowing(result.data.followingDetails)
                }
            } catch (error) {
                console.log('error', error)
            }
        }

    }
    
    const handleSubscribeChannel = async (checkSubscribe) => {

        if (checkSubscribe) {
            console.log('Subscribe')
            // try {
            //     const result = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create/follower`, { userId: userDetail._id, channelId: channelDetails._id, isFollowing: true }, { headers: { 'x-access-token': userDetail.jwtToken } });
            //     if (result) {
            //         setIsChannelFollowing(result.data.followingDetails)
            //     }
            // } catch (error) {
            //     console.log('error', error)
            // }
        } else {
           console.log('Unsubscribe')
        }
    }

    const liveDaysAgo = {
        borderLeft: "solid 1px #b1b1b1",
        marginLeft: "5px",
        paddingLeft: "5px"
    }

    const headerMargin = {
        marginTop: "90px"
    }

    return (
        <>
            <Box sx={{ display: 'flex' }} style={headerMargin}>
                <LeftMenu />
                {isPageLoading?
                    <Box sx={{textAlign: 'center', width: '100%', padding: '15%'}}>
                        <CircularProgress />
                        <Typography>
                            Loading...
                        </Typography>
                    </Box>
                :channelDetails && <Box component="main" sx={{ flexGrow: 1, width: '100%', position: 'relative'}}>
                    {/* <Box sx={{height: '100%', marginRight: '-36px', paddingRight: '35px', overflowY: 'scroll' }}> */}
                    <Box sx={{height: '100%', marginRight: '0px', paddingRight: '0px', overflowY: 'scroll' }}>
                        {currentBroadcast ?
                            <Typography variant="body1" component={'div'} sx={{ paddingBottom: '10px' }}>
                                <VideoJS options={{
                                    autoplay: true,
                                    controls: true,
                                    responsive: true,
                                    fluid: true,
                                    className: 'online-video',
                                    sources: [{
                                        // src: 'http://18.231.170.3/live/dd032ddc-8d55-4e98-ac82-adca59b8d44a/index.m3u8',
                                        // src: `${process.env.NEXT_PUBLIC_LIVE_STREAM_URL}/${currentBroadcast.streamUrl}`,
                                        src: `${currentBroadcast.streamUrl}`,
                                        type: 'application/x-mpegURL'
                                    }]
                                }} onReady={handlePlayerReady} />
                            </Typography> :
                            <Box>
                                <Typography variant="body1" component={'div'} sx={{ backgroundImage: "url(https://dummyimage.com/1835x550/000/fff)", width: '100%', height: '550px', backgroundRepeat: 'no-repeat' }}>
                                    <Typography variant="p" component={'p'} style={offline}>Offline</Typography>
                                </Typography>
                            </Box>
                        }
                        {channelDetails && <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '10px'
                            }}
                        >
                            <Item sx={{ border: '0px', boxShadow: 'none', backgroundColor: 'transparent !important' }}>
                                <Typography variant="body1" component={'div'} sx={{ display: 'flex' }}>
                                    <Typography variant="body1" component={'div'} sx={{position: "relative"}}>
                                        <img src={`${process.env.NEXT_PUBLIC_S3_URL}/${channelDetails.channelPicture}`} style={{ borderRadius: '100%', height: '65px', width: '65px', margin: '8px 12px 18px 18px', border: currentBroadcast? "2px solid red": null }} width="500" height="600"></img>
                                        {currentBroadcast && <Typography variant="h5" component="h5" sx={{ fontSize: '13px', fontWeight: 300 ,backgroundColor: 'red', borderRadius: '5px', width: '50px', position: 'absolute', top: '65px', left: '25px', color: '#fff'}}>Live</Typography>}
                                    </Typography>

                                    <Typography variant="body1" component={'div'} sx={{}}>
                                        <Typography variant="h3" component="h3" sx={{ fontWeight: 600, fontSize: '20px', cursor: 'pointer' }} align="left">{channelDetails.channelName}</Typography>
                                        {currentBroadcast ? <Typography variant="body1" component={'div'} sx={{}}>
                                            <Typography variant="h4" component="h4" sx={{ fontWeight: 600, fontSize: '15px', marginTop: '8px' }} align="left">{currentBroadcast.description}</Typography>
                                            <Typography variant="body1" component={'div'} sx={{ display: 'flex', marginTop: '5px' }}>
                                                {currentBroadcast.tattooCategoryDetails ?<Link
                                                    onClick={() => router.push(`/single-category/${currentBroadcast.tattooCategoryDetails[0].urlSlug}`)}
                                                    sx={{ fontWeight: 400, paddingRight: '10px', cursor: 'pointer' }} align="left">{currentBroadcast.tattooCategoryDetails[0].title}</Link>:null}

                                                {currentBroadcast.tags && currentBroadcast.tags.map((tag, index) => {
                                                    return (<Button key={index} variant="contained" sx={{ fontWeight: 400, fontSize: '12px', borderRadius: '50px', backgroundColor: 'grey', padding: '0px', margin: '0px 2px' }}>
                                                        <Link
                                                            onClick={() => router.push(`/tag/${tag}`)}
                                                            sx={{ color: '#fff' }}>{tag}</Link>
                                                    </Button>)
                                                })}
                                            </Typography>
                                        </Typography> :
                                            <Typography variant="h5" component={"h5"} sx={{ fontSize: '15px', marginTop: '8px' }}>
                                                {countLiveViewing(channelTotalFollower.countFollower)} followers
                                            </Typography>
                                        }
                                    </Typography>
                                </Typography>
                            </Item>

                            <Item sx={{ border: '0px', boxShadow: 'none', backgroundColor: 'transparent !important' }}>
                                <Typography variant="body1" component={'div'} sx={{ gap: "15px", display: "flex" }}>                            
                                    {isChannelFollowing ?
                                        (isChannelFollowing.isFollowing ?
                                            <Button variant="contained" startIcon={<FavoriteIcon />} onClick={() => handleFollow(false)} sx={{ fontWeight: 400, fontSize: '12px', backgroundColor: 'rgb(112, 99, 192)', padding: '8px 30px', borderRadius: '5px' }}>Following</Button>
                                            :
                                            (Object.keys(userDetail).length === 0 ?
                                                <Tooltip title={<React.Fragment>Please <Link 
                                                // href={`/auth/login`}
                                                onClick={()=> router.push("/auth/login")}
                                                style={{cursor:"pointer"}}
                                                >login</Link> to follow channel</React.Fragment>} placement="right-start">
                                                    <Button variant="contained" startIcon={<FavoriteBorderIcon />} sx={{ fontWeight: 400, fontSize: '12px', backgroundColor: 'rgb(112, 99, 192)', padding: '8px 30px', borderRadius: '5px' }}>Follow</Button>
                                                </Tooltip>
                                                :
                                                <Button variant="contained" startIcon={<FavoriteBorderIcon />} onClick={() => handleFollow(true)} sx={{ fontWeight: 400, fontSize: '12px', backgroundColor: 'rgb(112, 99, 192)', padding: '8px 30px', borderRadius: '5px' }}>Follow</Button>
                                            )
                                        )
                                        : null}
                                    {isChannelSubscribed ?
                                        (isChannelSubscribed.isActive ?
                                            // <Button variant="contained" startIcon={<FavoriteIcon />} onClick={() => handleFollow(false)} sx={{ fontWeight: 400, fontSize: '12px', backgroundColor: 'rgb(112, 99, 192)', padding: '8px 30px', borderRadius: '5px' }}>Subscribed</Button>
                                            <Button onClick={()=>handleSubscribeChannel(false)} variant="contained" startIcon={<StarIcon />} sx={{ fontWeight: 400, fontSize: '12px', backgroundColor: 'rgb(112, 99, 192)', padding: '8px 30px', borderRadius: '5px' }}>Subscribed</Button>
                                            :
                                            (Object.keys(userDetail).length === 0 ?
                                                <Tooltip title={<React.Fragment>Please <Link 
                                                // href={`/auth/login`}
                                                onClick={()=> router.push("/auth/login")}
                                                style={{cursor:"pointer"}}
                                                >login</Link> to subscribe channel</React.Fragment>} placement="right-start">
                                                    <Button variant="contained" startIcon={<StarBorderIcon />} sx={{ fontWeight: 400, fontSize: '12px', backgroundColor: 'grey', padding: '8px 30px', borderRadius: '5px' }}>Subscribe</Button>
                                                </Tooltip>
                                                :
                                                <Button onClick={()=>handleSubscribeChannel(true)} variant="contained" startIcon={<StarBorderIcon />} sx={{ fontWeight: 400, fontSize: '12px', backgroundColor: 'grey', padding: '8px 30px', borderRadius: '5px' }}>Subscribe</Button>
                                            )
                                        )
                                        : null}
                                    {/* <Button variant="contained" sx={{ fontWeight: 400, fontSize: '12px', backgroundColor: 'grey', padding: '8px 30px', borderRadius: '5px' }}>Subscribe</Button> */}
                                </Typography>
                                <Typography variant="body1" component={'div'} sx={{ gap: "50px", display: "flex", margin: '10px 40px' }}>
                                    <Typography variant="body1" component={'div'} sx={{display: 'flex', alignItems: 'center'}}>
                                        <PermIdentityIcon/>
                                        <Typography variant="h5" component={'h5'}>{countLiveViewing(viewers)} viewers</Typography>
                                    </Typography>
                                    <Typography variant="body1" component={'span'}>
                                        123
                                    </Typography>
                                </Typography>
                            </Item>
                        </Box>}
                        {/* { !isClickOnChannel?  */}
                        {channelDetails && <Container maxWidth="xl">
                            <Box sx={{ width: '100%', typography: 'body1' }}>
                                <TabContext value={value}>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider', paddingBottom: '10px' }}>
                                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                                            {/* <Tab label="Home" value="1" onClick={closeChat} /> */}
                                            <Tab label="About" value="1" onClick={closeChat} />
                                            <Tab label="Videos" value="2" onClick={closeChat} />
                                            <Tab label="Chat" onClick={handleChatClick} />
                                        </TabList>
                                    </Box>
                                    {/* Home tab section */}
                                    {/* <TabPanel value="1">

                                    </TabPanel> */}

                                    {/* About tab section */}
                                    <TabPanel value="1">
                                        <Container maxWidth="lg" sx={{ padding: '20px' }}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    marginTop: '20px',
                                                    paddingBottom: '30px'
                                                }}
                                            >
                                                <Item sx={{ border: '0px', boxShadow: 'none', backgroundColor: 'transparent !important' }}>
                                                    <Box sx={{ 'textAlign': 'left' }}>
                                                        <Typography variant="h5" component={"h5"} sx={{ fontSize: '25px' }}>
                                                            About {channelDetails.channelName}
                                                        </Typography>
                                                        <Typography variant="h5" component={"h5"} sx={{ fontSize: '15px', marginTop: '8px', fontWeight: "500" }}>
                                                            {countLiveViewing(channelTotalFollower.countFollower)} followers
                                                        </Typography>
                                                        <Typography variant="h5" component={"h5"} sx={{ fontSize: '15px', marginTop: '8px', fontWeight: "500" }}>
                                                            {channelDetails.description}
                                                        </Typography>
                                                    </Box>
                                                </Item>

                                                {channelDetails.socialLinks && <Item sx={{ border: '0px', boxShadow: 'none', backgroundColor: 'transparent !important' }}>
                                                    {channelDetails.socialLinks.length > 0 ?
                                                        <Box sx={{ 'textAlign': 'left' }} className="socialShareLink">
                                                            {
                                                                channelDetails.socialLinks.map((links, index) => (
                                                                    <Box key={index}>
                                                                        {links.platform == 'facebook' && links.url != '' && <Typography variant="body1" component={'div'} sx={{ fontSize: '15px', marginTop: '20px' }}>
                                                                            <Link target="_blank" href={`https://${links.url}`}><FacebookIcon /> Facebook</Link>
                                                                        </Typography>}
                                                                        {links.platform == 'youTube' && links.url != '' && <Typography variant="body1" component={'div'} sx={{ fontSize: '15px', marginTop: '20px' }}>
                                                                            <Link target="_blank" href={`https://${links.url}`} ><YouTubeIcon /> YouTube</Link>
                                                                        </Typography>}
                                                                        {links.platform == 'instagram' && links.url != '' && <Typography variant="body1" component={'div'} sx={{ fontSize: '15px', marginTop: '20px' }}>
                                                                            <Link target="_blank" href={`https://${links.url}`} ><InstagramIcon /> Instagram</Link>
                                                                        </Typography>}
                                                                        {links.platform == 'twitter' && links.url != '' && <Typography variant="body1" component={'div'} sx={{ fontSize: '15px', marginTop: '20px' }}>
                                                                            <Link target="_blank" href={`https://${links.url}`} ><TwitterIcon /> Twitter</Link>
                                                                        </Typography>}
                                                                        {links.platform == 'discord' && links.url != '' && <Typography variant="body1" component={'div'} sx={{ fontSize: '15px', marginTop: '20px' }}>
                                                                            <Link target="_blank" href={`https://${links.url}`}>
                                                                                <svg width="22px" height="22px" viewBox="0 0.5 24 24" id="meteor-icon-kit__regular-discord" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                    <g clipPath="url(#clip0_525_68)">
                                                                                        <path d="M20.317 4.54101C18.7873 3.82774 17.147 3.30224 15.4319 3.00126C15.4007 2.99545 15.3695 3.00997 15.3534 3.039C15.1424 3.4203 14.9087 3.91774 14.7451 4.30873C12.9004 4.02808 11.0652 4.02808 9.25832 4.30873C9.09465 3.90905 8.85248 3.4203 8.64057 3.039C8.62448 3.01094 8.59328 2.99642 8.56205 3.00126C6.84791 3.30128 5.20756 3.82678 3.67693 4.54101C3.66368 4.54681 3.65233 4.5565 3.64479 4.56907C0.533392 9.29283 -0.31895 13.9005 0.0991801 18.451C0.101072 18.4733 0.11337 18.4946 0.130398 18.5081C2.18321 20.0401 4.17171 20.9701 6.12328 21.5866C6.15451 21.5963 6.18761 21.5847 6.20748 21.5585C6.66913 20.9179 7.08064 20.2424 7.43348 19.532C7.4543 19.4904 7.43442 19.441 7.39186 19.4246C6.73913 19.173 6.1176 18.8662 5.51973 18.5178C5.47244 18.4897 5.46865 18.421 5.51216 18.3881C5.63797 18.2923 5.76382 18.1926 5.88396 18.0919C5.90569 18.0736 5.93598 18.0697 5.96153 18.0813C9.88928 19.9036 14.1415 19.9036 18.023 18.0813C18.0485 18.0687 18.0788 18.0726 18.1015 18.091C18.2216 18.1916 18.3475 18.2923 18.4742 18.3881C18.5177 18.421 18.5149 18.4897 18.4676 18.5178C17.8697 18.8729 17.2482 19.173 16.5945 19.4236C16.552 19.4401 16.533 19.4904 16.5538 19.532C16.9143 20.2414 17.3258 20.9169 17.7789 21.5576C17.7978 21.5847 17.8319 21.5963 17.8631 21.5866C19.8241 20.9701 21.8126 20.0401 23.8654 18.5081C23.8834 18.4946 23.8948 18.4742 23.8967 18.452C24.3971 13.1911 23.0585 8.6212 20.3482 4.57004C20.3416 4.5565 20.3303 4.54681 20.317 4.54101ZM8.02002 15.6802C6.8375 15.6802 5.86313 14.577 5.86313 13.222C5.86313 11.8671 6.8186 10.7639 8.02002 10.7639C9.23087 10.7639 10.1958 11.8768 10.1769 13.222C10.1769 14.577 9.22141 15.6802 8.02002 15.6802ZM15.9947 15.6802C14.8123 15.6802 13.8379 14.577 13.8379 13.222C13.8379 11.8671 14.7933 10.7639 15.9947 10.7639C17.2056 10.7639 18.1705 11.8768 18.1516 13.222C18.1516 14.577 17.2056 15.6802 15.9947 15.6802Z" fill="#758CA3" />
                                                                                    </g>
                                                                                    <defs>
                                                                                        <clipPath id="clip0_525_68">
                                                                                            <rect width="24" height="24" fill="white" />
                                                                                        </clipPath>
                                                                                    </defs>
                                                                                </svg>
                                                                                Discord
                                                                            </Link>
                                                                        </Typography>}
                                                                    </Box>
                                                                ))
                                                            }
                                                        </Box>
                                                        :
                                                        <Box sx={{ 'textAlign': 'left' }} className="socialShareLink">
                                                            <Typography variant="body1" component={'div'} sx={{ fontSize: '15px', marginTop: '20px' }}>
                                                                <Link href="#"><FacebookIcon /> Facebook</Link>
                                                            </Typography>
                                                            <Typography variant="body1" component={'div'} sx={{ fontSize: '15px', marginTop: '20px' }}>
                                                                <Link href="#" ><YouTubeIcon /> YouTube</Link>
                                                            </Typography>
                                                            <Typography variant="body1" component={'div'} sx={{ fontSize: '15px', marginTop: '20px' }}>
                                                                <Link href="#">
                                                                    <svg width="22px" height="22px" viewBox="0 0.5 24 24" id="meteor-icon-kit__regular-discord" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <g clipPath="url(#clip0_525_68)">
                                                                            <path d="M20.317 4.54101C18.7873 3.82774 17.147 3.30224 15.4319 3.00126C15.4007 2.99545 15.3695 3.00997 15.3534 3.039C15.1424 3.4203 14.9087 3.91774 14.7451 4.30873C12.9004 4.02808 11.0652 4.02808 9.25832 4.30873C9.09465 3.90905 8.85248 3.4203 8.64057 3.039C8.62448 3.01094 8.59328 2.99642 8.56205 3.00126C6.84791 3.30128 5.20756 3.82678 3.67693 4.54101C3.66368 4.54681 3.65233 4.5565 3.64479 4.56907C0.533392 9.29283 -0.31895 13.9005 0.0991801 18.451C0.101072 18.4733 0.11337 18.4946 0.130398 18.5081C2.18321 20.0401 4.17171 20.9701 6.12328 21.5866C6.15451 21.5963 6.18761 21.5847 6.20748 21.5585C6.66913 20.9179 7.08064 20.2424 7.43348 19.532C7.4543 19.4904 7.43442 19.441 7.39186 19.4246C6.73913 19.173 6.1176 18.8662 5.51973 18.5178C5.47244 18.4897 5.46865 18.421 5.51216 18.3881C5.63797 18.2923 5.76382 18.1926 5.88396 18.0919C5.90569 18.0736 5.93598 18.0697 5.96153 18.0813C9.88928 19.9036 14.1415 19.9036 18.023 18.0813C18.0485 18.0687 18.0788 18.0726 18.1015 18.091C18.2216 18.1916 18.3475 18.2923 18.4742 18.3881C18.5177 18.421 18.5149 18.4897 18.4676 18.5178C17.8697 18.8729 17.2482 19.173 16.5945 19.4236C16.552 19.4401 16.533 19.4904 16.5538 19.532C16.9143 20.2414 17.3258 20.9169 17.7789 21.5576C17.7978 21.5847 17.8319 21.5963 17.8631 21.5866C19.8241 20.9701 21.8126 20.0401 23.8654 18.5081C23.8834 18.4946 23.8948 18.4742 23.8967 18.452C24.3971 13.1911 23.0585 8.6212 20.3482 4.57004C20.3416 4.5565 20.3303 4.54681 20.317 4.54101ZM8.02002 15.6802C6.8375 15.6802 5.86313 14.577 5.86313 13.222C5.86313 11.8671 6.8186 10.7639 8.02002 10.7639C9.23087 10.7639 10.1958 11.8768 10.1769 13.222C10.1769 14.577 9.22141 15.6802 8.02002 15.6802ZM15.9947 15.6802C14.8123 15.6802 13.8379 14.577 13.8379 13.222C13.8379 11.8671 14.7933 10.7639 15.9947 10.7639C17.2056 10.7639 18.1705 11.8768 18.1516 13.222C18.1516 14.577 17.2056 15.6802 15.9947 15.6802Z" fill="#758CA3" />
                                                                        </g>
                                                                        <defs>
                                                                            <clipPath id="clip0_525_68">
                                                                                <rect width="24" height="24" fill="white" />
                                                                            </clipPath>
                                                                        </defs>
                                                                    </svg>
                                                                    Discord
                                                                </Link>
                                                            </Typography>
                                                        </Box>
                                                    }
                                                </Item>}
                                            </Box>
                                        </Container>
                                    </TabPanel>

                                    {/* Videos tab section */}

                                    <TabPanel value="2" sx={{ padding: '20px 0px', textAlign: 'left' }}>
                                        {(recentLiveStreamVideos.length != 0 || recentUploadedVideos.length != 0) ? <>
                                            <Box>
                                                {recentLiveStreamVideos.length != 0 ? <>
                                                    <Typography variant="body1" component="div" sx={{ display: 'flex', alignItems: 'baseline' }}>
                                                        <Typography variant="h4" component="h4" sx={{ fontWeight: 600, fontSize: '17px', marginRight: "10px", paddingBottom: "12px" }}>Recent Broadcasts</Typography>
                                                        {recentLiveStreamVideos.length > 5 ? showRecentBroadcastCount > 5 ? <Button sx={{ fontWeight: 600, fontSize: '15px' }} onClick={()=>handleAllRecentBroadcast(5)}>View less</Button> : <Button sx={{ fontWeight: 600, fontSize: '15px' }} onClick={()=>handleAllRecentBroadcast(recentLiveStreamVideos.length)}>View All</Button>: null}
                                                    </Typography>

                                                    <Box sx={{ paddingTop: '5px' }}>
                                                        {/* <Grid className='desktop5'> */}
                                                        <Box sx={{ width: '100%' }}>
                                                            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12, lg: 26 }}>
                                                                {/* <Grid item xs={12} sm={6} md={4} style={{ maxWidth: "100%", margin: '0px 25px 25px 25px', flex: 1,  }}> */}
                                                                {recentLiveStreamVideos.slice(0, showRecentBroadcastCount).map((streamsInfo, index) => (
                                                                    // (streamsInfo.videoPreviewStatus.toLowerCase() == 'public') || (streamsInfo.videoPreviewStatus.toLowerCase() == 'subscriber' && isSubscribedUser) ?
                                                                        <Grid item xs={2} sm={4} md={4} lg={5.2} key={index}>
                                                                            <Card sx={{ width: '100%', margin: '0px 174px 0px 0px' }}>
                                                                                <div style={{ position: 'relative' }}>
                                                                                    <CardMedia
                                                                                        sx={{ height: 140 }}
                                                                                        image={`${process.env.NEXT_PUBLIC_S3_URL}/${streamsInfo.videoPreviewImage}`}
                                                                                    >

                                                                                    </CardMedia>
                                                                                    <Typography variant="body1" component="div" sx={{}}>
                                                                                        <div className='liveViewCount'>{countLiveViewing(streamsInfo.views)} viewers
                                                                                            <div style={liveDaysAgo}>{calculateDaysAgo(streamsInfo.createdAt)}</div>
                                                                                        </div>
                                                                                    </Typography>
                                                                                </div>
                                                                                <Grid container direction="row" alignItems="center" mt={"15px"} ml={"15px;"} pb={"15px"} style={{ display: "flex", alignItems: "flex-start" }}>
                                                                                    <Grid item>
                                                                                        <img src={`${process.env.NEXT_PUBLIC_S3_URL}/${channelDetails.channelPicture}`} className='br100 listChannelIconSize' />
                                                                                    </Grid>
                                                                                    <Grid item ml={"15px"} style={{ width: "75%" }}>
                                                                                        <Typography gutterBottom variant="h5" component="div">
                                                                                            <Link
                                                                                                // href={`/video/${streamsInfo._id}`}
                                                                                                onClick={() => router.push(`/video/${streamsInfo._id}`)}
                                                                                                color={'white'}>{streamsInfo.description}</Link>
                                                                                        </Typography>
                                                                                        <Typography gutterBottom variant="p" component="div">
                                                                                            <Link href="#" color={'#999'}>{channelDetails.channelName}</Link>
                                                                                        </Typography>
                                                                                        {streamsInfo.tags ? <ul className='videoTags'>
                                                                                            {streamsInfo.tags.map((tag, index) => (
                                                                                                <li key={index}>
                                                                                                    <Link
                                                                                                        // href="/tags/"
                                                                                                        onClick={() => router.push(`/tag/${tag}`)}
                                                                                                    >
                                                                                                        {tag}
                                                                                                    </Link>
                                                                                                </li>
                                                                                            ))}
                                                                                        </ul> : null}
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </Card>
                                                                        </Grid>
                                                                    // :
                                                                    //     <Grid item xs={2} sm={4} md={4} lg={5.2} key={index}>
                                                                    //         <LockIcon fontSize="large"/>
                                                                    //         <Card sx={{ width: '100%', margin: '0px 174px 0px 0px' }}>
                                                                    //             <div style={{ position: 'relative' }}>
                                                                    //                 <CardMedia
                                                                    //                     sx={{ height: 140 }}
                                                                    //                     image={`${process.env.NEXT_PUBLIC_S3_URL}/${streamsInfo.videoPreviewImage}`}
                                                                    //                 >
                                                                    //                 </CardMedia>
                                                                    //                 <Typography variant="body1" component="div" sx={{}}>
                                                                    //                     <div className='liveViewCount'>{countLiveViewing(streamsInfo.views)} viewers
                                                                    //                         <div style={liveDaysAgo}>{calculateDaysAgo(streamsInfo.createdAt)}</div>
                                                                    //                     </div>
                                                                    //                 </Typography>
                                                                    //             </div>
                                                                    //             <Grid container direction="row" alignItems="center" mt={"15px"} ml={"15px;"} pb={"15px"} style={{ display: "flex", alignItems: "flex-start" }}>
                                                                    //                 <Grid item>
                                                                    //                     <img src={`${process.env.NEXT_PUBLIC_S3_URL}/${channelDetails.channelPicture}`} className='br100 listChannelIconSize' />
                                                                    //                 </Grid>
                                                                    //                 <Grid item ml={"15px"} style={{ width: "75%" }}>
                                                                    //                     <Typography gutterBottom variant="h5" component="div">
                                                                    //                         <Link
                                                                    //                             // href={`/video/${streamsInfo._id}`}
                                                                    //                             onClick={() => router.push(`/video/${streamsInfo._id}`)}
                                                                    //                             color={'white'}>{streamsInfo.description}</Link>
                                                                    //                     </Typography>
                                                                    //                     <Typography gutterBottom variant="p" component="div">
                                                                    //                         <Link href="#" color={'#999'}>{channelDetails.channelName}</Link>
                                                                    //                     </Typography>
                                                                    //                     {streamsInfo.tags ? <ul className='videoTags'>
                                                                    //                         {streamsInfo.tags.map((tag, index) => (
                                                                    //                             <li key={index}>
                                                                    //                                 <Link
                                                                    //                                     // href="/tags/"
                                                                    //                                     onClick={() => router.push(`/tag/${tag}`)}
                                                                    //                                 >
                                                                    //                                     {tag}
                                                                    //                                 </Link>
                                                                    //                             </li>
                                                                    //                         ))}
                                                                    //                     </ul> : null}
                                                                    //                 </Grid>
                                                                    //             </Grid>
                                                                    //         </Card>
                                                                    //     </Grid>
                                                                ))}
                                                            </Grid>
                                                        </Box>
                                                    </Box>
                                                </>
                                                    : null}
                                            </Box>

                                            <Box mt='25px'>
                                                {allVideos.length != 0 ? <>
                                                    <Typography variant="body1" component="div" sx={{ display: 'flex', alignItems: 'baseline' }}>
                                                        <Typography variant="h4" component="h4" sx={{ fontWeight: 600, fontSize: '17px', marginRight: "10px" }}>All Videos</Typography>
                                                        {allVideos.length > 5 ? showAllVideosCount > 5 ? <Button sx={{ fontWeight: 600, fontSize: '15px' }} onClick={()=>handleShowAllVideo(5)}>View less</Button> : <Button sx={{ fontWeight: 600, fontSize: '15px' }} onClick={()=>handleShowAllVideo(allVideos.length)}>View All</Button>: null}
                                                    </Typography>

                                                    <Box pt='5px'>
                                                        <Box sx={{ width: '100%' }}>
                                                            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12, lg: 26 }}>
                                                                {allVideos.slice(0, showAllVideosCount).map((streamsInfo, index) => (
                                                                    // (streamsInfo.videoPreviewStatus == 'public') || (streamsInfo.videoPreviewStatus == 'subscriber' && isSubscribedUser) ?
                                                                        <Grid item xs={2} sm={4} md={4} lg={5.2} key={index}>
                                                                            <Card sx={{ width: '100%', margin: '0px 174px 0px 0px' }}>
                                                                                <div style={{ position: 'relative' }}>
                                                                                    <CardMedia
                                                                                        sx={{ height: 140 }}
                                                                                        image={`${process.env.NEXT_PUBLIC_S3_URL}/${streamsInfo.videoPreviewImage}`}
                                                                                    >

                                                                                    </CardMedia>
                                                                                    <Typography variant="body1" component="div" sx={{}}>
                                                                                        <div className='liveViewCount'>{countLiveViewing(streamsInfo.views)} viewers
                                                                                            <div style={liveDaysAgo}>{calculateDaysAgo(streamsInfo.createdAt)}</div>
                                                                                        </div>
                                                                                    </Typography>
                                                                                </div>
                                                                                <Grid container direction="row" alignItems="center" mt={"15px"} ml={"15px;"} pb={"15px"} style={{ display: "flex", alignItems: "flex-start" }}>
                                                                                    <Grid item>
                                                                                        <img src={`${process.env.NEXT_PUBLIC_S3_URL}/${channelDetails.channelPicture}`} className='br100 listChannelIconSize' />
                                                                                    </Grid>
                                                                                    <Grid item ml={"15px"} style={{ width: "75%" }}>
                                                                                        <Typography gutterBottom variant="h5" component="div">
                                                                                            <Link onClick={() => router.push(`/video/${streamsInfo._id}`)} color={'white'}>{streamsInfo.description}</Link>
                                                                                        </Typography>
                                                                                        <Typography gutterBottom variant="p" component="div">
                                                                                            <Link href="#" color={'#999'}>{channelDetails.channelName}</Link>
                                                                                        </Typography>
                                                                                        {streamsInfo.tags ? <ul className='videoTags'>
                                                                                            {streamsInfo.tags.map((tag, index) => (
                                                                                                <li key={index}>
                                                                                                    <Link onClick={() => router.push(`/tag/${tag}`)}>{tag}</Link>
                                                                                                </li>
                                                                                            ))}
                                                                                        </ul> : null}
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </Card>
                                                                        </Grid>
                                                                    // :
                                                                    //     <Grid item xs={2} sm={4} md={4} lg={5.2} key={index}>
                                                                    //         <LockIcon fontSize="large"/>
                                                                    //         <Card sx={{ width: '100%', margin: '0px 174px 0px 0px' }}>
                                                                    //             <div style={{ position: 'relative' }}>
                                                                    //                 <CardMedia
                                                                    //                     sx={{ height: 140 }}
                                                                    //                     image={`${process.env.NEXT_PUBLIC_S3_URL}/${streamsInfo.videoPreviewImage}`}
                                                                    //                 >

                                                                    //                 </CardMedia>
                                                                    //                 <Typography variant="body1" component="div" sx={{}}>
                                                                    //                     <div className='liveViewCount'>{countLiveViewing(streamsInfo.views)} viewers
                                                                    //                         <div style={liveDaysAgo}>{calculateDaysAgo(streamsInfo.createdAt)}</div>
                                                                    //                     </div>
                                                                    //                 </Typography>
                                                                    //             </div>
                                                                    //             <Grid container direction="row" alignItems="center" mt={"15px"} ml={"15px;"} pb={"15px"} style={{ display: "flex", alignItems: "flex-start" }}>
                                                                    //                 <Grid item>
                                                                    //                     <img src={`${process.env.NEXT_PUBLIC_S3_URL}/${channelDetails.channelPicture}`} className='br100 listChannelIconSize' />
                                                                    //                 </Grid>
                                                                    //                 <Grid item ml={"15px"} style={{ width: "75%" }}>
                                                                    //                     <Typography gutterBottom variant="h5" component="div">
                                                                    //                         <Link onClick={() => router.push(`/video/${streamsInfo._id}`)} color={'white'}>{streamsInfo.description}</Link>
                                                                    //                     </Typography>
                                                                    //                     <Typography gutterBottom variant="p" component="div">
                                                                    //                         <Link href="#" color={'#999'}>{channelDetails.channelName}</Link>
                                                                    //                     </Typography>
                                                                    //                     {streamsInfo.tags ? <ul className='videoTags'>
                                                                    //                         {streamsInfo.tags.map((tag, index) => (
                                                                    //                             <li key={index}>
                                                                    //                                 <Link onClick={() => router.push(`/tag/${tag}`)}>{tag}</Link>
                                                                    //                             </li>
                                                                    //                         ))}
                                                                    //                     </ul> : null}
                                                                    //                 </Grid>
                                                                    //             </Grid>
                                                                    //         </Card>
                                                                    //     </Grid>
                                                                ))}
                                                            </Grid>
                                                        </Box>
                                                    </Box>
                                                </>
                                                    : null}
                                            </Box>
                                        </> : <Typography variant="body1" component={'div'} sx={{ textAlign: 'center', marginTop: '15px', padding: '100px' }}>Looks like you don't have any videos yet...</Typography>}
                                    </TabPanel>
                                </TabContext>
                            </Box>
                        </Container>}
                        {/* :
                        } */}
                    </Box>
                </Box>}
                {isClickOnChannel && currentBroadcast && userDetail && channelDetails ? <LiveStreamChat funcHandleViewers={handleLiveStreamViewers} liveStreamInfo={currentBroadcast} viewerUser={userDetail} oldReceivedMessages={oldReceivedMessages} channelInfo={channelDetails} /> : null}
            </Box >
        </>
    )
}
