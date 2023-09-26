import { useState, useEffect } from 'react';
import Head from 'next/head';
import SidebarLayout from 'src/layouts/SidebarLayout';
import Footer from 'src/components/Footer';

import { Grid, Container } from '@mui/material';

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

function ManagementChannelProfile() {

    const [currentTab, setCurrentTab] = useState('edit_profile');
    const [tattooCategoryList, setTattooCategoryList]= useState([]);
    const [userData, setUserData] = useState([]);
    const [channelInfo, setChannelInfo]= useState({});
    const [channelFollower, setChannelFollower] = useState([]);
    const [channelTotalFollowers, setChannelTotalFollowers]= useState(0);
    const authState = useSelector(selectAuthUser)
    const router = useRouter();

    useEffect(()=>{
        // if(userInfo.length == 0){
        //   setUserInfo(authState);
        // }
        let userId = JSON.parse(localStorage.getItem('authUser'));
        function getChannelDetails(){
            client.query({
                variables: {
                    usersId: userId._id,
                    channelId: userId.channelId,
                    followersChannelId2: userId.channelId
                },
                query: gql`
                    query Query($usersId: ID, $channelId: String!, $followersChannelId2: String) {
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
                    }
                `,
            }).then((result) => {
                console.log('result channel user details', result.data)
                setUserData(result.data.users);
                setChannelInfo(result.data.users[0].channelDetails[0]);
                setChannelTotalFollowers(result.data.countChannelTotalFollowers[0].countFollower);
                console.log('setChannelFollower',result.data.followers )
                setChannelFollower([...result.data.followers]);
            });
        }
        getChannelDetails();
    },[])


  return (
    <>
        {userData.length > 0?<SidebarLayout userData= {userData}>
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
                {/* <Grid item xs={12} md={4}>
                    <RecentActivity />
                </Grid> */}
                {channelFollower.length > 0? <Grid item xs={12} md={8}>
                    <Feed channelFollower={channelFollower}/>
                </Grid>: null}
                <Grid item xs={12} md={8} mt={5}>
                    <SubscriberList />
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
        </SidebarLayout>:null}
    </>
  );
}

// ManagementUserProfile.getLayout = (page) => (
//   <SidebarLayout>{page}</SidebarLayout>
// );

export default ManagementChannelProfile;
