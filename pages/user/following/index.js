import { useEffect, useState } from 'react';
import Head from 'next/head';
import SidebarLayout from 'src/layouts/SidebarLayout';
import Footer from 'src/components/Footer';

import {
    Box,
    Typography,
    Card,
    CardHeader,
    Divider,
    Avatar,
    Grid,
    Container,
    Button
  } from '@mui/material';
  import { useRouter } from 'next/router';
  import { useSelector, useDispatch } from 'react-redux';
  import { selectAuthUser, selectAuthState } from 'store/slices/authSlice';
  import client from "../../../graphql";
  import { gql } from "@apollo/client";
  
  
  const followingShowLimit = 8;

export default function FollowingChannel(){
    const [followingChannelList, setFollowingChannelList] = useState([]);
    const [showFollowingCount, setShowFollowingCount] = useState(followingShowLimit);
    const [isFetched, setIsFetched]=useState(false);
    const router = useRouter();
    let userDetails = useSelector(selectAuthUser);
    let userIsLogedIn = useSelector(selectAuthState);
    const [userDetail, setUserDetail] = useState([]);

    useEffect(()=>{
      console.log('running')
      if(userDetails && userIsLogedIn) {
        if(!isFetched){
          client.query({
              query: gql`
              query Query($usersId: ID, $followersUserId2: String) {
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
                followers(userId: $followersUserId2) {
                    channelDetails {
                      _id
                      channelName
                      channelPicture
                      subscribers
                      urlSlug
                    }
                    isFollowing
                }
              }
          `,
              variables: {
                "followersUserId2": userDetails._id,
                "usersId": userDetails._id
              }
          }).then((result) => {
              console.log('subscription detail', result.data);
              setUserDetail(result.data.users);
              setFollowingChannelList(result.data.followers)
              setIsFetched(true);
              
              return result.data
          });
        }
      }
    },[userDetails])
  
    const handleFollowingCountAdd = ()=>{
      let count = showFollowingCount + 4
      if(followingChannelList.length < count){
        count = followingChannelList.length
      }
      setShowFollowingCount(count)
    }
    
    const handleSubscribedCountMinus = ()=>{
      let count = showFollowingCount - 4
      if(followingShowLimit > count){
        count = followingShowLimit
      }
      setShowFollowingCount(count)
    }

    return(
        <>
        {userDetail.length > 0?<SidebarLayout userData={userDetail}>
          <Head>
              <title>Following Channels</title>
          </Head>
          <Container sx={{ mt: 3 }} maxWidth="false">
            <Card>
              <CardHeader title="Your Following Channel List" />
              <Divider />
              <Box p={2}>
                <Grid container spacing={0}>
                  {followingChannelList.length > 0 ?
                    <>
                      {followingChannelList.slice(0, showFollowingCount).map((following, index) => (
                        <Grid key={index} item xs={12} sm={6} lg={3}>
                          <Box p={3} display="flex" alignItems="center">
                            {following.channelDetails[0].channelPicture?<Avatar  src={`${process.env.NEXT_PUBLIC_S3_URL}/${following.channelDetails[0].channelPicture}`} />: <Avatar></Avatar>}
                            <Box pl={1}>
                              <Typography variant="h4" gutterBottom sx={{cursor: 'pointer'}} onClick={()=>router.push(`/channel/${following.channelDetails[0].urlSlug}`)}>
                                {`${following.channelDetails[0].channelName}`}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                      <Box sx={{ width: '100%', textAlign: 'center'}}>
                        {showFollowingCount === followingChannelList.length ? null : followingChannelList.length > followingShowLimit && <Button sx={{mr: '10px'}} variant='contained' onClick={handleFollowingCountAdd}>Show More</Button>}
                        {showFollowingCount === followingShowLimit ? null: <Button variant='contained' onClick={()=>setShowFollowingCount(followingShowLimit)}>Show Less</Button>}
                      </Box>
                    </>
                  :
                    <Box sx={{width: '100%', textAlign: 'center'}}>
                      <Typography variant="h4" component='h4' gutterBottom>
                        Your Following Channels not found...
                      </Typography>
                    </Box>
                  }
                </Grid>
              </Box>
            </Card>
          </Container>
          <Footer />
        </SidebarLayout>:null}
      </>
    )
}