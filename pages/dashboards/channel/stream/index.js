import client from "../../../../graphql";
import { gql } from "@apollo/client";
import React, { useState, useEffect, useRef } from "react";
import LiveStreamChatAdmin from '../../../../src/content/Channel/LiveStreamChatAdmin';
import { setAuthUser, setAuthState, selectAuthState, selectAuthUser } from '../../../../store/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
// import VideoJS from '../../../../src/content/Overview/Slider/VideoJS';
import { Box, Typography, Card, CardActions, CardContent, Button, Dialog, DialogContent, DialogTitle, Slide, Backdrop, CircularProgress } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import EditStreamTab from '../../../../src/content/Management/Users/settings/EditStreamTab'
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import { makeStyles } from '@mui/styles';
import { useRouter } from "next/router";
import LockIcon from '@mui/icons-material/Lock';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import httpSourceSelector from 'videojs-http-source-selector';
import 'videojs-contrib-quality-levels';

const useStyles = makeStyles((theme) => ({
  root: {
    backdropFilter: 'blur(3px)',
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(3),
  },
  loginButton: {
    marginTop: theme.spacing(2),
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const offline = {
    backgroundColor: "#3d3d3d",
    fontSize: "12px",
    color: "#fff",
    padding: "5px",
    textAlign: "center"
}
const scrollCss = {
    // height: '100%',
    // marginRight: '-50px',
    // paddingRight: '50px',
    // overflowY: 'scroll'
}
function ManageLiveStream(params) {
    let userDetails = useSelector(selectAuthUser);
    let userIsLogedIn = useSelector(selectAuthState);
    const [userDetail, setUserDetail] = useState(userDetails);
    const [userAuthState, setUserAuthState] = useState(userIsLogedIn);
    const [liveStreamInfo, setLiveStreamInfo] = useState({});
    const [oldChatMessages, setOldChatMessages] = useState({});
    const [tattooCategoryList, setTattooCategoryList]= useState([]);
    const [userData, setUserData] = useState([]);
    const [artistStreamDetail, setArtistStreamDetail] = useState([]);
    const [tagList, setTagList] = useState([]);
    const [viewer, setViewer] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isArtist, setIsArtist] = useState(false);
    const classes = useStyles();
    const [open, setOpen] = useState(true);
    const router = useRouter();
    const videoRef = React.useRef(null);
    const playerRef = React.useRef(null);
    const [showPlayer, setShowPlayer] = useState(false)

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        // setOpen(false);
        router.push('/auth/login')
    };

    const handleCloseAccess = () => {
        // setOpen(false);
        router.push('/')
    };

    useEffect(async ()=>{
        if (userDetails && userIsLogedIn) {

            const roleInfo = await client.query({
                query: gql`
                query Query($rolesId: ID) {
                    roles(id: $rolesId) {
                        role
                    }
                }
            `,
                variables: {
                    "rolesId": userDetails.role
                }
            });
            console.log('roleInfo', roleInfo.data)
            if(roleInfo.data.roles[0].role === 'artist' || roleInfo.data.roles[0].role === 'admin'){
                console.log('roleInfo', roleInfo.data)
                console.log('userDetails', userDetails)
                console.log('userIsLogedIn', userIsLogedIn)
                    
                setUserDetail(userDetails)
                setUserAuthState(userIsLogedIn)
                setIsLoggedIn(true);
                setIsArtist(true)
                const liveStreamInfo = await client.query({
                    query: gql`
                    query Query ($channelId: String, $artistId: String!, $usersId: ID) {
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
                        users(id: $usersId) {
                            _id
                            firstName
                            lastName
                            username
                            email
                            password
                            profilePicture
                            urlSlug
                            jwtToken
                            role
                            channelId
                            channelDetails {
                            channelName
                            _id
                            channelPicture
                            channelCoverImage
                            description
                            subscribers
                            userId
                            urlSlug
                            location
                            createdAt
                            socialLinks {
                                platform
                                url
                            }
                            }
                            interestedStyleDetail {
                            title
                            _id
                            }
                        }
                        streams(artistId: $artistId) {
                            _id
                            title
                            description
                            tags
                            streamCategory
                            streamKey
                            streamStartDate
                            streamEndDate
                            streamPreviewImage
                            createdAt
                            artistId
                            channelId
                        }
                        tattooCategories {
                            title
                            _id
                        }
                        tagForStream {
                            id
                            text
                        }
                    }
                `,
                    variables: {
                        "channelId": userDetails.channelId,
                        "artistId": userDetails._id,
                        "usersId": userDetails._id
                        // "channelId": '64be593ca0f0c930a531b7ab'
                    }
                }).then((result) => {
                    // setIsChannelFollowing(result.data.isChannelFollowing[0])
                    // setUserDetail(userDetails);
                    console.log('liveStreamInfo', result.data);
                    setLiveStreamInfo(result.data.liveStreamings);
                    setTagList(result.data.tagForStream)
                    setUserData(result.data.users);
                    setTattooCategoryList(result.data.tattooCategories);
                    setArtistStreamDetail(result.data.streams)
                    return result.data.liveStreamings[0]
                });
                console.log('liveStreamInfo', liveStreamInfo);

                let chatMessages;
                if(liveStreamInfo){

                    chatMessages = await client.query({
                        query: gql`
                        query Query ($videoId: String!) {
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
                        variables: {
                            "videoId": liveStreamInfo.videoId,
                            // "channelId": '64be593ca0f0c930a531b7ab'
                        }
                    }).then((result) => {
                        console.log('chatMessages result.data.chatMessages', result.data)
                        setOldChatMessages(result.data.chatMessages)
                        setShowPlayer(true);
                        return result.data.chatMessages
                    });
                }

                console.log('chatMessages', chatMessages);
            } else {
                console.log('not a artist');
                setIsLoggedIn(true);
                setIsArtist(false)
            }
        }
    }, [userIsLogedIn])

    React.useEffect(() => {
        if(showPlayer){
            setTimeout(()=>{
                if (!playerRef.current) {
                  
                  videojs.registerPlugin("httpSourceSelector", httpSourceSelector);
                  
                  const videoElement = document.createElement("video-js");
                  videoElement.classList.add('vjs-big-play-centered');
                  videoRef.current.appendChild(videoElement);
            
                  const player = playerRef.current = videojs(videoElement, {
                    autoplay: true,
                    controls: true,
                    responsive: true,
                    fluid: true,
                    className: 'online-video',
                    sources: [{
                        src: `${liveStreamInfo[0].streamUrl}`,
                        type: 'application/x-mpegURL'
                    }]
                }, () => {
                    videojs.log('player is ready');
                    handlePlayerReady && handlePlayerReady(player);
                  });
            
                  player.qualityLevels();
                  player.httpSourceSelector();
                  
                } else {
                  const player = playerRef.current;
            
                  player.autoplay(true);
                  player.src([{
                    src: `${liveStreamInfo[0].streamUrl}`,
                    type: 'application/x-mpegURL'
                    }]);
                }
            }, 2000)
        }
    
    }, [showPlayer, videoRef]);
    
      // Dispose the Video.js player when the functional component unmounts
    React.useEffect(() => {
        const player = playerRef.current;
    
        return () => {
          if (player && !player.isDisposed()) {
            player.dispose();
            playerRef.current = null;
          }
        };
    }, [playerRef]);
    
    const handlePlayerReady = (player) => {
        // playerRef.current = player;
        console.log('player ready running')
        // You can handle player events here, for example:
        player.on('waiting', () => {
            videojs.log('player is waiting');
        });
    
        player.on('dispose', () => {
            videojs.log('player will dispose');
        });
    };

    const handleLiveStreamViewers = (viewer) =>{
        setViewer(viewer);
    }

    return (
        <>
            {isLoggedIn ?
                isArtist?
                    <Box mt='100px' sx={{display: 'flex'}}>
                        <Box sx={{width: '65%'}}>
                            {liveStreamInfo.length > 0 ?
                                <Typography variant="body1" component={'div'} sx={{ paddingBottom: '10px', marginLeft: '10px', ...scrollCss }}>
                                    <Box px={2}>
                                        {/* <VideoJS options={{ autoplay: true, controls: true, responsive: true, fluid: true, className: 'online-video',
                                            sources: [{
                                                src: `${liveStreamInfo[0].streamUrl}`,
                                                // src: `https://cdn.flowplayer.com/a30bd6bc-f98b-47bc-abf5-97633d4faea0/hls/de3f6ca7-2db3-4689-8160-0f574a5996ad/playlist.m3u8`,
                                                type: 'application/x-mpegURL'
                                            }]
                                        }} onReady={handlePlayerReady} /> */}
                                        <div ref={videoRef} />
                                    </Box>
                                    {/* <Box sx={{ m:'18px' }}>
                                        <Card>
                                            <CardContent>
                                                <Box sx={{display: 'flex', alignItems: 'end'}}>
                                                    <PermIdentityIcon/>
                                                    <Typography variant='h4' component={'h4'} sx={{ textWrap: 'wrap', ml: '5px' }}>
                                                    {viewer} Viewers
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Box>
                                    <Box sx={{ m:'18px' }}> */}
                                        {/* {artistStreamDetail.length > 0 && tagList.length > 0 && userData.length > 0 && tattooCategoryList.length > 0 && <EditStreamTab streamData={artistStreamDetail} isStreamFound={true} tattooCategoriesData={tattooCategoryList} tagData={tagList} userData={userData} isStreamManagementPage={false}/>} */}
                                        {/* {tagList.length > 0 && userData.length > 0 && tattooCategoryList.length > 0 && <EditStreamTab streamData={artistStreamDetail} isStreamFound={true} tattooCategoriesData={tattooCategoryList} tagData={tagList} userData={userData} isStreamManagementPage={false}/>}
                                    </Box> */}
                                </Typography> 
                                :
                                <Box>
                                    <Typography variant="body1" component={'div'} sx={{ backgroundImage: "url(https://dummyimage.com/1335x550/000/fff)", width: '100%', height: '550px', backgroundRepeat: 'no-repeat' }}>
                                        <Typography variant="p" component={'p'} style={offline}>Offline</Typography>
                                    </Typography>
                                </Box>
                            }
                            <Box sx={{ m:'18px' }}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{display: 'flex', alignItems: 'end'}}>
                                            <PermIdentityIcon/>
                                            <Typography variant='h4' component={'h4'} sx={{ textWrap: 'wrap', ml: '5px' }}>
                                            {viewer} Viewers
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Box>
                            <Box sx={{ m:'18px' }}>
                                {artistStreamDetail.length > 0 && tagList.length > 0 && userData.length > 0 && tattooCategoryList.length > 0 && <EditStreamTab streamData={artistStreamDetail} isStreamFound={true} tattooCategoriesData={tattooCategoryList} tagData={tagList} userData={userData} isStreamManagementPage={false}/>}
                                {/* {tagList.length > 0 && userData.length > 0 && tattooCategoryList.length > 0 && <EditStreamTab streamData={artistStreamDetail} isStreamFound={true} tattooCategoriesData={tattooCategoryList} tagData={tagList} userData={userData} isStreamManagementPage={false}/>} */}
                            </Box>
                        </Box>
                        {liveStreamInfo && userDetail && <LiveStreamChatAdmin liveStreamInfo={liveStreamInfo} viewerUser={userDetail} oldReceivedMessages={oldChatMessages} funcHandleViewers={handleLiveStreamViewers}/>}
                    </Box>
                :
                    <div>
                        {/* <Button variant="contained" color="primary" onClick={handleOpen}>
                        Login
                        </Button> */}
                        <Dialog
                        open={open}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={handleCloseAccess}
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                            classes: { root: classes.root },
                        }}
                        >
                            <DialogContent className={classes.dialogContent}>
                                <DialogTitle>
                                    <Box>
                                        <Typography sx={{textAlign: 'center'}}>
                                            <LockIcon fontSize="large"/>
                                        </Typography>
                                        <Typography variant="h4" component="h4" >You do not have permissions to access this page</Typography>
                                    </Box>
                                </DialogTitle>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className={classes.loginButton}
                                    onClick={handleCloseAccess}
                                >
                                    Home
                                </Button>
                                <CircularProgress style={{ display: 'none' }} />
                            </DialogContent>
                        </Dialog>
                    </div>
            :
                <div>
                    {/* <Button variant="contained" color="primary" onClick={handleOpen}>
                    Login
                    </Button> */}
                    <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        classes: { root: classes.root },
                    }}
                    >
                        <DialogContent className={classes.dialogContent}>
                            <DialogTitle>Login to access Pages</DialogTitle>
                            <Button
                            variant="contained"
                            color="primary"
                            className={classes.loginButton}
                            onClick={handleClose}
                            >
                            Login
                            </Button>
                            <CircularProgress style={{ display: 'none' }} />
                        </DialogContent>
                    </Dialog>
                </div>
            }
        </>
    )
}

export default ManageLiveStream;