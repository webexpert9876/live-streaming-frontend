import client from "../../../../graphql";
import { gql } from "@apollo/client";
import { useState, useEffect, useRef } from "react";
import LiveStreamChatAdmin from '../../../../src/content/Channel/LiveStreamChatAdmin';
import { setAuthUser, setAuthState, selectAuthState, selectAuthUser } from '../../../../store/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import VideoJS from '../../../../src/content/Overview/Slider/VideoJS';
import videojs from 'video.js';
import { Box, Typography, Card, CardActions, CardContent, Button, Grid } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import EditStreamTab from '../../../../src/content/Management/Users/settings/EditStreamTab'
import PermIdentityIcon from '@mui/icons-material/PermIdentity';

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
    const playerRef = useRef(null);

    useEffect(async ()=>{
        if (userDetails && userIsLogedIn) {

            console.log('userDetails', userDetails)
            console.log('userIsLogedIn', userIsLogedIn)
            setUserDetail(userDetails)
            setUserAuthState(userIsLogedIn)
            const liveStreamInfo = await client.query({
                query: gql`
                query Query ($channelId: String) {
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
                }
            `,
                variables: {
                    "channelId": userDetails.channelId
                    // "channelId": '64be593ca0f0c930a531b7ab'
                }
            }).then((result) => {
                // setIsChannelFollowing(result.data.isChannelFollowing[0])
                // setUserDetail(userDetails);
                console.log('liveStreamInfo', result.data.liveStreamings[0]);
                setLiveStreamInfo(result.data.liveStreamings);
                return result.data.liveStreamings[0]
            });
            console.log('liveStreamInfo', liveStreamInfo);

            let chatMessages;
            if(liveStreamInfo){

                chatMessages = await client.query({
                    query: gql`
                    query Query ($videoId: String!, $artistId: String!, $usersId: ID) {
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
                        "videoId": liveStreamInfo.videoId,
                        "artistId": liveStreamInfo.userId,
                        "usersId": liveStreamInfo.userId
                        // "channelId": '64be593ca0f0c930a531b7ab'
                    }
                }).then((result) => {
                    console.log('chatMessages result.data.chatMessages', result.data)
                    setOldChatMessages(result.data.chatMessages)
                    setTagList(result.data.tagForStream)
                    setUserData(result.data.users);
                    setTattooCategoryList(result.data.tattooCategories);
                    setArtistStreamDetail(result.data.streams)
                    return result.data.chatMessages
                });
            }

            console.log('chatMessages', chatMessages);
            
        }
    }, [userIsLogedIn])


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

    const handleLiveStreamViewers = (viewer) =>{
        setViewer(viewer);
    }

    return (
        <>
            <Box mt='100px' sx={{display: 'flex'}}>
                <Box sx={{width: '65%'}}>
                    {liveStreamInfo.length > 0 ?
                        <Typography variant="body1" component={'div'} sx={{ paddingBottom: '10px', marginLeft: '10px', ...scrollCss }}>
                            <Box px={2}>
                                <VideoJS options={{
                                    autoplay: true,
                                    controls: true,
                                    responsive: true,
                                    fluid: true,
                                    className: 'online-video',
                                    sources: [{
                                        src: `${liveStreamInfo[0].streamUrl}`,
                                        // src: `https://cdn.flowplayer.com/a30bd6bc-f98b-47bc-abf5-97633d4faea0/hls/de3f6ca7-2db3-4689-8160-0f574a5996ad/playlist.m3u8`,
                                        type: 'application/x-mpegURL'
                                    }]
                                }} onReady={handlePlayerReady} />
                            </Box>
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
                            </Box>
                        </Typography> 
                        :
                        <Box>
                            <Typography variant="body1" component={'div'} sx={{ backgroundImage: "url(https://dummyimage.com/1835x550/000/fff)", width: '100%', height: '550px', backgroundRepeat: 'no-repeat' }}>
                                <Typography variant="p" component={'p'} style={offline}>Offline</Typography>
                            </Typography>
                        </Box>
                    }
                </Box>
                {liveStreamInfo && userDetail && <LiveStreamChatAdmin liveStreamInfo={liveStreamInfo} viewerUser={userDetail} oldReceivedMessages={oldChatMessages} funcHandleViewers={handleLiveStreamViewers}/>}
            </Box>
        </>
    )
}

export default ManageLiveStream;