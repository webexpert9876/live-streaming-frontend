import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Container, Link, ListItemText, CardMedia, Divider, Box, Button } from '@mui/material';
import { useRouter } from 'next/router';

const recommendedStyle = {
    display: 'grid',
    gridTemplateColumns: 'auto auto auto auto auto',
    gap: '15px',
};

const LiveStreamingSkeletonItem = () => {
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
            sx={{ maxWidth: 325 }}
        >
            <Skeleton
                className='br100 listChannelIconSize'
                style={{ width: "280px", borderRadius: "10px" }}
                height={140}
            />
            <Divider /><br />
            <Grid item ml={"15px"} style={{ width: "100%", paddingTop: "10px" }}>
                <Box style={{ float: "left", paddingRight: "15px" }}>
                    <Skeleton height={45} width={45} style={{ borderRadius: "100px" }} />
                </Box>
                <ListItemText sx={{ display: 'block' }} style={{ position: "relative", float: "left" }}>

                    <div className='channelListChannelName'>
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

const LiveStreamings = ({ liveStreamings }) => {
    const [showCount, setShowCount] = useState(5);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();    

    const handleShowMore = () => {
        setShowCount((prevCount) => prevCount + 5);
    };

    useEffect(() => {
        // Simulate a delay to show the skeleton animation
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, []);

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
            <Container style={{ width: "100%", maxWidth: "100%", marginTop: "70px" }}>
                <h2><Link
                // href="#"
                onClick={()=> router.push(`/live/channels`)}
                style={{cursor: "pointer"}}                
                >Live channels</Link> we think you’ll like</h2>        
                {isLoading ? (

                    <Grid sx={recommendedStyle} className='desktop5'>
                        {/* Skeleton loading animation */}
                        {Array.from({ length: 5 }).map((_, index) => (
                            <LiveStreamingSkeletonItem key={index} />
                        ))}
                    </Grid>

                ) : (
                    <Grid sx={recommendedStyle} className='desktop5'>
                        {liveStreamings.slice(0, showCount).map((channel) => (
                            <Grid item xs={12} sm={6} md={4} key={channel._id}>
                                <Card sx={{ maxWidth: 345 }}>
                                    <div style={{ position: 'relative' }}>
                                        <CardMedia
                                            sx={{ height: 140 }}
                                            image={`${process.env.NEXT_PUBLIC_S3_URL}/${channel.videoPoster}`}
                                            title={channel.channelDetails[0].channelName}
                                        />
                                        <div className='liveViewCount'>
                                            {/* {channel.viewers} viewers */}
                                            {channel.viewers? countLiveViewing(channel.viewers): 0} viewers
                                        </div>
                                    </div>
                                    <Grid container direction="row" alignItems="center" mt={"15px"} ml={"15px"} pb={"15px"} style={{ display: "flex", alignItems: "flex-start" }} >
                                        <Grid item>
                                            <img src={`${process.env.NEXT_PUBLIC_S3_URL}/${channel.channelDetails[0].channelPicture}`} className='br100 listChannelIconSize' />
                                        </Grid>
                                        <Grid item ml={"15px"} style={{ width: "75%" }}>
                                            <Typography gutterBottom variant="h5" component="div">
                                                <Link 
                                                // href={`/channel/${channel.channelDetails[0].urlSlug}`}
                                                onClick={()=> router.push(`/channel/${channel.channelDetails[0].urlSlug}`)}
                                                style={{cursor: "pointer"}}
                                                color={'white'}>{channel.description}</Link>
                                            </Typography>
                                            <Typography gutterBottom variant="p" component="div">
                                                <Link 
                                                // href={`/channel/${channel.channelDetails[0].urlSlug}`}
                                                onClick={()=> router.push(`/channel/${channel.channelDetails[0].urlSlug}`)}
                                                style={{cursor: "pointer"}}
                                                color={'#999'}>{channel.channelDetails[0].channelName}</Link>
                                            </Typography>
                                            <Typography gutterBottom variant="p" component="div">
                                                <Link 
                                                // href={`/single-category/${channel.tattooCategoryDetails[0].urlSlug}`}
                                                onClick={()=> router.push(`/single-category/${channel.tattooCategoryDetails[0].urlSlug}`)}
                                                style={{cursor: "pointer"}}
                                                color={'#999'}>{channel.tattooCategoryDetails[0].title}</Link>
                                            </Typography>
                                            {channel.tags && channel.tags ? <ul className='videoTags'>
                                                {channel.tags && channel.tags.map((tag) => (
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
                        {/* Skeleton loading animation */}
                        {/* {Array.from({ length: 5 }).map((_, index) => (
                            <LiveStreamingSkeletonItem key={index} />
                        ))} */}
                    </Grid>
                )}
                {showCount < liveStreamings.length && (
                    <div className='showAllItemHr'>
                        <Button variant="contained" color="primary" onClick={handleShowMore}>Show More</Button>
                    </div>
                )}
            </Container>
            {/* <LiveStreamingSkeletonItem /> */}
        </>
    );
};

export default LiveStreamings;
