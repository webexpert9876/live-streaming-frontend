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
  
  
  const subscribedShowLimit = 8;
  
  function SubscribeChannel() {
    const [subscribedChannelList, setSubscribedChannelList] = useState([]);
    const [showSubscribedCount, setShowSubscribedCount] = useState(subscribedShowLimit);
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
              query Query($usersId: ID, $userId: String) {
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
                subscriptionDetails(userId: $userId) {
                  _id
                  planDurationUnit
                  planDuration
                  isActive
                  channelDetails {
                    _id
                    channelName
                    channelPicture
                    subscribers
                    urlSlug
                  }
                }
              }
          `,
              variables: {
                "userId": userDetails._id,
                "usersId": userDetails._id
              }
          }).then((result) => {
              console.log('subscription detail', result.data);
              setUserDetail(result.data.users);
              setSubscribedChannelList(result.data.subscriptionDetails)
              setIsFetched(true);
              
              return result.data
          });
        }
      }
    },[userDetails])
  
    const handleSubscribedCountAdd = ()=>{
      let count = showSubscribedCount + 4
      if(subscribedChannelList.length < count){
        count = subscribedChannelList.length
      }
      setShowSubscribedCount(count)
    }
    
    const handleSubscribedCountMinus = ()=>{
      let count = showSubscribedCount - 4
      if(subscribedShowLimit > count){
        count = subscribedShowLimit
      }
      setShowSubscribedCount(count)
    }
    
  
    return (
      <>
        {userDetail.length > 0?<SidebarLayout userData={userDetail}>
          <Head>
              <title>Subscribed Channels</title>
          </Head>
          <Container sx={{ mt: 3 }} maxWidth="false">
            <Card>
              <CardHeader title="Your Subscribed Channel List" />
              <Divider />
              <Box p={2}>
                <Grid container spacing={0}>
                  {subscribedChannelList.length > 0 ?
                    <>
                      {subscribedChannelList.slice(0, showSubscribedCount).map((subscriber, index) => (
                        <Grid key={index} item xs={12} sm={6} lg={3}>
                          <Box p={3} display="flex" alignItems="flex-start">
                            {subscriber.channelDetails[0].channelPicture?<Avatar  src={`${process.env.NEXT_PUBLIC_S3_URL}/${subscriber.channelDetails[0].channelPicture}`} />: <Avatar></Avatar>}
                            <Box pl={1}>
                              <Typography variant="h4" gutterBottom sx={{cursor: 'pointer'}} onClick={()=>router.push(`/channel/${subscriber.channelDetails[0].urlSlug}`)}>
                                {`${subscriber.channelDetails[0].channelName}`}
                              </Typography>
                              <Typography variant="h5" sx={{fontSize: '13px'}} gutterBottom>
                                Duration: {`${subscriber.planDuration} ${subscriber.planDurationUnit}`}
                              </Typography>
                              <Typography variant="h5" sx={{fontSize: '13px'}} gutterBottom>
                                Status: {`${subscriber.isActive}` == 'true'? 'Active': 'Inactive'}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                      <Box sx={{ width: '100%', textAlign: 'center'}}>
                        {showSubscribedCount === subscribedChannelList.length ? null : subscribedChannelList.length > subscribedShowLimit && <Button sx={{mr: '10px'}} variant='contained' onClick={handleSubscribedCountAdd}>Show More</Button>}
                        {showSubscribedCount === subscribedShowLimit ? null: <Button variant='contained' onClick={()=>setShowSubscribedCount(subscribedShowLimit)}>Show Less</Button>}
                      </Box>
                    </>
                  :
                    <Box sx={{width: '100%', textAlign: 'center'}}>
                      <Typography variant="h4" component='h4' gutterBottom>
                        Subscribed channels not found...
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
    );
  }
  
  export default SubscribeChannel;
  