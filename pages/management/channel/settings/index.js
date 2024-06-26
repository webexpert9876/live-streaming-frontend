import { useState, ChangeEvent, useEffect } from 'react';
import Head from 'next/head';
import SidebarLayout from 'src/layouts/SidebarLayout';
import PageHeader from 'src/content/Management/Users/settings/PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Container,
  Tabs,
  Tab,
  Grid,
  Box,
  Typography
} from '@mui/material';
import Footer from 'src/components/Footer';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthUser } from 'store/slices/authSlice';
import client from "../../../../graphql";
import { gql } from "@apollo/client";
import CircularProgress from '@mui/material/CircularProgress';

import EditChannelTab from 'src/content/Management/Users/settings/EditChannelTab';
import EditStreamTab from 'src/content/Management/Users/settings/EditStreamTab';
import EditProfileTab from 'src/content/Management/Users/settings/EditProfileTab';
// import NotificationsTab from 'src/content/Management/Users/settings/NotificationsTab';
import SecurityTab from 'src/content/Management/Users/settings/SecurityTab';
import LoginDialog from 'src/components/pageAccessDialog/loginDialog'
import PermissionDeniedDialog from 'src/components/pageAccessDialog/permissionDeniedDialog'

const TabsWrapper = styled(Tabs)(
  () => `
    .MuiTabs-scrollableX {
      overflow-x: auto !important;
    }
`
);

function ManagementChannelSettings() {
  const [currentTab, setCurrentTab] = useState('edit_profile');
  const [tattooCategoryList, setTattooCategoryList]= useState([]);
  
  const [userData, setUserData] = useState([]);
  const [isUserAvailable, setIsUserAvailable] = useState(false);
  const [isFetchedApi, setIsFetchedApi] = useState(true);
  const [allowUser, setAllowUser] = useState(false);
  const [isPageLoading, setIsPageLoading]= useState(true);

  const [artistStreamDetail, setArtistStreamDetail] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [userInfo, setUserInfo]= useState({});
  const authState = useSelector(selectAuthUser)
  const router = useRouter();

  useEffect(()=>{
    // if(userInfo.length == 0){
    //   setUserInfo(authState);
    // }
    // let userId = JSON.parse(localStorage.getItem('authUser'));
    async function getUserAllDetails(){
      const roleInfo = await client.query({
        variables: {
            "rolesId": userData[0].role
        },
        query: gql`
            query Query($rolesId: ID) {
                roles(id: $rolesId) {
                    role
                }
            }
        `,
      });

      if(roleInfo.data.roles[0].role == 'admin' || roleInfo.data.roles[0].role == 'artist'){
        
        client.query({
          variables: {
            usersId: userData[0]._id,
            artistId: userData[0]._id,
          },
          query: gql`
            query Query($usersId: ID, $artistId: String!) {
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
                  channelName
                  _id
                  channelPicture
                  channelCoverImage
                  description
                  subscribers
                  userId
                  urlSlug
                  location
                  createdAt
                  socialLinks {
                    platform
                    url
                  }
                }
                interestedStyleDetail {
                  title
                  _id
                }
              }
              streams(artistId: $artistId) {
                _id
                title
                description
                tags
                streamCategory
                streamKey
                streamStartDate
                streamEndDate
                streamPreviewImage
                createdAt
                artistId
                channelId
              }
              tattooCategories {
                title
                _id
              }
              tagForStream {
                id
                text
              }
            }
          `,
        }).then((result) => {
          setTagList(result.data.tagForStream)
          setUserData(result.data.users);
          setTattooCategoryList(result.data.tattooCategories);
          setArtistStreamDetail(result.data.streams)
          setAllowUser(true);
          setIsPageLoading(false)
        });
      } else {
        setAllowUser(false);
      }
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
  },[isUserAvailable]);

  useEffect(()=>{
    if(authState && Object.keys(authState).length > 0){
        if(isFetchedApi){
          setUserData([{...authState}])
          setIsUserAvailable(true);
        }
    }
  },[authState])

  const tabs = [
    { value: 'channel', label: 'Edit Channel' },
    { value: 'edit_profile', label: 'Edit Profile' },
    { value: 'edit_stream', label: 'Edit Stream' },
    // { value: 'notifications', label: 'Notifications' },
    { value: 'security', label: 'Passwords/Security' }
  ];

  const handleTabsChange = (_event, value) => {
    setCurrentTab(value);
  };

  return (
    <>
    
    {userData.length > 0?
      isPageLoading?
        <Box sx={{textAlign: 'center', width: '100%', padding: '15%'}}>
            <CircularProgress />
            <Typography>
                Loading...
            </Typography>
        </Box>
      : 
        (
          allowUser ?
            <SidebarLayout userData={userData}>
              <Head>
                <title>Channel Settings - Applications</title>
              </Head>
              <PageTitleWrapper>
                <PageHeader />
              </PageTitleWrapper>
              <Container maxWidth="false" className='tttttttttttttttttddd'>
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="stretch"
                  spacing={3}
                >
                  <Grid item xs={12}>
                    <TabsWrapper
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
                    </TabsWrapper>
                  </Grid>
                  <Grid item xs={12}>
                    {userData.length > 0 && userData[0].channelDetails.length > 0?
                      <>
                        {currentTab === 'channel' && <EditChannelTab channelData={userData[0].channelDetails} userData={userData}/>}
                      </>
                    : null }

                    {tattooCategoryList.length > 0 && userData.length > 0 ?
                      <>
                        {currentTab === 'edit_profile' && <EditProfileTab tattooCategoryList={tattooCategoryList} userData={userData}/>}
                      </>
                    : null }

                    {(artistStreamDetail.length > 0 && tattooCategoryList.length > 0) && tagList.length > 0 && userData.length > 0? 
                      <>
                        {currentTab === 'edit_stream' && <EditStreamTab streamData={artistStreamDetail} isStreamFound={true} tattooCategoriesData={tattooCategoryList} tagData={tagList} userData={userData}/>}
                      </>
                      :
                        <>
                          {currentTab === 'edit_stream' && <EditStreamTab streamData={artistStreamDetail} isStreamFound={false} tattooCategoriesData={tattooCategoryList} tagData={tagList} userData={userData}/>}
                        </>
                    }
                    {/* {currentTab === 'notifications' && <NotificationsTab />} */}

                    {userData.length > 0?
                      <>
                        {currentTab === 'security' && <SecurityTab userData={userData}/>}
                      </>
                      : null
                    }
                  </Grid>
                </Grid>
              </Container>
              <Footer/>
            </SidebarLayout>
          :
            (
              <PermissionDeniedDialog/>
            )
        )
    :
      <LoginDialog/>
    }
    </>
  );
}

// ManagementChannelSettings.getLayout = (page) => {
//   <SidebarLayout>{page}</SidebarLayout>}
// ;


// export async function getStaticPaths() {
//   let userData = await client.query({
//       query: gql`
//           query Query {
//             users {
//               urlSlug
//             }
//           }
//       `
//   }).then((result) => {
//       let userIds = result.data.users.map((item) => {
//           return {
//               params: {
//                   userName: `${item.urlSlug}`
//               }
//           }
//       })
//       return userIds;
//   });

//   return {
//       paths: userData,
//       fallback: false,
//   };
// }

// export async function getStaticProps() {

//   let channelInfo = await client.query({
//       query: gql`
//           query Query ($urlSingleSlug: String) {
//               channels(urlSlug: $urlSingleSlug) {
//                   _id
//                   channelName
//                   channelPicture
//                   description
//                   subscribers
//                   urlSlug
//                   location
//                   createdAt
//                   userId
//               }
//           }
//       `,
//       variables: {
//           "urlSingleSlug": params.userName
//       }
//   }).then((result) => {
//       return result.data
//   });

//   let streamInfo = await client.query({
//       query: gql`
//       query Query () {
          
//       }
//       `,
//       variables: {
//         "userIdForVideo": channelInfo.channels[0].userId
//       }
//   }).then((result) => {
//       return result.data
//   });

//   let allData = { ...channelInfo, ...streamInfo };
//   channelInfo = JSON.stringify(allData);
//   return {
//       props: {
//           channelInfo: channelInfo
//       },
//   }
// }

export default ManagementChannelSettings;
