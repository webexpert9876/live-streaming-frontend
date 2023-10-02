import * as React from 'react';
import { useState } from 'react';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Container, Divider, Link } from '@mui/material';
import { borders, Box } from '@mui/system';
import { styled } from '@mui/system';
import { useRouter } from 'next/router';

const recommendedStyle = {
    display: 'grid',
    gridTemplateColumns: 'auto auto auto auto auto',
    gap: '15px',
    marginTop: "40px"
}
const LiveVideos = ({ liveVideosInfo }) => {
    const [showCount, setShowCount] = React.useState(5);
    const [selectedTag, setSelectedTag] = useState(null);
    const router = useRouter();

    const handleShowMore = () => {
        setShowCount(prevCount => prevCount + 5);
        setSelectedTag(null);
    };
    // const [showCount, setShowCount] = React.useState(5);
    //console.log('liveVideosInfoLiveVideossssssssssssssssssssssss', liveVideosInfo)
    // const handleShowMore = () => {
    //     setShowCount(prevCount => prevCount + 5);
    // };


    if (!liveVideosInfo || !Array.isArray(liveVideosInfo)) {
        // Handle cases where LiveVideos is not defined or not an array
        return <p>No live videos available.</p>;
    }

    const liveVideosInfoSearch = [
        { label: "test" }
    ];

    // Get all unique tags from video data to show in Autocomplete
    const allTags = liveVideosInfo.reduce((tags, video) => {
        if (video.tags) {
            video.tags.forEach(tag => {
                if (!tags.includes(tag)) {
                    tags.push(tag);
                }
            });
        }
        return tags;
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

            <Box style={{ width: "100%", maxWidth: "100%", marginTop: "5px", padding: "0" }}>
                <Grid style={{ width: "100%" }}>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={allTags}
                        value={selectedTag}
                        onChange={(event, newValue) => setSelectedTag(newValue)} // Update selectedTag state on selection
                        getOptionLabel={(option) => option}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Search by tag" />}
                    />
                </Grid>
                <Grid sx={recommendedStyle} className='desktop5'>
                    {liveVideosInfo
                        .filter((video) => !selectedTag || video.tags?.includes(selectedTag))
                        .slice(0, showCount)
                        .map((channel) => (
                            <Grid item xs={12} sm={6} md={4} key={channel._id} style={{ maxWidth: "100%" }}>
                                <Card sx={{ maxWidth: 345 }}>
                                    <div style={{ position: 'relative' }}>
                                        <CardMedia
                                            sx={{ height: 140 }}
                                            image={`${process.env.NEXT_PUBLIC_S3_URL}/${channel.videoPoster}`}
                                            title={channel.channelName}
                                        />
                                        <div className='liveViewCount'>{countLiveViewing(channel.viewers)} viewers</div>
                                    </div>
                                    <Grid container direction="row" alignItems="center" mt={"15px"} ml={"15px;"} pb={"15px"} style={{ display: "flex", alignItems: "flex-start" }}>
                                        <Grid item>
                                            <img src={`${process.env.NEXT_PUBLIC_S3_URL}/${channel.channelDetails[0].channelPicture}`} className='br100 listChannelIconSize' />
                                        </Grid>
                                        <Grid item ml={"15px"} style={{ width: "75%" }}>
                                            <Typography gutterBottom variant="h5" component="div">
                                                <Link 
                                                // href={`/channel/${channel.channelDetails[0].urlSlug}`}
                                                style={{cursor: "pointer"}}
                                                onClick={()=> router.push(`/channel/${channel.channelDetails[0].urlSlug}`)}
                                                
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
                                                        onClick={() => router.push(`/tag/${tag}`)}
                                                        style={{cursor: "pointer"}}
                                                        // onClick={()=> router.push(`/channel/${channel.channelDetails[0].tags}`)}
                                                        >{tag}</Link>
                                                    </li>
                                                ))}
                                            </ul> : null}
                                        </Grid>
                                    </Grid>
                                </Card>
                            </Grid>
                        ))}
                </Grid>
                {showCount < liveVideosInfo.length && (
                    <div className='showAllItemHr'>
                        <Button variant="contained" color="primary" onClick={handleShowMore}>Show More</Button>
                    </div>
                )}
            </Box>
        </>
    );
};

export default LiveVideos;