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
const Recommended = ({ channels }) => {
    const [showCount, setShowCount] = React.useState(8);

    const handleShowMore = () => {
        setShowCount(prevCount => prevCount + 8);
    };

    const staticChannelData = [{
        channelName: "StreamerHouse",
        liveVideoTitle: "24/7 !DROPS | The Azoth must Flow - Follow @StreamerHouse Always Live Since 2013",
        channelPicture: "https://static-cdn.jtvnw.net/jtv_user_pictures/fd9521c0-018f-4d93-ab0d-44d2a00a00ef-profile_image-50x50.png",
        videoBanner: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_streamerhouse-440x248.jpg',
        liveView: "54",
        subscribers: "15445",
        channelCategory: "Sea of Thieves",
        videoTags: ["TwitchOG", "AlwaysOn", "Marathon"]
    },
    {
        channelName: "DannehTV",
        liveVideoTitle: "24/7 !DROPS | The Azoth must Flow - Follow @StreamerHouse Always Live Since 2013",
        channelPicture: "https://static-cdn.jtvnw.net/jtv_user_pictures/f2ec9b7c-ccf3-440c-8dc1-7f4c1e0b6bb6-profile_image-50x50.png",
        videoBanner: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_dannehtv-440x248.jpg',
        liveView: "545",
        subscribers: "15445",
        channelCategory: "New World",
        videoTags: ["TwitchOG", "Marathon"]
    },
    {
        channelName: "VeliaInn",
        liveVideoTitle: "24/7 !DROPS | The Azoth must Flow - Follow @StreamerHouse Always Live Since 2013",
        channelPicture: "https://static-cdn.jtvnw.net/jtv_user_pictures/6eadc3b0-61dc-4d11-8e14-924bbfa35664-profile_image-50x50.png",
        videoBanner: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_veliainn-440x248.jpg',
        liveView: "96",
        subscribers: "15445",
        channelCategory: "New World",
        videoTags: ["AlwaysOn", "Marathon"]
    },
    {
        channelName: "BenedictG",
        liveVideoTitle: "24/7 !DROPS | The Azoth must Flow - Follow @StreamerHouse Always Live Since 2013",
        channelPicture: "https://static-cdn.jtvnw.net/jtv_user_pictures/c71b60fc-4215-4c41-aaaa-17908502babf-profile_image-50x50.png",
        videoBanner: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_benedictg-440x248.jpg',
        liveView: "5454",
        subscribers: "15445",
        channelCategory: "New World",
        videoTags: ["TwitchOG", "AlwaysOn"]
    },
    {
        channelName: "zackrawrr",
        liveVideoTitle: "24/7 !DROPS | The Azoth must Flow - Follow @StreamerHouse Always Live Since 2013",
        channelPicture: "https://static-cdn.jtvnw.net/jtv_user_pictures/6a3f6d25-96c3-403e-8b3c-e30544344bab-profile_image-50x50.png",
        videoBanner: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_mikars-440x248.jpg',
        liveView: "3 viewers",
        subscribers: "15445",
        channelCategory: "New World",
        videoTags: ["TwitchOG", "Marathon"]
    }
    ]


    return (
        <>
            <Container style={{ width: "100%", maxWidth: "100%", marginTop: "100px" }}>
                <h2>Recommended <Link href="#">New World</Link> channels</h2>
                <Grid sx={recommendedStyle} className='desktop5'>
                    {channels.map((channel) => (
                        <Grid item xs={12} sm={6} md={4} key={channel.channelName}>
                            <Card sx={{ maxWidth: 345 }}>
                                <div style={{ position: 'relative' }}>
                                    <CardMedia
                                        sx={{ height: 140 }}
                                        image={channel.videoBanner}
                                        title={channel.channelName}
                                    />
                                    <div className='liveViewCount'>{channel.liveView} viewers</div>
                                </div>
                                <Grid container direction="row" alignItems="center" mt={"15px"} ml={"15px;"} pb={"15px"} style={{ display: "flex", alignItems: "flex-start" }} >
                                    <Grid item>
                                        <img src={channel.channelPicture} className='br100 listChannelIconSize' />
                                    </Grid>
                                    <Grid item ml={"15px"} style={{ width: "75%" }}>
                                        <Typography gutterBottom variant="h5" component="div">
                                            <Link href="#" color={'white'}>{channel.liveVideoTitle}</Link>
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            <Link href="#" color={'#bdbdbd'}>{channel.channelName}</Link>
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            <Link href="#" color={'#bdbdbd'} className='mt5'><i>{channel.channelCategory}</i></Link>
                                        </Typography>
                                        {channel.videoTags && channel.videoTags ? <ul className='videoTags'>
                                            {channel.videoTags && channel.videoTags.map((tag) => (
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
                {showCount < channels.length && (
                    <div className='showAllItemHr'>
                        <Button variant="contained" color="primary" onClick={handleShowMore}>Show More</Button>
                    </div>
                )}
            </Container>
        </>
    );
};

export default Recommended;