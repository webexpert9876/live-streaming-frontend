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
import {styled} from '@mui/system';

// const RecommendedStyle = styled(`Grid`)({
//     display: 'grid',
//     gridTemplateColumns: 'auto auto auto auto auto',
//     gap: '15px'
// })
const Styledesktop10 = {
    display: 'grid',
    gridTemplateColumns: 'auto auto auto auto auto auto auto auto auto auto',
    gap: '10px'
}


const ChannelCategory = () => {

    const ChannelCategoryData = [{
        channelCategoryTitle: "New World",
        liveVideoTitle: "24/7 !DROPS | The Azoth must Flow - Follow @StreamerHouse Always Live Since 2013",
        categoryPoster: "https://static-cdn.jtvnw.net/ttv-boxart/493597_IGDB-188x250.jpg",
        categoryViewers: "2.1K viewers",     
        videoTags: ["AlwaysOn", "Marathon"]
    },
    {
        channelCategoryTitle: "Just Chatting",
        liveVideoTitle: "24/7 !DROPS | The Azoth must Flow - Follow @StreamerHouse Always Live Since 2013",
        categoryPoster: "https://static-cdn.jtvnw.net/ttv-boxart/493597_IGDB-188x250.jpg",
        categoryViewers: "2.1K viewers",     
        videoTags: ["Marathon"]
    },
    {
        channelCategoryTitle: "Diablo IV",
        liveVideoTitle: "24/7 !DROPS | The Azoth must Flow - Follow @StreamerHouse Always Live Since 2013",
        categoryPoster: "https://static-cdn.jtvnw.net/ttv-boxart/493597_IGDB-188x250.jpg",
        categoryViewers: "2.1K viewers",     
        videoTags: ["TwitchOG", "AlwaysOn",]
    },
    {
        channelCategoryTitle: "World of Warcraft",
        liveVideoTitle: "24/7 !DROPS | The Azoth must Flow - Follow @StreamerHouse Always Live Since 2013",
        categoryPoster: "https://static-cdn.jtvnw.net/ttv-boxart/493597_IGDB-188x250.jpg",
        categoryViewers: "2.1K viewers",     
        videoTags: ["Marathon"]
    },
    {
        channelCategoryTitle: "League of Legends",
        liveVideoTitle: "24/7 !DROPS | The Azoth must Flow - Follow @StreamerHouse Always Live Since 2013",
        categoryPoster: "https://static-cdn.jtvnw.net/ttv-boxart/493597_IGDB-188x250.jpg",
        categoryViewers: "2.1K viewers",     
        videoTags: ["TwitchOG", "Marathon"]
    },
    {
        channelCategoryTitle: "VALORANT",
        liveVideoTitle: "24/7 !DROPS | The Azoth must Flow - Follow @StreamerHouse Always Live Since 2013",
        categoryPoster: "https://static-cdn.jtvnw.net/ttv-boxart/493597_IGDB-188x250.jpg",
        categoryViewers: "2.1K viewers",     
        videoTags: ["Marathon"]
    },
    {
        channelCategoryTitle: "The Elder Scrolls Online",
        liveVideoTitle: "24/7 !DROPS | The Azoth must Flow - Follow @StreamerHouse Always Live Since 2013",
        categoryPoster: "https://static-cdn.jtvnw.net/ttv-boxart/493597_IGDB-188x250.jpg",
        categoryViewers: "2.1K viewers",     
        videoTags: ["AlwaysOn", "Marathon"]
    },
    {
        channelCategoryTitle: "Black Desert",
        liveVideoTitle: "24/7 !DROPS | The Azoth must Flow - Follow @StreamerHouse Always Live Since 2013",
        categoryPoster: "https://static-cdn.jtvnw.net/ttv-boxart/493597_IGDB-188x250.jpg",
        categoryViewers: "2.1K viewers",     
        videoTags: ["Marathon"]
    },
    {
        channelCategoryTitle: "BattleBit Remastered",
        liveVideoTitle: "24/7 !DROPS | The Azoth must Flow - Follow @StreamerHouse Always Live Since 2013",
        categoryPoster: "https://static-cdn.jtvnw.net/ttv-boxart/493597_IGDB-188x250.jpg",
        categoryViewers: "2.1K viewers",     
        videoTags: ["TwitchOG"]
    },
    {
        channelCategoryTitle: "Counter-Strike",
        liveVideoTitle: "24/7 !DROPS | The Azoth must Flow - Follow @StreamerHouse Always Live Since 2013",
        categoryPoster: "https://static-cdn.jtvnw.net/ttv-boxart/493597_IGDB-188x250.jpg",
        categoryViewers: "2.1K viewers",     
        videoTags: ["TwitchOG"]
    }
    ]


    return (
        <>
            <Container style={{ width: "100%", maxWidth: "100%", marginTop: "0px" }}>
                <h2><Link href="#">Categories</Link> we think you’ll like</h2>
                <Grid sx={Styledesktop10}>
                    {ChannelCategoryData.map((channelCat) => (
                        <Grid item xs={12} sm={10} md={4} key={channelCat.channelName}>
                            <Card sx={{ maxWidth: 155 }} style={{ position: 'relative' }}>
                                <div style={{ position: 'relative' }}>
                                    <CardMedia
                                        sx={{ height: 280 }}
                                        image={channelCat.categoryPoster}                                        
                                    />
                                    
                                </div>
                                <Grid container direction="row" alignItems="center" mt={"15px"} ml={"15px;"} pb={"15px"} style={{ display: "flex", alignItems: "flex-start" }} >
                                        <Typography gutterBottom variant="h5" component="div" style={{width:"100%"}}>
                                            <Link href="#" color={'white'}>{channelCat.channelCategoryTitle.slice(0,20)}</Link>
                                        </Typography>
                                        <div className='cateBadge'> New</div>
                                       
                                        {channelCat.videoTags && channelCat.videoTags ? <ul className='videoTags'>
                                            {channelCat.videoTags && channelCat.videoTags.map((tag) => (
                                                <li key={tag}>
                                                    <Link href="#" style={{fontSize: "10px"}}>{tag}</Link>
                                                </li>
                                            ))}
                                        </ul> : null
                                        }
                                   
                                </Grid>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <div className='showAllItemHr'><Link>Show All</Link></div>
            </Container>
        </>
    );
};

export default ChannelCategory;