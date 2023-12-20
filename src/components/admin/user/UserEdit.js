import client from "../../../../graphql";
import { gql } from "@apollo/client";
import { useState, useEffect } from "react";
// import LeftMenu from 'src/content/Overview/LeftMenu/index';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import { 
    Box,
    Tooltip,
    Grid,
    Typography,
    Container,
    Button,
    Card,
    CardHeader,
    CardContent,
    IconButton,
    Avatar,
    Divider,
    TextField,
    FormControl,
    InputLabel,
    MenuItem,
    DialogTitle,
    DialogContent,
    DialogActions,
    Dialog,
    RadioGroup,
    FormControlLabel,
    Radio,
    Stack,
    Snackbar,
    Alert
} from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import styled from "@emotion/styled";
import React from 'react';
import { setAuthUser, setAuthState, selectAuthState, selectAuthUser } from '../../../../store/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import axios from "axios";
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import EditIcon from '@mui/icons-material/Edit';
import Text from '../../Text';


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const subscriberShowLimit = 8;
const subscribedChannelShowLimit = 8;
let followerShowLimit = 8;

export default function UserProfile({userDetail, selectedUserInfo, cancelBtnFunction, channelUpdateFunction}) {
    
    const [userInfo, setUserInfo] = useState({});
    const [selectedUserDetail, setSelectedUserDetail] = useState({});
    const router = useRouter();
    const [isPageLoading, setIsPageLoading]= useState(true);
    const theme = useTheme();
    const [roleList, setRoleList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userInput, setUserInput] = useState({
        role: '',
        blocked: false
    });
    const [subscribedChannelList, setSubscribedChannelList] = useState([]);
    const [showSubscribedChannelCount, setShowSubscribedChannelCount] = useState(subscribedChannelShowLimit);
    const [showSubscriptionCount, setShowSubscriptionCount] = useState(subscriberShowLimit);
    const [subscriberList, setSubscriberList] = useState([]);
    const [followerList, setFollowerList] = useState([]);
    const [showFollowerCount, setShowFollowerCount] = useState(followerShowLimit);
    const [errorObject, setErrorObject]= useState({
        reason: {
            error: false,
            message: 'Declined reason is required'
        },
        blockReason: {
            error: false,
            message: 'Block reason is required'
        }
    });
    const [open, setOpen] = useState(false);
    const [errorOpen, setErrorOpen] = useState(false);
    const [isUpdateUserDetail, setIsUpdateUserDetail] = useState(false);
    const [apiResponseMessage, setApiResponseMessage] = useState('');
    const [apiMessageType, setApiMessageType] = useState('');

    useEffect(async ()=>{
        client.query({
            query: gql`
            query Query{
                roles {
                    _id
                    role
                }
            }
        `,
        }).then((result) => {
            setRoleList(result.data.roles);
        });

        if(selectedUserInfo.channelId){
            client.query({
                variables: {
                    followersChannelId2: selectedUserInfo.channelId,
                    subscriptionDetailsChannelId2: selectedUserInfo.channelId
                },
                query: gql`
                query Query($followersChannelId2: String, $subscriptionDetailsChannelId2: String) {
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
                setSubscriberList(result.data.subscriptionDetails)
                setFollowerList(result.data.followers)
            });
        }

        client.query({
            variables: {
                subscriptionDetailsUserId: selectedUserInfo._id
            },
            query: gql`
            query Query($subscriptionDetailsUserId: String) {
                subscriptionDetails(userId: $subscriptionDetailsUserId) {
                    channelDetails {
                        channelName
                        channelPicture
                        urlSlug
                        userId
                        _id
                    }
                    userDetail {
                        profilePicture
                        lastName
                        firstName
                        _id
                    }
                    _id
                    isActive
                }
            }
        `,
        }).then((result) => {
            setSubscribedChannelList(result.data.subscriptionDetails);
        });

        setUserInput({
            role: selectedUserInfo.roleDetails[0]._id,
            blocked: selectedUserInfo.blocked
        });

        setUserInfo(userDetail[0]);
        setSelectedUserDetail(selectedUserInfo);
        setIsPageLoading(false)        
    }, [])

    useEffect(async ()=>{
        if(isUpdateUserDetail){

            const userUpdatedData = {
                id: selectedUserDetail._id,
                role: userInput.role,
                blocked: userInput.blocked
            }

            axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/update/user`, userUpdatedData, {headers: {'x-access-token': userInfo.jwtToken}}).then(async (data)=>{
                let userData = data.data.user

                setTimeout(async ()=>{
                    const updatedUserDetailObject = await client.query({
                        variables: {
                          usersId: userData._id,
                        },
                        query: gql`
                            query Query($usersId: ID) {
                                users(id: $usersId) {
                                    _id
                                    firstName
                                    lastName
                                    email
                                    username
                                    profilePicture
                                    urlSlug
                                    channelId
                                    blocked
                                    channelDetails {
                                        _id
                                        channelName
                                        description
                                        channelPicture
                                        createdAt
                                        isApproved
                                        urlSlug
                                    }
                                    roleDetails {
                                        role
                                        _id
                                    }
                                    interestedStyleDetail {
                                        _id
                                        title
                                        urlSlug
                                    }
                                }
                            }
                        `,
                    })

                    setApiMessageType('success');
                    setApiResponseMessage('User updated successfully');
                    handleMessageBoxOpen();
                    setSelectedUserDetail(updatedUserDetailObject.data.users[0]);
                    channelUpdateFunction(userData._id, updatedUserDetailObject.data.users[0])
                    setIsUpdateUserDetail(false);
                    setLoading(false);
                    handleClose();
                }, 0);
            }).catch((error)=>{
                console.log('error', error);
                setApiMessageType('error')

                let errorMessage;
                if(error.response){
                    errorMessage = error.response.data.message;
                }
                
                setApiResponseMessage(errorMessage);
                setIsUpdateUserDetail(false)
                setLoading(false);
                handleMessageBoxOpen();
            });
        }
    }, [isUpdateUserDetail])


    const handleFormSubmit = (e)=>{
        e.preventDefault();
        setIsUpdateUserDetail(true);
        setLoading(true);
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e) => {
        if(e.target.name == 'blocked'){
            setUserInput((prevState)=>({
                ...prevState,
                [e.target.name]: e.target.value == 'block'? true: false
            }))
        } else {
            setUserInput((prevState)=>({
                ...prevState,
                [e.target.name]: e.target.value
            }))
        }
    }

    const handleSubscribedChannelCountAdd = ()=>{
        let count = showSubscribedChannelCount + 4
        if(subscribedChannelList.length < count){
          count = subscribedChannelList.length
        }
        setShowSubscribedChannelCount(count)
    }
    
    const handleSubscriptionCountAdd = ()=>{
        let count = showSubscriptionCount + 4
        if(subscriberList.length < count){
          count = subscriberList.length
        }
        setShowSubscriptionCount(count)
    }

    const handleFollowerCountAdd = ()=>{
        let count = showFollowerCount + 4
        if(followerList.length < count){
          count = followerList.length
        }
        setShowFollowerCount(count)
    }

    const handleMessageBoxClose = () => {
        setErrorOpen(false);
        setApiResponseMessage('');
        setApiMessageType('')
    };
    
    const handleMessageBoxOpen = () => {
        setErrorOpen(true);
    };

    const inputStyle ={ padding: '2px', alignItems: 'center'}

    return (
        <>
            {Object.keys(selectedUserDetail).length > 0 && 
                <Container maxWidth="lg" >
                    <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="stretch"
                        spacing={3}
                        mt={3}
                    >
                        <Card style={{width: "97%"}}>
                            <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                                <Box sx={{display: 'flex'}}>
                                    <Tooltip arrow placement="top" title="Go back" disabled={loading} onClick={cancelBtnFunction}>
                                        <IconButton color="primary" sx={{ p: 2 }}>
                                            <ArrowBackTwoToneIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <CardHeader title="User List" />
                                </Box>
                                <Box sx={{display: 'flex'}}>
                                    <Tooltip arrow placement="top" title="Update profile" onClick={handleClickOpen}>
                                        <IconButton color="primary" sx={{ p: 2 }}>
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <CardHeader title="Update User details" />
                                </Box>
                            </Box>
                            <Divider />
                            <Box>
                                <CardContent sx={{ p: 4 }}>
                                    <Typography variant="subtitle2">
                                        <Box sx={{display: 'flex'}}>
                                            <Box sx={{margin: '30px 57px'}}>
                                                <Avatar sx={{minHeight: 250, minWidth: 250}} src={`${process.env.NEXT_PUBLIC_S3_URL}/${selectedUserDetail.profilePicture}`} />
                                            </Box>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', margin: '30px 57px' }}>
                                                <CardContent sx={{ flex: '1 0 auto', color: 'white' }}>
                                                    <Box sx={{display: 'flex', padding: '5px'}}>

                                                        <Box sx={{...inputStyle, marginRight: '15px'}}>
                                                            {/* <Typography gutterBottom variant="h4" component="h4">
                                                                {`First Name :- `} 
                                                            </Typography> */}
                                                            <Typography gutterBottom variant="div" component="div">
                                                                <TextField
                                                                    label="First Name"
                                                                    InputProps={{
                                                                        readOnly: true,
                                                                    }}
                                                                    value={`${selectedUserDetail.firstName}`}
                                                                />
                                                            </Typography>
                                                        </Box>
                                                        
                                                        <Box sx={{...inputStyle, marginRight: '15px'}}>
                                                            {/* <Typography gutterBottom variant="h4" component="h4">
                                                                {`Last Name :- `} 
                                                            </Typography> */}
                                                            <Typography gutterBottom variant="div" component="div">
                                                                <TextField
                                                                    label="Last Name"
                                                                    InputProps={{
                                                                        readOnly: true,
                                                                    }}
                                                                    value={`${selectedUserDetail.lastName}`}
                                                                />
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <Box sx={{display: 'flex', padding: '5px', marginRight: '15px'}}>

                                                        <Box sx={{...inputStyle, marginRight: '15px'}}>
                                                            {/* <Typography gutterBottom variant="h4" component="h4">
                                                                {`Email :- `}&nbsp;&nbsp;
                                                            </Typography> */}
                                                            <Typography gutterBottom variant="div" component="div">
                                                                <TextField
                                                                    label="Email"
                                                                    InputProps={{
                                                                        readOnly: true,
                                                                    }}
                                                                    value={`${selectedUserDetail.email}`}
                                                                />
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{...inputStyle, marginRight: '15px'}}>
                                                            {/* <Typography gutterBottom variant="h4" component="div">
                                                                {`Username :- `} &nbsp;&nbsp;
                                                            </Typography> */}
                                                            <Typography gutterBottom variant="div" component="div">
                                                                <TextField
                                                                    label="Username"
                                                                    InputProps={{
                                                                        readOnly: true,
                                                                    }}
                                                                    value={`${selectedUserDetail.username}`}
                                                                />
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <Box sx={{ ...inputStyle, padding: '5px', marginRight: '15px'}}>
                                                        {/* <Typography gutterBottom variant="h4" component="div">
                                                            {`Role :- `} &nbsp;&nbsp;
                                                        </Typography> */}
                                                        <Typography gutterBottom variant="div" component="div">
                                                            <TextField
                                                                label="Role"
                                                                InputProps={{
                                                                    readOnly: true,
                                                                }}
                                                                value={`${selectedUserDetail.roleDetails[0].role}`}
                                                            />
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ padding: '5px'}}>
                                                        <Typography gutterBottom variant="h4" component="h4" sx={{fontWeight: 500}}>
                                                            Interested Style :
                                                        </Typography>
                                                        <Box sx={{display: 'flex', flexWrap: 'wrap'}}>
                                                            {selectedUserDetail.interestedStyleDetail.map((style, index)=>(
                                                                <Typography key={index} variant="h4" pb={1} color="text.secondary">
                                                                    <Button key={index} variant="contained" sx={{
                                                                        fontWeight: 400,
                                                                        fontSize: '0.8rem',
                                                                        borderRadius: '50px',
                                                                        padding: '0.5em 1em',
                                                                        margin: '0 0.2em', 
                                                                        minWidth: 'fit-content', 
                                                                    }}>
                                                                        {style.title}
                                                                    </Button>
                                                                </Typography>
                                                            ))}
                                                        </Box>
                                                    </Box>
                                                </CardContent>
                                            </Box>
                                        </Box>
                                    </Typography>
                                    {/* <Typography sx={{textAlign: 'end'}}>
                                        <Button onClick={cancelBtnFunction} disabled={loading}>Cancel</Button>
                                        <Button onClick={handleFormSubmit} disabled={errorObject.reason.error? true: loading}>{loading ? 'Updating Channel...' : 'Update Channel'}</Button>
                                    </Typography> */}
                                </CardContent>
                            </Box>
                            
                            
                            <>
                                <Divider/>
                                <Box>
                                    <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                                        <Box sx={{display: 'flex'}}>
                                            <CardHeader title="Subscribed Channels" />
                                        </Box>
                                    </Box>
                                    <Divider/>
                                    <Box>
                                        <CardContent sx={{ p: 4 }}>
                                            <Grid container spacing={0}>
                                                {subscribedChannelList.length > 0 ?
                                                    <>
                                                        {subscribedChannelList.slice(0, showSubscribedChannelCount).map((subscriber, index) => (
                                                            <Grid key={index} item xs={12} sm={6} lg={3}>
                                                                <Box p={3} display="flex" alignItems="flex-start">
                                                                    {subscriber.channelDetails[0].channelPicture?<Avatar  src={`${process.env.NEXT_PUBLIC_S3_URL}/${subscriber.channelDetails[0].channelPicture}`} />: <Avatar></Avatar>}
                                                                    <Box pl={1}>
                                                                        <Typography variant="h4" gutterBottom>
                                                                            {subscriber.channelDetails[0].channelName}
                                                                        </Typography>
                                                                        {/* <Typography variant="h5" sx={{fontSize: '13px'}} gutterBottom>
                                                                            Duration: {`${subscriber.planDuration} ${subscriber.planDurationUnit}`}
                                                                        </Typography> */}
                                                                        <Typography variant="h5" sx={{fontSize: '13px'}} gutterBottom>
                                                                            Status: {`${subscriber.isActive}` == 'true'? 'Active': 'Inactive'}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </Grid>
                                                        ))}
                                                        <Box sx={{ width: '100%', textAlign: 'center'}}>
                                                            {showSubscribedChannelCount === subscribedChannelList.length ? null : subscribedChannelList.length > subscribedChannelShowLimit && <Button sx={{mr: '10px'}} variant='contained' onClick={handleSubscribedChannelCountAdd}>Show More</Button>}
                                                            {showSubscribedChannelCount === subscribedChannelShowLimit ? null: <Button variant='contained' onClick={()=>setShowSubscribedChannelCount(subscribedChannelShowLimit)}>Show Less</Button>}
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
                                        </CardContent>
                                    </Box>
                                </Box>
                            </>

                            {selectedUserDetail.roleDetails[0].role == 'artist' &&
                                <>
                                    <Divider/>
                                    <Box>
                                        <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                                            <Box sx={{display: 'flex'}}>
                                                <CardHeader title="Channel Subscribers" />
                                            </Box>
                                        </Box>
                                        <Divider/>
                                        <Box>
                                            <CardContent sx={{ p: 4 }}>
                                                <Grid container spacing={0}>
                                                    {subscriberList.length > 0 ?
                                                        <>
                                                            {subscriberList.slice(0, showSubscriptionCount).map((subscriber, index) => (
                                                                <Grid key={index} item xs={12} sm={6} lg={3}>
                                                                    <Box p={3} display="flex" alignItems="flex-start">
                                                                        {subscriber.userDetail[0].profilePicture?<Avatar  src={`${process.env.NEXT_PUBLIC_S3_URL}/${subscriber.userDetail[0].profilePicture}`} />: <Avatar></Avatar>}
                                                                        <Box pl={1}>
                                                                            <Typography variant="h4" gutterBottom>
                                                                                {`${subscriber.userDetail[0].firstName} ${subscriber.userDetail[0].lastName}`}
                                                                            </Typography>
                                                                            {/* <Typography variant="h5" sx={{fontSize: '13px'}} gutterBottom>
                                                                                Duration: {`${subscriber.planDuration} ${subscriber.planDurationUnit}`}
                                                                            </Typography> */}
                                                                            <Typography variant="h5" sx={{fontSize: '13px'}} gutterBottom>
                                                                                Status: {`${subscriber.isActive}` == 'true'? 'Active': 'Inactive'}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Box>
                                                                </Grid>
                                                            ))}
                                                            <Box sx={{ width: '100%', textAlign: 'center'}}>
                                                                {showSubscriptionCount === subscriberList.length ? null : subscriberList.length > subscriberShowLimit && <Button sx={{mr: '10px'}} variant='contained' onClick={handleSubscriptionCountAdd}>Show More</Button>}
                                                                {showSubscriptionCount === subscriberShowLimit ? null: <Button variant='contained' onClick={()=>setShowSubscriptionCount(subscriberShowLimit)}>Show Less</Button>}
                                                            </Box>
                                                        </>
                                                    :
                                                        <Box sx={{width: '100%', textAlign: 'center'}}>
                                                            <Typography variant="h4" component='h4' gutterBottom>
                                                                Subscribers not found...
                                                            </Typography>
                                                        </Box>
                                                    }
                                                </Grid>
                                            </CardContent>
                                        </Box>
                                    </Box>
                                </>
                            }

                            {selectedUserDetail.roleDetails[0].role == 'artist' &&
                                <> 
                                    <Divider/>
                                    <Box>
                                        <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                                            <Box sx={{display: 'flex'}}>
                                                <CardHeader title="Channel Followers" />
                                            </Box>
                                        </Box>
                                        <Divider/>
                                        <Box>
                                            <CardContent sx={{ p: 4 }}>
                                                <Grid container spacing={0}>
                                                    {followerList.length > 0 ?
                                                        <>
                                                            {followerList.slice(0, showFollowerCount).map((follower, index) => (
                                                                <Grid key={index} item xs={12} sm={6} lg={3}>
                                                                <Box p={3} display="flex" alignItems="center">
                                                                    {follower.userDetails[0].profilePicture?<Avatar src={`${process.env.NEXT_PUBLIC_S3_URL}/${follower.userDetails[0].profilePicture}`} />: <Avatar></Avatar>}
                                                                    <Box pl={1}>
                                                                    {/* <Typography gutterBottom variant="subtitle2">
                                                                        {_feed.company}
                                                                    </Typography> */}
                                                                    <Typography variant="h4" gutterBottom>
                                                                        {`${follower.userDetails[0].firstName} ${follower.userDetails[0].lastName}`}
                                                                    </Typography>
                                                                    {/* <Typography color="text.primary" sx={{ pb: 2 }}>
                                                                        {_feed.jobtitle}
                                                                    </Typography>
                                                                    <Button
                                                                        variant="outlined"
                                                                        size="small"
                                                                        startIcon={<AddTwoToneIcon />}
                                                                    >
                                                                        Follow
                                                                    </Button> */}
                                                                    </Box>
                                                                </Box>
                                                                </Grid>
                                                            ))}
                                                            <Box sx={{ width: '100%', textAlign: 'center'}}>
                                                                {showFollowerCount === followerList.length ? null : followerList.length > followerShowLimit && <Button sx={{mr: '10px'}} variant='contained' onClick={handleFollowerCountAdd}>Show More</Button>}
                                                                {showFollowerCount === followerShowLimit ? null: <Button variant='contained' onClick={()=>setShowFollowerCount(followerShowLimit)}>Show Less</Button>}
                                                            </Box>
                                                        </>
                                                    :
                                                        <Box sx={{width: '100%', textAlign: 'center'}}>
                                                            <Typography variant="h4" component='h4' gutterBottom>
                                                                Followers not found...
                                                            </Typography>
                                                        </Box>
                                                    }
                                                </Grid>
                                            </CardContent>
                                        </Box>
                                    </Box>
                                </>
                            }
                        </Card>
                    </Grid>
                </Container>
            }
            <>
                <Dialog fullWidth={true} maxWidth='sm' open={open} onClose={handleClose}>
                    <DialogTitle>Edit User Detail</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={0} mt={1} >
                            <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                                <Box mt={1} pr={3} pb={2}>
                                    User Role:
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={8} md={9}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">User Role</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={userInput.role}
                                        label="User Role"
                                        name="role"
                                        onChange={handleChange}
                                    >
                                        {
                                            roleList.map((role, index)=>(
                                                <MenuItem key={index} value={role._id}>{role.role}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={0} mt={1}>
                            <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                                <Box mt={1} pr={3} pb={2}>
                                    Block channel:
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={8} md={9}>
                                <FormControl>
                                    {/* <FormLabel id="demo-radio-buttons-group-label"> Gender</FormLabel> */}
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        value={`${userInput.blocked}` == `true` ?'block':'unblock'}
                                        name="blocked"
                                        onChange={handleChange}
                                    >
                                        <Box sx={{display: 'flex'}}>
                                            <FormControlLabel value="block" control={<Radio />} label="Block" />
                                            <FormControlLabel value="unblock" control={<Radio />} label="Unblock" />
                                        </Box>
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} disabled={loading}>Cancel</Button>
                        <Button onClick={handleFormSubmit} disabled={loading}>Update</Button>
                    </DialogActions>
                </Dialog>
            </>
            
            {/* --------------------------------------------------------Error or success message------------------------------------------ */}
            <Stack spacing={2} sx={{ width: '100%' }}>
                <Snackbar anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }} open={errorOpen} autoHideDuration={6000} onClose={handleMessageBoxClose} >
                <Alert onClose={handleMessageBoxClose} variant="filled" severity={`${apiMessageType=='success'? 'success': 'error'}`} sx={{ width: '100%' }}>
                    {apiResponseMessage}
                </Alert>
                </Snackbar>
            </Stack>
        </>
    )
}






// import Head from 'next/head';
// import { useState, useEffect, useRef } from 'react';
// import { Grid, Container } from '@mui/material';
// import {
//     Tooltip,
//     IconButton,
//     Divider,
//     Box,
//     FormControl,
//     InputLabel,
//     FormLabel,
//     Radio,
//     RadioGroup,
//     FormControlLabel,
//     Card,
//     Select,
//     MenuItem,
//     Typography,
//     useTheme,
//     CardHeader,
//     CardContent,
//     NativeSelect,
//     TextField,
//     Button,
//     Avatar,
//     Slider,
//     Alert
// } from '@mui/material';
// import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';

// import { useRouter } from 'next/router';
// import { useSelector, useDispatch } from 'react-redux';
// import { selectAuthUser } from 'store/slices/authSlice';
// import client from "../../../../graphql";
// import { gql } from "@apollo/client";
// import axios from 'axios';
// import Text from '../../Text';
// import { WithContext as ReactTags } from 'react-tag-input';
// import AvatarEditor from 'react-avatar-editor';
// import {v4 as uuidv4} from 'uuid';
// import Stack from '@mui/material/Stack';
// import Snackbar from '@mui/material/Snackbar';
// import MuiAlert from '@mui/material/Alert';
// import { socket } from '../../../../socket';


// function ChannelEdit({userData, channelDetail, cancelBtnFunction, channelUpdateFunction}){
//     const router = useRouter();
//     const [userInfo, setUserInfo] = useState([]);

//     // console.log('channelDetail', channelDetail)

//     const [channelInput, setChannelInput] = useState({
//         isApproved: 'pending',
//         blocked: false,
//         reason: '',
//         blockReason: ''
//     })
//     const [channelData, setChannelData] = useState({});
//     const [isChannelStatusChanged, setIsChannelStatusChanged] = useState(false);
//     const [channelNewStatus, setChannelNewStatus] = useState('');
//     const [channelStatusNotification, setChannelStatusNotification] = useState('');
//     const [blockStatusNotification, setBlockStatusNotification] = useState('');

//     // -------------------------Error state------------------------
//     const [loading, setLoading] = useState(false);
//     const [apiResponseMessage, setApiResponseMessage] = useState('');

//     const [open, setOpen] = useState(false);
//     const [apiMessageType, setApiMessageType] = useState('');
//     const [errorObject, setErrorObject]= useState({
//         reason: {
//             error: false,
//             message: 'Declined reason is required'
//         },
//         blockReason: {
//             error: false,
//             message: 'Block reason is required'
//         }
//     });

//     // const [openTitleError, setOpenTitleError] = useState(false)
//     // const [titleErrorMessage, setTitleErrorMessage] = useState('Tattoo category title is required')
//     // const [openDescriptionError, setOpenDescriptionError] = useState(false)
//     // const [descriptionErrorMessage, setDescriptionErrorMessage] = useState('Tattoo category description is required')
//     const [isUpdatingChannel, setIsUpdatingChannel] = useState(false);

//     const filterStatusOption = {
//         approved: 'approved',
//         declined: 'declined',
//         pending: 'pending'
//     };

//     useEffect(()=>{

//         if(channelDetail){
//             setChannelData(channelDetail);
//             setChannelInput({
//                 isApproved: channelDetail.isApproved,
//                 blocked: channelDetail.blocked,
//                 reason: channelDetail.isApproved?channelDetail.reason:'',
//                 blockReason: channelDetail.blocked? channelDetail.reason: ''
//             })
//         }
        
//         if(userData.length > 0){
//             setUserInfo(userData[0]);
//         }
//     }, [])

//     useEffect(async()=>{
//         if(isUpdatingChannel){
//             const formData = new FormData();
//             formData.append('id', channelData._id);
//             formData.append('isApproved', channelInput.isApproved);
//             formData.append('blocked', channelInput.blocked);
//             formData.append('reason', channelInput.reason);
//             formData.append('isChannelStatusChanged', isChannelStatusChanged);
//             formData.append('channelNewStatus', channelNewStatus);
//             formData.append('blockReason', channelInput.blockReason);
            
//             await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/update/channel`, formData, {headers: {'x-access-token': userData[0].jwtToken}
//             }).then((data)=>{
//                 // tagResult = data.data.success
//                 // tags.forEach(tag => {
//                 //     // Check if the value does not exist in the objectArray
//                 //     if (!suggestions.some(obj => obj.text === tag.text)) {

//                 //         // Create a new object and add it to the array
//                 //         let newObj = { id: tag.text, text: tag.text };
//                 //         setSuggestions([...suggestions, newObj]);
//                 //         tagUpdateFunction([...suggestions, newObj])
//                 //     }
//                 // });
//                 setApiMessageType('success');
//                 setApiResponseMessage('Channel updated successfully');
//                 // console.log('data.data.channelData._id', data.data.channelData._id)
//                 let channelApiData = data.data.channelData;

//                 if(channelStatusNotification == channelApiData.isApproved && channelApiData.isApproved != 'pending'){
                    
//                     // Emitting socket event for channel approve notification.
//                     socket.emit('channelApproveNotification', {receiverUserId: channelData.userId, userDetails: userInfo, status: channelApiData.isApproved, reason: channelInput.reason});

//                 } else if(`${channelApiData.blocked}` == blockStatusNotification){

//                     // Emitting socket event for channel approve notification.
//                     socket.emit('channelBlockNotification', {receiverUserId: channelData.userId, userDetails: userInfo, status: `${channelApiData.blocked}`, reason: channelInput.blockReason});
//                 }

//                 channelUpdateFunction(data.data.channelData._id, data.data.channelData)
//                 setChannelStatusNotification('');
//                 setBlockStatusNotification('');
//                 setIsUpdatingChannel(false)
//                 setLoading(false);
//                 handleMessageBoxOpen()
//                 setTimeout(() => {
//                     cancelBtnFunction();
//                 }, 1000);
//             }).catch((error)=>{
//                 console.log('error', error);
//                 setApiMessageType('error')

//                 let errorMessage;
//                 if(error.response){
//                     errorMessage = error.response.data.message;
//                 }
                
//                 handleMessageBoxOpen()
//                 setApiResponseMessage(errorMessage);
//                 setIsUpdatingChannel(false)
//                 setLoading(false);
//             });
            
//             // if(tagResult){
//             //     axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/update/category`, formData, {headers: {'x-access-token': userData[0].jwtToken, 'Content-Type': 'multipart/form-data'}
//             //     }).then((data)=>{
                    
//             //         setApiMessageType('success');
//             //         setApiResponseMessage('Tattoo category update successfully');
                    
//             //         categoryUpdateFunction(data.data.tattoCategoryData._id, data.data.tattoCategoryData)
//             //         setIsUpdatingChannel(false)
//             //         setLoading(false);
//             //         handleMessageBoxOpen()
//             //     }).catch((error)=>{
//             //         console.log('error', error);
//             //         setApiMessageType('error')
//             //         const errorMessage = error.response.data.message;
                    
//             //         handleMessageBoxOpen()
//             //         setApiResponseMessage(errorMessage);
//             //         setIsUpdatingChannel(false)
//             //         setLoading(false);
//             //     });
//             // }
//         }
//     }, [isUpdatingChannel])

//     const handleFormChange = (e)=>{

//         if(e.target.name == 'title'){
//             // console.log('e.target.value', e.target.value)
//             setChannelInput((prevState)=>({
//                 ...prevState,
//                 [e.target.name]: e.target.value
//             }))

//             if(e.target.value){
//                 setOpenTitleError(false)
//             } else {
                
//                 setOpenTitleError(true)
//                 // setTitleErrorMessage('Video title is required');
//             }
//         } else if(e.target.name == 'description'){
//             setChannelInput((prevState)=>({
//                 ...prevState,
//                 [e.target.name]: e.target.value
//             }))

//             if(e.target.value){
//                 setOpenDescriptionError(false)
//             } else {
//                 setOpenDescriptionError(true)
//                 // setDescriptionErrorMessage('Video description is required');
//             }
//         }
//     }

//     const handleFormSubmit = (e)=>{
//         e.preventDefault();

//         let isError = false;
//         let message = '';

//         if(channelData.isApproved != channelInput.isApproved){
//             setChannelStatusNotification(channelInput.isApproved);
//             setIsChannelStatusChanged(true);
//             setChannelNewStatus(channelInput.isApproved);
//         } else {
//             setIsChannelStatusChanged(false);
//             setChannelNewStatus(channelInput.isApproved);
//         }



//         if(channelInput.isApproved == 'declined' && !channelInput.reason){
//             isError = true
//             message = 'Please Enter Declined Reason'
//         }

//         let blockReasonError = false;
//         // if(!channelInput.blockReason && !channelInput.blocked){
//         //     console.log('in if blockReasonError');
//         //     blockReasonError = true
//         // }

//         if(`${channelData.blocked}` != `${channelInput.blocked}`){
//             setBlockStatusNotification(`${channelInput.blocked}`);
//         }

//         if(`${channelInput.blocked}` == `true`){
//             if(!channelInput.blockReason && channelInput.blocked){
//                 blockReasonError = true
//             }
//         }

//         if((channelInput.isApproved != null || channelInput.isApproved != undefined) && !isError && !blockReasonError){
//             // console.log('true')
//             setIsUpdatingChannel(true);
//             setLoading(true);
//             setErrorObject((prevState) => ({...prevState, ['reason']: { error: false, message: '' } }));
//         } else {
//             // console.log('false')
//             setErrorObject((prevState) => ({...prevState, ['reason']: { error: isError, message: message } }));
//             setErrorObject((prevState) => ({ ...prevState, ['blockReason']: { error: true, message: 'Please provide block reason' } }));
//             setApiMessageType('error')
//             setApiResponseMessage('Please enter all the details.');
//             setOpen(true);
//         }
//     }

//     const handleMessageBoxClose = () => {
//         setOpen(false);
//         setApiResponseMessage('');
//         setApiMessageType('')
//     };
//     const handleMessageBoxOpen = () => {
//         setOpen(true);
//     };

//     const handleChange = (e) => {
//         if(e.target.name == 'isApproved'){
//             setChannelInput((prevState)=>({
//                 ...prevState,
//                 [e.target.name]: filterStatusOption[e.target.value]
//             }));
//             setErrorObject((prevState) => ({ ...prevState, ['reason']: { error: false, message: '' } }));
//         } else if(e.target.name == 'blocked'){
//             setChannelInput((prevState)=>({
//                 ...prevState,
//                 [e.target.name]: e.target.value == 'block'? 'true': 'false'
//             }))
//         } else if(e.target.name == 'reason'){
            
//             if(errorObject.reason.error){
//                 setErrorObject((prevState) => ({ ...prevState, ['reason']: { error: false, message: '' } }));
//             }
//             setChannelInput((prevState)=>({
//                 ...prevState,
//                 [e.target.name]: e.target.value
//             }))
//         } else if(e.target.name == 'blockReason'){
            
//             if(errorObject.blockReason.error){
//                 setErrorObject((prevState) => ({ ...prevState, ['blockReason']: { error: false, message: '' } }));
//             }
//             setChannelInput((prevState)=>({
//                 ...prevState,
//                 [e.target.name]: e.target.value
//             }))
//         }
//     };

//     return(
//         <>
//             <Container maxWidth="lg" >
//                 <Grid
//                     container
//                     direction="row"
//                     justifyContent="center"
//                     alignItems="stretch"
//                     spacing={3}
//                     mt={3}
//                 >
//                     {/* <Grid item xs={12}></Grid> */}
//                     <Card style={{width: "97%"}}>
//                         <Box sx={{display: 'flex'}}>
//                             <Tooltip arrow placement="top" title="Go back" disabled={loading} onClick={cancelBtnFunction}>
//                                 <IconButton color="primary" sx={{ p: 2 }}>
//                                     <ArrowBackTwoToneIcon />
//                                 </IconButton>
//                             </Tooltip>
//                             <CardHeader
//                                 title="Update User"
//                             />
//                         </Box>
//                         <Divider />
//                         <Box>
//                             <CardContent sx={{ p: 4 }}>
//                                 <Typography variant="subtitle2">
//                                     <Grid container spacing={0}>
//                                         <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
//                                             <Box mt={1} pr={3} pb={2}>
//                                                 Approve channel:
//                                             </Box>
//                                         </Grid>
//                                         <Grid item xs={12} sm={8} md={9}>
//                                             <FormControl>
//                                                 {/* <FormLabel id="demo-radio-buttons-group-label"> Gender</FormLabel> */}
//                                                 <RadioGroup
//                                                     aria-labelledby="demo-radio-buttons-group-label"
//                                                     // value={channelInput.isApproved == `true` ?'approve':'unapprove'}
//                                                     value={filterStatusOption[channelInput.isApproved]}
//                                                     name="isApproved"
//                                                     onChange={handleChange}
//                                                 >
//                                                     <Box sx={{display: 'flex'}}>
//                                                         <FormControlLabel value="approved" control={<Radio />} label="Approve" />
//                                                         <FormControlLabel value="declined" control={<Radio />} label="Decline" />
//                                                         <FormControlLabel value="pending" control={<Radio />} label="Pending" />
//                                                     </Box>
//                                                 </RadioGroup>
//                                             </FormControl>
//                                             {/* {openDescriptionError?<Box sx={{color: 'red', fontWeight: 600}}>
//                                                 {descriptionErrorMessage}
//                                             </Box>: null} */}
//                                         </Grid>
//                                         {channelInput.isApproved == 'declined' && 
//                                             <>
//                                                 <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
//                                                     <Box mt={1} pr={3} pb={2}>
//                                                         Declined reason:
//                                                     </Box>
//                                                 </Grid>
//                                                 <Grid item xs={12} sm={8} md={9}>
//                                                     <Text color="black">
//                                                         <TextField
//                                                             autoFocus
//                                                             margin="dense"
//                                                             id="reason"
//                                                             multiline
//                                                             rows={4}
//                                                             type="text"
//                                                             fullWidth
//                                                             name='reason'
//                                                             value={channelInput.reason}
//                                                             onChange={handleChange}
//                                                             required
//                                                             error={errorObject.reason.error}
//                                                             helperText={errorObject.reason.error?errorObject.reason.message:null}
//                                                         />
//                                                     </Text>    
//                                                     {/* {openDescriptionError?<Box sx={{color: 'red', fontWeight: 600}}>
//                                                         {descriptionErrorMessage}
//                                                     </Box>: null} */}
//                                                 </Grid>
//                                             </>
//                                         }
//                                         <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
//                                             <Box mt={1} pr={3} pb={2}>
//                                                 Block user:
//                                             </Box>
//                                         </Grid>
//                                         <Grid item xs={12} sm={8} md={9}>
//                                             <FormControl>
//                                                 {/* <FormLabel id="demo-radio-buttons-group-label"> Gender</FormLabel> */}
//                                                 <RadioGroup
//                                                     aria-labelledby="demo-radio-buttons-group-label"
//                                                     value={`${channelInput.blocked}` == `true` ?'block':'unblock'}
//                                                     name="blocked"
//                                                     onChange={handleChange}
//                                                 >
//                                                     <Box sx={{display: 'flex'}}>
//                                                         <FormControlLabel value="block" control={<Radio />} label="Block" />
//                                                         <FormControlLabel value="unblock" control={<Radio />} label="Unblock" />
//                                                     </Box>
//                                                 </RadioGroup>
//                                             </FormControl>
//                                         </Grid>
//                                         {`${channelInput.blocked}` == 'true' && 
//                                             <>
//                                                 <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
//                                                     <Box mt={1} pr={3} pb={2}>
//                                                         Block reason:
//                                                     </Box>
//                                                 </Grid>
//                                                 <Grid item xs={12} sm={8} md={9}>
//                                                     <Text color="black">
//                                                         <TextField
//                                                             autoFocus
//                                                             margin="dense"
//                                                             id="blockReason"
//                                                             multiline
//                                                             rows={4}
//                                                             type="text"
//                                                             fullWidth
//                                                             name='blockReason'
//                                                             value={channelInput.blockReason}
//                                                             onChange={handleChange}
//                                                             required
//                                                             error={errorObject.blockReason.error}
//                                                             helperText={errorObject.blockReason.error?errorObject.blockReason.message:null}
//                                                         />
//                                                     </Text>    
//                                                     {/* {openDescriptionError?<Box sx={{color: 'red', fontWeight: 600}}>
//                                                         {descriptionErrorMessage}
//                                                     </Box>: null} */}
//                                                 </Grid>
//                                             </>
//                                         }
//                                     </Grid>
//                                 </Typography>
//                                 <Typography sx={{textAlign: 'end'}}>
//                                     <Button onClick={cancelBtnFunction} disabled={loading}>Cancel</Button>
//                                     <Button onClick={handleFormSubmit} disabled={errorObject.reason.error? true: loading}>{loading ? 'Updating User...' : 'Update User'}</Button>
//                                 </Typography>
//                             </CardContent>
//                         </Box>
//                     </Card>
//                 </Grid>
//             </Container >
//             {/* --------------------------------------------------------Error or success message------------------------------------------ */}
//             <Stack spacing={2} sx={{ width: '100%' }}>
//                 <Snackbar anchorOrigin={{
//                     vertical: 'bottom',
//                     horizontal: 'right',
//                 }} open={open} autoHideDuration={6000} onClose={handleMessageBoxClose} >
//                 <Alert onClose={handleMessageBoxClose} variant="filled" severity={`${apiMessageType=='success'? 'success': 'error'}`} sx={{ width: '100%' }}>
//                     {apiResponseMessage}
//                 </Alert>
//                 </Snackbar>
//             </Stack>
//         </>
//     )
// }

// export default ChannelEdit;