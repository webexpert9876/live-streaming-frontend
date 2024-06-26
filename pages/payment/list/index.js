import { useEffect, useState } from 'react';
import SidebarLayout from 'src/layouts/SidebarLayout';

import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthUser, selectAuthState } from 'store/slices/authSlice';
import client from "../../../graphql";
import { gql } from "@apollo/client";
import Head from 'next/head';
import PageHeader from 'src/content/Management/Transactions/PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from 'src/components/Footer';

import RecentOrders from 'src/content/Management/Transactions/RecentOrders';
  

export default function PaymentList(){
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
              }
          `,
              variables: {
                "usersId": userDetails._id
              }
          }).then((result) => {
              console.log('subscription detail', result.data);
              setUserDetail(result.data.users);
              setIsFetched(true);
              
              return result.data
          });
        }
      }
    },[userDetails])
  

    return(
        <>
        {userDetail.length > 0?<SidebarLayout userData={userDetail}>
            <Head>
                <title>Payment List</title>
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
                    <RecentOrders />
                </Grid>
                </Grid>
            </Container>
            <Footer />
        </SidebarLayout>:null}
      </>
    )
}