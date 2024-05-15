import Head from 'next/head';
import SidebarLayout from 'src/layouts/SidebarLayout';
import { useState, useEffect } from 'react';
import PageHeader from 'src/content/Dashboards/Tasks/PageHeader';
import Footer from 'src/components/Footer';
import {
  Grid,
  Tab,
  Tabs,
  Divider,
  Container,
  Card,
  Box,
  useTheme,
  styled
} from '@mui/material';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

import TeamOverview from 'src/content/Dashboards/Tasks/TeamOverview';
import ChannelAnalytics from 'src/content/Dashboards/Tasks/ChannelAnalytics';
import Analysis from 'src/content/Dashboards/Tasks/Analysis';
import VideoAnalytics from 'src/content/Dashboards/video/VideoAnalytics';
import VideoAnalysisOverview from 'src/content/Dashboards/video/VideoAnalysisOverview';
import Projects from 'src/content/Dashboards/Tasks/Projects';
import Checklist from 'src/content/Dashboards/Tasks/Checklist';
import Profile from 'src/content/Dashboards/Tasks/Profile';
import TaskSearch from 'src/content/Dashboards/Tasks/TaskSearch';
import client from "../../../graphql";
import { selectAuthUser } from 'store/slices/authSlice';
import { gql } from "@apollo/client";
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import LoginDialog from 'src/components/pageAccessDialog/loginDialog'

const TabsContainerWrapper = styled(Box)(
  ({ theme }) => `
      padding: 0 ${theme.spacing(2)};
      position: relative;
      bottom: -1px;

      .MuiTabs-root {
        height: 44px;
        min-height: 44px;
      }

      .MuiTabs-scrollableX {
        overflow-x: auto !important;
      }

      .MuiTabs-indicator {
          min-height: 4px;
          height: 4px;
          box-shadow: none;
          bottom: -4px;
          background: none;
          border: 0;

          &:after {
            position: absolute;
            left: 50%;
            width: 28px;
            content: ' ';
            margin-left: -14px;
            background: ${theme.colors.primary.main};
            border-radius: inherit;
            height: 100%;
          }
      }

      .MuiTab-root {
          &.MuiButtonBase-root {
              height: 44px;
              min-height: 44px;
              background: ${theme.colors.alpha.white[50]};
              border: 1px solid ${theme.colors.alpha.black[10]};
              border-bottom: 0;
              position: relative;
              margin-right: ${theme.spacing(1)};
              font-size: ${theme.typography.pxToRem(14)};
              color: ${theme.colors.alpha.black[80]};
              border-bottom-left-radius: 0;
              border-bottom-right-radius: 0;

              .MuiTouchRipple-root {
                opacity: .1;
              }

              &:after {
                position: absolute;
                left: 0;
                right: 0;
                width: 100%;
                bottom: 0;
                height: 1px;
                content: '';
                background: ${theme.colors.alpha.black[10]};
              }

              &:hover {
                color: ${theme.colors.alpha.black[100]};
              }
          }

          &.Mui-selected {
              color: ${theme.colors.alpha.black[100]};
              background: ${theme.colors.alpha.white[100]};
              border-bottom-color: ${theme.colors.alpha.white[100]};

              &:after {
                height: 0;
              }
          }
      }
  `
);

function DashboardTasks() {
  const theme = useTheme();
  const authState = useSelector(selectAuthUser)
  const [userData, setUserData] = useState([]);
  const [isUserAvailable, setIsUserAvailable] = useState(false);
  const [isFetchedApi, setIsFetchedApi] = useState(true);
  const [currentTab, setCurrentTab] = useState('analytics');
  
  const [channelDetail, setChannelDetail] = useState([]);
  const [channelAnanlysisData, setChannelAnanlysisData] = useState([]);
  
  // const [channelDetail, setChannelDetail] = useState([]);
  const [videoUploadAnanlysisData, setVideoUploadAnanlysisData] = useState([]);
  const [videoStreamAnanlysisData, setVideoStreamAnanlysisData] = useState([]);

  const [uploadVideoCount, setUploadVideoCount] = useState(0);
  const [streamVideoCount, setStreamVideoCount] = useState(0);

  const [isFetchVideoData, setIsFetchVideoData] = useState(false);
  const [selectedVideosYear, setSelectedVideosYear] = useState("");
  
  const router = useRouter();

  const tabs = [
    { value: 'analytics', label: 'Channel Analytics Overview' },
    // { value: 'taskSearch', label: 'Task Search' }
  ];

  useEffect(()=>{

    // let userId = JSON.parse(localStorage.getItem('authUser'));
    function getUserAllDetails(){
      client.query({
        variables: {
          usersId: userData[0]._id
        },
        query: gql`
            query Query($usersId: ID) {
                users(id: $usersId) {
                    _id
                    firstName
                    lastName
                    username
                    email
                    password
                    profilePicture
                    urlSlug
                    jwtToken
                    role
                    channelId
                    channelDetails {
                      _id
                      channelName
                      urlSlug
                      userId
                      subscribers
                    }
                    interestedStyleDetail {
                        title
                        _id
                    }
                }
            }
        `,
      }).then((result) => {
        setUserData(result.data.users);
        setChannelDetail(result.data.users[0].channelDetails);
      });
    }

    if(isUserAvailable){
            
      if(isFetchedApi){
        console.log('fetch')
        setIsUserAvailable(false);
        setIsFetchedApi(false);
        getUserAllDetails();
      }
    }
    // getUserAllDetails();
  },[isUserAvailable])

  useEffect(()=>{
    if(authState && Object.keys(authState).length > 0){
        setUserData([{...authState}])
        setIsUserAvailable(true);
    }
  },[authState])

  useEffect(()=>{

    if(channelDetail.length > 0){
      let currentDate = new Date();
      let currentYear = currentDate.getFullYear();

      client.query({
        variables: {
          getChannelAnalysisByChannelId: channelDetail[0]._id,
          // videoAnalysisId: channelDetail[0]._id
          videoAnalysisId: "64f5b09f6830acb8e65aa00f",
          year: `${currentYear}`
        },
        query: gql`
          query Query($getChannelAnalysisByChannelId: ID, $videoAnalysisId: ID, $year: String) {
            getChannelAnalysisByChannelId(id: $getChannelAnalysisByChannelId) {
              _id
              numberofvisit
            }
            videoAnalysis(id: $videoAnalysisId, year: $year) {
              _id
              uploadedVideo
              streamedVideo
            }
          }
        `,
      }).then((result)=>{
        console.log("result.data", result.data)
        let channelAnanlysis = result.data.getChannelAnalysisByChannelId
        
        let videoAnalytics = result.data.videoAnalysis
        
        let channelArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        
        channelAnanlysis.forEach((item)=>{
          let indexToReplace = parseInt(item._id);
          channelArray[indexToReplace - 1] = item.numberofvisit;
        });

        let videoUploadArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let videoStreamArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        videoAnalytics.forEach((item)=>{
          let indexToReplace = parseInt(item._id);
          videoUploadArray[indexToReplace - 1] = item.uploadedVideo;
          videoStreamArray[indexToReplace - 1] = item.streamedVideo;
        });

        setChannelAnanlysisData(channelArray);
        setVideoUploadAnanlysisData(videoUploadArray)
        setVideoStreamAnanlysisData(videoStreamArray)
        
        let videoUploadSum = videoUploadArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        let videoStreamSum = videoStreamArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        console.log("videoUploadSum", videoUploadSum)
        console.log("videoStreamSum", videoStreamSum)
        setUploadVideoCount(videoUploadSum)
        setStreamVideoCount(videoStreamSum)
      })
    }
  }, [channelDetail])
  
  useEffect(()=>{
    console.log('isFetchVideoData', isFetchVideoData);
    if(isFetchVideoData){
      console.log('isFetchVideoData if', isFetchVideoData);
      console.log('selectedVideosYear', selectedVideosYear)
      client.query({
        variables: {
          // videoAnalysisId: channelDetail[0]._id
          videoChannelId: "64f5b09f6830acb8e65aa00f",
          year: `${selectedVideosYear}`
        },
        query: gql`
          query Query($videoChannelId: ID, $year: String) {
            videoAnalysis(id: $videoChannelId, year: $year) {
              _id
              uploadedVideo
              streamedVideo
            }
          }
        `,
      }).then((result)=>{
        
        console.log('new result.data.videoAnalysis', result.data.videoAnalysis)
        let videoAnalytics = result.data.videoAnalysis
      
        let videoUploadArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let videoStreamArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        videoAnalytics.forEach((item)=>{
          let indexToReplace = parseInt(item._id);
          videoUploadArray[indexToReplace - 1] = item.uploadedVideo;
          videoStreamArray[indexToReplace - 1] = item.streamedVideo;
        });

        setVideoUploadAnanlysisData(videoUploadArray)
        setVideoStreamAnanlysisData(videoStreamArray)
        
        let videoUploadSum = videoUploadArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        let videoStreamSum = videoStreamArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
       
        setUploadVideoCount(videoUploadSum)
        setStreamVideoCount(videoStreamSum)
        setIsFetchVideoData(false);
      })
    }
  }, [isFetchVideoData])

  const changeVideoFilterYear = (year)=> {
    console.log('year--------------------------------', year);
    setSelectedVideosYear(year);
    setIsFetchVideoData(true);
  }
  const handleTabsChange = (_event, value) => {
    setCurrentTab(value);
  };

  return (
    <>
      {userData.length > 0?
        <SidebarLayout userData={userData}>
          <Head>
            <title>Channel Analytics Dashboard</title>
          </Head>
          <PageTitleWrapper>
            <PageHeader />
          </PageTitleWrapper>
          <Container maxWidth="lg">
            <TabsContainerWrapper>
              <Tabs
                onChange={handleTabsChange}
                value={currentTab}
                variant="scrollable"
                scrollButtons="auto"
                textColor="primary"
                indicatorColor="primary"
              >
                {tabs.map((tab) => (
                  <Tab key={tab.value} label={tab.label} value={tab.value} />
                ))}
              </Tabs>
            </TabsContainerWrapper>
            <Card variant="outlined">
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="stretch"
                spacing={0}
              >
                {currentTab === 'analytics' && (
                  <>
                    {/* <Grid item xs={12}>
                      <Box p={4}>
                        <TeamOverview />
                      </Box>
                    </Grid> */}
                    <Grid item xs={12}>
                      {/* <Divider /> */}
                      <Box
                        p={4}
                        sx={{
                          background: `${theme.colors.alpha.black[5]}`
                        }}
                      >
                        <Grid container spacing={4}>
                          <Grid item xs={12} sm={6} md={8}>
                            {channelAnanlysisData.length > 0 && channelDetail.length > 0 && <ChannelAnalytics channelAnanlysisData={channelAnanlysisData} channelDetail={channelDetail}/>}
                          </Grid>
                          <Grid item xs={12} sm={6} md={4}>
                            { channelDetail.length > 0 && <Analysis channelDetail={channelDetail} /> }
                          </Grid>
                        </Grid>
                      </Box>
                      <Divider />
                    </Grid>
                    {/* <Grid item xs={12}>
                      <Box p={4}>
                        <Projects />
                      </Box>
                      <Divider />
                    </Grid>
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          background: `${theme.colors.alpha.black[5]}`
                        }}
                      >
                        <Grid container spacing={0}>
                          <Grid item xs={12} md={6}>
                            <Box
                              p={4}
                              sx={{
                                background: `${theme.colors.alpha.white[70]}`
                              }}
                            >
                              <Checklist />
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Box p={4}>
                              <Profile />
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid> */}
                  </>
                )}
                {/* {currentTab === 'taskSearch' && (
                  <Grid item xs={12}>
                    <Box p={4}>
                      <TaskSearch />
                    </Box>
                  </Grid>
                )} */}
              </Grid>
            </Card>

            <Card variant="outlined" style={{marginTop: "10px"}}>
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="stretch"
                spacing={0}
              >
                <Grid item xs={12}>
                  {/* <Divider /> */}
                  <Box
                    p={4}
                    sx={{
                      background: `${theme.colors.alpha.black[5]}`
                    }}
                  >
                    <Grid container spacing={4}>
                      <Grid item xs={12} sm={6} md={8}>
                        { videoUploadAnanlysisData.length > 0 && videoStreamAnanlysisData.length > 0 && <VideoAnalytics videoUploadData={videoUploadAnanlysisData} videoStreamData={videoStreamAnanlysisData} changeVideoFilterYear={changeVideoFilterYear}/>}
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        { uploadVideoCount >= 0 && streamVideoCount >= 0 && <VideoAnalysisOverview uploadVideoCount={uploadVideoCount} streamVideoCount={streamVideoCount} /> }
                      </Grid>
                    </Grid>
                  </Box>
                  <Divider />
                </Grid>
              </Grid>
            </Card>
          </Container>
          <Footer />
        </SidebarLayout>
      : 
        <LoginDialog/>
      }
    </>
  );
}

// DashboardTasks.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default DashboardTasks;
