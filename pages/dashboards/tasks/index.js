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
import TasksAnalytics from 'src/content/Dashboards/Tasks/TasksAnalytics';
import Performance from 'src/content/Dashboards/Tasks/Performance';
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
  const router = useRouter();

  const tabs = [
    { value: 'analytics', label: 'Analytics Overview' },
    { value: 'taskSearch', label: 'Task Search' }
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
                    interestedStyleDetail {
                        title
                        _id
                    }
                }
            }
        `,
      }).then((result) => {
          setUserData(result.data.users);
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

  const handleTabsChange = (_event, value) => {
    setCurrentTab(value);
  };

  return (
    <>
      {userData.length > 0?
        <SidebarLayout userData={userData}>
          <Head>
            <title>Tasks Dashboard</title>
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
                    <Grid item xs={12}>
                      <Box p={4}>
                        <TeamOverview />
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider />
                      <Box
                        p={4}
                        sx={{
                          background: `${theme.colors.alpha.black[5]}`
                        }}
                      >
                        <Grid container spacing={4}>
                          <Grid item xs={12} sm={6} md={8}>
                            <TasksAnalytics />
                          </Grid>
                          <Grid item xs={12} sm={6} md={4}>
                            <Performance />
                          </Grid>
                        </Grid>
                      </Box>
                      <Divider />
                    </Grid>
                    <Grid item xs={12}>
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
                    </Grid>
                  </>
                )}
                {currentTab === 'taskSearch' && (
                  <Grid item xs={12}>
                    <Box p={4}>
                      <TaskSearch />
                    </Box>
                  </Grid>
                )}
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
