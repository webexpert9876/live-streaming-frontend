import client from "../../graphql";
import { gql } from "@apollo/client";
import { useState, useEffect } from "react";
import LeftMenu from '../../src/content/Overview/LeftMenu/index';
import Paper from '@mui/material/Paper';
import { Box, Grid, Link, Typography, Container, Button, Card, CardMedia, Tooltip, MenuItem , Avatar, Menu, Toolbar, AppBar, Tab, Divider} from "@mui/material";
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


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


export default function Videos(props){
    const videoPageInfo = JSON.parse(props.videoInfo);
    // console.log('channelInfo video', videoPageInfo)
    const [channelDetails, setChannelDetails] = useState(...videoPageInfo.singleVideo.channelDetails);
    const [videoDetails, setVideoDetails] = useState(videoPageInfo.singleVideo);
    const [lastBroadcastVideo, setLastBroadcastVideo] = useState(...videoPageInfo.getLastLiveStreamVideo);
    const [currentBroadcastVideo, setCurrentBroadcastVideo] = useState(...videoPageInfo.liveStreamings);
    const [recentLiveStreamVideos, setRecentLiveStreamVideos] = useState(videoPageInfo.recentLiveStreamVideos);
    const [recentUploadedVideos, setRecentUploadedVideos] = useState(videoPageInfo.recentUploadedVideos);
    const [allVideos, setAllVideos] = useState(videoPageInfo.videos);
    // const [currentBroadcast, setCurrentBroadcast] = useState(...channelInfo.liveStreamings);
    // const [channelTotalFollower, setChannelTotalFollower] = useState(...channelInfo.countChannelTotalFollowers);
    // const [streams, setStreams] = useState(channelInfo.streams);
    const [showAllRecentBroadcast, setShowAllRecentBroadcast] = useState(true);
    const [showAllVideos, setShowAllVideos] = useState(true);
    // const [noVideoFound, setNoVideoFound] = useState(false);
    // const [isClickOnChannel, setIsClickOnChannel] = useState(false);
    const [oldReceivedMessages, setOldReceivedMessages] = React.useState(videoPageInfo.chatMessages);
    const [value, setValue] = React.useState('1');

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

    const getHoursDiffBetweenDates = (dateFinal) => {
        const videoTime = new Date(parseInt(dateFinal));
        const currentTime = new Date();
        // console.log('videoTime', videoTime);
        // console.log('currentTime', currentTime);
        const hours = parseInt((currentTime - videoTime) / (1000 * 3600));
        if(hours == 0){
            return `Last live few minutes ago`
        }  else if(hours > 0 && hours < 24 ){
            return `Last live streaming ${hours} hours ago`
        } else if(hours >= 24 && hours < 48){
            return 'Last live yesterday'
        } else if(hours >= 48) {
            return `Last live stream ${calculateDaysAgo(dateFinal)} days ago`
        }
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

    return (
        <>
            <Box sx={{ display: 'flex'}}>
                <LeftMenu />
                <Box component="main" sx={{ flexGrow: 1, marginTop: '-8px', width: '100%'  }}>
                    <Typography variant="body1" component={'div'} sx={{ paddingBottom: '10px' }}>
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
                        }} onReady={handlePlayerReady} />
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
                            <Typography variant="h5" component={"h5"} sx={{marginBottom: '10px', fontWeight: '600'}} >{`${calculateDaysAgo(videoDetails.createdAt)} days ago`}</Typography>
                        </Typography>
                        <Typography variant="h4" component={"h4"} sx={{fontSize: '20px'}}>{videoDetails.description}</Typography>
                        <Box sx={{display: 'flex', marginTop: '5px'}}>
                            <Link href={`/single-category/${videoDetails.tattooCategoryDetails[0].urlSlug}`} sx={{fontWeight: 400, marginRight: '10px', color: 'rgb(167 157 233)'}}>{videoDetails.tattooCategoryDetails[0].title}</Link>
                            {/* <Typography sx={{fontWeight: 400, marginRight: '10px', color: 'rgb(112, 99, 192)'}}>{videoDetails.tattooCategoryDetails[0].title}</Typography> */}
                            <Typography>- {countLiveViewing(videoDetails.views)} Views</Typography>
                        </Box>
                    </Box>
                    <Divider></Divider>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            margin: '10px 0px'
                        }}
                    >
                        <Item sx={{ border: '0px', boxShadow: 'none', backgroundColor: 'transparent !important' }}>
                            <Typography variant="body1" component={'div'} sx={{ display: 'flex', alignItems: 'start' }}>
                                <Typography variant="body1" component={'div'} sx={{}}>
                                    {channelDetails?<img src={`${process.env.NEXT_PUBLIC_S3_URL}/${channelDetails.channelPicture}`} style={{ borderRadius: '100%', height: '65px', width: '65px', margin: '0px 12px 10px 18px' }} alt="Girl in a jacket" width="500" height="600"></img>: <img style={{ borderRadius: '100%', height: '65px', width: '65px', margin: '0px 12px 10px 18px', background: 'aliceblue' }}></img>}
                                </Typography>

                                <Typography variant="body1" component={'div'} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography>
                                        <Typography variant="body1" component={'div'} sx={{ gap: "15px", display: "flex" }}>
                                            {/* <Typography variant="h3" component="h3" sx={{ fontWeight: 600, fontSize: '20px', cursor: 'pointer' }} align="left">{channelDetails.channelName}</Typography> */}
                                            {channelDetails?<Link sx={{ fontWeight: 600, fontSize: '20px', color: '#CBCCD2'}} align="left" href={`/channel/${channelDetails.urlSlug}`}>{channelDetails.channelName}</Link>: <Typography sx={{ fontWeight: 600, fontSize: '18px', color: '#CBCCD2'}} align="left">No Channel name found</Typography>}
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
                                    <Typography>
                                        <Button variant="contained" sx={{ fontWeight: 400, fontSize: '12px', backgroundColor: 'rgb(112, 99, 192)', padding: '8px 30px', borderRadius: '5px', marginLeft: '20px'  }}>Subscribe</Button>
                                    </Typography>

                                </Typography>
                            </Typography>
                        </Item>
                        <Item sx={{ border: '0px', boxShadow: 'none', backgroundColor: 'transparent !important' }}>
                            <Typography variant="body1" component={'div'} sx={{ gap: "15px", display: "flex" }}>
                                <Button variant="contained" sx={{ fontWeight: 400, fontSize: '12px', backgroundColor: 'rgb(112, 99, 192)', padding: '8px 30px', borderRadius: '5px' }}>Follow</Button>
                                {/* <Button variant="contained" sx={{ fontWeight: 400, fontSize: '12px', backgroundColor: 'grey', padding: '8px 30px', borderRadius: '5px' }}>Subscribe</Button> */}
                            </Typography>
                        </Item>
                    </Box>
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
                <LiveStreamChat oldReceivedMessages={oldReceivedMessages}/>
            </Box>
                
        </>
    )
}

export async function getStaticPaths() {
    let videoData = await client.query({
        query: gql`
            query Query {
                videos {
                    _id
                }
            }
        `
    }).then((result) => {
        let videoIds = result.data.videos.map((item) => {
            return {
                params: {
                    id: `${item._id}`
                }
            }
        })
        return videoIds;
    });

    return {
        paths: videoData,
        fallback: false,
    };
}

export async function getStaticProps({ params }) {

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
            "videoId": params.id,
        }
    }).then((result) => {
        // console.log('single video details', result.data)
        return result.data
    });

    let videoOtherInfo = await client.query({
        query: gql`
        query Query ($recentLiveStreamVideosUserId2: String!, $recentUploadedVideosUserId2: String!, $userIdForVideo: String, $chatVideoId: String!, $getLastLiveStreamVideoUserId2: String!, $channelId: String) {
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
            recentUploadedVideos(userId: $recentUploadedVideosUserId2) {
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
            videos(userId: $userIdForVideo) {
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
            "recentLiveStreamVideosUserId2": videoInfo.videos[0].userId,
            "recentUploadedVideosUserId2": videoInfo.videos[0].userId,
            "userIdForVideo": videoInfo.videos[0].userId,
            "getLastLiveStreamVideoUserId2": videoInfo.videos[0].userId,
            "channelId": videoInfo.videos[0].channelId,
            "chatVideoId": videoInfo.videos[0]._id
        }
    }).then((result) => {
        // console.log('channelInfo.channels[0].userId', videoInfo.videos[0].userId)
        // console.log('channelInfo.channels[0].userId result', result.data)
        return result.data
    });

    let allData = { singleVideo: {...videoInfo.videos[0]}, ...videoOtherInfo };
    videoInfo = JSON.stringify(allData);
    return {
        props: {
            videoInfo: videoInfo
        },
    }
}