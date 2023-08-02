import * as React from 'react';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Container, Link } from '@mui/material';
import { borders } from '@mui/system';
import { styled } from '@mui/system';

// const RecommendedStyle = styled(`Grid`)({
//     display: 'grid',
//     gridTemplateColumns: 'auto auto auto auto auto',
//     gap: '15px'
// })
const recommendedStyle = {
    display: 'grid',
    gridTemplateColumns: 'auto auto auto auto auto',
    gap: '15px'
}
const LiveStreamings = ({ liveStreamings }) => {
    const [showCount, setShowCount] = React.useState(5);
    console.log('liveStreamings', liveStreamings)
    const handleShowMore = () => {
        setShowCount(prevCount => prevCount + 5);
    };

    // const staticChannelData = [{
    //     channelName: "StreamerHouse",
    //     liveVideoTitle: "24/7 !DROPS | The Azoth must Flow - Follow @StreamerHouse Always Live Since 2013",
    //     channelPicture: "https://static-cdn.jtvnw.net/jtv_user_pictures/fd9521c0-018f-4d93-ab0d-44d2a00a00ef-profile_image-50x50.png",
    //     videoBanner: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_streamerhouse-440x248.jpg',
    //     liveView: "54",
    //     subscribers: "15445",
    //     channelCategory: "Sea of Thieves",
    //     videoTags: ["TwitchOG", "AlwaysOn", "Marathon"]
    // },
    // {
    //     channelName: "DannehTV",
    //     liveVideoTitle: "24/7 !DROPS | The Azoth must Flow - Follow @StreamerHouse Always Live Since 2013",
    //     channelPicture: "https://static-cdn.jtvnw.net/jtv_user_pictures/f2ec9b7c-ccf3-440c-8dc1-7f4c1e0b6bb6-profile_image-50x50.png",
    //     videoBanner: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_dannehtv-440x248.jpg',
    //     liveView: "545",
    //     subscribers: "15445",
    //     channelCategory: "New World",
    //     videoTags: ["TwitchOG", "Marathon"]
    // },
    // {
    //     channelName: "VeliaInn",
    //     liveVideoTitle: "24/7 !DROPS | The Azoth must Flow - Follow @StreamerHouse Always Live Since 2013",
    //     channelPicture: "https://static-cdn.jtvnw.net/jtv_user_pictures/6eadc3b0-61dc-4d11-8e14-924bbfa35664-profile_image-50x50.png",
    //     videoBanner: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_veliainn-440x248.jpg',
    //     liveView: "96",
    //     subscribers: "15445",
    //     channelCategory: "New World",
    //     videoTags: ["AlwaysOn", "Marathon"]
    // },
    // {
    //     channelName: "BenedictG",
    //     liveVideoTitle: "24/7 !DROPS | The Azoth must Flow - Follow @StreamerHouse Always Live Since 2013",
    //     channelPicture: "https://static-cdn.jtvnw.net/jtv_user_pictures/c71b60fc-4215-4c41-aaaa-17908502babf-profile_image-50x50.png",
    //     videoBanner: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_benedictg-440x248.jpg',
    //     liveView: "5454",
    //     subscribers: "15445",
    //     channelCategory: "New World",
    //     videoTags: ["TwitchOG", "AlwaysOn"]
    // },
    // {
    //     channelName: "zackrawrr",
    //     liveVideoTitle: "24/7 !DROPS | The Azoth must Flow - Follow @StreamerHouse Always Live Since 2013",
    //     channelPicture: "https://static-cdn.jtvnw.net/jtv_user_pictures/6a3f6d25-96c3-403e-8b3c-e30544344bab-profile_image-50x50.png",
    //     videoBanner: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_mikars-440x248.jpg',
    //     liveView: "3 viewers",
    //     subscribers: "15445",
    //     channelCategory: "New World",
    //     videoTags: ["TwitchOG", "Marathon"]
    // }
    // ]
    // console.log('process.env.NEXT_PUBLIC_S3_URL', process.env.NEXT_PUBLIC_S3_URL)


    return (
        <>
            <Container style={{ width: "100%", maxWidth: "100%", marginTop: "70px" }}>
                <h2><Link href="#">Live channels</Link> we think you’ll like</h2>
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
                                <Grid container direction="row" alignItems="center" mt={"15px"} ml={"15px;"} pb={"15px"} style={{ display: "flex", alignItems: "flex-start" }} >
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
                                        {/* <Typography variant="body2" color="text.secondary">
                                            <Link href="#" color={'#bdbdbd'}>{channel.tags}</Link>
                                        </Typography> */}
                                        {/* <Typography variant="body2" color="text.secondary">
                                            <Link href={`/single-category/${stream.tattooCategory}`} color={'#bdbdbd'} className='mt5'><i>{channel.channelCategory}</i></Link>
                                        </Typography> */}
                                        {channel.tags && channel.tags ? <ul className='videoTags'>
                                            {channel.tags && channel.tags.map((tag) => (
                                                <li key={tag}>
                                                    <Link href="#">{tag}</Link>
                                                </li>
                                            ))}
                                        </ul> : null
                                        }
                                    </Grid>
                                </Grid>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
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