// import { useEffect, useState, forwardRef } from 'react';
// import {
//   Grid,
//   Typography,
//   CardContent,
//   Card,
//   Box,
//   Divider,
//   Container,
// } from '@mui/material';
// import { useRouter } from 'next/router';


// function PaymentComplete(){

//     const router = useRouter();
//     const [loading, setLoading] = useState(true);
//     const [redirecting, setRedirecting] = useState(false);
//     const [countdown, setCountdown] = useState(5);
//     const channelName = router.query.channelName;

//     useEffect(() => {
//         if (channelName) {
//             setLoading(false);
//             const countdownInterval = setInterval(() => {
//                 setCountdown(prev => {
//                     if (prev <= 1) {
//                         clearInterval(countdownInterval);
//                         router.push(`/channel/${channelName}`);
//                         return 0;
//                     }
//                     return prev - 1;
//                 });
//             }, 1000);

//             return () => clearInterval(countdownInterval);
//         }
//     }, [channelName]);

//     return (
//         <>
//             {!loading && (
//                 <Container maxWidth="lg" sx={{ position: 'relative', top: '115px' }}>
//                     <Grid
//                         container
//                         direction="row"
//                         justifyContent="center"
//                         alignItems="stretch"
//                         spacing={3}
//                         mt={3}
//                     >
//                         <Card style={{ width: "97%" }}>
//                             <Divider />
//                             <Box>
//                                 <CardContent sx={{ p: 4 }}>
//                                     <Box p={10} textAlign={'center'}>
//                                         <Typography sx={{ fontWeight: 800, fontSize: 18 }} mb={1}>
//                                             Payment Successful!
//                                         </Typography>
//                                         <Typography sx={{ fontWeight: 500, fontSize: 18 }} mb={1}>
//                                             Thank you for your payment! We’ve successfully processed your transaction, and your subscription to  
//                                             {channelName ? <strong style={{color: '#8c7cf0'}}> {channelName.toUpperCase()} </strong>: ''}
//                                             is now active.
//                                         </Typography>
//                                         {countdown != 0 ? 
//                                             <Typography sx={{ fontSize: 16, mt: 2 }}>
//                                                 Redirecting to your channel in {countdown} seconds...
//                                             </Typography>
//                                         :
//                                             <Typography sx={{ fontSize: 16, mt: 2 }}>
//                                                 Redirecting...
//                                             </Typography>
//                                         }
                                        
//                                     </Box>
//                                 </CardContent>
//                             </Box>
//                         </Card>
//                     </Grid>
//                 </Container>
//             )}
//         </>
//     );

// }

// export default PaymentComplete