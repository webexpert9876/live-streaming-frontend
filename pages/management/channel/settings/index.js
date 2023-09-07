import { useState, ChangeEvent, useEffect } from 'react';
import Head from 'next/head';
import SidebarLayout from 'src/layouts/SidebarLayout';
import PageHeader from 'src/content/Management/Users/settings/PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Container, Tabs, Tab, Grid } from '@mui/material';
import Footer from 'src/components/Footer';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthUser } from 'store/slices/authSlice';
import client from "../../../../graphql";
import { gql } from "@apollo/client";

import EditChannelTab from 'src/content/Management/Users/settings/EditChannelTab';
import EditStreamTab from 'src/content/Management/Users/settings/EditStreamTab';
import EditProfileTab from 'src/content/Management/Users/settings/EditProfileTab';
import NotificationsTab from 'src/content/Management/Users/settings/NotificationsTab';
import SecurityTab from 'src/content/Management/Users/settings/SecurityTab';

const TabsWrapper = styled(Tabs)(
  () => `
    .MuiTabs-scrollableX {
      overflow-x: auto !important;
    }
`
);

function ManagementUserSettings() {
  const [currentTab, setCurrentTab] = useState('edit_profile');
  const [tattooCategoryList, setTattooCategoryList]= useState([]);
  const [userData, setUserData] = useState([]);
  const [artistStreamDetail, setArtistStreamDetail] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [userInfo, setUserInfo]= useState({});
  const authState = useSelector(selectAuthUser)
  const router = useRouter();

  useEffect(()=>{
    // if(userInfo.length == 0){
    //   setUserInfo(authState);
    // }
    let userId = JSON.parse(localStorage.getItem('authUser'));
    function getUserAllDetails(){
      client.query({
        variables: {
          usersId: userId._id,
          artistId: userId._id,
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
          console.log('result tattoo user', result.data)
          setTagList(result.data.tagForStream)
          setUserData(result.data.users);
          setTattooCategoryList(result.data.tattooCategories);
          setArtistStreamDetail(result.data.streams)
      });
    }
    getUserAllDetails();
  },[])

  const tabs = [
    { value: 'channel', label: 'Edit Channel' },
    { value: 'edit_profile', label: 'Edit Profile' },
    { value: 'edit_stream', label: 'Edit Stream' },
    { value: 'notifications', label: 'Notifications' },
    { value: 'security', label: 'Passwords/Security' }
  ];

  const handleTabsChange = (_event, value) => {
    setCurrentTab(value);
  };

  return (
    <>
    {userData.length > 0?<SidebarLayout userData={userData}>
      <Head>
        <title>Channel Settings - Applications</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Container maxWidth="lg">
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

            {(artistStreamDetail.length > 0 && tattooCategoryList.length > 0) && tagList && userData.length > 0? 
              <>
                {currentTab === 'edit_stream' && <EditStreamTab streamData={artistStreamDetail} isStreamFound={true} tattooCategoriesData={tattooCategoryList} tagData={tagList} userData={userData}/>}
              </>
              :
                <>
                  {currentTab === 'edit_stream' && <EditStreamTab streamData={artistStreamDetail} isStreamFound={false} tattooCategoriesData={tattooCategoryList} userData={userData}/>}
                </>
            }
            {currentTab === 'notifications' && <NotificationsTab />}

            {userData.length > 0?
              <>
                {currentTab === 'security' && <SecurityTab userData={userData}/>}
              </>
              : null
            }
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </SidebarLayout>:null
      }
    </>
  );
}

// ManagementUserSettings.getLayout = (page) => {
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

export default ManagementUserSettings;
