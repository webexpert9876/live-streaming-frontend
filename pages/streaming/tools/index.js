import { useState, useEffect } from "react";
import { Box, Card, Typography, CardContent, CardMedia, CardActionArea, CardActions, Button, Grid } from "@mui/material";
import { useRouter } from 'next/router';
// import CircularProgress from '@mui/material/CircularProgress';
import SidebarLayout from 'src/layouts/SidebarLayout';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthUser } from 'store/slices/authSlice';
import client from "../../../graphql";
import { gql } from "@apollo/client";

const headerMargin = {
    marginTop: "10px"
}

export default function StreamingTools(){
    const authState = useSelector(selectAuthUser)
    const router = useRouter();

    const [userData, setUserData] = useState([]);
    const [isUserAvailable, setIsUserAvailable] = useState(false);
    const [isFetchedApi, setIsFetchedApi] = useState(true);
    const [allowUser, setAllowUser] = useState(false);

    useEffect(()=>{
        async function getUserAllDetails(){
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
              
            if(roleInfo.data.roles[0].role == 'artist' || roleInfo.data.roles[0].role == "admin"){
                setAllowUser(true);
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
                            }
                        }
                    `,
                }).then((result) => {
                    setUserData(result.data.users);
                });
            } else {
                setAllowUser(false);
            }
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

    return (
        <>
            {userData.length > 0 &&
                allowUser && <SidebarLayout userData={userData}>
                    <Box sx={{ display: 'flex' }} style={headerMargin}>
                        <Box sx={{padding: "20px 40px 0px 40px"}}>
                            <Box>
                                <Typography variant="h3" component="h3">
                                    Streaming tools
                                </Typography>
                            </Box>
                            <Box sx={{ marginTop: "30px"}}>
                                <Grid container spacing={{ xs: 2, md: 3, lg: 3 }} columns={{ xs: 4, sm: 6, md: 8, lg: 10 }} >
                                    <Grid item xs={4} sm={4} md={4} lg={4}>
                                        <Card sx={{ maxWidth: 678, paddingBottom: "15px" }}>
                                            <CardActionArea>
                                                <CardMedia
                                                    component="img"
                                                    height="140"
                                                    image="/obs-2.svg"
                                                    alt="Obs"
                                                    sx={{objectFit: "contain", margin: "40px 0px"}}
                                                />
                                                <CardContent>
                                                    <Typography gutterBottom variant="h5" component="div">
                                                        OBS
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Free and open source software for video recording and live streaming.
                                                        Download and start streaming quickly and easily on Windows, Mac or Linux.
                                                    </Typography>
                                                </CardContent>
                                            </CardActionArea>
                                            <CardActions sx={{justifyContent: "center"}}>
                                                <Button variant="contained" size="small" onClick={()=>{ router.push("https://obsproject.com/download")}}>Download</Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                    {/* <Grid item xs={4} sm={4} md={4} lg={4}>
                                        <Card sx={{ maxWidth: 345, paddingBottom: "15px" }}>
                                            <CardActionArea>
                                                <CardMedia
                                                    component="img"
                                                    height="140"
                                                    image="/xspilt.png"
                                                    alt="Obs"
                                                    sx={{objectFit: "contain", margin: "40px 0px"}}
                                                />
                                                <CardContent>
                                                    <Typography gutterBottom variant="h5" component="div">
                                                        XSplit Broadcaster
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        XSplit is the best all-in-one streaming and recording solution for content creation.
                                                        It is mostly used for capturing gameplay for live streaming or video recording purposes.
                                                    </Typography>
                                                </CardContent>
                                            </CardActionArea>
                                            <CardActions sx={{justifyContent: "center"}}>
                                                <Button variant="contained" size="small" onClick={()=>{ router.push("https://www.xsplit.com/broadcaster")}}>Download</Button>
                                            </CardActions>
                                        </Card>
                                    </Grid> */}
                                </Grid>
                            </Box>
                        </Box>
                    </Box >
                </SidebarLayout>
            }
        </>
    )
}

