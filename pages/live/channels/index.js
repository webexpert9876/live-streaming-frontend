import { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Container, Grid, Link, ListItemText, Card, CardMedia, Typography, Box, CardHeader, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import client from "../../../graphql";
import { gql } from "@apollo/client";
import LeftMenu from '../../../src/content/Overview/LeftMenu/index';
import CircularProgress from '@mui/material/CircularProgress';

const recommendedStyle = {
    display: 'grid',
    gridTemplateColumns: 'auto auto auto auto auto auto',
    gap: '15px'
}
const Styledesktop10 = {
    display: 'grid',
    gridTemplateColumns: 'auto auto auto auto auto auto',
    gap: '10px'
}

const LiveStreamItemSkeletonItem = () => {

    return (
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
            <Skeleton
                    className='br100 listLiveStreamIconSize'
                    style={{ width: "225px", borderRadius: "10px" }}
                    height={140}
                />
            <Grid item>
                <Skeleton
                    className='br100 listLiveStreamIconSize'
                    style={{ width: "30px" }}
                    height={30}
                />
            </Grid>
            <Grid item ml={"15px"} style={{ width: "74%" }}>
                <ListItemText sx={{ display: 'block' }} style={{ position: "relative" }}>
                    <div className='liveStreamList'>
                        <Skeleton height={16} width={100} />
                    </div>
                    <Skeleton height={16} width={100} />
                    <span className="tooltiptext" style={{ textAlign: "left", padding: "10px" }}>
                        <Skeleton height={16} width={100} />
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        
                        <Skeleton height={16} width={50} />
                    </div>
                </ListItemText>
            </Grid>
        </Grid>
    );
};

function LiveStreamList(props) {
    const [liveStreamList, setLiveStreamList] = useState([]);
    const [fetchliveStreamList, setFetchLiveStreamList] = useState(false);
    const [fetchMoreLiveStreamList, setFetchMoreLiveStreamList] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isPageLoading, setIsPageLoading]= useState(true);
    const [liveStreamShowSize, setLiveStreamShowSize]= useState(5);
    const [totalLiveStream, setTotalLiveStream]= useState(0);
    const router = useRouter();

    useEffect(()=>{
        setFetchLiveStreamList(true);
    }, [])

    useEffect(async () => {
        // Simulate a delay to show the skeleton animation
        if(fetchliveStreamList) {
            let liveStreamListInfo = await client.query({
                query: gql`
                    query Query ($skip: Int, $limit: Int) {
                        liveStreamWithCount(skip: $skip, limit: $limit) {
                            liveStream {
                              title
                              description
                              videoId
                              userId
                              tattooCategory
                              channelId
                              channelDetails {
                                _id
                                channelName
                                channelPicture
                                urlSlug
                              }
                              videoPoster
                              viewers
                              tags
                              tattooCategoryDetails {
                                title
                                urlSlug
                              }
                            }
                            totalLiveStream
                        }
                    }
                `,
                variables: {
                    "skip": 0,
                    "limit": 5
                }
            }).then((result) => {
                return result.data
            });
    
            setFetchLiveStreamList(false);
            setLiveStreamList(liveStreamListInfo.liveStreamWithCount[0].liveStream)
            setTotalLiveStream(liveStreamListInfo.liveStreamWithCount[0].totalLiveStream);

            setIsLoading(false);
            setIsPageLoading(false);
        }
    }, [fetchliveStreamList]);
    
    useEffect(async () => {
        // Simulate a delay to show the skeleton animation
        if(fetchMoreLiveStreamList) {
            let liveStreamListInfo = await client.query({
                query: gql`
                    query Query ($skip: Int, $limit: Int) {
                        liveStreamWithCount(skip: $skip, limit: $limit) {
                            liveStream {
                              title
                              description
                              videoId
                              userId
                              tattooCategory
                              channelId
                              channelDetails {
                                _id
                                channelName
                                channelPicture
                                urlSlug
                              }
                              videoPoster
                              viewers
                              tags
                              tattooCategoryDetails {
                                title
                                urlSlug
                              }
                            }
                            totalLiveStream
                        }
                    }
                `,
                variables: {
                    skip: liveStreamShowSize,
                    limit: 5
                }
            }).then((result) => {
                return result.data
            });
    
            setFetchMoreLiveStreamList(false);
            setLiveStreamShowSize((prevCount) => prevCount + 5);
            
            console.log("liveStreamListInfo", liveStreamListInfo);
            setLiveStreamList((prevState)=> [...prevState, ...liveStreamListInfo.liveStreamWithCount[0].liveStream])
            setTotalLiveStream(liveStreamListInfo.liveStreamWithCount[0].totalLiveStream);
        }
    }, [fetchMoreLiveStreamList]);



    const handleShowMore = () => {
        // setLiveStreamShowSize((prevCount) => prevCount + 5);
        setFetchMoreLiveStreamList(true);
    };

    return(
        <>
            <Box sx={{ display: 'flex', marginTop: "110px" }}>
                <LeftMenu />
                {isPageLoading?
                    <Box sx={{textAlign: 'center', width: '100%', padding: '15%'}}>
                        <CircularProgress />
                        <Typography>
                            Loading...
                        </Typography>
                    </Box>
                :
                    <Container style={{ width: "100%", maxWidth: "100%", marginBottom: '50px' }}>
                        {/* <Card sx={{marginBottom: '20px'}}>
                            <CardHeader title={<Typography variant="h2" component={'h2'} sx={{color: '#8C7CF0'}}>Tattoo Categories</Typography>}>
                            </CardHeader>
                        </Card> */}
                        {/* <Typography sx={{fontSize: '50px !important', color: '#8162d2', fontWeight: 800}} mb={2}>Tattoo Categories</Typography> */}
                            <Box mb={4}>
                                <img width={'100%'} src='https://placehold.co/1784x250'/>
                            </Box>
                            <Typography mb={2} component={'h3'} variant={'h3'}>All Live Streams</Typography>
                        {isLoading ? (
                            <Grid sx={recommendedStyle} className='desktop5'>
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <LiveStreamItemSkeletonItem key={index} />
                                ))}
                            </Grid>
                        ) : (
                            liveStreamList.length > 0 ?<Grid sx={recommendedStyle} className='desktop5'>
                                {liveStreamList.map((liveStream) => (
                                    <Grid item xs={12} sm={10} md={4} key={liveStream._id}>
                                        <Card sx={{ maxWidth: 290 }} style={{ position: 'relative' }}>
                                            <div style={{ position: 'relative' }}>
                                                <CardMedia
                                                    sx={{ height: 250 }}
                                                    image={`https://livestreamingmaria.s3.us-west-1.amazonaws.com/images/${liveStream.videoPoster}`}
                                                />

                                            </div>
                                           
                                            <Grid container direction="row" alignItems="center" mt={"15px"} ml={"15px"} pb={"15px"} style={{ display: "flex", alignItems: "flex-start" }} >
                                                <Grid item>
                                                    <img src={`${process.env.NEXT_PUBLIC_S3_URL}/${liveStream.channelDetails[0].channelPicture}`} className='br100 listChannelIconSize' />
                                                </Grid>
                                                <Grid item ml={"15px"} style={{ width: "75%" }}>
                                                    <Typography gutterBottom variant="h5" component="div">
                                                        <Link 
                                                        onClick={()=> router.push(`/channel/${liveStream.channelDetails[0].urlSlug}`)}
                                                        style={{cursor: "pointer"}}
                                                        color={'white'}>{liveStream.title}</Link>
                                                    </Typography>
                                                    <Typography gutterBottom variant="p" component="div">
                                                        <Link 
                                                        onClick={()=> router.push(`/channel/${liveStream.channelDetails[0].urlSlug}`)}
                                                        style={{cursor: "pointer"}}
                                                        color={'#999'}>{liveStream.channelDetails[0].channelName}</Link>
                                                    </Typography>
                                                    <Typography gutterBottom variant="p" component="div">
                                                        <Link 
                                                        onClick={()=> router.push(`/single-category/${liveStream.tattooCategoryDetails[0].urlSlug}`)}
                                                        style={{cursor: "pointer"}}
                                                        color={'#999'}>{liveStream.tattooCategoryDetails[0].title}</Link>
                                                    </Typography>
                                                    {liveStream.tags ? <ul className='videoTags'>
                                                        { liveStream.tags.map((tag) => (
                                                            <li key={tag}>
                                                                <Link 
                                                                // href={`/tags/`}
                                                                onClick={()=> router.push(`/tag/${tag}`)}
                                                                style={{cursor: "pointer"}} 
                                                                >{tag}</Link>
                                                            </li>
                                                        ))} </ul> : null
                                                    }
                                                </Grid>
                                            </Grid>
                                        </Card>
                                    </Grid>
                                    
                                ))}
                            </Grid>:<div>
                                    No Live Stream Found
                                </div>
                        )}
                        {/* {liveStreamShowSize < liveStreamList.length ? ( */}
                        { liveStreamShowSize < totalLiveStream && (
                            <div className='showAllItemHr'>
                                <Button variant="contained" color="primary" onClick={handleShowMore}>Show More</Button>
                            </div>)
                        }
                    </Container>
                }
            </Box>
        </>
    )
}
  
export default LiveStreamList;
