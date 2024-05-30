import { useState, useEffect } from 'react';
import Head from 'next/head';
import SidebarLayout from 'src/layouts/SidebarLayout';
import Footer from 'src/components/Footer';

import { Grid, Container, Box, Typography } from '@mui/material';

import ProfileCover from 'src/content/Management/Users/details/ProfileCover';
import RecentActivity from 'src/content/Management/Users/details/RecentActivity';
import Feed from 'src/content/Management/Users/details/Feed';
import SubscriberList from 'src/content/Management/Users/details/SubscriberList';
import PopularTags from 'src/content/Management/Users/details/PopularTags';
import MyCards from 'src/content/Management/Users/details/MyCards';
import Addresses from 'src/content/Management/Users/details/Addresses';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthUser } from 'store/slices/authSlice';
import client from "../../../graphql";
import { gql } from "@apollo/client";
import Button from '@mui/material/Button';
import LoginDialog from 'src/components/pageAccessDialog/loginDialog'
import PermissionDeniedDialog from 'src/components/pageAccessDialog/permissionDeniedDialog'
import CircularProgress from '@mui/material/CircularProgress';

function ManagementChannelProfile() {

    const [userData, setUserData] = useState([]);
    const [isUserAvailable, setIsUserAvailable] = useState(false);
    const [isFetchedApi, setIsFetchedApi] = useState(true);
    const [allowUser, setAllowUser] = useState(false);

    const [channelInfo, setChannelInfo]= useState({});
    const [channelFollower, setChannelFollower] = useState([]);
    const [channelSubscribers, setChannelSubscribers] = useState([]);
    const [channelTotalFollowers, setChannelTotalFollowers]= useState(0);
    const [isPageLoading, setIsPageLoading]= useState(true);
    const authState = useSelector(selectAuthUser)
    const router = useRouter();

    useEffect(()=>{
        // if(userInfo.length == 0){
        //   setUserInfo(authState);
        // }
        // let userId = JSON.parse(localStorage.getItem('authUser'));
        async function getChannelDetails(){
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
                        channelId: userData[0].channelId,
                        followersChannelId2: userData[0].channelId,
                        subscriptionDetailsChannelId2: userData[0].channelId
                    },
                    query: gql`
                        query Query($usersId: ID, $channelId: String!, $followersChannelId2: String, $subscriptionDetailsChannelId2: String) {
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
                                }
                                interestedStyleDetail {
                                title
                                _id
                                }
                            }
                            countChannelTotalFollowers(channelId: $channelId) {
                                countFollower
                            }
                            followers(channelId: $followersChannelId2) {
                                userDetails {
                                    firstName
                                    lastName
                                    profilePicture
                                }
                            }
                            subscriptionDetails(channelId: $subscriptionDetailsChannelId2) {
                                userDetail {
                                  profilePicture
                                  lastName
                                  firstName
                                  _id
                                }
                                _id
                                planDurationUnit
                                planDuration
                                isActive
                            }
                        }
                    `,
                }).then((result) => {
                    console.log('subscription de', result.data)
                    setUserData(result.data.users);
                    setChannelInfo(result.data.users[0].channelDetails[0]);
                    setChannelTotalFollowers(result.data.countChannelTotalFollowers[0].countFollower);
                    setChannelFollower([...result.data.followers]);
                    setChannelSubscribers([...result.data.subscriptionDetails]);
                    setAllowUser(true);
                    setIsPageLoading(false);
                });
            } else {
                setAllowUser(false);
            }
        }

        if(isUserAvailable){
            
            if(isFetchedApi){
                setIsUserAvailable(false);
                setIsFetchedApi(false);
                getChannelDetails();
            }
        }
    },[isUserAvailable])

    useEffect(()=>{
        if(authState && Object.keys(authState).length > 0){
            setUserData([{...authState}])
            setIsUserAvailable(true);
        }
    },[authState])

  return (
    <>
        {userData.length > 0?
            (
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
                            <SidebarLayout userData= {userData}>
                                <Head>
                                    <title>Channel Details - Management</title>
                                </Head>
                                <Container sx={{ mt: 3 }} maxWidth="false">
                                    <Grid
                                        direction="row"
                                        justifyContent="center"
                                        alignItems="stretch"
                                        spacing={3}
                                    >
                                    <Grid item xs={12} md={8}>
                                        <ProfileCover channelInfo={channelInfo} channelTotalFollowers={channelTotalFollowers}/>
                                    </Grid>
                                    {/* {channelFollower.length > 0? <Grid item xs={12} md={8}>
                                        <Feed channelFollower={channelFollower}/>
                                    </Grid>: null} */}
                                    <Grid item xs={12} md={8}>
                                        <Feed channelFollower={channelFollower}/>
                                    </Grid>
                                    {/* {channelSubscribers.length > 0 ? <Grid item xs={12} md={8} mt={5}>
                                        <SubscriberList channelSubscribers={channelSubscribers}/>
                                    </Grid>:null} */}
                                    <Grid item xs={12} md={8} mt={5}>
                                        <SubscriberList channelSubscribers={channelSubscribers}/>
                                    </Grid>
                                    {/* <Grid item xs={12} md={4}>
                                        <PopularTags />
                                    </Grid>
                                    <Grid item xs={12} md={7}>
                                        <MyCards />
                                    </Grid>
                                    <Grid item xs={12} md={5}>
                                        <Addresses />
                                    </Grid> */}
                                    </Grid>
                                </Container>
                                <Footer />
                            </SidebarLayout>
                        :
                            <PermissionDeniedDialog/>
                    )
            )
        :
            <LoginDialog/>
        }
    </>
  );
}

// ManagementUserProfile.getLayout = (page) => (
//   <SidebarLayout>{page}</SidebarLayout>
// );

export default ManagementChannelProfile;
