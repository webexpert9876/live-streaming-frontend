import client from "../../graphql";
import { gql } from "@apollo/client";
import { useState, useEffect } from "react";
import LeftMenu from '../../src/content/Overview/LeftMenu/index';
import Paper from '@mui/material/Paper';
import { Box, Grid, Link, Typography, Container, Button, Card, CardMedia, Tooltip, MenuItem, Avatar, Menu, Toolbar, AppBar, Tab } from "@mui/material";
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
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { setAuthUser, setAuthState, selectAuthState, selectAuthUser } from '../../store/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import { useRouter } from 'next/router';
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
    // console.log('channelInfo', channelInfo)
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
    const router = useRouter();

    // console.log('currentBroadcast', currentBroadcast)
    React.useEffect(() => {
        if (currentBroadcast) {
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
        }
    }, [])

    useEffect(() => {
        if (userDetails && userIsLogedIn) {
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

    const handleChatClick = () => {
        setIsClickOnChannel(true);
        setShowAllRecentBroadcast(true)
    }
    const closeChat = () => {
        setIsClickOnChannel(false);
        setShowAllRecentBroadcast(true)
    }

    const handleAllRecentBroadcast = () => {
        setShowAllRecentBroadcast(!showAllRecentBroadcast)
    }

    const handleShowAllVideo = () => {
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
    const liveDaysAgo = {
        borderLeft: "solid 1px #b1b1b1",
        marginLeft: "5px",
        paddingLeft: "5px"
    }

    // const channelVideos = {
    //     width: "90%",
    //     overflow: "hidden"
    // }
    const headerMargin = {
        marginTop: "90px"
    }

    return (
        <>
            <Box sx={{ display: 'flex' }} style={headerMargin}>
                <LeftMenu />
                <Box component="main" sx={{ flexGrow: 1, width: '100%' }}>
                    {currentBroadcast ?
                        <Typography variant="body1" component={'div'} sx={{ paddingBottom: '10px' }}>
                            <VideoJS options={{
                                autoplay: true,
                                controls: true,
                                responsive: true,
                                fluid: true,
                                className: 'online-video',
                                sources: [{
                                    // src: 'https://5b44cf20b0388.streamlock.net:8443/vod/smil:bbb.smil/playlist.m3u8',
                                    src: `${process.env.NEXT_PUBLIC_S3_VIDEO_URL}/${currentBroadcast.streamUrl}`,
                                    type: 'application/x-mpegURL'
                                }]
                            }} onReady={handlePlayerReady} />
                        </Typography> :
                        <Box>
                            <Typography variant="body1" component={'div'} sx={{ backgroundImage: "url(https://dummyimage.com/1835x550/000/fff)", width: '100%', height: '550px', backgroundRepeat: 'no-repeat' }}>
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

                                <Typography variant="body1" component={'div'} sx={{}}>
                                    <Typography variant="h3" component="h3" sx={{ fontWeight: 600, fontSize: '20px', cursor: 'pointer' }} align="left">{channelDetails.channelName}</Typography>
                                    {currentBroadcast ? <Typography variant="body1" component={'div'} sx={{}}>
                                        <Typography variant="h4" component="h4" sx={{ fontWeight: 600, fontSize: '15px', marginTop: '8px' }} align="left">{currentBroadcast.description}</Typography>
                                        <Typography variant="body1" component={'div'} sx={{ display: 'flex', marginTop: '5px' }}>
                                            <Link

                                                onClick={() => router.push(`/single-category/${currentBroadcast.tattooCategoryDetails[0].urlSlug}`)}

                                                sx={{ fontWeight: 400, paddingRight: '10px', cursor: 'pointer' }} align="left">{currentBroadcast.tattooCategoryDetails[0].title}</Link>
                                            {/* <Typography variant="h6" component="h6" sx={{ fontWeight: 400, fontSize: '12px', borderRadius: '50px', backgroundColor: 'grey', padding: '2px 10px 2px 10px' }}>Tattoo</Typography> */}
                                            {currentBroadcast.tags.map((tag, index) => {
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
                                {/* <Button variant="contained" startIcon={<FavoriteBorderIcon />} sx={{ fontWeight: 400, fontSize: '12px', backgroundColor: 'rgb(112, 99, 192)', padding: '8px 30px', borderRadius: '5px' }}>Follow</Button> */}
                                {isChannelFollowing ?
                                    (isChannelFollowing.isFollowing ?
                                        <Button variant="contained" startIcon={<FavoriteIcon />} onClick={() => handleFollow(false)} sx={{ fontWeight: 400, fontSize: '12px', backgroundColor: 'rgb(112, 99, 192)', padding: '8px 30px', borderRadius: '5px' }}>Following</Button>
                                        :
                                        (Object.keys(userDetail).length === 0 ?
                                            <Tooltip title={<React.Fragment>Please <Link href={`/auth/login`}>login</Link> to follow channel</React.Fragment>} placement="right-start">
                                                <Button variant="contained" startIcon={<FavoriteBorderIcon />} sx={{ fontWeight: 400, fontSize: '12px', backgroundColor: 'rgb(112, 99, 192)', padding: '8px 30px', borderRadius: '5px' }}>Follow</Button>
                                            </Tooltip>
                                            :
                                            <Button variant="contained" startIcon={<FavoriteBorderIcon />} onClick={() => handleFollow(true)} sx={{ fontWeight: 400, fontSize: '12px', backgroundColor: 'rgb(112, 99, 192)', padding: '8px 30px', borderRadius: '5px' }}>Follow</Button>
                                        )
                                    )
                                    : null}
                                <Button variant="contained" sx={{ fontWeight: 400, fontSize: '12px', backgroundColor: 'grey', padding: '8px 30px', borderRadius: '5px' }}>Subscribe</Button>
                            </Typography>
                            <Typography variant="body1" component={'div'} sx={{ gap: "50px", display: "flex", margin: '10px 40px' }}>
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

                                            <Item sx={{ border: '0px', boxShadow: 'none', backgroundColor: 'transparent !important' }}>
                                                {channelDetails.socialLinks.length > 0 ?
                                                    <Box sx={{ 'textAlign': 'left' }} className="socialShareLink">
                                                        {
                                                            channelDetails.socialLinks.map((links) => (
                                                                <>
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
                                                                </>
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
                                            </Item>
                                        </Box>
                                    </Container>
                                </TabPanel>

                                {/* Videos tab section */}

                                <TabPanel value="2" sx={{ padding: '20px 0px', textAlign: 'left' }}>
                                    {(recentLiveStreamVideos.length != 0 && recentUploadedVideos.length != 0) ? <>
                                        <Box>
                                            {recentLiveStreamVideos.length != 0 ? <>
                                                <Typography variant="body1" component="div" sx={{ display: 'flex', alignItems: 'baseline' }}>
                                                    <Typography variant="h4" component="h4" sx={{ fontWeight: 600, fontSize: '17px', marginRight: "10px", paddingBottom: "12px" }}>Recent Broadcasts</Typography>
                                                    {/* {showAllRecentBroadcast ? <Button sx={{ fontWeight: 600, fontSize: '15px' }} onClick={handleAllRecentBroadcast}>View All</Button> : <Button sx={{ fontWeight: 600, fontSize: '15px' }} onClick={handleAllRecentBroadcast}>View less</Button>} */}
                                                </Typography>

                                                <Box sx={{ paddingTop: '5px' }}>
                                                    {/* <Grid className='desktop5'> */}

                                                    {showAllRecentBroadcast ?
                                                        // <Carousel swipeable={false} responsive={responsive}>
                                                        //     {recentLiveStreamVideos.slice(0, 10).map((streamsInfo, index) => (
                                                        //         <Grid item xs={12} sm={6} md={4} key={index} style={{ maxWidth: "100%" }}>
                                                        //             <Card sx={{ maxWidth: 345 }}>
                                                        //                 <div style={{ position: 'relative' }}>
                                                        //                     <CardMedia
                                                        //                         sx={{ height: 140 }}
                                                        //                         image={`${process.env.NEXT_PUBLIC_S3_URL}/${streamsInfo.videoPreviewImage}`}
                                                        //                     >
                                                        //                     </CardMedia>

                                                        //                     <div className='liveViewCount'>{countLiveViewing(streamsInfo.views)} viewers
                                                        //                         <div style={liveDaysAgo}>{calculateDaysAgo(streamsInfo.createdAt)} days ago</div>
                                                        //                     </div>


                                                        //                 </div>
                                                        //                 <Grid container direction="row" alignItems="center" mt={"15px"} ml={"15px;"} pb={"15px"} style={{ display: "flex", alignItems: "flex-start" }}>
                                                        //                     <Grid item>
                                                        //                         <img src={`${process.env.NEXT_PUBLIC_S3_URL}/${channelDetails.channelPicture}`} className='br100 listChannelIconSize' />
                                                        //                     </Grid>
                                                        //                     <Grid item ml={"15px"} style={{ width: "75%" }}>
                                                        //                         <Typography gutterBottom variant="h5" component="div">
                                                        //                             <Link href={`/video/${streamsInfo._id}`} color={'white'}>{streamsInfo.description}</Link>
                                                        //                         </Typography>
                                                        //                         <Typography gutterBottom variant="p" component="div">
                                                        //                             <Link href="#" color={'#999'}>{channelDetails.channelName}</Link>
                                                        //                         </Typography>
                                                        //                         {streamsInfo.tags ? <ul className='videoTags'>
                                                        //                             {streamsInfo.tags.map((tag, index) => (
                                                        //                                 <li key={index}>
                                                        //                                     <Link href="/tags/">{tag}</Link>
                                                        //                                 </li>
                                                        //                             ))}
                                                        //                         </ul> : null}
                                                        //                     </Grid>
                                                        //                 </Grid>
                                                        //             </Card>
                                                        //         </Grid>
                                                        //     ))}
                                                        // </Carousel> 
                                                        <Box sx={{ width: '100%' }}>
                                                            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12, lg: 26 }}>
                                                                {/* <Grid item xs={12} sm={6} md={4} style={{ maxWidth: "100%", margin: '0px 25px 25px 25px', flex: 1,  }}> */}
                                                                {recentLiveStreamVideos.slice(0, 5).map((streamsInfo, index) => (
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
                                                                                        <div style={liveDaysAgo}>{calculateDaysAgo(streamsInfo.createdAt)} days ago</div>
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
                                                                ))}
                                                            </Grid>
                                                        </Box>
                                                        :

                                                        // <Box sx={{display:'flex', flexWrap: 'wrap'}}>

                                                        <Box sx={{ width: '100%' }}>
                                                            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12, lg: 26 }}>
                                                                {/* <Grid item xs={12} sm={6} md={4} style={{ maxWidth: "100%", margin: '0px 25px 25px 25px', flex: 1,  }}> */}
                                                                {recentLiveStreamVideos.map((streamsInfo, index) => (
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
                                                                                        <div style={liveDaysAgo}>{calculateDaysAgo(streamsInfo.createdAt)} days ago</div>
                                                                                    </div>
                                                                                </Typography>
                                                                            </div>
                                                                            <div className=""></div>
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
                                                        // <Carousel swipeable={false} responsive={responsive}>
                                                        //     {allVideos.slice(0, 10).map((streamsInfo, index) => (
                                                        //         <Grid item xs={12} sm={6} md={4} key={index} style={{ maxWidth: "100%" }}>
                                                        //             <Card sx={{ maxWidth: 345 }}>
                                                        //                 <div style={{ position: 'relative' }}>
                                                        //                     <CardMedia
                                                        //                         sx={{ height: 140 }}
                                                        //                         image={`${process.env.NEXT_PUBLIC_S3_URL}/${streamsInfo.videoPreviewImage}`}
                                                        //                     >
                                                        //                     </CardMedia>
                                                        //                     <Typography variant="body1" component="div" sx={{}}>
                                                        //                         <div className='liveViewCount'>{countLiveViewing(streamsInfo.views)} viewers
                                                        //                             <div style={liveDaysAgo}>{calculateDaysAgo(streamsInfo.createdAt)} days ago</div>
                                                        //                         </div>

                                                        //                     </Typography>
                                                        //                 </div>
                                                        //                 <Grid container direction="row" alignItems="center" mt={"15px"} ml={"15px;"} pb={"15px"} style={{ display: "flex", alignItems: "flex-start" }}>
                                                        //                     <Grid item>
                                                        //                         <img src={`${process.env.NEXT_PUBLIC_S3_URL}/${channelDetails.channelPicture}`} className='br100 listChannelIconSize' />
                                                        //                     </Grid>
                                                        //                     <Grid item ml={"15px"} style={{ width: "75%" }}>
                                                        //                         <Typography gutterBottom variant="h5" component="div">
                                                        //                             <Link href={`/video/${streamsInfo._id}`} color={'white'}>{streamsInfo.description}</Link>
                                                        //                         </Typography>
                                                        //                         <Typography gutterBottom variant="p" component="div">
                                                        //                             <Link href="#" color={'#999'}>{channelDetails.channelName}</Link>
                                                        //                         </Typography>
                                                        //                         {streamsInfo.tags ? <ul className='videoTags'>
                                                        //                             {streamsInfo.tags.map((tag, index) => (
                                                        //                                 <li key={index}>
                                                        //                                     <Link href="/tags/">{tag}</Link>
                                                        //                                 </li>
                                                        //                             ))}
                                                        //                         </ul> : null}
                                                        //                     </Grid>
                                                        //                 </Grid>
                                                        //             </Card>
                                                        //         </Grid>
                                                        //     ))}
                                                        // </Carousel> 
                                                        <Box sx={{ width: '100%' }}>
                                                            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12, lg: 26 }}>
                                                                {allVideos.slice(0, 5).map((streamsInfo, index) => (
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
                                                                                        <div style={liveDaysAgo}>{calculateDaysAgo(streamsInfo.createdAt)} days ago</div>
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
                                                                ))}
                                                            </Grid>
                                                        </Box>
                                                        :
                                                        <Box sx={{ width: '100%' }}>
                                                            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12, lg: 26 }}>
                                                                {allVideos.map((streamsInfo, index) => (
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
                                                                                        <div style={liveDaysAgo}>{calculateDaysAgo(streamsInfo.createdAt)} days ago</div>
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
                                                                ))}
                                                            </Grid>
                                                        </Box>
                                                    }
                                                </Box>
                                            </>
                                                : null}
                                        </Box>
                                    </> : <Typography variant="body1" component={'div'} sx={{ textAlign: 'center', marginTop: '15px', padding: '100px' }}>Looks like you don't have any videos yet...</Typography>}
                                </TabPanel>
                            </TabContext>
                        </Box>
                    </Container>
                    {/* :
                    } */}
                </Box>
                {isClickOnChannel ? <LiveStreamChat oldReceivedMessages={oldReceivedMessages} /> : null}
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
                    socialLinks {
                        platform
                        url
                    }
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