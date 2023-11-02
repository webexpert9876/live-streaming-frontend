import { useState, useEffect } from "react";
import client from "../../../graphql";
import Head from 'next/head';
import { gql } from "@apollo/client";
import { useRouter } from "next/router";
import Paper from '@mui/material/Paper';
import { Box, Grid, Link, Typography, Container, Button, Card,CardHeader, CardMedia, Divider  } from "@mui/material";
import React from 'react';
import { setAuthUser, setAuthState, selectAuthState, selectAuthUser } from '../../../store/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import SidebarLayout from 'src/layouts/SidebarLayout';
import Footer from 'src/components/Footer';
import { format, isToday, isYesterday } from 'date-fns';

const historyShowLimit = 18;

function WatchHistory(){
    let userDetails = useSelector(selectAuthUser);
    let userIsLogedIn = useSelector(selectAuthState);
    const [isFetched, setIsFetched]=useState(false);
    const [userDetail, setUserDetail] = useState([]);
    const [videoHistoryList, setVideoHistoryList] = useState([]);
    const [totalVideoHistoryListCount, setTotalVideoHistoryListCount] = useState(0);
    const [showWatchHistoryCount, setShowWatchHistoryCount] = useState(historyShowLimit);
    const [isShowMoreHistory, setIsShowMoreHistory ] = useState(false);
    const [todayVideoHistoryList, setTodayVideoHistoryList ] = useState([]);
    const [yesterdayVideoHistoryList, setYesterdayVideoHistoryList ] = useState([]);
    const [oldVideoHistoryList, setOldVideoHistoryList ] = useState([]);
    const router = useRouter();

    useEffect(()=>{
        console.log('in useEffect running check', userDetails)
        if(userDetails && userIsLogedIn){
            setIsFetched(true);
        }
    },[userDetails]);

    useEffect(()=>{
        console.log('in useEffect running')
        if(isFetched){
            console.log('in useEffect', userDetails)
            console.log('isFetched', isFetched)
          client.query({
              query: gql`
              query Query($usersId: ID, $videoUserId2: String!, $limit: Int, $skip: Int, $countVideoHistoriesUserId2: String!) {
                users(id: $usersId) {
                  _id
                  firstName
                  lastName
                  username
                  email
                  profilePicture
                  urlSlug
                  jwtToken
                  role
                  channelId
                }
                videoHistories(userId: $videoUserId2, limit: $limit, skip: $skip) {
                    _id
                    videoId
                    videoDetails {
                        title
                        _id
                        videoPreviewImage
                        views
                        tags
                        description
                        channelDetails {
                            channelName
                            channelPicture
                            urlSlug
                        }
                        createdAt
                    }
                    createdAt
                }
                countVideoHistories(userId: $countVideoHistoriesUserId2) {
                    videoHistoryCount
                }
              }
          `,
              variables: {
                "videoUserId2": userDetails._id,
                "usersId": userDetails._id,
                "countVideoHistoriesUserId2": userDetails._id,
                "limit": historyShowLimit,
                "skip": 0
              }
          }).then((result) => {
              console.log('subscription detail', result.data);
              setIsFetched(false);
              setUserDetail(result.data.users);
              setVideoHistoryList(result.data.videoHistories);
              filterVideoHistory(result.data.videoHistories)
              setTotalVideoHistoryListCount(result.data.countVideoHistories[0].videoHistoryCount);
              
              return result.data
          });
        }
    },[isFetched]);

    // useEffect(()=>{
    //     console.log('in useEffect running')
    //     if(userDetails && userIsLogedIn) {
    //         console.log('in useEffect', userDetails)
    //         console.log('isFetched', isFetched)
    //         if(!isFetched){
    //           client.query({
    //               query: gql`
    //               query Query($usersId: ID, $videoUserId2: String!, $limit: Int, $skip: Int, $countVideoHistoriesUserId2: String!) {
    //                 users(id: $usersId) {
    //                   _id
    //                   firstName
    //                   lastName
    //                   username
    //                   email
    //                   profilePicture
    //                   urlSlug
    //                   jwtToken
    //                   role
    //                   channelId
    //                 }
    //                 videoHistories(userId: $videoUserId2, limit: $limit, skip: $skip) {
    //                     _id
    //                     videoId
    //                     videoDetails {
    //                         title
    //                         _id
    //                         videoPreviewImage
    //                         views
    //                         tags
    //                         description
    //                         channelDetails {
    //                             channelName
    //                             channelPicture
    //                             urlSlug
    //                         }
    //                     }
    //                     createdAt
    //                 }
    //                 countVideoHistories(userId: $countVideoHistoriesUserId2) {
    //                     videoHistoryCount
    //                 }
    //               }
    //           `,
    //               variables: {
    //                 "videoUserId2": userDetails._id,
    //                 "usersId": userDetails._id,
    //                 "countVideoHistoriesUserId2": userDetails._id,
    //                 "limit": historyShowLimit,
    //                 "skip": 0
    //               }
    //           }).then((result) => {
    //               console.log('subscription detail', result.data);
    //               setUserDetail(result.data.users);
    //             //   setVideoHistoryList(result.data.videoHistories);
    //               filterVideoHistory(result.data.videoHistories)
    //               setIsFetched(true);
    //               setTotalVideoHistoryListCount(result.data.countVideoHistories[0].videoHistoryCount);
                  
    //               return result.data
    //           });
    //         }
    //       }
    // },[userDetails]);

    useEffect(()=>{
        if(isShowMoreHistory) {
            client.query({
                query: gql`
                query Query($videoUserId2: String!, $limit: Int, $skip: Int) {
                videoHistories(userId: $videoUserId2, limit: $limit, skip: $skip) {
                    _id
                    videoId
                    videoDetails {
                        title
                        _id
                        videoPreviewImage
                        views
                        tags
                        description
                        channelDetails {
                            channelName
                            channelPicture
                            urlSlug
                        }
                        createdAt
                    }
                    createdAt
                }
                }
            `,
                variables: {
                "videoUserId2": userDetails._id,
                "usersId": userDetails._id,
                "limit": totalVideoHistoryListCount,
                "skip": 0
                }
            }).then((result) => {
                console.log('subscription detail', result.data);
                setVideoHistoryList(result.data.videoHistories);
                filterVideoHistory(result.data.videoHistories)
                setShowWatchHistoryCount(result.data.videoHistories.length);
                setIsShowMoreHistory(false);
                
                return result.data
            });
        }
    },[isShowMoreHistory]);

    const filterVideoHistory = async (videoList)=>{
        console.log('type check run');
        let oldVideo=[];
        let todayVideo=[];
        let yesterdayVideo=[];
        for(let i=0; i<videoList.length; i++){
            let type = await DateLabel(videoList[i].createdAt);
            console.log('type', videoList[i]);
            console.log('type-----------', type);
            if( type == 'Today'){
                todayVideo.push(videoList[i]);
            } else if( type == 'Yesterday') {
                yesterdayVideo.push(videoList[i]);
            } else {
                oldVideo.push(videoList[i]);
            }
        }
        setTodayVideoHistoryList(todayVideo);
        setYesterdayVideoHistoryList(yesterdayVideo);
        setOldVideoHistoryList(oldVideo);
    }

    const handleHistoryShowCountAdd = ()=>{
        if(videoHistoryList.length < totalVideoHistoryListCount){
            setIsShowMoreHistory(true)
        } else {
            setShowWatchHistoryCount(totalVideoHistoryListCount)
        }
        
    }
      
    const handleSubscribedCountMinus = ()=>{
    let count = showWatchHistoryCount - 4
    if(historyShowLimit > count){
        count = historyShowLimit
    }
    setShowWatchHistoryCount(count)
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

    const liveDaysAgo = {
        borderLeft: "solid 1px #b1b1b1",
        marginLeft: "5px",
        paddingLeft: "5px"
    }

    const DateLabel = async (createdAt) => {
        const createdAtDate = new Date(parseInt(createdAt));
      
        let label = '';
      
        if (isToday(createdAtDate)) {
          label = 'Today';
        } else if (isYesterday(createdAtDate)) {
          label = 'Yesterday';
        } else {
          label = 'old';
        }
        return label
    };

    return(
        <>
            {userDetail.length > 0?<SidebarLayout userData={userDetail}>
                <Head>
                    <title>Watch History</title>
                </Head>
                <Container sx={{ mt: 3, mb:3 }} maxWidth="false">
                    <Card>
                        <CardHeader titleTypographyProps={{ fontSize: '25px !important' }} title="Watch History" />
                        <Divider />
                        {((todayVideoHistoryList.length != 0 || yesterdayVideoHistoryList.length != 0) || oldVideoHistoryList.length != 0) ? <>
                        <Box p={'5px 25px 25px 25px'}>
                            <Box sx={{ paddingTop: '5px' }}>
                                {todayVideoHistoryList.length != 0 && <>
                                    <Box sx={{ width: '100%', mb: '20px' }}>
                                        <Box mb='20px'>
                                            <Typography variant="h3" component='h3'>
                                                Today
                                            </Typography>
                                        </Box>
                                        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12, lg: 26 }}>
                                            {todayVideoHistoryList.map((videoInfo, index) => (
                                                <Grid item xs={12} sm={4} md={4} lg={6.5} key={index}>
                                                    <Card sx={{ width: '100%', margin: '0px 174px 0px 0px' }}>
                                                        <div style={{ position: 'relative' }}>
                                                            <CardMedia
                                                                sx={{ height: 140 }}
                                                                image={`${process.env.NEXT_PUBLIC_S3_URL}/${videoInfo.videoDetails[0].videoPreviewImage}`}
                                                            >

                                                            </CardMedia>
                                                            <Typography variant="body1" component="div" sx={{}}>
                                                                <div className='liveViewCount'>{countLiveViewing(videoInfo.videoDetails[0].views)} viewers
                                                                    <div style={liveDaysAgo}>{calculateDaysAgo(videoInfo.videoDetails[0].createdAt)}</div>
                                                                </div>
                                                            </Typography>
                                                        </div>
                                                        <Grid container direction="row" alignItems="center" mt={"15px"} ml={"15px;"} pb={"15px"} style={{ display: "flex", alignItems: "flex-start" }}>
                                                            <Grid item>
                                                                <img src={`${process.env.NEXT_PUBLIC_S3_URL}/${videoInfo.videoDetails[0].channelDetails[0].channelPicture}`} className='br100 listChannelIconSize' />
                                                            </Grid>
                                                            <Grid item ml={"15px"} style={{ width: "75%" }}>
                                                                <Typography gutterBottom variant="h5" component="div">
                                                                    <Link
                                                                        onClick={() => router.push(`/video/${videoInfo.videoDetails[0]._id}`)}
                                                                        color={'white'}>{videoInfo.videoDetails[0].description}</Link>
                                                                </Typography>
                                                                <Typography gutterBottom variant="p" component="div">
                                                                    <Link onClick={() => router.push(`/channel/${videoInfo.videoDetails[0].channelDetails[0].urlSlug}`)} color={'#999'}>{videoInfo.videoDetails[0].channelDetails[0].channelName}</Link>
                                                                </Typography>
                                                                {videoInfo.videoDetails[0].tags ? <ul className='videoTags'>
                                                                    {videoInfo.videoDetails[0].tags.map((tag, index) => (
                                                                        <li key={index}>
                                                                            <Link
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
                                    <Divider />
                                </>
                                }
                                {yesterdayVideoHistoryList.length != 0 && <>
                                    <Box sx={{ width: '100%', mb: '20px' }}>
                                        <Box mb='20px' mt='20px'>
                                            <Typography variant="h3" component='h3'>
                                                Yesterday
                                            </Typography>
                                        </Box>
                                        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12, lg: 26 }}>
                                            {yesterdayVideoHistoryList.map((videoInfo, index) => (
                                                <Grid item xs={12} sm={4} md={4} lg={6.5} key={index}>
                                                    <Card sx={{ width: '100%', margin: '0px 174px 0px 0px' }}>
                                                        <div style={{ position: 'relative' }}>
                                                            <CardMedia
                                                                sx={{ height: 140 }}
                                                                image={`${process.env.NEXT_PUBLIC_S3_URL}/${videoInfo.videoDetails[0].videoPreviewImage}`}
                                                            >

                                                            </CardMedia>
                                                            <Typography variant="body1" component="div" sx={{}}>
                                                                <div className='liveViewCount'>{countLiveViewing(videoInfo.videoDetails[0].views)} viewers
                                                                    <div style={liveDaysAgo}>{calculateDaysAgo(videoInfo.videoDetails[0].createdAt)}</div>
                                                                </div>
                                                            </Typography>
                                                        </div>
                                                        <Grid container direction="row" alignItems="center" mt={"15px"} ml={"15px;"} pb={"15px"} style={{ display: "flex", alignItems: "flex-start" }}>
                                                            <Grid item>
                                                                <img src={`${process.env.NEXT_PUBLIC_S3_URL}/${videoInfo.videoDetails[0].channelDetails[0].channelPicture}`} className='br100 listChannelIconSize' />
                                                            </Grid>
                                                            <Grid item ml={"15px"} style={{ width: "75%" }}>
                                                                <Typography gutterBottom variant="h5" component="div">
                                                                    <Link
                                                                        onClick={() => router.push(`/video/${videoInfo.videoDetails[0]._id}`)}
                                                                        color={'white'}>{videoInfo.videoDetails[0].description}</Link>
                                                                </Typography>
                                                                <Typography gutterBottom variant="p" component="div">
                                                                    <Link onClick={() => router.push(`/channel/${videoInfo.videoDetails[0].channelDetails[0].urlSlug}`)} color={'#999'}>{videoInfo.videoDetails[0].channelDetails[0].channelName}</Link>
                                                                </Typography>
                                                                {videoInfo.videoDetails[0].tags ? <ul className='videoTags'>
                                                                    {videoInfo.videoDetails[0].tags.map((tag, index) => (
                                                                        <li key={index}>
                                                                            <Link
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
                                    <Divider />
                                </>
                                }
                                {oldVideoHistoryList.length != 0 && <>
                                    <Box sx={{ width: '100%', mb: '20px' }}>
                                        <Box mt='20px' mb='20px'>
                                            <Typography variant="h3" component='h3'>
                                                Old
                                            </Typography>
                                        </Box>
                                        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12, lg: 26 }}>
                                            {oldVideoHistoryList.map((videoInfo, index) => (
                                                <Grid item xs={12} sm={4} md={4} lg={6.5} key={index}>
                                                    <Card sx={{ width: '100%', margin: '0px 174px 0px 0px' }}>
                                                        <div style={{ position: 'relative' }}>
                                                            <CardMedia
                                                                sx={{ height: 140 }}
                                                                image={`${process.env.NEXT_PUBLIC_S3_URL}/${videoInfo.videoDetails[0].videoPreviewImage}`}
                                                            >

                                                            </CardMedia>
                                                            <Typography variant="body1" component="div" sx={{}}>
                                                                <div className='liveViewCount'>{countLiveViewing(videoInfo.videoDetails[0].views)} viewers
                                                                    <div style={liveDaysAgo}>{calculateDaysAgo(videoInfo.videoDetails[0].createdAt)}</div>
                                                                </div>
                                                            </Typography>
                                                        </div>
                                                        <Grid container direction="row" alignItems="center" mt={"15px"} ml={"15px;"} pb={"15px"} style={{ display: "flex", alignItems: "flex-start" }}>
                                                            <Grid item>
                                                                <img src={`${process.env.NEXT_PUBLIC_S3_URL}/${videoInfo.videoDetails[0].channelDetails[0].channelPicture}`} className='br100 listChannelIconSize' />
                                                            </Grid>
                                                            <Grid item ml={"15px"} style={{ width: "75%" }}>
                                                                <Typography gutterBottom variant="h5" component="div">
                                                                    <Link
                                                                        onClick={() => router.push(`/video/${videoInfo.videoDetails[0]._id}`)}
                                                                        color={'white'}>{videoInfo.videoDetails[0].description}</Link>
                                                                </Typography>
                                                                <Typography gutterBottom variant="p" component="div">
                                                                    <Link onClick={() => router.push(`/channel/${videoInfo.videoDetails[0].channelDetails[0].urlSlug}`)} color={'#999'}>{videoInfo.videoDetails[0].channelDetails[0].channelName}</Link>
                                                                </Typography>
                                                                {videoInfo.videoDetails[0].tags ? <ul className='videoTags'>
                                                                    {videoInfo.videoDetails[0].tags.map((tag, index) => (
                                                                        <li key={index}>
                                                                            <Link
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
                                </>
                                }
                            </Box>
                        </Box>
                        {/* <Box sx={{ width: '100%', textAlign: 'center', mb: '10px'}}>
                            { totalVideoHistoryListCount > showWatchHistoryCount ? <Button sx={{mr: '10px'}} variant='contained' onClick={handleHistoryShowCountAdd}>View All</Button>: null}
                            {showWatchHistoryCount === historyShowLimit ? null: <Button variant='contained' onClick={()=>setShowWatchHistoryCount(historyShowLimit)}>View Less</Button>}
                        </Box> */}
                    </> : <Typography variant="body1" component={'div'} sx={{ textAlign: 'center', marginTop: '15px', padding: '100px' }}>No watch history found...!!</Typography>}
                    </Card>
                </Container>
            </SidebarLayout>:null}
        </>
    )
}

{/* <>
    {DateLabel(videoInfo.createdAt) == 'Today' && <>
            <Box>
                <Typography variant="h5" component='h5'>
                    Today
                </Typography>
            </Box>
            <Grid item xs={12} sm={4} md={4} lg={6.5} key={index}>
                <Card sx={{ width: '100%', margin: '0px 174px 0px 0px' }}>
                    <div style={{ position: 'relative' }}>
                        <CardMedia
                            sx={{ height: 140 }}
                            image={`${process.env.NEXT_PUBLIC_S3_URL}/${videoInfo.videoDetails[0].videoPreviewImage}`}
                        >

                        </CardMedia>
                        <Typography variant="body1" component="div" sx={{}}>
                            <div className='liveViewCount'>{countLiveViewing(videoInfo.videoDetails[0].views)} viewers
                                <div style={liveDaysAgo}>{calculateDaysAgo(videoInfo.createdAt)}</div>
                            </div>
                        </Typography>
                    </div>
                    <Grid container direction="row" alignItems="center" mt={"15px"} ml={"15px;"} pb={"15px"} style={{ display: "flex", alignItems: "flex-start" }}>
                        <Grid item>
                            <img src={`${process.env.NEXT_PUBLIC_S3_URL}/${videoInfo.videoDetails[0].channelDetails[0].channelPicture}`} className='br100 listChannelIconSize' />
                        </Grid>
                        <Grid item ml={"15px"} style={{ width: "75%" }}>
                            <Typography gutterBottom variant="h5" component="div">
                                <Link
                                    onClick={() => router.push(`/video/${videoInfo.videoDetails[0]._id}`)}
                                    color={'white'}>{videoInfo.videoDetails[0].description}</Link>
                            </Typography>
                            <Typography gutterBottom variant="p" component="div">
                                <Link onClick={() => router.push(`/channel/${videoInfo.videoDetails[0].channelDetails[0].urlSlug}`)} color={'#999'}>{videoInfo.videoDetails[0].channelDetails[0].channelName}</Link>
                            </Typography>
                            {videoInfo.videoDetails[0].tags ? <ul className='videoTags'>
                                {videoInfo.videoDetails[0].tags.map((tag, index) => (
                                    <li key={index}>
                                        <Link
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
        </>}
    {DateLabel(videoInfo.createdAt) == 'Yesterday' && <>
        <Box>
            <Typography variant="h5" component='h5'>
                Yesterday
            </Typography>
        </Box>
        <Grid item xs={12} sm={4} md={4} lg={6.5} key={index}>
            <Card sx={{ width: '100%', margin: '0px 174px 0px 0px' }}>
                <div style={{ position: 'relative' }}>
                    <CardMedia
                        sx={{ height: 140 }}
                        image={`${process.env.NEXT_PUBLIC_S3_URL}/${videoInfo.videoDetails[0].videoPreviewImage}`}
                    >

                    </CardMedia>
                    <Typography variant="body1" component="div" sx={{}}>
                        <div className='liveViewCount'>{countLiveViewing(videoInfo.videoDetails[0].views)} viewers
                            <div style={liveDaysAgo}>{calculateDaysAgo(videoInfo.createdAt)}</div>
                        </div>
                    </Typography>
                </div>
                <Grid container direction="row" alignItems="center" mt={"15px"} ml={"15px;"} pb={"15px"} style={{ display: "flex", alignItems: "flex-start" }}>
                    <Grid item>
                        <img src={`${process.env.NEXT_PUBLIC_S3_URL}/${videoInfo.videoDetails[0].channelDetails[0].channelPicture}`} className='br100 listChannelIconSize' />
                    </Grid>
                    <Grid item ml={"15px"} style={{ width: "75%" }}>
                        <Typography gutterBottom variant="h5" component="div">
                            <Link
                                onClick={() => router.push(`/video/${videoInfo.videoDetails[0]._id}`)}
                                color={'white'}>{videoInfo.videoDetails[0].description}</Link>
                        </Typography>
                        <Typography gutterBottom variant="p" component="div">
                            <Link onClick={() => router.push(`/channel/${videoInfo.videoDetails[0].channelDetails[0].urlSlug}`)} color={'#999'}>{videoInfo.videoDetails[0].channelDetails[0].channelName}</Link>
                        </Typography>
                        {videoInfo.videoDetails[0].tags ? <ul className='videoTags'>
                            {videoInfo.videoDetails[0].tags.map((tag, index) => (
                                <li key={index}>
                                    <Link
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
    </>}

    {DateLabel(videoInfo.createdAt) == 'old' && <>
        <Box>
            <Typography variant="h5" component='h5'>
                Old
            </Typography>
        </Box>
        <Grid item xs={12} sm={4} md={4} lg={6.5} key={index}>
            <Card sx={{ width: '100%', margin: '0px 174px 0px 0px' }}>
                <div style={{ position: 'relative' }}>
                    <CardMedia
                        sx={{ height: 140 }}
                        image={`${process.env.NEXT_PUBLIC_S3_URL}/${videoInfo.videoDetails[0].videoPreviewImage}`}
                    >

                    </CardMedia>
                    <Typography variant="body1" component="div" sx={{}}>
                        <div className='liveViewCount'>{countLiveViewing(videoInfo.videoDetails[0].views)} viewers
                            <div style={liveDaysAgo}>{calculateDaysAgo(videoInfo.createdAt)}</div>
                        </div>
                    </Typography>
                </div>
                <Grid container direction="row" alignItems="center" mt={"15px"} ml={"15px;"} pb={"15px"} style={{ display: "flex", alignItems: "flex-start" }}>
                    <Grid item>
                        <img src={`${process.env.NEXT_PUBLIC_S3_URL}/${videoInfo.videoDetails[0].channelDetails[0].channelPicture}`} className='br100 listChannelIconSize' />
                    </Grid>
                    <Grid item ml={"15px"} style={{ width: "75%" }}>
                        <Typography gutterBottom variant="h5" component="div">
                            <Link
                                onClick={() => router.push(`/video/${videoInfo.videoDetails[0]._id}`)}
                                color={'white'}>{videoInfo.videoDetails[0].description}</Link>
                        </Typography>
                        <Typography gutterBottom variant="p" component="div">
                            <Link onClick={() => router.push(`/channel/${videoInfo.videoDetails[0].channelDetails[0].urlSlug}`)} color={'#999'}>{videoInfo.videoDetails[0].channelDetails[0].channelName}</Link>
                        </Typography>
                        {videoInfo.videoDetails[0].tags ? <ul className='videoTags'>
                            {videoInfo.videoDetails[0].tags.map((tag, index) => (
                                <li key={index}>
                                    <Link
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
    </>}
</> */}

export default WatchHistory;