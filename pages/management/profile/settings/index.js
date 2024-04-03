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

// import ActivityTab from 'src/content/Management/Users/settings/ActivityTab';
import EditProfileTab from 'src/content/Management/Users/settings/EditProfileTab';
import NotificationsTab from 'src/content/Management/Users/settings/NotificationsTab';
import SecurityTab from 'src/content/Management/Users/settings/SecurityTab';
import LoginDialog from 'src/components/pageAccessDialog/loginDialog'

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
  const [isUserAvailable, setIsUserAvailable] = useState(false);
  const [isFetchedApi, setIsFetchedApi] = useState(true);
  const [allowUser, setAllowUser] = useState(false);

  const [userInfo, setUserInfo]= useState({});
  const authState = useSelector(selectAuthUser)
  const router = useRouter();

  useEffect(()=>{
    // if(userInfo.length == 0){
    //   setUserInfo(authState);
    // }
    // let userId = JSON.parse(localStorage.getItem('authUser'));
    async function getTattooCategoryList(){

      client.query({
        variables: {
          usersId: userData[0]._id,
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
                interestedStyleDetail {
                  title
                  _id
                }
              }
              tattooCategories {
                title
                _id
              }
            }
        `,
      }).then((result) => {
          setUserData(result.data.users);
          setTattooCategoryList(result.data.tattooCategories);
      });
    }

    if(isUserAvailable){   
      if(isFetchedApi){
        console.log('fetch')
        setIsUserAvailable(false);
        setIsFetchedApi(false);
        getTattooCategoryList();
      }
    }
    
    // getTattooCategoryList();
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
    // { value: 'activity', label: 'Activity' },
    { value: 'edit_profile', label: 'Edit Profile' },
    // { value: 'notifications', label: 'Notifications' },
    { value: 'security', label: 'Passwords/Security' }
  ];

  const handleTabsChange = (_event, value) => {
    setCurrentTab(value);
  };

  return (
    <>
    {userData.length > 0?
      <SidebarLayout userData={userData}>
        <Head>
          <title>Settings - Applications</title>
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
              {/* {currentTab === 'activity' && <ActivityTab />} */}
              {tattooCategoryList.length > 0 && userData.length > 0 ?
                <>
                  {currentTab === 'edit_profile' && <EditProfileTab tattooCategoryList={tattooCategoryList} userData={userData}/>}
                </>
              : null }
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
        <Footer />
      </SidebarLayout>
    :
      <LoginDialog/>
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
