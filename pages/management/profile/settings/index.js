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

// import ActivityTab from 'src/content/Management/Users/settings/ActivityTab';
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
  const router = useRouter();

  const tabs = [
    // { value: 'activity', label: 'Activity' },
    { value: 'edit_profile', label: 'Edit Profile' },
    { value: 'notifications', label: 'Notifications' },
    { value: 'security', label: 'Passwords/Security' }
  ];

  const handleTabsChange = (_event, value) => {
    setCurrentTab(value);
  };

  return (
    <>
      <Head>
        <title>User Settings - Applications</title>
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
            {currentTab === 'edit_profile' && <EditProfileTab />}
            {currentTab === 'notifications' && <NotificationsTab />}
            {currentTab === 'security' && <SecurityTab />}
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

ManagementUserSettings.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);


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
