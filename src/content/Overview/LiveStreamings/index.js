import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Container, Link, ListItemText, CardMedia } from '@mui/material';

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
        >
            <Grid item>
                <Skeleton
                    className='br100 listChannelIconSize'
                    style={{ width: "30px" }}
                    height={30}
                />
            </Grid>
            <Grid item ml={"15px"} style={{ width: "74%" }}>
                <ListItemText sx={{ display: 'block' }} style={{ position: "relative" }}>
                    <div className='channelListChannelName'>
                        <Skeleton height={16} width={100} />
                    </div>
                    <Skeleton height={16} width={100} />
                    <span className="tooltiptext" style={{ textAlign: "left", padding: "10px" }}>
                        <Skeleton height={16} width={100} />
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'red', marginRight: '4px' }} />
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

    const handleShowMore = () => {
        setShowCount((prevCount) => prevCount + 5);
    };

    useEffect(() => {
        // Simulate a delay to show the skeleton animation
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, []);

    return (
        <>
            <Container style={{ width: "100%", maxWidth: "100%", marginTop: "70px" }}>
                <h2><Link href="#">Live channels</Link> we think you’ll like</h2>
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
                                            title={channel.channelName}
                                        />
                                        <div className='liveViewCount'>{channel.viewers} viewers</div>
                                    </div>
                                    <Grid container direction="row" alignItems="center" mt={"15px"} ml={"15px"} pb={"15px"} style={{ display: "flex", alignItems: "flex-start" }} >
                                        <Grid item>
                                            <img src={`${process.env.NEXT_PUBLIC_S3_URL}/${channel.channelDetails[0].channelPicture}`} className='br100 listChannelIconSize' />
                                        </Grid>
                                        <Grid item ml={"15px"} style={{ width: "75%" }}>
                                            <Typography gutterBottom variant="h5" component="div">
                                                <Link href={`/channel/${channel.channelDetails[0]._id}`} color={'white'}>{channel.description}</Link>
                                            </Typography>
                                            <Typography gutterBottom variant="p" component="div">
                                                <Link href="#" color={'#999'}>{channel.title}</Link>
                                            </Typography>
                                            <Typography gutterBottom variant="p" component="div">
                                                <Link href={`/single-category/${channel.tattooCategoryDetails[0].urlSlug}`} color={'#999'}>{channel.tattooCategoryDetails[0].title}</Link>
                                            </Typography>
                                            {channel.tags && channel.tags ? <ul className='videoTags'>
                                                {channel.tags && channel.tags.map((tag) => (
                                                    <li key={tag}>
                                                        <Link href="#">{tag}</Link>
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
        </>
    );
};

export default LiveStreamings;
