import React, { useState, useEffect } from "react";
import SidebarLayout from 'src/layouts/SidebarLayout';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthUser, selectAuthState } from 'store/slices/authSlice';
import client from "../../graphql";
import { gql } from "@apollo/client";
import Head from 'next/head';
import PageHeader from 'src/content/Management/Transactions/PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container, Box, Typography, Button, Card, CardContent } from '@mui/material';
import Footer from 'src/components/Footer';

import { useStripeConnect } from "../../hooks/useStripeConnect";

import dynamic from 'next/dynamic';

// Dynamically import ConnectAccountOnboarding so it's not SSR'd
const ConnectAccountOnboarding = dynamic(
  () => import('@stripe/react-connect-js').then((mod) => mod.ConnectAccountOnboarding),
  { ssr: false }
);

const ConnectComponentsProvider = dynamic(
  () => import('@stripe/react-connect-js').then((mod) => mod.ConnectComponentsProvider),
  { ssr: false }
);

// import {
//   ConnectAccountOnboarding,
//   ConnectComponentsProvider,
// } from "@stripe/react-connect-js";

export default function StripeOnBoarding() {
  const [isFetched, setIsFetched]=useState(false);
  const router = useRouter();
  let userDetails = useSelector(selectAuthUser);
  let userIsLogedIn = useSelector(selectAuthState);
  const [userDetail, setUserDetail] = useState([]);
  const [userConnectedAccountDetail, setUserConnectedAccountDetail] = useState(null);
  const [email, setEmail] = useState('');
  const [showComponent, setShowComponent] = useState(false);
  
  
  const [accountCreatePending, setAccountCreatePending] = useState(false);
  const [onboardingExited, setOnboardingExited] = useState(false);
  const [error, setError] = useState(false);
  const [connectedAccountId, setConnectedAccountId] = useState();
  const stripeConnectInstance = useStripeConnect(connectedAccountId);


  const handleAccountCreation = async () => {
    setAccountCreatePending(true);
    setError(false);

    // const accountInfo = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get/account/${userDetail[0].channelId}`, { headers: { 'x-access-token': userDetail[0].jwtToken }})

    // console.log("accountInfo", accountInfo);
    
    // if(accountInfo.data.isFound) {
    //   setAccountCreatePending(false);
    //   setConnectedAccountId(accountInfo.data.account.connectAccountId)
    // } else {
      let data = {
        name: userDetail[0]?.channelDetails[0]?.channelName,
        channelId: userDetail[0].channelId,
        urlSlug: userDetail[0]?.channelDetails[0]?.urlSlug,
        userId: userDetail[0]?._id,
        email: userDetail[0]?.email
      }
      console.log("data metadata", data)
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/create/connected/account`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data)
        },
        )
        .then((response) => response.json())
        .then(async (json) => {
          console.log("userDetail ----", userDetail)
          setAccountCreatePending(false);
          const { account, error } = json;
  
          if (account) {
            const connectAccount = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create/account`,{connectAccountId: account, userId: userDetail[0]._id, channelId: userDetail[0].channelId, isAccountCreated: 'pending', isTransfer: 'inactive' }, { headers: { 'x-access-token': userDetail[0].jwtToken }})

            setUserConnectedAccountDetail(connectAccount);
  
            setConnectedAccountId(account);
          }
  
          if (error) {
            setError(true);
          }
        });
    // }
  }


  useEffect(()=>{
    console.log('running')
    if(userDetails && userIsLogedIn) {
      if(!isFetched){
        client.query({
            query: gql`
            query Query($usersId: ID, $channelId: String) {
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
              getConnectAccountInfo(channelId: $channelId) {
                AccountPaymentStatus
                _id
                channelId
                connectAccountId
                isAccountCreated
                userId
              }
            }
        `,
            variables: {
              "usersId": userDetails._id,
              // "channelId": '650d7b91542338448f5daced'
              "channelId": userDetails.channelId
            }
        }).then((result) => {
            console.log('subscription detail', result.data);
            let connectAccDetail = result.data.getConnectAccountInfo;
            // if(connectAccDetail.length > 0){
            //   setConnectedAccountId(connectAccDetail.connectAccountId)
            //   setAccountCreatePending(false);
            // }
            setUserConnectedAccountDetail(connectAccDetail)
            setUserDetail(result.data.users);
            setIsFetched(true);
            

            return result.data
        });
      }
    }
  },[userDetails])


  const handleStripeLogin =async () =>{
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/login/express/dashboard`, { connectAccountId: userConnectedAccountDetail[0].connectAccountId });
        router.push(response.data.loginLink.url);
    } catch (error) {
        console.error('Error creating account:', error);
    }
  }


  const handlePendingAccount = () =>{
    setConnectedAccountId(userConnectedAccountDetail[0].connectAccountId)
    setAccountCreatePending(false);
  }

  return (
    <>
      {userDetail.length > 0?<SidebarLayout userData={userDetail}>
        <Head>
            <title>Onboarding</title>
        </Head>
        <Box>
        {userConnectedAccountDetail[0]?.isAccountCreated == 'created' ?
            <Box className="container stripe-component add-plan-stripe-dash" sx={{marginTop: '50px', padding: 5}}>
              <Card sx={{width: '100%', height: 'auto'}}>
                <CardContent>
                  <Box className="add-plan-stripe-dash-box">
                    <Box>
                      <Typography variant="h4" component="h4">
                        {/* Connect Stripe by click on the below button */}
                        Add subscription plan by clicking the button below to earn money
                      </Typography>
                      <Box sx={{marginTop: '30px'}}>
                        <Button variant="contained" onClick={()=>router.push('/management/channel/subscription/list')}>Add Subscription plan</Button>
                      </Box>
                    </Box>
                    <Box className="vertical-line-box" > </Box>
                    <Box className="container stripe-component" >
                      <Typography variant="h4" component="h4">
                        {/* Connect Stripe by click on the below button */}
                        Go to Stripe dashboard by click on the below button.
                      </Typography>
                      <Box sx={{marginTop: '30px'}}>
                        <Button variant="contained" onClick={handleStripeLogin}>Go To Stripe</Button>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
              
            </Box>
          : 
            <div className="container stripe-component">
              <div className="banner" style={{margin: '20px 0px'}}>
                <h2>Live Tattoo Streaming</h2>
              </div>
              {/* -------------------------------------------------------- Handle Create accounts ------------------------------------------------------- */}
              {
                (userConnectedAccountDetail[0]?.isAccountCreated == 'notCreated' || userConnectedAccountDetail[0] == null) &&
                <div className="content">
                  {/* {!connectedAccountId && <h2>Get ready for take off</h2>} */}
                  {connectedAccountId && !stripeConnectInstance && <h2>Add information to start accepting money</h2>}
                  {/* {!connectedAccountId && <p>live tattoo streaming is the world's leading air travel platform: join our team of pilots to help people travel faster.</p>} */}
                  {!connectedAccountId && <Box style={{marginBottom: '25px'}}>
                    <Typography component='h4' variant="h4">Create an Account to Monetize your channel by clicking the button below</Typography>
                  </Box>}
                  {!accountCreatePending && !connectedAccountId && (
                    <div>
                      <Button variant="contained" color="primary" onClick={handleAccountCreation}>Create account</Button>
                    </div>
                  )}
                  {stripeConnectInstance && (
                    <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
                      <ConnectAccountOnboarding
                        onExit={() => setOnboardingExited(true)}
                      />
                    </ConnectComponentsProvider>
                  )}
                  {error && <p className="error">Something went wrong!</p>}
                  {(connectedAccountId || accountCreatePending || onboardingExited) && (
                    <div className="dev-callout">
                      {/* {connectedAccountId && <p>Your connected account ID is: <code className="bold">{connectedAccountId}</code></p>} */}
                      {accountCreatePending && <p>Creating a connected account...</p>}
                      {/* {onboardingExited && <p>The Account Onboarding component has exited</p>} */}
                    </div>
                  )}
                  {/* <div className="info-callout">
                    <p>
                      This is a sample app for Connect onboarding using the Account Onboarding embedded component. <a href="https://docs.stripe.com/connect/onboarding/quickstart?connect-onboarding-surface=embedded" target="_blank" rel="noopener noreferrer">View docs</a>
                    </p>
                  </div> */}
                </div>
              }

  {/* -------------------------------------------------------- Handle pending accounts ------------------------------------------------------- */}
              {
                userConnectedAccountDetail[0]?.isAccountCreated == 'pending' &&
                  <>
                    <Box style={{marginBottom: '25px'}}>
                      <Typography component='h4' variant="h4">Your stripe account details is pending. Please fill the details to start monetizing your channel</Typography>
                    </Box>
                    <Box >

                      {!accountCreatePending && !connectedAccountId && ( <Button variant="contained" color="primary" onClick={handlePendingAccount}>Start</Button> ) }
                      {stripeConnectInstance && (
                        <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
                          <ConnectAccountOnboarding
                            onExit={() => setOnboardingExited(true)}
                          />
                        </ConnectComponentsProvider>
                      )}
                      {error && <p className="error">Something went wrong!</p>}
                      {/* {(connectedAccountId || accountCreatePending || onboardingExited) && (
                        <div className="dev-callout">
                          {connectedAccountId && <p>Your connected account ID is: <code className="bold">{connectedAccountId}</code></p>}
                          {accountCreatePending && <p>Creating a connected account...</p>}
                          {onboardingExited && <p>The Account Onboarding component has exited</p>}
                        </div>
                      )} */}
                    </Box>
                  </>
              }
              {/* -------------------------------------------------------- Handle pending accounts ------------------------------------------------------- */}
              {/* {
                userConnectedAccountDetail[0]?.isAccountCreated == 'created' &&
                  <>
                    <Box>
                      <Typography component='h4' variant="h4">Your stripe account has been created and channel is monetized</Typography>
                    </Box>
                  </>
              } */}
            </div>
        }
        </Box>
        <Footer />
        </SidebarLayout>:null
      }
    </>
  );
}







// import { useEffect, useState } from 'react';
// import SidebarLayout from 'src/layouts/SidebarLayout';
// import axios from 'axios';
// import { useRouter } from 'next/router';
// import { useSelector, useDispatch } from 'react-redux';
// import { selectAuthUser, selectAuthState } from 'store/slices/authSlice';
// import client from "../../graphql";
// import { gql } from "@apollo/client";
// import Head from 'next/head';
// import PageHeader from 'src/content/Management/Transactions/PageHeader';
// import PageTitleWrapper from 'src/components/PageTitleWrapper';
// import { Grid, Container } from '@mui/material';
// import Footer from 'src/components/Footer';

// import RecentOrders from 'src/content/Management/Transactions/RecentOrders';

// import {loadConnectAndInitialize} from '@stripe/connect-js';
// import {
//   ConnectPayments,
// } from "@stripe/react-connect-js";

// import { ConnectAccountOnboarding, ConnectComponentsProvider } from "@stripe/react-connect-js";
  

// export default function onboarding(){
//     const [isFetched, setIsFetched]=useState(false);
//     const router = useRouter();
//     let userDetails = useSelector(selectAuthUser);
//     let userIsLogedIn = useSelector(selectAuthState);
//     const [userDetail, setUserDetail] = useState([]);
//     const [email, setEmail] = useState('');
//     const [showComponent, setShowComponent] = useState(false);



//     const [stripeConnectInstance] = useState(() => {
//         const fetchClientSecret = async () => {
//           // Fetch the AccountSession client secret
//           const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/account_session`, { method: "POST" });
//           if (!response.ok) {
//             // Handle errors on the client side here
//             const {error} = await response.json();
//             console.error('An error occurred: ', error);
//             // document.querySelector('#error').removeAttribute('hidden');
//             return undefined;
//           } else {
//             const {client_secret: clientSecret} = await response.json();
//             document.querySelector('#error').setAttribute('hidden', '');
//             return clientSecret;
//           }
//         }
    
//         return loadConnectAndInitialize({
//           // This is your test publishable API key.
//           publishableKey: "pk_test_51PMP4BLhsqLL49rZF55H8PhhtEaRVbtadTTHAMMuJ6inN6FfTk0ZOr7XPFrY8WeZOoJ6TWvuWartAroCkXur7QwL00sPp8tzfM",
//           fetchClientSecret: fetchClientSecret,
//         })
//     });



//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/create-account`, { email });
//             window.location.href = response.data.url;
//             setShowComponent(true)
//         } catch (error) {
//             console.error('Error creating account:', error);
//         }
//     };

//     useEffect(()=>{
//       console.log('running')
//       if(userDetails && userIsLogedIn) {
//         if(!isFetched){
//           client.query({
//               query: gql`
//               query Query($usersId: ID) {
//                 users(id: $usersId) {
//                   _id
//                   firstName
//                   lastName
//                   username
//                   email
//                   password
//                   profilePicture
//                   urlSlug
//                   jwtToken
//                   role
//                   channelId
//                   channelDetails {
//                       channelName
//                       _id
//                       channelPicture
//                       channelCoverImage
//                       description
//                       subscribers
//                       userId
//                       urlSlug
//                       location
//                       createdAt
//                   }
//                   interestedStyleDetail {
//                   title
//                   _id
//                   }
//                 }
//               }
//           `,
//               variables: {
//                 "usersId": userDetails._id
//               }
//           }).then((result) => {
//               console.log('subscription detail', result.data);
//               setUserDetail(result.data.users);
//               setIsFetched(true);
              
//               return result.data
//           });
//         }
//       }
//     },[userDetails])
  

//     return(
//         <>
//         {userDetail.length > 0?<SidebarLayout userData={userDetail}>
//             <Head>
//                 <title>Onboarding</title>
//             </Head>
//             {/* <PageTitleWrapper>
//                 <PageHeader />
//             </PageTitleWrapper> */}
//             {/* <Container maxWidth="lg">
//                 <Grid
//                 container
//                 direction="row"
//                 justifyContent="center"
//                 alignItems="stretch"
//                 spacing={3}
//                 >
//                 <Grid item xs={12}>
//                     <RecentOrders />
                    
//                 </Grid>
//                 </Grid>
//             </Container> */}
//             <div>
//               <h1>Complete Your Onboarding</h1>
//               <form onSubmit={handleSubmit}>
//                   <input
//                       type="email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       placeholder="Enter your email"
//                       required
//                   />
//                   <button type="submit">Start Onboarding</button>
//               </form>


//             {/* <div className="container">
//                 <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
//                     <ConnectPayments />
//                 </ConnectComponentsProvider>
//             </div> */}
            
//         </div>
//         {/* { showComponent && <div>
//             <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
//               <ConnectAccountOnboarding
//                   onExit={() => {
//                     console.log("The account has exited onboarding");
//                   }}
//                   // Optional: make sure to follow our policy instructions above
//                   // fullTermsOfServiceUrl="{{URL}}"
//                   // recipientTermsOfServiceUrl="{{URL}}"
//                   // privacyPolicyUrl="{{URL}}"
//                   // skipTermsOfServiceCollection={false}
//                   // collectionOptions={{
//                   //   fields: 'eventually_due',
//                   //   futureRequirements: 'include',
//                   // }}
//                 />
//             </ConnectComponentsProvider>
//         </div>} */}
//             <Footer />
//         </SidebarLayout>:null}
//       </>
//     )
// }