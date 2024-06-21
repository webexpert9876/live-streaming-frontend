import client from "../../graphql";
import { gql } from "@apollo/client";
import { useState, useEffect, useRef } from "react";
import LeftMenu from '../../src/content/Overview/LeftMenu/index';
import Paper from '@mui/material/Paper';
import { 
    Box,
    Grid,
    Link,
    Typography,
    Container,
    Button,
    TextField,
    Tooltip,
    Divider,
    CardContent,
    Avatar,
    InputAdornment, 
    Dialog,
    DialogActions, 
    DialogContent, 
    DialogContentText, 
    DialogTitle 
} from "@mui/material";

import styled from "@emotion/styled";
import React from 'react';
// import VideoJS from '../../src/content/Overview/Slider/VideoJS';
import VideoJS from '../../src/components/videojs player/VideoJsOffline';
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
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import dynamic from 'next/dynamic';
import { makeStyles } from '@mui/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

const EmojiPicker = dynamic(
    () => {
      return import('emoji-picker-react');
    },
    { ssr: false }
  );

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const commentButton = { marginTop: '10px', border: 'none', background: '#9147FF', borderRadius: '3px', padding: '5px 10px 5px 10px', color: 'white', float: 'right' };
const commentUpdateButton = { marginTop: '10px', border: 'none', background: '#9147FF', borderRadius: '3px', padding: '5px 10px 5px 10px', color: 'white', float: 'right' };
const cmtUpdateCancelButton = { marginTop: '10px', marginRight: "10px", border: 'none', background: 'rgb(145 71 255 / 29%)', borderRadius: '3px', padding: '5px 10px 5px 10px', color: 'white', float: 'right' };


const useStyles = makeStyles({
    scrollableContent: {
      overflowY: 'scroll',
      height: "500px",
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
  });


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

    const [isVideoNotFound, setIsVideoNotFound] = useState(false);
    const [isBlockedChannel, setIsBlockedChannel] = useState(false);
    const [isStatusPendingChannel, setIsStatusPendingChannel] = useState(false);

    const [viewerRole, setViewerRole] = useState('');
    const [isPrivateVideo, setIsPrivateVideo] = useState(false);
    
    const [commentList, setCommentList] = useState([]);
    const [comment, setComment] = useState('');
    const [isClickOnEmoji, setIsClickOnEmoji] = useState(false);
    const [isAddedComment, setIsAddedComment] = useState(false);
    
    const [isEditingComment, setIsEditingComment] = useState(false);
    const [isDeletingComment, setIsDeletingComment] = useState(false);
    
    const [isUpdatingCommentInDB, setIsUpdatingCommentInDB] = useState(false);
    const [editCommentDetails, setEditCommentDetails ] = useState({});
    const [deleteCommentId, setDeleteCommentId ] = useState('');

    const [openToolTip, setOpenToolTip] = useState(false);

    const [open, setOpen] = React.useState(false);
    
    const [disableDeleteBtn, setDisableDeleteBtn] = useState(false);
    
    const [currentChannelActivePlan, setCurrentChannelActivePlan] = useState([]);
    
    const [openBuySubscription, setOpenBuySubscription] = useState(false);
    const [selectedBox, setSelectedBox] = useState(null);
    const [channelPlanList, setChannelPlanList] = useState([
        // { id: 1, planDuration:'month', timeDuration: 1, price: 10},
        // { id: 2, planDuration:'month', timeDuration: 6, price: 50},
        // { id: 3, planDuration:'year', timeDuration: 1, price: 90 },
      ]
    );

    const classes = useStyles();

    const router = useRouter();
    const commentSectionRef = useRef(null);

    let isViewCreated = false;
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
                    query Query($videoId: String, $videoIdForComment: String) {
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
                                blocked
                                isApproved
                            }
                            createdAt
                            tattooCategoryDetails {
                                title
                                urlSlug
                            }
                        }
                        comments(videoId: $videoIdForComment) {
                            _id
                            text
                            createdAt
                            userId
                            videoId
                            userDetail {
                              _id
                              firstName
                              lastName
                              username
                              profilePicture
                              urlSlug
                            }
                          }
                    }
                  
                `,
                variables: {
                    "videoId": videoId,
                    "videoIdForComment": videoId
                }
            }).then((result) => {
                console.log("result.data---------", result.data);
                return result.data
            });

            console.log('videoInfo', videoInfo.videos.length )
            
            if(videoInfo.comments.length > 0) {
                setCommentList(videoInfo.comments);
            }

            if(videoInfo.videos.length > 0){
                
                console.log('video found ')
                let channelApproveStatus = videoInfo.videos[0].channelDetails[0].isApproved;
                let channelBlockedStatus = videoInfo.videos[0].channelDetails[0].blocked;
                if(channelApproveStatus == 'approved' && `${channelBlockedStatus}` == 'false'){
                    let videoOtherInfo = await client.query({
                        query: gql`
                        query Query ($recentLiveStreamVideosChannelId2: String!, $recentUploadedVideosChannelId2: String!, $chatVideoId: String!, $getLastLiveStreamVideoUserId2: String!, $channelId: String, $channelId2: String) {
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
                            getChannelActivePlans(channelId: $channelId2) {
                                _id
                                channelId
                                isPaid
                            }
                        }
                        `,
                        variables: {
                            "recentLiveStreamVideosChannelId2": videoInfo.videos[0].channelId,
                            "recentUploadedVideosChannelId2": videoInfo.videos[0].channelId,
                            "getLastLiveStreamVideoUserId2": videoInfo.videos[0].userId,
                            "channelId": videoInfo.videos[0].channelId,
                            "channelId2": videoInfo.videos[0].channelId,
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
                    // setAllVideos(videoOtherInfo.videos);
                    setOldReceivedMessages(videoOtherInfo.chatMessages);
                    setCurrentChannelActivePlan(videoOtherInfo.getChannelActivePlans)


                    if(videoOtherInfo.getChannelActivePlans[0].isPaid){
                        client.query({
                            variables: {
                                channelId3: videoInfo.videos[0].channelId
                            },
                            query: gql`
                                query Query($channelId3: ID,) {
                                    subscriptionPlans(channelId: $channelId3) {
                                        _id
                                        planDuration
                                        planDurationUnit
                                        price
                                        createdAt
                                        channelId
                                    }
                
                                }
                            `,
                        })
                            .then((result) => {
                                setChannelPlanList(result.data.subscriptionPlans);
                            });
                    }


                    if (userDetails && userIsLogedIn) {
                        let isArtistOrAdmin = false;

                        if(userDetails){
                            if(userDetails._id == videoInfo.videos[0].userId){
                                isArtistOrAdmin = true
                            }
                        }

                        client.query({
                            query: gql`
                            query Query ($channelId: String!, $userId: String!, $channelId2: String, $userId2: String, $rolesId: ID, $channelIdForVideo: String, $isShowingPrivateVideo: Boolean) {
                                isChannelFollowing(channelId: $channelId, userId: $userId) {
                                    isFollowing
                                    channelId
                                    userId
                                    _id
                                }
                                subscriptionDetails(channelId: $channelId2, userId: $userId2) {
                                    isActive
                                }
                                roles(id: $rolesId) {
                                    role
                                }
                                videos(channelId: $channelIdForVideo, showPrivateVideo: $isShowingPrivateVideo) {
                                    _id
                                    title
                                    videoPreviewImage
                                    views
                                    userId
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
                            }
                        `,
                            variables: {
                                "channelId": videoInfo.videos[0].channelDetails[0]._id,
                                "userId": userDetails._id,
                                "channelId2": videoInfo.videos[0].channelDetails[0]._id,
                                "userId2": userDetails._id,
                                "rolesId": userDetails.role,
                                "channelIdForVideo": videoInfo.videos[0].channelId,
                                "isShowingPrivateVideo": isArtistOrAdmin
                            }
                        }).then((result) => {
                            console.log('subscription detail', result.data);
                            setAllVideos(result.data.videos);
                            setIsChannelFollowing(result.data.isChannelFollowing[0])
                            setUserDetail(userDetails);
                            setViewerRole(result.data.roles[0].role);
                            console.log('userDetails._id', userDetails._id)
                            console.log('videoDetails.userId', videoInfo.videos[0].userId)
                            console.log('result.data.roles[0].role', result.data.roles[0].role)
                            
                            if(userDetails._id != videoInfo.videos[0].userId && result.data.roles[0].role != 'admin' && videoInfo.videos[0].videoPreviewStatus == 'private'){
                                console.log('result.data.roles[0].role', result.data.roles[0].role)
                                setIsPrivateVideo(true);
                            }
                            console.log("result.data.subscriptionDetails---------------------", result.data.subscriptionDetails)
                            if(result.data.subscriptionDetails.length > 0){
                                setIsChannelSubscribed(result.data.subscriptionDetails[0])
                                if(result.data.subscriptionDetails[0].isActive){
                                    // setIsSubscribedUser(true)
                                    console.log('result.data.subscriptionDetails[0].isActive', result.data.subscriptionDetails[0].isActive)
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

                        client.query({
                            query: gql`
                            query Query ($channelIdForVideo: String, $isShowingPrivateVideo: Boolean) {
                                
                                videos(channelId: $channelIdForVideo, showPrivateVideo: $isShowingPrivateVideo) {
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
                                "channelIdForVideo": videoInfo.videos[0].channelId,
                                "isShowingPrivateVideo": false
                            }
                        }).then((result) => {
                            console.log('subscription detail', result.data);
                            setAllVideos(result.data.videos);
                        });

                        setShowPlayer(true);
                        setIsSubscribedUser(false)
                        if(videoInfo.videos[0].videoPreviewStatus == 'private'){
                            setIsPrivateVideo(true);
                        }
                    }
                } else if(channelApproveStatus == 'approved' && `${channelBlockedStatus}` == 'true') {
                    setIsBlockedChannel(true);
                } else if(channelApproveStatus == 'declined' || channelApproveStatus == 'pending') {
                    console.log('channel is ', channelApproveStatus);
                    setIsStatusPendingChannel(true);
                }
            } else {
                setIsVideoNotFound(true);
            }

            // await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get/streaming/video/hls/${videoId}`, {headers: {'x-access-token': userDetails.jwtToken}}).then((data)=>{
            //     console.log('data data data', data);
            // }).catch((error)=>{
            // console.log('error', error.response.data.message);
            // });

            
            setIsPageLoading(false)
            
            const commentSection = commentSectionRef.current;
            if (commentSection) {
                commentSection.scrollTop = commentSection.scrollHeight - commentSection.clientHeight;
            }
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
            console.log('video played');
        });
        
        player.on('timeupdate', ()=>{
            var time = player.currentTime();
            time = parseInt(time.toString());
            console.log(time)
            if(time >= 5){

                if(!isViewCreated){
                    isViewCreated = true;
                    let viewData={};
                    if(userDetail){
                        viewData.userId= userDetail._id,
                        viewData.videoId= videoInfor._id
                    } else {
                        viewData.videoId= videoInfor._id
                    }
                    axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/api/create/view`, viewData ).then((data)=>{
                        console.log("-------", data)
                    });
                }
            }
            if(currentChannelActivePlan[0].isPaid) {

                if(time >= 30){
                    console.log('----------------------- subscribed user --------------', subscribeInfo);
                    // console.log('-----------------------  video info --------------', videoInfor);
                    // console.log('-----------------------  user Detail info --------------', userDetail);
                    console.log('-----------------------  viewerRole --------------', viewerRole);
                    console.log('-----------------------  videoInfor.userId --------------', videoInfor.userId);
                    console.log('-----------------------  videoInfor.videoPreviewStatus --------------', videoInfor.videoPreviewStatus);
                    if(viewerRole != 'admin' && videoInfor.userId !== userDetail._id && videoInfor.videoPreviewStatus !== 'public'){
                        
                        if(`${subscribeInfo.isActive}` == 'false' || Object.keys(subscribeInfo).length == 0 ){
                            // console.log('----------------------- subscribed user --------------');
                            // console.log('----------------------- or public video --------------');
                            player.pause();
                            setIsLockVideo(true)
                        }
                    }
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

    const showQualityUrl = (qualityArray)=>{
        console.log(qualityArray);
        const newQualityArray = [...qualityArray];
        newQualityArray.sort((a, b) => {
            const qualityA = parseInt(a.quality); // Extract the quality number from the string
            const qualityB = parseInt(b.quality);
          
            // Compare the quality values
            if (qualityA > qualityB) {
              return -1; // If qualityA is greater, place it before qualityB
            } else if (qualityA < qualityB) {
              return 1; // If qualityB is greater, place it before qualityA
            } else {
              return 0; // If both are equal, no change in position
            }
          });

        const qualities = newQualityArray.map((quality, index)=>{
            // let qualityInfo; 
            // switch(quality.quality) {
            //     case '1080':
            //         qualityInfo = 1080;
            //         break;
            //     case '1280':
            //         qualityInfo = 720;
            //       break;
            //     case '854':
            //         qualityInfo = 480;
            //       break;
            //     case '640':
            //         qualityInfo = 360;
            //       break;
            // }
            // console.log('quality.quality', quality.quality)
            return {
                    src: `${process.env.NEXT_PUBLIC_S3_VIDEO_URL}/${quality.url}`,
                    // src: `https://livestreamingmaria.s3.us-west-1.amazonaws.com/hls+streams/index.m3u8`,
                    // type: 'application/x-mpegURL',
                    type: 'video/mp4',
                    label: quality.quality,
                    res: quality.quality
                }
        })

        return qualities;
    }

    const handleEmojiOpen = () =>{
        setIsClickOnEmoji(!isClickOnEmoji);
    }

    const onEmojiClick = (emojiObject, event) => {
        setComment(
          (comment) =>
            comment + (emojiObject ? emojiObject.emoji : null)
        );
        setChosenEmoji(emojiObject);
    };

    // Adding comment in db
    useEffect(async () => {
        if(isAddedComment) {
            let commentData= {
                text: comment,
                userId: userDetail._id,
                videoId: videoId
            }

            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create/comment`, commentData, {headers: {'x-access-token': userDetail.jwtToken}
            }).then((result)=>{
                
                let commentWithUserDetail = {
                    ...result.data.comment,
                    userDetail: [userDetail]
                }
                let newCommentList = [...commentList, commentWithUserDetail];

                setCommentList(newCommentList);
                setComment("");
                const commentSection = commentSectionRef.current;
                
                if (commentSection) {
                    commentSection.scrollTop = commentSection.scrollHeight - commentSection.clientHeight;
                }
                setIsAddedComment(false)
            })
        }
    }, [isAddedComment])

    // Updating comment in db
    useEffect(async ()=>{
        if(isUpdatingCommentInDB) {

            axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update/comment/${editCommentDetails._id}`, {text: comment}, {headers: {'x-access-token': userDetail.jwtToken}})
                .then((response) => {
                    console.log("comment updarte response", response);
                    
                    const updatedCommentList = commentList.map(item =>
                        item._id === editCommentDetails._id ? { ...item, text: comment } : item
                    );

                    setCommentList(updatedCommentList);
                    setComment('');
                    setIsUpdatingCommentInDB(false);
                    setIsEditingComment(false);
                    setEditCommentDetails('')
                })
                .catch((error) => {
                    // Handle errors
                    console.log("comment updarte error", error);
                })

        }
    }, [isUpdatingCommentInDB]);
    
    useEffect(async ()=>{
        if(isDeletingComment) {

            axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete/comment/${deleteCommentId}`, {headers: {'x-access-token': userDetail.jwtToken}})
                .then((response) => {
                    console.log("comment updarte response", response);

                    const filteredItems = commentList.filter(item => item._id !== deleteCommentId);

                    setCommentList(filteredItems);
                    setIsDeletingComment(false);
                    setOpen(false);
                })
                .catch((error) => {
                    // Handle errors
                    console.log("comment updarte error", error);
                })

        }
    }, [isDeletingComment]);

    const handleWriteComment = () =>{
        setIsAddedComment(true)
    }
    
    const toggleToolTipClick = (index) => {
        setOpenToolTip(openToolTip === index ? null : index);
    };

    const handleCommentDelete = (commentData, index) =>{
        console.log("comment deleted")
        setDeleteCommentId(commentData._id);
        setOpenToolTip(openToolTip === index ? null : index);
        setOpen(true);
    }
    const handleCommentEdit = (commentData, index) =>{
        console.log("comment edit", commentData)
        setIsEditingComment(true);
        setComment(commentData.text);
        setOpenToolTip(openToolTip === index ? null : index);
        setEditCommentDetails(commentData);
    }

    const handleCommentEditCancel = () =>{
        setOpenToolTip(null);
        setIsEditingComment(false);
        setComment('');
    }

    const handleCommentUpdate = () =>{
        setIsUpdatingCommentInDB(true)
    }


    const handleClose = () => {
        setOpen(false);
        setDeleteCommentId('')
    };

    const handleConfirmDelete= () =>{
        setIsDeletingComment(true);
        setDisableDeleteBtn(true);
    }

    const handleBoxClick = (subscriptionDetail, boxNumber) => {
        console.log('subscriptionDetail boxNumber', subscriptionDetail);
        setSelectedBox(boxNumber);
    };

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
                                <Box component="main" sx={{ flexGrow: 1, marginTop: '91px', width: '100%', marginBottom: "30px"  }}>
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
                                                // videoDetails.videoPreviewStatus != 'private' ?
                                                (
                                                    !isPrivateVideo ?
                                                        (
                                                            <VideoJS options = {{
                                                                playbackRates: [0.5, 1, 1.25, 1.5, 2],
                                                                autoplay: false,
                                                                controls: true,
                                                                responsive: true,
                                                                fluid: true,
                                                                poster: videoDetails.videoPreviewImage?`https://livestreamingmaria.s3.us-west-1.amazonaws.com/images/${videoDetails.videoPreviewImage}`: `https://dummyimage.com/740x415/000/fff`,
                                                                className: 'video-page-player',
                                                                // fill: true,
                                                                controlBar: {
                                                                children: [
                                                                    "playToggle",
                                                                    "progressControl",
                                                                    "volumePanel",
                                                                    "qualitySelector",
                                                                    "fullscreenToggle"
                                                                ]
                                                                },
                                                                sources: showQualityUrl(videoDetails.videoQualityUrl)
                                                            } }
                                                            onReady={(player)=>handlePlayerReady(player, isChannelSubscribed, videoDetails)} />
                                                        )
                                                    :
                                                        <>
                                                            <Box sx={{filter: 'blur(5px)'}}>
                                                                <VideoJS  options={{
                                                                    autoplay: false,
                                                                    controls: true,
                                                                    responsive: true,
                                                                    fluid: true,
                                                                    poster: videoDetails.videoPreviewImage?`https://livestreamingmaria.s3.us-west-1.amazonaws.com/images/${videoDetails.videoPreviewImage}`: `https://dummyimage.com/740x415/000/fff`,
                                                                    className: 'video-page-player',
                                                                    sources: [{src: ``}]
                                                                }} />
                                                            </Box>
                                                            <Box sx={{ position: 'absolute', top: '50%', right: '45%', textAlign: 'center'}}>
                                                                <LockIcon fontSize="large"/>
                                                                <Typography variant="h4" component='h4' >This is private video...!!</Typography>
                                                            </Box>
                                                        </>
                                                )
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
                                            margin: '20px 0px'
                                        }}
                                    >
                                        <Item sx={{ border: '0px', boxShadow: 'none', backgroundColor: 'transparent !important' }}>
                                            <Typography variant="body1" component={'div'} sx={{ display: 'flex', alignItems: 'start' }}>
                                                <Typography variant="body1" component={'div'} sx={{position: "relative"}}>
                                                    {channelDetails?<Avatar alt={channelDetails.channelName} src={`${process.env.NEXT_PUBLIC_S3_URL}/${channelDetails.channelPicture}`} style={{ borderRadius: '100%', height: '65px', width: '65px', margin: '0px 12px 10px 18px', border: currentBroadcastVideo? "2px solid red": null }} width="500" height="600"></Avatar>: <Avatar alt={channelDetails.channelName} style={{ borderRadius: '100%', height: '65px', width: '65px', margin: '0px 12px 10px 18px', background: 'aliceblue' }}></Avatar>}
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
                                                        lastBroadcastVideo &&
                                                        <Typography variant="h5" component={"h5"} sx={{fontSize:'15px', textAlign: 'left', marginTop: '5px' }}>
                                                            {/* {videoPageInfo.singleVideo.views} viewers */}
                                                            {getHoursDiffBetweenDates(lastBroadcastVideo.createdAt)}
                                                        </Typography>}
                                                    </Typography>
                                                    {isChannelSubscribed ?
                                                        (`${isChannelSubscribed.isActive}` == 'true' ?
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
                                                                    
                                                                    currentChannelActivePlan.length > 0 && currentChannelActivePlan[0].isPaid ? 
                                                                        // <Button onClick={()=>{handleSubscribeChannel(true); setOpenBuySubscription(true)}} variant="contained" startIcon={<StarBorderIcon />} sx={{ fontWeight: 400, fontSize: '12px', backgroundColor: 'grey', padding: '8px 30px', borderRadius: '5px' }}>Subscribe</Button>
                                                                        <Button onClick={()=>{handleSubscribeChannel(true); setOpenBuySubscription(true);}} variant="contained" startIcon={<StarBorderIcon />} sx={{ fontWeight: 400, fontSize: '12px', backgroundColor: 'grey', padding: '8px 30px', borderRadius: '5px', marginLeft: '20px'  }}>Subscribe</Button>
                                                                    : 
                                                                        <Button onClick={()=>{setOpenBuySubscription(true)}} variant="contained" startIcon={<StarBorderIcon />} sx={{ fontWeight: 400, fontSize: '12px', backgroundColor: 'grey', padding: '8px 30px', borderRadius: '5px' }}>Subscribe</Button>
                                                                
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
                                    <Divider></Divider>
                                    <Box sx={{ padding: "30px 20px" }}>
                                            <Typography variant="h4" component={"h4"} mb="10px">
                                                Comments 
                                            </Typography>
                                        <Box style={{padding: "10px 15px"}} >

                                            <Box ref={commentSectionRef} className={classes.scrollableContent} >
                                                {
                                                    commentList.length > 0 ? 
                                                        commentList.map((commentInfo, index)=>(
                                                            userDetail._id == commentInfo.userDetail[0]._id ?
                                                                // <>
                                                                //     <Typography variant="body1" component="div" sx={{ paddingBottom: '10px', display: "flex", justifyContent: "end" }}>
                                                                //         <Box style={{ lineHeight: "0.5", margin: "0px 15px" }}>
                                                                //             <h3 style={{ color: 'rgb(180, 38, 38)', fontSize: '15px', marginTop: "1px", textAlign: "right" }}>{commentInfo.userDetail[0].username}</h3>
                                                                //             <h3 style={{ fontWeight: 'normal', lineHeight: 1, textAlign: "justify", marginLeft: "3%"}}> {commentInfo.text}</h3>
                                                                //         </Box>
                                                                //         <img style={{verticalAlign:'middle', height:'3.0em', fontSize: '12px', borderRadius: "50%"}} src={`${process.env.NEXT_PUBLIC_S3_URL}/${commentInfo.userDetail[0].profilePicture}`} alt="profile"/>
                                                                //     </Typography>
                                                                // </>
                                                                <>
                                                                    <Typography variant="body1" component="div" sx={{display: "flex", background: "#ffffff14", marginBottom: "10px", padding: "7px 0px 7px 9px" }}>
                                                                        
                                                                        <img style={{verticalAlign:'middle', height:'3.0em', fontSize: '12px', borderRadius: "50%", marginTop: "6px"}} src={`${process.env.NEXT_PUBLIC_S3_URL}/${commentInfo.userDetail[0].profilePicture}`} alt="profile"/>
                                                                        <Box style={{ lineHeight: "0.5", margin: "0px 15px" }}>
                                                                            <Box sx={{display: "flex"}}>
                                                                                {/* <Typography variant="h3" component="h3" style={{ color: '#fff', fontSize: '15px', marginTop: "1px", marginBottom: "6px" }}>{commentInfo.userDetail[0].username}</Typography> */}
                                                                                <Typography variant="h3" component="h3" style={{ color: '#fff', fontSize: '15px', marginTop: "1px", marginBottom: "6px" }}>You</Typography>
                                                                                <Tooltip
                                                                                    title={
                                                                                        <React.Fragment>
                                                                                            <Box sx={{display: "flex"}}>
                                                                                                <Box sx={{ marginRight: "15px", cursor: "pointer"}} onClick={()=>{handleCommentDelete(commentInfo, index)}}>
                                                                                                    <DeleteOutlineIcon />
                                                                                                </Box>
                                                                                                <Box sx={{cursor: "pointer"}} onClick={()=>{handleCommentEdit(commentInfo, index)}}>
                                                                                                    <EditOutlinedIcon />
                                                                                                </Box>
                                                                                            </Box>
                                                                                        </React.Fragment>
                                                                                    }
                                                                                    onClose={()=>{toggleToolTipClick(null)}}
                                                                                    open={openToolTip === index}
                                                                                    placement="right-start"
                                                                                    pointer
                                                                                    PopperProps={{
                                                                                        disablePortal: true
                                                                                    }}
                                                                                    disableFocusListener
                                                                                    disableHoverListener
                                                                                    disableTouchListener
                                                                                >
                                                                                        {/* <Button variant="contained" startIcon={ <MoreVertIcon sx={{height: "0.8em", cursor: "pointer"}}/> } sx={{ fontWeight: 400, fontSize: '12px', backgroundColor: 'grey', padding: '8px 30px', borderRadius: '5px', marginLeft: '20px'  }}>Subscribe</Button> */}
                                                                                        <MoreVertIcon sx={{height: "0.8em", cursor: "pointer"}} onClick={()=>{toggleToolTipClick(index)}}/>
                                                                                </Tooltip>
                                                                            </Box>
                                                                            <h3 style={{ fontWeight: 'normal', lineHeight: 1, marginTop: "1px", marginBottom: "6px"}}> {commentInfo.text}</h3>
                                                                        </Box>
                                                                    </Typography>
                                                                </>
                                                            :
                                                                <>
                                                                    <Typography variant="body1" component="div" sx={{ display: "flex", marginBottom: "10px", padding: "7px 0px 7px 9px"}}>
                                                                        
                                                                        <img style={{verticalAlign:'middle', height:'3.0em', fontSize: '12px', borderRadius: "50%", marginTop: "6px"}} src={`${process.env.NEXT_PUBLIC_S3_URL}/${commentInfo.userDetail[0].profilePicture}`} alt="profile"/>
                                                                        <Box style={{ lineHeight: "0.5", margin: "0px 15px" }}>
                                                                            <Box sx={{display: "flex"}}>
                                                                                <Typography variant="h3" component="h3" style={{ color: '#fff', fontSize: '15px', marginTop: "1px", marginBottom: "6px" }}>{commentInfo.userDetail[0].username}</Typography>
                                                                                {/* <MoreVertIcon sx={{height: "0.8em", cursor: "pointer"}} /> */}
                                                                            </Box>
                                                                            {/* <h3 style={{ color: 'rgb(180, 38, 38)', fontSize: '15px', marginTop: "1px", marginBottom: "6px" }}>{commentInfo.userDetail[0].username}</h3> */}
                                                                            <h3 style={{ fontWeight: 'normal', lineHeight: 1, marginTop: "1px", marginBottom: "6px"}}> {commentInfo.text}</h3>
                                                                            
                                                                        </Box>
                                                                    </Typography>
                                                                </>
                                                        ))
                                                    :
                                                        <Typography variant="h3" component={"h3"} sx={{textAlign: "center", padding: "50px"}}>
                                                            No comment found
                                                        </Typography>
                                                }
                                                
                                            </Box>
                                            <Box>
                                                <Typography variant="body1" component="div" sx={{ bottom: 0, width: '100%' }}>
                                                    {/* <Typography>{chosenEmoji.emoji}</Typography> */}
                                                    {/* {chosenEmoji ? <Emoji unified={chosenEmoji.unified} size={77} /> : null} */}
                                                    { isClickOnEmoji && <EmojiPicker width={325} height={450} onEmojiClick={onEmojiClick}/> }
                                                    <TextField value={comment} onChange={(e) => setComment(e.target.value)} multiline placeholder="Write a Comment Here" sx={{width: "100%"}} rows={2} InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <InsertEmoticonIcon onClick={handleEmojiOpen}/>
                                                            </InputAdornment>
                                                        )
                                                    }}/>

                                                    {   isEditingComment ? 
                                                            <Box>
                                                                <Button style={commentUpdateButton} onClick={handleCommentUpdate}>Update</Button>
                                                                <Button style={cmtUpdateCancelButton} onClick={handleCommentEditCancel}>Cancel</Button>
                                                            </Box>
                                                        :
                                                            <Button style={commentButton} onClick={handleWriteComment}>Comment</Button>
                                                    }
                                                    {/* <Box>
                                                    <Typography variant="body1" component="div" onClick={handleEmojiOpen}>
                                                        <InsertEmoticonIcon />
                                                    </Typography>
                                                    </Box> */}
                                                </Typography>
                                            </Box>
                                        </Box>
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
                                <Box sx={{mt: '90px', position: 'sticky'}}>
                                    <LiveStreamChatHistory oldReceivedMessages={oldReceivedMessages}/>
                                </Box>
                            </>
                        : 
                            <>    
                                {isVideoNotFound && <Box mt={'100px'} sx={{textAlign: 'center', width: '100%', padding: '15%'}}>
                                    <Typography variant="h3" component={'h3'}>
                                        Video Not Found ...!!!
                                    </Typography>
                                </Box>}
                                {isBlockedChannel && <Box mt={'100px'} sx={{textAlign: 'center', width: '100%', padding: '15%'}}>
                                    <Typography variant="h3" component={'h3'}>
                                        Video is not available because this channel is blocked ...!!!
                                    </Typography>
                                </Box>}
                                {isStatusPendingChannel && <Box mt={'100px'} sx={{textAlign: 'center', width: '100%', padding: '15%'}}>
                                    <Typography variant="h3" component={'h3'}>
                                        {/* Video is not available because this channel is in process ...!!! */}
                                        Currently videos of this channel is not available.
                                    </Typography>
                                </Box>}
                            </>
                        }
                    </>
                }
            </Box>
            {/* } */}
            
            
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Delete Comment"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure, you want to delete comment
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} autoFocus disabled={disableDeleteBtn}>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openBuySubscription}
                onClose={()=>setOpenBuySubscription(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth={true}
                maxWidth={'sm'}
            >
                <DialogTitle id="alert-dialog-title">
                    {"Subscribe channel"}
                </DialogTitle>
                <DialogContent sx={{paddingTop: "20px !important"}}>
                    {
                        currentChannelActivePlan.length > 0 && currentChannelActivePlan[0].isPaid ? 
                            <Typography variant="div" component={'div'} className={classes.container} >
                                {channelPlanList.map((box, index) => (
                                    <Box
                                        key={box.id}
                                        className={`${classes.box} ${selectedBox === index ? classes.selectedBox : ''}`}
                                        onClick={() => handleBoxClick(box, index)}
                                    >
                                        <Typography variant="h4" component="h4">{`${box.planDuration} ${box.planDurationUnit}`}</Typography>
                                        <Typography variant="h5" component="h5" sx={{fontWeight: 400, marginTop: '8px'}}>{`$${box.price}/${box.planDurationUnit}`}</Typography>
                                    </Box>
                                ))}
                            </Typography>
                        :
                            <Typography variant="div" component={'div'} className={classes.container} >
                                <Typography variant="h4" component={'h4'} className={classes.container} >Currently this channel subscription is free for everyone</Typography>
                            </Typography>
                    }
                </DialogContent>
                <DialogActions>
                    {
                        currentChannelActivePlan.length > 0 && currentChannelActivePlan[0].isPaid ? 
                            <>        
                                <Button onClick={()=>setOpenBuySubscription(false)}>Cancel</Button>
                                <Button autoFocus>
                                    Buy
                                </Button>
                            </>
                        : 
                            <Button onClick={()=>setOpenBuySubscription(false)}>Cancel</Button>
                    }
                </DialogActions>
            </Dialog>
                
        </>
    )
}