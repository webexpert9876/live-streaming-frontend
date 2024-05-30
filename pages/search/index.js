import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import client from "../../graphql";
import { gql } from "@apollo/client";
import LeftMenu from '../../src/content/Overview/LeftMenu/index';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Button, Container, Divider, Typography, Link, Card } from "@mui/material";

function SearchString() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [isPageLoading, setIsPageLoading]= useState(true);
    const [isChannel, setIsChannel]= useState(false);
    const [channelDetail, setChannelDetail]= useState({});
    const [videosList, setVideosList]= useState([]);
    const [isSearchStringEmpty, setIsSearchStringEmpty]= useState(true);

    useEffect(()=>{
        if(!router.query.searchString) {
            setIsPageLoading(false)
            return;
        }
        setIsSearchStringEmpty(false);
        setSearchQuery(router.query.searchString);
        setIsSearching(true);
    }, [router.query.searchString])

    useEffect(async()=>{
        if(isSearching){
            await client.query({
                query: gql`
                    query Query($searchString: String) {
                        searchBar(searchString: $searchString) {
                            channel {
                                _id
                                channelName
                                channelPicture
                                description
                                subscribers
                                urlSlug
                              }
                              videos {
                                _id
                                title
                                description
                                tattooCategoryDetails {
                                  title
                                  urlSlug
                                }
                                videoPreviewImage
                                channelDetails {
                                  channelName
                                  urlSlug
                                  _id
                                  subscribers
                                }
                                views
                                tags
                                createdAt
                            }
                        }
                    }
                    
                `,
                variables: {
                    "searchString": router.query.searchString
                }
            }).then((result) => {

                // let count = Math.ceil(result.data.videoByTagCount[0].count/fixedLimit);
                // setTotalVideoCount(count);

                if(result.data.searchBar[0].channel.length > 0 ){
                   setIsChannel(true);
                   setChannelDetail(result.data.searchBar[0].channel[0]);
                } else {
                    setIsChannel(false);
                    setChannelDetail({});
                }

                setVideosList(result.data.searchBar[0].videos);
                
                setIsSearching(false);
                setIsPageLoading(false)
            }).catch((error) => {
                console.log('error', error);
                setIsSearching(false);
                setIsPageLoading(false)
            });
        }
    }, [isSearching])

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

        return `${daysAgo} days ago`
    }

    const countViewing = (viewers) => {
        if (viewers > 999 && viewers < 1000000) {
            const viewing = (Math.floor(viewers / 100) / 10).toFixed(1) + "K";
            return viewing
        } else if (viewers > 999999) {
            const viewing = (Math.floor(viewers / 100000) / 10).toFixed(1) + "M";
            return viewing
        } else {
            return `${viewers}`
        }

        // if (viewers >= 1000 && viewers < 1000000) {
        //     const viewing = (viewers >= 1000 ? (Math.floor(viewers / 1000)).toFixed(0) : (Math.floor(viewers / 100) / 10).toFixed(1)) + "K";
        //     return viewing;
        // } else if (viewers >= 1000000) {
        //     const viewing = (Math.floor(viewers / 100000) / 10).toFixed(1) + "M";
        //     return viewing;
        // } else {
        //     return `${viewers}`;
        // }
    }

    return(
        <>
            {isPageLoading?
                <Box sx={{textAlign: 'center', width: '100%', padding: '15%'}}>
                    <CircularProgress />
                    <Typography>
                        Loading...
                    </Typography>
                </Box>
            :
                <Container sx={{display: 'flex', marginTop: '110px'}} maxWidth='md'>
                    {/* <LeftMenu/> */}
                    <Box width='100%'>
                        {channelDetail && !isSearchStringEmpty?
                        <>
                            <Typography component={'h3'} variant={'h3'}>Search result for - {searchQuery} </Typography>
                                <Card sx={{my:2}}>
                                    <Box sx={{ display: 'flex', width: '100%', my:2 }}>
                                        <Typography variant="body1" component={'div'} sx={{width: '40%', textAlign: 'center'}}>
                                            <img src={`${process.env.NEXT_PUBLIC_S3_URL}/${channelDetail.channelPicture}`} style={{ borderRadius: '100%', height: 'auto', width: '35%', marginTop: '18px' }}></img>
                                        </Typography>
                                        <Box sx={{display:'flex', width: '100%'}}>
                                            <Box sx={{ margin: 'auto', width: '100%' }}>
                                                <Typography onClick={()=>{router.push(`/channel/${channelDetail.urlSlug}`)}} variant="h3" component="h3" sx={{ fontWeight: 600, fontSize: '20px', cursor: 'pointer', }} align="left">
                                                    {channelDetail.channelName}
                                                </Typography>
                                                <Typography variant="h4" component="h4" sx={{ fontWeight: 600, fontSize: '15px', marginTop: '8px' }} align="left">{channelDetail.description}</Typography>
                                                <Typography variant="h5" component={"h5"} sx={{ fontSize: '15px', marginTop: '8px' }}>
                                                    {countViewing(channelDetail.subscribers)} subscribers
                                                </Typography>
                                            </Box>
                                            {/* <Box sx={{margin: 'auto'}}>
                                                <Button variant="contained">Subscribe</Button>
                                            </Box> */}
                                        </Box>
                                    </Box>
                                </Card>
                            <Divider/>
                        </>
                        : null}

                        {channelDetail && videosList.length > 0?
                            <>
                                <Typography component={'h3'} variant={'h3'} mt={2}>{channelDetail.channelName[0].toUpperCase() + channelDetail.channelName.slice(1)} channel videos -  </Typography>
                                {videosList.map((video, index)=>(
                                    <Card sx={{my: 2}} key={index}>
                                        <Box sx={{ display: 'flex', width: '100%', my:2 }}>
                                            <Typography variant="body1" component={'div'} sx={{width: '40%', textAlign: 'center'}} onClick={() => router.push(`/video/${video._id}`)}>
                                                <img src={`${process.env.NEXT_PUBLIC_S3_URL}/${video.videoPreviewImage}`} style={{ borderRadius: '5%', height: '187px', width: '70%', marginTop: '10px' }}></img>
                                            </Typography>
                                            <Box sx={{display:'flex', width: '100%'}}>
                                                <Box sx={{ mt:1, width: '100%' }}>
                                                    <Typography onClick={() => router.push(`/video/${video._id}`)} variant="h2" component="h2" sx={{ fontWeight: 600, cursor: 'pointer', }} align="left">{video.title[0].toUpperCase() + video.title.slice(1)}</Typography>
                                                    <Typography variant="h5" component={"h5"} sx={{ fontSize: '14px', marginTop: '8px' }}>
                                                        {countViewing(video.views)} views <span style={{color:"#8C7CF0"}}>~</span> {calculateDaysAgo(video.createdAt)}
                                                    </Typography>
                                                    <Typography onClick={() => router.push(`/channel/${video.channelDetails[0].urlSlug}`)} variant="h4" component="h4" sx={{ fontWeight: 600, my: '18px' }} align="left">{video.channelDetails[0].channelName}</Typography>
                                                    <Typography variant="body1" component={'div'} sx={{ display: 'flex', marginTop: '18px' }}>
                                                        <Link
                                                            onClick={() => router.push(`/single-category/${video.tattooCategoryDetails[0].urlSlug}`)}
                                                            sx={{ fontWeight: 400, paddingRight: '10px', cursor: 'pointer' }} align="left">{video.tattooCategoryDetails[0].title}</Link>
                                                        {/* <Typography variant="h6" component="h6" sx={{ fontWeight: 400, fontSize: '12px', borderRadius: '50px', backgroundColor: 'grey', padding: '2px 10px 2px 10px' }}>Tattoo</Typography> */}
                                                    </Typography>
                                                    <Box mt={'5px'}>
                                                        {video.tags.map((tag, index) => {
                                                            return (<Button key={index} variant="contained" sx={{ fontWeight: 400, fontSize: '12px', borderRadius: '50px', backgroundColor: 'grey', padding: '0px', margin: '0px 2px' }}>
                                                                <Link
                                                                    onClick={() => router.push(`/tag/${tag}`)}
                                                                    sx={{ color: '#fff' }}>{tag}</Link>
                                                            </Button>)
                                                        })}
                                                    </Box>
                                                </Box>
                                                {/* <Box sx={{margin: 'auto'}}>
                                                    <Button variant="contained">Subscribe</Button>
                                                </Box> */}
                                            </Box>
                                        </Box>
                                    </Card>
                                ))}
                            </>
                        : 
                            null
                        }

                        {!channelDetail && videosList.length > 0?
                            <>
                                <Typography component={'h3'} variant={'h3'} mt={2}>Search result for - {searchQuery} </Typography>
                                {videosList.map((video, index)=>(
                                    <Card sx={{my: 2}} key={index}>
                                        <Box sx={{ display: 'flex', width: '100%', my:2 }}>
                                            <Typography variant="body1" component={'div'} sx={{width: '40%', textAlign: 'center'}} onClick={() => router.push(`/video/${video._id}`)}>
                                                <img src={`${process.env.NEXT_PUBLIC_S3_URL}/${video.videoPreviewImage}`} style={{ borderRadius: '5%', height: '187px', width: '70%', marginTop: '10px' }}></img>
                                            </Typography>
                                            <Box sx={{display:'flex', width: '100%'}}>
                                                <Box sx={{ mt:1, width: '100%' }}>
                                                    <Typography onClick={() => router.push(`/video/${video._id}`)} variant="h2" component="h2" sx={{ fontWeight: 600, cursor: 'pointer', }} align="left">{video.title[0].toUpperCase() + video.title.slice(1)}</Typography>
                                                    <Typography variant="h5" component={"h5"} sx={{ fontSize: '14px', marginTop: '8px' }}>
                                                        {countViewing(video.views)} views <span style={{color:"#8C7CF0"}}>~</span> {calculateDaysAgo(video.createdAt)} 
                                                    </Typography>
                                                    <Typography onClick={() => router.push(`/channel/${video.channelDetails[0].urlSlug}`)} variant="h4" component="h4" sx={{ fontWeight: 600, my: '18px' }} align="left">{video.channelDetails[0].channelName}</Typography>
                                                    <Typography variant="body1" component={'div'} sx={{ display: 'flex', marginTop: '18px' }}>
                                                        <Link
                                                            onClick={() => router.push(`/single-category/${video.tattooCategoryDetails[0].urlSlug}`)}
                                                            sx={{ fontWeight: 400, paddingRight: '10px', cursor: 'pointer' }} align="left">{video.tattooCategoryDetails[0].title}</Link>
                                                        {/* <Typography variant="h6" component="h6" sx={{ fontWeight: 400, fontSize: '12px', borderRadius: '50px', backgroundColor: 'grey', padding: '2px 10px 2px 10px' }}>Tattoo</Typography> */}
                                                    </Typography>
                                                    <Box mt={'5px'}>
                                                        {video.tags.map((tag, index) => {
                                                            return (<Button key={index} variant="contained" sx={{ fontWeight: 400, fontSize: '12px', borderRadius: '50px', backgroundColor: 'grey', padding: '0px', margin: '0px 2px' }}>
                                                                <Link
                                                                    onClick={() => router.push(`/tag/${tag}`)}
                                                                    sx={{ color: '#fff' }}>{tag}</Link>
                                                            </Button>)
                                                        })}
                                                    </Box>
                                                </Box>
                                                {/* <Box sx={{margin: 'auto'}}>
                                                    <Button variant="contained">Subscribe</Button>
                                                </Box> */}
                                            </Box>
                                        </Box>
                                    </Card>
                                ))}
                            </>
                        : 
                            null
                        }

                        {
                            !channelDetail && videosList.length == 0 &&
                                <Box sx={{ textAlign: 'center'}}>
                                    <Card sx={{padding: '50px', fontSize: '30px'}}>
                                        Search result not found
                                    </Card>
                                </Box>
                        }
                    </Box>
                </Container>
            }
        </>
    )

}

export default SearchString;