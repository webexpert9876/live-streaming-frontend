import React from 'react';
// import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import PageHeader from 'src/content/Dashboards/Tasks/PageHeader';
import { gql, useQuery, ApolloClient, InMemoryCache } from '@apollo/client';
import Menu from '@mui/material/Menu'
import client from "../../graphql";
import CssBaseline from '@mui/material/CssBaseline';
import {
  Typography,
  Box,
  Card,
  Container,
  Button,
  styled,
  Grid,
  Paper,
  Divider
} from '@mui/material';
import Logo from 'src/components/LogoSign';
import Link from 'src/components/Link';
import Head from 'next/head';
import { StickyNote2, Transform } from '@mui/icons-material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { KeyboardArrowUp } from '@mui/icons-material';
import LiveVideos from '../../src/content/Overview/CategoryInnerTabs/LiveVideos';
import VideosList from '../../src/content/Overview/CategoryInnerTabs/VideosList';
import { TypeInfo } from 'graphql';
import LeftMenu from '../../src/content/Overview/LeftMenu/index'
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
// import Header from '../../src/components/Layout/Header';
import { useRouter } from 'next/router';
import { setCurrentRoute } from '../../store/slices/routeSlice';
import { setAuthUser, setAuthState, selectAuthState, selectAuthUser } from '../../store/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';


const HeaderWrapper = styled(Card)(
  ({ theme }) => `
  width: 100%;
  display: flex;
  align-items: center;
  height: ${theme.spacing(10)};
  margin-bottom: ${theme.spacing(10)};
  border-radius:0;
`
);
const singCatMenu = {
  // marginLeft: "20px",
  marginTop: "30px",
  marginBottom: "36px",
  fontSize: "16px",
}
const whiteColor = {
  color: "#fff",
  padding: "15px"
}
const activeManu = {
  color: "#8C7CF0",
  borderBottom: "solid 1px #8C7CF0",
  paddingBottom: "7px"
}

const widthBox = {
  maxWidth: "1100px"
}


export default function Category() {
  const [tattooCategories, setTattooCategories] = useState({});
  const [countFollower, setCountFollower] = useState({});
  const [isCatFollowing, setIsCatFollowing] = useState({});
  const [liveVideosInfo, setLiveVideosInfo] = useState([]);
  const [videosListInfo, setVideosListInfo] = useState([]);
  const [value, setValue] = useState('1');
  let userDetails = useSelector(selectAuthUser);
  let userIsLogedIn = useSelector(selectAuthState);
  const [userDetail, setUserDetail] = useState(userDetails);
  const [userAuthState, setUserAuthState] = useState(userIsLogedIn);
  const [showFullContent, setShowFullContent] = React.useState(false);
  const [categorySlug, setCategorySlug] = useState('');
  const [isFetchingCategory, setIsFetchingCategory] = useState({});
  const [isPageLoading, setIsPageLoading]= useState(true);
  const router = useRouter();

  const dispatch = useDispatch();
  // const router = useRouter();
  // dispatch(setCurrentRoute(router.pathname));

  useEffect(async ()=>{
    if(!router.query.categorySlug) {
        return;
    }

    setCategorySlug(router.query.categorySlug);
    setIsFetchingCategory(true)

}, [router.query.categorySlug]);

useEffect(async ()=>{

    if(isFetchingCategory){

      let category = await client.query({
        query: gql`
            query Query ($urlSlug: String) {
              tattooCategories(urlSlug: $urlSlug) {
                _id
                description
                profilePicture
                tags
                title
              }
            }
          `,
        variables: {
          "urlSlug": categorySlug
        }
      }).then((result) => {
          return result.data.tattooCategories[0]
        });
    
      let categoryInfo = await client.query({
        query: gql`
          query Query ($tattooCategoryId: String!, $liveStreamingsTattooCategoryId2: String, $catAllVideos: String) {
            countTattooCategoryFollower(tattooCategoryId: $tattooCategoryId) {
              countFollower
            }
            liveStreamings(tattooCategoryId: $liveStreamingsTattooCategoryId2) {
              _id
              title
              tattooCategory
              videoId
              viewers
              videoPoster
              tags
              channelDetails {
                _id
                channelPicture
                channelName
                urlSlug
              }
              description
              _id
              tattooCategoryDetails {
                _id
                title
                urlSlug
              }
            }
            videos(tattooCategoryId: $catAllVideos) {
              videoPreviewImage
              _id
              title
              tags
              channelDetails {
                _id
                channelPicture
                urlSlug
                channelName
              }
              description
              channelId
              views           
            }
            
          }
        `,
        variables: {
          "tattooCategoryId": category._id,
          "liveStreamingsTattooCategoryId2": category._id,
          "catAllVideos": category._id,
        }
      }).then((result) => {
          return result.data
        });

      if(userDetails && userIsLogedIn){
        client.query({
          query: gql`
            query Query ($isTattooCategoryFollowingTattooCategoryId2: String!, $userId: String!,) {
              isTattooCategoryFollowing(tattooCategoryId: $isTattooCategoryFollowingTattooCategoryId2, userId: $userId) {
                _id
                isFollowing
              }
            }
          `,
          variables: {
            "isTattooCategoryFollowingTattooCategoryId2": category._id,
            "userId": userDetails._id
          }
        }).then((result) => {
          setIsCatFollowing(result.data.isTattooCategoryFollowing[0])
          setUserDetail(userDetails);
          return result.data
        });
      }

      setTattooCategories(category);
      setCountFollower(categoryInfo.countTattooCategoryFollower[0]);
      setLiveVideosInfo(categoryInfo.liveStreamings);
      setVideosListInfo(categoryInfo.videos);
      setIsPageLoading(false);
      setIsFetchingCategory(false)
    }
}, [isFetchingCategory])


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleReadMore = () => {
    setShowFullContent(!showFullContent);
  };

  // let content;
  // let wordsToShow;
  // let truncatedContent;

  // if(tattooCategories){
  //   content = tattooCategories.description;
  //   wordsToShow = 30;
  //   truncatedContent = content.split(' ').slice(0, wordsToShow).join(' ');
  // }

  function truncatedContent(description){
    let content = description.split(' ').slice(0, 35).join(' ');
    return content;
  }

  // const router = useRouter()

  const handleFollow = async(checkFollow) => {
    
    if(checkFollow){
      try{
        const result = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/follow/tattoo/category`, {userId: userDetail._id, tattooCategoryId: tattooCategories._id}, {headers: {'x-access-token': userDetail.jwtToken}});
        if(result){
          setIsCatFollowing(result.data.followingDetails)
        }
      } catch( error){
        console.log('error', error)
      }
    } else {
      try{
        const result = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/unfollow/tattoo/category/${isCatFollowing._id}`, {headers: {'x-access-token': userDetail.jwtToken}});
        if(result){
          setIsCatFollowing(result.data.followingDetails)
        }
      } catch( error){
        console.log('error', error)
      }
    }
    // let userDetail = useSelector(selectAuthUser);
    // let userIsLogedIn = useSelector(selectAuthState);

  }

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
      <Box sx={{ display: 'flex', marginTop:"90px" }} >
        <CssBaseline />
        <LeftMenu />
        {isPageLoading?
            <Box sx={{textAlign: 'center', width: '100%', padding: '15%'}}>
                <CircularProgress />
                <Typography>
                    Loading...
                </Typography>
            </Box>
        :
          <Box component="main" sx={{ flexGrow: 1, p: 3, padding: "40px" }} className='teeeeest' >
            <Box sx={widthBox}>
              <Grid container spacing={2}>
                {/* Left Image Section */}
                <Grid item xs={12} sm={2}>
                  <img
                    src={`${process.env.NEXT_PUBLIC_S3_URL}/${tattooCategories.profilePicture}`}
                    alt={`${tattooCategories.title}`}
                    style={{ width: '100%', height: '100%' }}
                  />
                </Grid>

                {/* Right Text Section */}
                <Grid item xs={12} sm={10}>
                  <Paper elevation={3} style={{ padding: '16px' }} gap={"15px"}>
                    <Typography variant="h2" style={{ width: "100%", paddingBottom: "15px", textTransform: 'uppercase', paddingLeft: "7px" }} >{tattooCategories.title}</Typography>
                    <Grid container gap={"15px"} direction="row" alignItems="center" mt={"0px"} ml={"8px"} pb={"15px"} style={{ display: "flex", alignItems: "flex-start" }}>

                      <Grid item gap={"15px"}>
                        {tattooCategories.viewers} 69K Viewers
                      </Grid>
                      <Grid item gap={"15px"}>
                        {countFollower.countFollower} Followers 
                      </Grid>

                      <Grid item gap={"15px"}>
                        {/* {tattooCategories.tags} */}
                        {tattooCategories.tags ? <ul style={{ margin: '0px 0 0 0', padding: 0}} className='videoTags'>
                          {tattooCategories.tags.map((tag, index) => (
                            <li key={index}>
                              <Link href="#">{tag}</Link>
                            </li>
                          ))}
                        </ul> : null
                        }
                      </Grid>
                      <Divider />


                      <Typography style={{ width: "620px" }}>
                        {showFullContent ? tattooCategories.description : truncatedContent(tattooCategories.description)}
                        {tattooCategories.description.length > 200 && (
                          !showFullContent ? (
                              <div onClick={handleReadMore}>
                                <KeyboardArrowDownIcon style={{ position: "relative", top: "7px" }} /> View More
                              </div>
                              )
                            :
                              <div onClick={handleReadMore}>
                                <KeyboardArrowUp style={{ position: "relative", top: "7px" }} /> View Less
                              </div>
                          )
                        }
                      </Typography>


                      <Typography item gap={"15px"} style={{ width: "100%" }}>
                        
                        {isCatFollowing?
                          (isCatFollowing.isFollowing?
                            <Button Button variant="contained" startIcon={<FavoriteIcon />} onClick={()=>handleFollow(false)}>Following</Button> 
                            : 
                            ( 
                              Object.keys(userDetail).length === 0? 
                                <Tooltip title={<React.Fragment>Please <a style={{color: "#8C7CF0", cursor: "pointer"}} onClick={()=> router.push(`/auth/login`)}>login</a> to follow this tattoo category</React.Fragment>} placement="right-start">
                                  <Button Button variant="contained" startIcon={<FavoriteBorderIcon />}>Follow</Button>
                                </Tooltip>
                              : 
                                <Button Button variant="contained" startIcon={<FavoriteBorderIcon />} onClick={()=>handleFollow(true)}>Follow</Button>
                            )
                          )
                        : null}

                      </Typography>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid >
            </Box>
            <Box sx={singCatMenu}>
              <Box sx={{ width: '100%', typography: 'body1' }} style={{ paddingBottom: "15px" }}>
                <TabContext value={value}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider', paddingBottom: "12px" }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                      <Tab label="Live Videos" value="1" />
                      <Tab label="Videos" value="2" />
                    </TabList>
                  </Box>
                  <TabPanel value="1" style={{ paddingLeft: "0" }}>
                    <Box component="main" sx={{ flexGrow: 1, p: 3, padding: "0" }}>
                      <LiveVideos liveVideosInfo={liveVideosInfo} />
                    </Box>
                  </TabPanel>
                  <TabPanel value="2" style={{ paddingLeft: "0" }}>
                    <Box component="main" sx={{ flexGrow: 1, p: 3, padding: "0" }}>
                      <VideosList videosListInfo={videosListInfo} />
                    </Box>
                  </TabPanel>
                </TabContext>
              </Box>
            </Box>
          </Box>
        }
      </Box >

    </>
  )
}
