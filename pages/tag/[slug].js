import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import client from "../../graphql";
import { gql } from "@apollo/client";
import { 
    Box, 
    Container, 
    Typography, 
    Grid, 
    Card,
    CardMedia, 
    Link, 
    CardHeader,
    Pagination,
    Stack
} from "@mui/material";
import LeftMenu from '../../src/content/Overview/LeftMenu/index';
import CircularProgress from '@mui/material/CircularProgress';

const liveDaysAgo = {
    borderLeft: "solid 1px #b1b1b1",
    marginLeft: "5px",
    paddingLeft: "5px"
}

const fixedLimit =  20;


function TagSlug(){
    const router = useRouter();
    const [videoList, setVideoList] = useState([]);
    const [slug, setSlug] = useState('');
    const [limit, setLimit] = useState(fixedLimit);
    const [skip, setSkip] = useState(0);
    const [isFetchingVideos, setIsFetchingVideos] = useState(false);
    const [totalVideoCount, setTotalVideoCount]= useState(0);
    const [isPageLoading, setIsPageLoading]= useState(true);
    const [filterValue, setFilterValue] = useState('');
    // const [isFilter, setFilterValue] = useState('');

    useEffect(async ()=>{
        if(!router.query.slug) {
            return;
        }

        setSlug(router.query.slug[0].toUpperCase() + router.query.slug.slice(1));
        setIsFetchingVideos(true)

    }, [router.query.slug])

    useEffect(async ()=>{
        if(isFetchingVideos){
            await client.query({
                query: gql`
                    query Query($tags: String, $limit: Int, $skip: Int, $videoByTagCountTags2: String) {
                        videoByTag(tags: $tags, limit: $limit, skip: $skip) {
                            _id
                            title
                            description
                            videoPreviewImage
                            tags
                            views
                            url
                            userId
                            channelId
                            videoQualityUrl {
                                quality
                                url
                            }
                            channelDetails {
                                channelName
                                channelPicture
                                _id
                                urlSlug
                            }
                            createdAt
                            tattooCategoryDetails {
                                title
                                urlSlug
                            }
                        }
                        videoByTagCount(tags: $videoByTagCountTags2) {
                            count
                        }
                    }
                    
                `,
                variables: {
                    "tags": router.query.slug,
                    "videoByTagCountTags2": router.query.slug,
                    "limit": limit,
                    "skip": skip 
                }
            }).then((result) => {

                setVideoList(result.data.videoByTag);

                let count = Math.ceil(result.data.videoByTagCount[0].count/fixedLimit);
                setTotalVideoCount(count);
                
                setIsFetchingVideos(false);
                setIsPageLoading(false)
            }).catch((error) => {
                console.log('error', error);
                setIsFetchingVideos(false);
                setIsPageLoading(false)
            });
        }
    }, [isFetchingVideos])

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
        return daysAgo;
    }


    const handlePageChange = (event, value)=>{
        setLimit(fixedLimit * value);
        setSkip(fixedLimit * (value - 1));
        setIsFetchingVideos(true);
    }


    return(
        <>
            <Box sx={{ display: 'flex' }} mt={'110px'}>
                <LeftMenu />
                {isPageLoading?
                    <Box sx={{textAlign: 'center', width: '100%', padding: '15%'}}>
                        <CircularProgress />
                        <Typography>
                            Loading...
                        </Typography>
                    </Box>
                :
                    <Box sx={{ width: '100%' }} ml={2}>
                        <Box width={'98.4%'}>
                            {/* <Card sx={{marginBottom: '20px'}}>
                                <CardHeader title={<Typography variant="h2" component={'h2'} sx={{color: '#8C7CF0'}}>Tag: {slug}</Typography>}>
                                </CardHeader>
                            </Card> */}
                            <Box mb={4}>
                                <img style={{width: '100%'}} src='https://placehold.co/1784x250'/>
                            </Box>
                            <Typography mb={2} component={'h3'} variant={'h3'}>Search result for Tag - {slug}</Typography>
                            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12, lg: 26 }}>
                                {/* <Grid item xs={12} sm={6} md={4} style={{ maxWidth: "100%", margin: '0px 25px 25px 25px', flex: 1,  }}> */}
                                {videoList.length>0?
                                    <>
                                        {videoList.map((video, index) => (
                                            <Grid item xs={2} sm={4} md={4} lg={5.2} key={index}>
                                                <Card sx={{ width: '100%', margin: '0px 174px 0px 0px' }}>
                                                    <div style={{ position: 'relative' }}>
                                                        <CardMedia
                                                            sx={{ height: 140 }}
                                                            image={`${process.env.NEXT_PUBLIC_S3_URL}/${video.videoPreviewImage}`}
                                                        >

                                                        </CardMedia>
                                                        <Typography variant="body1" component="div" sx={{}}>
                                                            <div className='liveViewCount'>{countLiveViewing(video.views)} viewers
                                                                <div style={liveDaysAgo}>{calculateDaysAgo(video.createdAt)} days ago</div>
                                                            </div>
                                                        </Typography>
                                                    </div>
                                                    <div className=""></div>
                                                    <Grid container direction="row" alignItems="center" mt={"15px"} ml={"15px;"} pb={"15px"} style={{ display: "flex", alignItems: "flex-start" }}>
                                                        <Grid item>
                                                            <img src={`${process.env.NEXT_PUBLIC_S3_URL}/${video.channelDetails[0].channelPicture}`} className='br100 listChannelIconSize' />
                                                        </Grid>
                                                        <Grid item ml={"15px"} style={{ width: "75%" }}>
                                                            <Typography gutterBottom variant="h5" component="div">
                                                                <Link onClick={()=> router.push(`/video/${video._id}`)} color={'white'} style={{cursor: "pointer"}}>{video.description.slice(0, 30)}..</Link>
                                                            </Typography>
                                                            <Typography gutterBottom variant="p" component="div">
                                                                <Link onClick={()=> router.push(`/channel/${video.channelDetails[0].urlSlug}`)} color={'#999'} style={{cursor: "pointer"}}>{video.channelDetails[0].channelName}</Link>
                                                            </Typography>
                                                            {video.tags ? <ul className='videoTags'>
                                                                {video.tags.map((tag, index) => (
                                                                    <li key={index}>
                                                                        <Link onClick={()=> router.push(`/tag/${tag}`)} style={{cursor: "pointer"}}>{tag}</Link>
                                                                    </li>
                                                                ))}
                                                            </ul> : null}
                                                        </Grid>
                                                    </Grid>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </>
                                :   
                                    <Grid item xs={2} sm={4} md={4} lg={5.2}>
                                        <Typography>No Videos found for {slug} tag</Typography>
                                    </Grid>
                                }
                            </Grid>
                            {totalVideoCount?<Stack spacing={2} mt={5} mb={5} alignItems={'center'}>
                                <Pagination onChange={handlePageChange} count={totalVideoCount} color="primary" />
                            </Stack>: null}
                        </Box>
                    </Box>
                }
            </Box >
        </>
    )
}

export default TagSlug;