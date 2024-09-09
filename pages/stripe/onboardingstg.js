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
import { Grid, Container, Box, Typography, Button } from '@mui/material';
import Footer from 'src/components/Footer';

import { useStripeConnect } from "../../hooks/useStripeConnect";
import {
  ConnectAccountOnboarding,
  ConnectComponentsProvider,
} from "@stripe/react-connect-js";

export default function Home() {
//   const [isFetched, setIsFetched]=useState(false);
//   const router = useRouter();
//   let userDetails = useSelector(selectAuthUser);
//   let userIsLogedIn = useSelector(selectAuthState);
//   const [userDetail, setUserDetail] = useState([]);
//   const [userConnectedAccountDetail, setUserConnectedAccountDetail] = useState(null);
//   const [email, setEmail] = useState('');
//   const [showComponent, setShowComponent] = useState(false);
  
  
//   const [accountCreatePending, setAccountCreatePending] = useState(false);
//   const [onboardingExited, setOnboardingExited] = useState(false);
//   const [error, setError] = useState(false);
//   const [connectedAccountId, setConnectedAccountId] = useState();
//   const stripeConnectInstance = useStripeConnect(connectedAccountId);


//   const handleAccountCreation = async () => {
//     setAccountCreatePending(true);
//     setError(false);

//     // const accountInfo = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get/account/${userDetail[0].channelId}`, { headers: { 'x-access-token': userDetail[0].jwtToken }})

//     // console.log("accountInfo", accountInfo);
    
//     // if(accountInfo.data.isFound) {
//     //   setAccountCreatePending(false);
//     //   setConnectedAccountId(accountInfo.data.account.connectAccountId)
//     // } else {

//       fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/create/connected/account`, {
//         method: "POST",
//       })
//         .then((response) => response.json())
//         .then(async (json) => {
//           console.log("userDetail ----", userDetail)
//           setAccountCreatePending(false);
//           const { account, error } = json;
  
//           if (account) {
//             const connectAccount = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create/account`,{connectAccountId: account, userId: userDetail[0]._id, channelId: userDetail[0].channelId, isAccountCreated: 'pending', isTransfer: 'inactive' }, { headers: { 'x-access-token': userDetail[0].jwtToken }})

//             setUserConnectedAccountDetail(connectAccount);
  
//             setConnectedAccountId(account);
//           }
  
//           if (error) {
//             setError(true);
//           }
//         });
//     // }
//   }


//   useEffect(()=>{
//     console.log('running')
//     if(userDetails && userIsLogedIn) {
//       if(!isFetched){
//         client.query({
//             query: gql`
//             query Query($usersId: ID, $channelId: String) {
//               users(id: $usersId) {
//                 _id
//                 firstName
//                 lastName
//                 username
//                 email
//                 password
//                 profilePicture
//                 urlSlug
//                 jwtToken
//                 role
//                 channelId
//                 channelDetails {
//                     channelName
//                     _id
//                     channelPicture
//                     channelCoverImage
//                     description
//                     subscribers
//                     userId
//                     urlSlug
//                     location
//                     createdAt
//                 }
//                 interestedStyleDetail {
//                 title
//                 _id
//                 }
//               }
//               getConnectAccountInfo(channelId: $channelId) {
//                 AccountPaymentStatus
//                 _id
//                 channelId
//                 connectAccountId
//                 isAccountCreated
//                 userId
//               }
//             }
//         `,
//             variables: {
//               "usersId": userDetails._id,
//               // "channelId": '650d7b91542338448f5daced'
//               "channelId": userDetails.channelId
//             }
//         }).then((result) => {
//             console.log('subscription detail', result.data);
//             let connectAccDetail = result.data.getConnectAccountInfo;
//             // if(connectAccDetail.length > 0){
//             //   setConnectedAccountId(connectAccDetail.connectAccountId)
//             //   setAccountCreatePending(false);
//             // }
//             setUserConnectedAccountDetail(connectAccDetail)
//             setUserDetail(result.data.users);
//             setIsFetched(true);
            

//             return result.data
//         });
//       }
//     }
//   },[userDetails])


//   const formExithandling = () => {

//   }

//   const handlePendingAccount = () =>{
//     setConnectedAccountId(userConnectedAccountDetail[0].connectAccountId)
//     setAccountCreatePending(false);
//   }

//   return (
//     <>
//       {userDetail.length > 0?<SidebarLayout userData={userDetail}>
//         <Head>
//             <title>Onboarding</title>
//         </Head>
//           <div className="container stripe-component">
//             <div className="banner" style={{margin: '20px 0px'}}>
//               <h2>Live Tattoo Streaming</h2>
//             </div>
//             {/* -------------------------------------------------------- Handle Create accounts ------------------------------------------------------- */}
//             {
//               (userConnectedAccountDetail[0]?.isAccountCreated == 'notCreated' || userConnectedAccountDetail[0] == null) &&
//               <div className="content">
//                 {/* {!connectedAccountId && <h2>Get ready for take off</h2>} */}
//                 {connectedAccountId && !stripeConnectInstance && <h2>Add information to start accepting money</h2>}
//                 {/* {!connectedAccountId && <p>live tattoo streaming is the world's leading air travel platform: join our team of pilots to help people travel faster.</p>} */}
//                 {!connectedAccountId && <Box style={{marginBottom: '25px'}}>
//                   <Typography component='h4' variant="h4">Create an Account to Monetize your channel by clicking the button below</Typography>
//                 </Box>}
//                 {!accountCreatePending && !connectedAccountId && (
//                   <div>
//                     <Button variant="contained" color="primary" onClick={handleAccountCreation}>Create account</Button>
//                   </div>
//                 )}
//                 {stripeConnectInstance && (
//                   <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
//                     <ConnectAccountOnboarding
//                       onExit={() => setOnboardingExited(true)}
//                     />
//                   </ConnectComponentsProvider>
//                 )}
//                 {error && <p className="error">Something went wrong!</p>}
//                 {(connectedAccountId || accountCreatePending || onboardingExited) && (
//                   <div className="dev-callout">
//                     {/* {connectedAccountId && <p>Your connected account ID is: <code className="bold">{connectedAccountId}</code></p>} */}
//                     {accountCreatePending && <p>Creating a connected account...</p>}
//                     {/* {onboardingExited && <p>The Account Onboarding component has exited</p>} */}
//                   </div>
//                 )}
//                 {/* <div className="info-callout">
//                   <p>
//                     This is a sample app for Connect onboarding using the Account Onboarding embedded component. <a href="https://docs.stripe.com/connect/onboarding/quickstart?connect-onboarding-surface=embedded" target="_blank" rel="noopener noreferrer">View docs</a>
//                   </p>
//                 </div> */}
//               </div>
//             }

// {/* -------------------------------------------------------- Handle pending accounts ------------------------------------------------------- */}
//             {
//               userConnectedAccountDetail[0]?.isAccountCreated == 'pending' &&
//                 <>
//                   <Box style={{marginBottom: '25px'}}>
//                     <Typography component='h4' variant="h4">Your account details is pending. Please fill the details to start monetizing your channel</Typography>
//                   </Box>
//                   <Box >

//                     {!accountCreatePending && !connectedAccountId && ( <Button variant="contained" color="primary" onClick={handlePendingAccount}>Start</Button> ) }
//                     {stripeConnectInstance && (
//                       <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
//                         <ConnectAccountOnboarding
//                           onExit={() => setOnboardingExited(true)}
//                         />
//                       </ConnectComponentsProvider>
//                     )}
//                     {error && <p className="error">Something went wrong!</p>}
//                     {/* {(connectedAccountId || accountCreatePending || onboardingExited) && (
//                       <div className="dev-callout">
//                         {connectedAccountId && <p>Your connected account ID is: <code className="bold">{connectedAccountId}</code></p>}
//                         {accountCreatePending && <p>Creating a connected account...</p>}
//                         {onboardingExited && <p>The Account Onboarding component has exited</p>}
//                       </div>
//                     )} */}
//                   </Box>
//                 </>
//             }
//             {/* -------------------------------------------------------- Handle pending accounts ------------------------------------------------------- */}
//             {
//               userConnectedAccountDetail[0]?.isAccountCreated == 'created' &&
//                 <>
//                   <Box>
//                     <Typography component='h4' variant="h4">Your account has been created and channel is monetized</Typography>
                    
//                   </Box>
//                 </>
//             }
//           </div>
//         <Footer />
//         </SidebarLayout>:null
//       }
//     </>
//   );
return (
  <>
    onboarding
  </>
)
}