import client from "../../graphql";
import { gql } from "@apollo/client";
import { useState, useEffect } from "react";
import LeftMenu from '../../src/content/Overview/LeftMenu/index';
import Paper from '@mui/material/Paper';
import { Box, Grid, Link, Typography, Container, Button, Card, CardMedia, Tooltip, Divider, CardContent} from "@mui/material";
import styled from "@emotion/styled";
import React from 'react';
import VideoJS from '../../src/content/Overview/Slider/VideoJS';
import videojs from 'video.js';
import LiveStreamChatHistory from '../../src/content/Channel/LiveStreamChatHistory'
import { useRouter } from "next/router";
import CircularProgress from '@mui/material/CircularProgress';
import { setAuthUser, setAuthState, selectAuthState, selectAuthUser } from '../../store/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from "axios";
import LockIcon from '@mui/icons-material/Lock';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


export default function Videos(){
    const [channelDetails, setChannelDetails] = useState({});
    const [videoDetails, setVideoDetails] = useState({});
    const [lastBroadcastVideo, setLastBroadcastVideo] = useState({});
    const [currentBroadcastVideo, setCurrentBroadcastVideo] = useState({});
    const [recentLiveStreamVideos, setRecentLiveStreamVideos] = useState([]);
    const [recentUploadedVideos, setRecentUploadedVideos] = useState([]);
    const [allVideos, setAllVideos] = useState([]);
    const [showAllRecentBroadcast, setShowAllRecentBroadcast] = useState(true);
    const [showAllVideos, setShowAllVideos] = useState(true);
    const [oldReceivedMessages, setOldReceivedMessages] = React.useState([]);
    const [value, setValue] = React.useState('1');
    const [videoId, setVideoId] = useState('');
    const [isFetchingVideo, setIsFetchingVideo] = useState(false);
    const [isPageLoading, setIsPageLoading]= useState(true);
    let userDetails = useSelector(selectAuthUser);
    let userIsLogedIn = useSelector(selectAuthState);
    const [userDetail, setUserDetail] = useState(userDetails);
    const [userAuthState, setUserAuthState] = useState(userIsLogedIn);
    const [isChannelFollowing, setIsChannelFollowing] = useState({});
    const [isChannelSubscribed, setIsChannelSubscribed] = useState({});
    const [isSubscribedUser, setIsSubscribedUser] = useState(false);
    const [isLockVideo, setIsLockVideo] = useState(false);
    const [showPlayer, setShowPlayer] = useState(false);
    const [isVideoFound, setIsVideoFound] = useState(true);
    const router = useRouter();

    let subscribeUser = false;
    useEffect(async ()=>{
        if(!router.query.id) {
            return;
        }

        setVideoId(router.query.id);
        setIsFetchingVideo(true);

    }, [router.query.id]);

    useEffect(async ()=>{

        if(isFetchingVideo){
            setIsFetchingVideo(false)
            let videoInfo = await client.query({
                query: gql`
                    query Query($videoId: String) {
                        videos(videoId: $videoId) {
                            _id
                            title
                            description
                            videoPreviewImage
                            tags
                            views
                            url
                            userId
                            channelId
                            videoServiceType
                            videoPreviewStatus
                            videoQualityUrl {
                                quality
                                url
                            }
                            channelDetails {
                                channelName
                                channelPicture
                                _id
                                urlSlug
                            }
                            createdAt
                            tattooCategoryDetails {
                                title
                                urlSlug
                            }
                        }
                    }
                  
                `,
                variables: {
                    "videoId": videoId,
                }
            }).then((result) => {
                return result.data
            });

            console.log('videoInfo', videoInfo.videos.length )
            
            if(videoInfo.videos.length > 0){

                let videoOtherInfo = await client.query({
                    query: gql`
                    query Query ($recentLiveStreamVideosChannelId2: String!, $recentUploadedVideosChannelId2: String!, $channelIdForVideo: String, $chatVideoId: String!, $getLastLiveStreamVideoUserId2: String!, $channelId: String) {
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
                            channelDetails {
                                channelName
                                channelPicture
                                _id
                                urlSlug
                            }
                        }
                        getLastLiveStreamVideo(userId: $getLastLiveStreamVideoUserId2) {
                            _id
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
                        recentUploadedVideos(channelId: $recentUploadedVideosChannelId2) {
                            _id
                            title
                            videoPreviewImage
                            views
                            isStreamed
                            isUploaded
                            isPublished
                            createdAt
                            channelDetails {
                                channelName
                                channelPicture
                                _id
                                urlSlug
                              }
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
                            channelDetails {
                                channelName
                                channelPicture
                                _id
                                urlSlug
                            }
                        }
                        chatMessages(videoId: $chatVideoId) {
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
                    variables: {
                        "recentLiveStreamVideosChannelId2": videoInfo.videos[0].channelId,
                        "recentUploadedVideosChannelId2": videoInfo.videos[0].channelId,
                        "channelIdForVideo": videoInfo.videos[0].channelId,
                        "getLastLiveStreamVideoUserId2": videoInfo.videos[0].userId,
                        "channelId": videoInfo.videos[0].channelId,
                        "chatVideoId": videoInfo.videos[0]._id
                    }
                }).then((result) => {
                    return result.data
                });
    
                setChannelDetails(...videoInfo.videos[0].channelDetails);
                setVideoDetails(videoInfo.videos[0]);
                setLastBroadcastVideo(...videoOtherInfo.getLastLiveStreamVideo);
                setCurrentBroadcastVideo(...videoOtherInfo.liveStreamings);
                setRecentLiveStreamVideos(videoOtherInfo.recentLiveStreamVideos);
                setRecentUploadedVideos(videoOtherInfo.recentUploadedVideos);
                setAllVideos(videoOtherInfo.videos);
                setOldReceivedMessages(videoOtherInfo.chatMessages);
    
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
                            "channelId": videoInfo.videos[0].channelDetails[0]._id,
                            "userId": userDetails._id,
                            "channelId2": videoInfo.videos[0].channelDetails[0]._id,
                            "userId2": userDetails._id
                        }
                    }).then((result) => {
                        console.log('subscription detail', result.data);
                        setIsChannelFollowing(result.data.isChannelFollowing[0])
                        setUserDetail(userDetails);
                        if(result.data.subscriptionDetails.length > 0){
                            setIsChannelSubscribed(result.data.subscriptionDetails[0])
                            if(result.data.subscriptionDetails[0].isActive){
                                setIsSubscribedUser(true)
                                setShowPlayer(true);
                            }
                        } else {
                            setIsSubscribedUser(false)
                            setIsChannelSubscribed({})
                            setShowPlayer(true);
                        }
                        return result.data
                    });
    
                    await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create/video/history`, {
                        userId: userDetails._id,
                        videoId: videoId
                    }, {headers: {'x-access-token': userDetails.jwtToken}
                    }).then((data)=>{
                        console.log('data', data)
                    })
                } else {
                    setShowPlayer(true);
                    setIsSubscribedUser(false)
                }
            } else {
                setIsVideoFound(false);
            }

            
            setIsPageLoading(false)
        }
    }, [isFetchingVideo])

    const playerRef = React.useRef(null);

    const handleLockForSubscriber = (player, time)=>{
        if(time >= 30){
            if(!subscribeUser){
                player.pause();
                setIsLockVideo(true)
            } else {
                console.log('subscribed user --------------');
            }
        }
    }

    const handlePlayerReady = (player, subscribeInfo, videoInfor) => {
        playerRef.current = player;

        player.on('waiting', () => {
            videojs.log('player is waiting');
        });
        
        player.on('play', function() {
            console.log('video played')
        });
        
        player.on('timeupdate', ()=>{
            var time = player.currentTime();
            time = parseInt(time.toString());

            if(time >=5){
                axios.get("http://localhost:8080/prod/public/api/create/view").then((data)=>{
                    console.log(data)
                })
                // if(subscribeInfo.isActive || videoInfor.videoPreviewStatus == 'public'){
                //     // console.log('----------------------- subscribed user --------------');
                //     // console.log('----------------------- public video --------------');
                // } else {
                //     console.log('player stop--------------');
                //     player.pause();
                //     setIsLockVideo(true)
                // }
            }

            if(time >= 30){
                if(subscribeInfo.isActive || videoInfor.videoPreviewStatus == 'public'){
                    console.log('----------------------- subscribed user --------------');
                    console.log('----------------------- public video --------------');
                } else {
                    console.log('player stop--------------');
                    player.pause();
                    setIsLockVideo(true)
                }
            }
        })

        player.on('dispose', () => {
            videojs.log('player will dispose');
        });
    };

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

    const getHoursDiffBetweenDates = (dateFinal) => {
        const videoTime = new Date(parseInt(dateFinal));
        const currentTime = new Date();
        const hours = parseInt((currentTime - videoTime) / (1000 * 3600));
        if(hours == 0){
            return `Last live few minutes ago`
        }  else if(hours > 0 && hours < 24 ){
            return `Last live streaming ${hours} hours ago`
        } else if(hours >= 24 && hours < 48){
            return 'Last live yesterday'
        } else if(hours >= 48) {
            return `Last live stream ${calculateDaysAgo(dateFinal)}`
        }
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

    return (
        <>
            {/* {isLockVideo?
            <Backdrop
              sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: '#fff' }}
              open={true} // Set this based on whether the stream is locked
            >
              <LockIcon fontSize="large" /> Unlock video by subscribe channel
            </Backdrop>
            : */}
            <Box sx={{ display: 'flex'}}>
                <LeftMenu />
                {isPageLoading?
                    <Box sx={{textAlign: 'center', width: '100%', padding: '15%'}}>
                        <CircularProgress />
                        <Typography>
                            Loading...
                        </Typography>
                    </Box>
                :
                    <>
                        {showPlayer ?
                            <>    
                                <Box component="main" sx={{ flexGrow: 1, marginTop: '-8px', width: '100%'  }}>
                                    <Typography variant="body1" component={'div'} sx={{ paddingBottom: '10px', position: 'relative' }}>
                                        {
                                            isLockVideo?
                                            <>
                                                <Box sx={{filter: 'blur(5px)'}}>
                                                    <VideoJS  options={{
                                                        autoplay: false,
                                                        controls: true,
                                                        responsive: true,
                                                        fluid: true,
                                                        poster: videoDetails.videoPreviewImage?`https://livestreamingmaria.s3.us-west-1.amazonaws.com/images/${videoDetails.videoPreviewImage}`: `https://dummyimage.com/740x415/000/fff`,
                                                        className: 'video-page-player',
                                                        sources: [{
                                                            // src: 'https://5b44cf20b0388.streamlock.net:8443/vod/smil:bbb.smil/playlist.m3u8',
                                                            // src: `${process.env.NEXT_PUBLIC_S3_VIDEO_URL}/${videoDetails.url}`,
                                                            src: ``,
                                                            type: "video/mp4"
                                                        }]
                                                    }} />
                                                </Box>
                                                <Box sx={{ position: 'absolute', top: '50%', right: '45%', textAlign: 'center'}}>
                                                    <LockIcon fontSize="large"/>
                                                    <Typography variant="h4" component='h4' >Unlock video by subscribe channel</Typography>
                                                </Box>
                                            </>
                                            :
                                                <VideoJS  options={{
                                                    autoplay: false,
                                                    controls: true,
                                                    responsive: true,
                                                    fluid: true,
                                                    poster: videoDetails.videoPreviewImage?`https://livestreamingmaria.s3.us-west-1.amazonaws.com/images/${videoDetails.videoPreviewImage}`: `https://dummyimage.com/740x415/000/fff`,
                                                    className: 'video-page-player',
                                                    sources: [{
                                                        // src: 'https://5b44cf20b0388.streamlock.net:8443/vod/smil:bbb.smil/playlist.m3u8',
                                                        src: `${process.env.NEXT_PUBLIC_S3_VIDEO_URL}/${videoDetails.url}`,
                                                        type: "video/mp4"
                                                    }]
                                                }} onReady={(player)=>handlePlayerReady(player, isChannelSubscribed, videoDetails)} />
                                        }
                                    </Typography>
                                    <Box sx={{padding: '20px', textAlign: 'start'}}>
                                        <Typography variant="div" component={"div"} sx={{display: 'flex', marginRight: '10px'}}>
                                            {/* <Typography variant="h5" component={"h5"} className={classes.daysAgoStyle}></Typography> */}
                                            <hr style={{backgroundColor: "rgb(112, 99, 192)", 
                                                        content: '""',
                                                        width:'5px',
                                                        height: '20px',
                                                        margin: '0px 10px 0px 0px',
                                                        border: '0',
                                                        borderRadius: '10px'
                                            }}></hr>
                                            <Typography variant="h5" component={"h5"} sx={{marginBottom: '10px', fontWeight: '600'}} >{`${calculateDaysAgo(videoDetails.createdAt)}`}</Typography>
                                        </Typography>
                                        <Typography variant="h4" component={"h4"} sx={{fontSize: '20px'}}>{videoDetails.description}</Typography>
                                        {videoDetails.tattooCategoryDetails && <Box sx={{display: 'flex', marginTop: '5px'}}>
                                            <Link onClick={()=> router.push(`/single-category/${videoDetails.tattooCategoryDetails[0].urlSlug}`)} sx={{fontWeight: 400, marginRight: '10px', color: 'rgb(167 157 233)'}}>{videoDetails.tattooCategoryDetails[0].title}</Link>
                                            {/* <Typography sx={{fontWeight: 400, marginRight: '10px', color: 'rgb(112, 99, 192)'}}>{videoDetails.tattooCategoryDetails[0].title}</Typography> */}
                                            <Typography>- {countLiveViewing(videoDetails.views)} Views</Typography>
                                        </Box>}
                                    </Box>
                                    <Divider></Divider>
                                    {channelDetails && <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            margin: '10px 0px'
                                        }}
                                    >
                                        <Item sx={{ border: '0px', boxShadow: 'none', backgroundColor: 'transparent !important' }}>
                                            <Typography variant="body1" component={'div'} sx={{ display: 'flex', alignItems: 'start' }}>
                                                <Typography variant="body1" component={'div'} sx={{position: "relative"}}>
                                                    {channelDetails?<img src={`${process.env.NEXT_PUBLIC_S3_URL}/${channelDetails.channelPicture}`} style={{ borderRadius: '100%', height: '65px', width: '65px', margin: '0px 12px 10px 18px', border: currentBroadcastVideo? "2px solid red": null }} alt="" width="500" height="600"></img>: <img style={{ borderRadius: '100%', height: '65px', width: '65px', margin: '0px 12px 10px 18px', background: 'aliceblue' }}></img>}
                                                    {currentBroadcastVideo && <Typography variant="h5" component="h5" sx={{ fontSize: '13px', fontWeight: 300 ,backgroundColor: 'red', borderRadius: '5px', width: '50px', position: 'absolute', top: '56px', left: '25px', color: '#fff'}}>Live</Typography>}
                                                </Typography>
                
                                                <Typography variant="body1" component={'div'} sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Typography>
                                                        <Typography variant="body1" component={'div'} sx={{ gap: "15px", display: "flex" }}>
                                                            {/* <Typography variant="h3" component="h3" sx={{ fontWeight: 600, fontSize: '20px', cursor: 'pointer' }} align="left">{channelDetails.channelName}</Typography> */}
                                                            {channelDetails?<Link sx={{ fontWeight: 600, fontSize: '20px', color: '#CBCCD2'}} align="left" onClick={() => router.push(`/channel/${channelDetails.urlSlug}`)}>{channelDetails.channelName}</Link>: <Typography sx={{ fontWeight: 600, fontSize: '18px', color: '#CBCCD2'}} align="left">No Channel name found</Typography>}
                                                            {/* <Button variant="contained" sx={{ fontWeight: 400, fontSize: '12px', backgroundColor: 'grey', padding: '8px 30px', borderRadius: '5px', marginLeft: '20px'  }}>Subscribe</Button> */}
                                                        </Typography>
                                                        {currentBroadcastVideo? <Typography variant="h5" component={"h5"} sx={{fontSize:'15px', textAlign: 'left', marginTop: '5px' }}>
                                                            {/* {videoPageInfo.singleVideo.views} viewers */}
                                                            Streaming live now
                                                        </Typography>: 
                                                        <Typography variant="h5" component={"h5"} sx={{fontSize:'15px', textAlign: 'left', marginTop: '5px' }}>
                                                            {/* {videoPageInfo.singleVideo.views} viewers */}
                                                            {getHoursDiffBetweenDates(lastBroadcastVideo.createdAt)}
                                                        </Typography>}
                                                    </Typography>
                                                    {isChannelSubscribed ?
                                                        (isChannelSubscribed.isActive ?
                                                            <Button onClick={()=>handleSubscribeChannel(false)} variant="contained" startIcon={<StarIcon />} sx={{ fontWeight: 400, fontSize: '12px', backgroundColor: 'grey', padding: '8px 30px', borderRadius: '5px', marginLeft: '20px'  }}>Subscribed</Button>
                                                            :
                                                            (Object.keys(userDetail).length === 0 ?
                                                                <Tooltip title={<React.Fragment>Please <Link
                                                                onClick={()=> router.push("/auth/login")}
                                                                style={{cursor:"pointer"}}
                                                                >login</Link> to subscribe channel</React.Fragment>} placement="right-start">
                                                                    <Button variant="contained" startIcon={<StarBorderIcon />} sx={{ fontWeight: 400, fontSize: '12px', backgroundColor: 'grey', padding: '8px 30px', borderRadius: '5px', marginLeft: '20px'  }}>Subscribe</Button>
                                                                </Tooltip>
                                                                :
                                                                <Button onClick={()=>handleSubscribeChannel(true)} variant="contained" startIcon={<StarBorderIcon />} sx={{ fontWeight: 400, fontSize: '12px', backgroundColor: 'grey', padding: '8px 30px', borderRadius: '5px', marginLeft: '20px'  }}>Subscribe</Button>
                                                            )
                                                        )
                                                    :
                                                        null
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
                                                {/* <Button variant="contained" sx={{ fontWeight: 400, fontSize: '12px', backgroundColor: 'rgb(112, 99, 192)', padding: '8px 30px', borderRadius: '5px' }}>Follow</Button> */}
                                                {/* <Button variant="contained" sx={{ fontWeight: 400, fontSize: '12px', backgroundColor: 'grey', padding: '8px 30px', borderRadius: '5px' }}>Subscribe</Button> */}
                                            </Typography>
                                        </Item>
                                    </Box>}
                                    {/* { !isClickOnChannel?  */}
                                    {/* <Box>
                                        <Container className="" maxWidth="xl">
                                            <Box sx={{ width: '100%', typography: 'body1' }}>
                                                <TabContext value="3">
                                                    <TabList aria-label="lab API tabs example">
                                                        <Tab label="Videos" value="1"/>
                                                    </TabList>
                                                    <TabPanel value="3" sx={{ padding:'20px 0px', textAlign: 'left' }}>
                                                        <ChannelVideoSection recentLiveStreamVideos={recentLiveStreamVideos} recentUploadedVideos={recentLiveStreamVideos} allVideos={allVideos} channelDetails={channelDetails}/>
                                                    </TabPanel>
                                                </TabContext>
                                                <ChannelVideoSection recentLiveStreamVideos={recentLiveStreamVideos} recentUploadedVideos={recentLiveStreamVideos} allVideos={allVideos} channelDetails={channelDetails}/>
                                            </Box>
                                        </Container>
                                    </Box> */}
                                        {/* :
                                    } */}
                                </Box>
                                <Box sx={{mt: '90px', position: 'sticky'}}>
                                    <LiveStreamChatHistory oldReceivedMessages={oldReceivedMessages}/>
                                </Box>
                            </>
                            : <Box mt={"100px"}>
                                <Typography variant="h3" component={'h3'}>
                                    video not found..!!
                                </Typography>
                            </Box>
                        }
                    </>
                }
            </Box>
            {/* } */}
                
        </>
    )
}