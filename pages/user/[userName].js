import client from "../../graphql";
import { gql } from "@apollo/client";
import { useState, useEffect } from "react";
import LeftMenu from '../../src/content/Overview/LeftMenu/index';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import { Box, Grid, Link, Typography, Container, Button, Card, CardMedia, CardContent, CardActionArea, IconButton, Avatar } from "@mui/material";
import styled from "@emotion/styled";
import React from 'react';
import { setAuthUser, setAuthState, selectAuthState, selectAuthUser } from '../../store/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import CircularProgress from '@mui/material/CircularProgress';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import CircleIcon from '@mui/icons-material/Circle';



const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function ChannelName() {
    const [userInfo, setUserInfo] = useState({});

    let userDetails = useSelector(selectAuthUser);
    let userIsLogedIn = useSelector(selectAuthState);
    const [userDetail, setUserDetail] = useState(userDetails);
    const [userAuthState, setUserAuthState] = useState(userIsLogedIn);
    const router = useRouter();
    const [isFetchingUser, setIsFetchingUser] = useState(false);
    const [userNameSlug, setUserNameSlug ] = useState('');
    const [isPageLoading, setIsPageLoading]= useState(true);
    const theme = useTheme();

    useEffect(async ()=>{
        if(!router.query.userName) {
            return;
        }
        
        setUserNameSlug(router.query.userName);
        setIsFetchingUser(true)

    }, [router.query.userName]);

    useEffect(async ()=>{

        if(isFetchingUser){
            let userInformation = await client.query({
                query: gql`
                    query Query ($urlSlug: String) {
                        users(urlSlug: $urlSlug) {
                            _id
                            firstName
                            lastName
                            profilePicture
                            email
                            interestedStyleDetail {
                              title
                              urlSlug
                            }
                        }
                    }
                `,
                variables: {
                    "urlSlug": userNameSlug
                }
            }).then((result) => {
                return result.data.users
            });
            console.log('userInfo', userInformation[0])
            setUserInfo(userInformation[0]);
           
            setIsFetchingUser(false)
            setIsPageLoading(false)
        }
    }, [isFetchingUser])
    

    const headerMargin = {
        marginTop: "90px"
    }
    return (
        <>
            <Box sx={{ display: 'flex' }} style={headerMargin}>
                <LeftMenu />
                {isPageLoading?
                    <Box sx={{textAlign: 'center', width: '100%', padding: '15%'}}>
                        <CircularProgress />
                        <Typography>
                            Loading...
                        </Typography>
                    </Box>
                :userInfo && <Box component="main" sx={{ flexGrow: 1, width: '100%', position: 'relative',}}>
                    <Box sx={{margin: '10px'}}>
                        <Card sx={{ display: 'flex' }}>
                            {/* <CardMedia
                                component="img"
                                sx={{ width: 151 }}
                                image="/static/images/cards/live-from-space.jpg"
                                alt="Live from space album cover"
                            /> */}
                            <Box sx={{display: 'flex'}}>
                                <Box sx={{margin: '30px 57px'}}>
                                    <Avatar sx={{minHeight: 250, minWidth: 250}} src={`${process.env.NEXT_PUBLIC_S3_URL}/${userInfo.profilePicture}`} />
                                    {/* <Box>
                                        <Typography gutterBottom variant="h5" component="div">
                                            Interested Style :
                                        </Typography>
                                        {userInfo.interestedStyleDetail.map((style, index)=>(
                                            <Typography variant="body2" color="text.secondary">
                                                {style.title}
                                            </Typography>
                                        ))}
                                    </Box> */}
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', margin: '30px 57px' }}>
                                    <CardContent sx={{ flex: '1 0 auto' }}>
                                        <Box sx={{ display: 'flex', padding: '2px'}}>
                                            <Typography gutterBottom variant="h4" component="div">
                                                {`Name : `} 
                                            </Typography>
                                            <Typography gutterBottom variant="h4" component="div">
                                                {`- ${userInfo.firstName} ${userInfo.lastName}`}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', padding: '2px'}}>
                                            <Typography gutterBottom variant="h4" component="div">
                                                {`Email : `} 
                                            </Typography>
                                            <Typography gutterBottom variant="h4" component="div">
                                                {`- ${userInfo.email}`}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ padding: '2px'}}>
                                            <Typography gutterBottom variant="h4" component="div">
                                                Interested Style :
                                            </Typography>
                                            {userInfo.interestedStyleDetail.map((style, index)=>(
                                                <Typography variant="h4" pl={'10px'} color="text.secondary">
                                                    {`- ${style.title}`}
                                                </Typography>
                                            ))}
                                        </Box>
                                    </CardContent>
                                </Box>
                            </Box>
                        </Card>
                        {/* <Card sx={{ maxWidth: 345, margin: 'auto' }}>
                            <CardActionArea>
                                
                                <Avatar sx={{minHeight: 250, minWidth: 250, margin: 'auto'}} src={`${process.env.NEXT_PUBLIC_S3_URL}/${userInfo.profilePicture}`} />
                                <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Name :
                                </Typography>
                                <Typography gutterBottom variant="h5" component="div">
                                    {userInfo.firstName} {userInfo.lastName}
                                </Typography>

                                <Typography gutterBottom variant="h5" component="div">
                                    Interested Style :
                                </Typography>
                                {userInfo.interestedStyleDetail.map((style, index)=>(
                                    <Typography variant="body2" color="text.secondary">
                                        {style.title}
                                    </Typography>
                                ))}
                                </CardContent>
                            </CardActionArea>
                        </Card> */}
                    </Box>
                </Box>}
            </Box >
        </>
    )
}
