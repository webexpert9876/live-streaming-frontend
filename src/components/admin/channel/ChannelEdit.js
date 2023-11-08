import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { Grid, Container } from '@mui/material';
import {
    Tooltip,
    IconButton,
    Divider,
    Box,
    FormControl,
    InputLabel,
    FormLabel,
    Radio,
    RadioGroup,
    FormControlLabel,
    Card,
    Select,
    MenuItem,
    Typography,
    useTheme,
    CardHeader,
    CardContent,
    NativeSelect,
    TextField,
    Button,
    Avatar,
    Slider,
    Alert
} from '@mui/material';
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';

import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthUser } from 'store/slices/authSlice';
import client from "../../../../graphql";
import { gql } from "@apollo/client";
import axios from 'axios';
import Text from '../../Text';
import { WithContext as ReactTags } from 'react-tag-input';
import AvatarEditor from 'react-avatar-editor';
import {v4 as uuidv4} from 'uuid';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


function ChannelEdit({userData, channelDetail, cancelBtnFunction, channelUpdateFunction}){
    const router = useRouter();
    const [userInfo, setUserInfo] = useState([]);

    console.log('channelDetail', channelDetail)

    const [channelInput, setChannelInput] = useState({
        isApproved: false,
        blocked: false
    })
    const [channelData, setChannelData] = useState({});

    // -------------------------Error state------------------------
    const [loading, setLoading] = useState(false);
    const [apiResponseMessage, setApiResponseMessage] = useState('');

    const [open, setOpen] = useState(false);
    const [apiMessageType, setApiMessageType] = useState('');

    // const [openTitleError, setOpenTitleError] = useState(false)
    // const [titleErrorMessage, setTitleErrorMessage] = useState('Tattoo category title is required')
    // const [openDescriptionError, setOpenDescriptionError] = useState(false)
    // const [descriptionErrorMessage, setDescriptionErrorMessage] = useState('Tattoo category description is required')
    const [isUpdatingChannel, setIsUpdatingChannel] = useState(false);

    useEffect(()=>{

        if(channelDetail){
            setChannelData(channelDetail);
            setChannelInput({
                isApproved: channelDetail.isApproved,
                blocked: channelDetail.blocked
            })
        }
        
        if(userData.length > 0){
            setUserInfo(userData[0]);
        }
    }, [])

    useEffect(async()=>{
        if(isUpdatingChannel){
            const formData = new FormData();
            formData.append('id', channelData._id);
            formData.append('isApproved', channelInput.isApproved);
            formData.append('blocked', channelInput.blocked);
            
            await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/update/channel`, formData, {headers: {'x-access-token': userData[0].jwtToken}
                }).then((data)=>{
                    // tagResult = data.data.success
                    // tags.forEach(tag => {
                    //     // Check if the value does not exist in the objectArray
                    //     if (!suggestions.some(obj => obj.text === tag.text)) {

                    //         // Create a new object and add it to the array
                    //         let newObj = { id: tag.text, text: tag.text };
                    //         setSuggestions([...suggestions, newObj]);
                    //         tagUpdateFunction([...suggestions, newObj])
                    //     }
                    // });
                    setApiMessageType('success');
                    setApiResponseMessage('Channel updated successfully');
                    
                    channelUpdateFunction(data.data.channelData._id, data.data.channelData)
                    setIsUpdatingChannel(false)
                    setLoading(false);
                    handleMessageBoxOpen()
                }).catch((error)=>{
                    console.log('error', error);
                    setApiMessageType('error')
                    const errorMessage = error.response.data.message;
                    
                    handleMessageBoxOpen()
                    setApiResponseMessage(errorMessage);
                    setIsUpdatingChannel(false)
                    setLoading(false);
                });
            
            // if(tagResult){
            //     axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/update/category`, formData, {headers: {'x-access-token': userData[0].jwtToken, 'Content-Type': 'multipart/form-data'}
            //     }).then((data)=>{
                    
            //         setApiMessageType('success');
            //         setApiResponseMessage('Tattoo category update successfully');
                    
            //         categoryUpdateFunction(data.data.tattoCategoryData._id, data.data.tattoCategoryData)
            //         setIsUpdatingChannel(false)
            //         setLoading(false);
            //         handleMessageBoxOpen()
            //     }).catch((error)=>{
            //         console.log('error', error);
            //         setApiMessageType('error')
            //         const errorMessage = error.response.data.message;
                    
            //         handleMessageBoxOpen()
            //         setApiResponseMessage(errorMessage);
            //         setIsUpdatingChannel(false)
            //         setLoading(false);
            //     });
            // }
        }
    }, [isUpdatingChannel])

    const handleFormChange = (e)=>{

        if(e.target.name == 'title'){
            // console.log('e.target.value', e.target.value)
            setChannelInput((prevState)=>({
                ...prevState,
                [e.target.name]: e.target.value
            }))

            if(e.target.value){
                setOpenTitleError(false)
            } else {
                
                setOpenTitleError(true)
                // setTitleErrorMessage('Video title is required');
            }
        } else if(e.target.name == 'description'){
            setChannelInput((prevState)=>({
                ...prevState,
                [e.target.name]: e.target.value
            }))

            if(e.target.value){
                setOpenDescriptionError(false)
            } else {
                setOpenDescriptionError(true)
                // setDescriptionErrorMessage('Video description is required');
            }
        }
    }

    const handleFormSubmit = (e)=>{
        e.preventDefault();
        // if(!channelInput.title){
        //     setOpenTitleError(true)
        // } 
        // if(!channelInput.description){
        //     setOpenDescriptionError(true)
        // }
        
        if(channelInput.isApproved && channelInput.blocked ){
            setIsUpdatingChannel(true);
            setLoading(true);
        } else {
            setApiMessageType('error')
            setApiResponseMessage('Please enter all the details.');
            setOpen(true);
        }
    }

    const handleMessageBoxClose = () => {
        setOpen(false);
        setApiResponseMessage('');
        setApiMessageType('')
    };
    const handleMessageBoxOpen = () => {
        setOpen(true);
    };

    const handleChange = (e) => {
        // setValue(event.target.value);
        console.log('e.target.value', e.target.value)
        console.log('e.target.name', e.target.name)
        if(e.target.name == 'isApproved'){
            setChannelInput((prevState)=>({
                ...prevState,
                [e.target.name]: e.target.value == 'approve'? 'true': 'false'
            }))
        } else if(e.target.name == 'blocked'){
            setChannelInput((prevState)=>({
                ...prevState,
                [e.target.name]: e.target.value == 'block'? 'true': 'false'
            }))
        }
    };

    return(
        <>
            <Container maxWidth="lg" >
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="stretch"
                    spacing={3}
                    mt={3}
                >
                    {/* <Grid item xs={12}></Grid> */}
                    <Card style={{width: "97%"}}>
                        <Box sx={{display: 'flex'}}>
                            <Tooltip arrow placement="top" title="Go back" disabled={loading} onClick={cancelBtnFunction}>
                                <IconButton color="primary" sx={{ p: 2 }}>
                                    <ArrowBackTwoToneIcon />
                                </IconButton>
                            </Tooltip>
                            <CardHeader
                                title="Update Channel"
                            />
                        </Box>
                        <Divider />
                        <Box>
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="subtitle2">
                                    <Grid container spacing={0}>
                                        <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                                            <Box mt={1} pr={3} pb={2}>
                                                Approve channel:
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={8} md={9}>
                                            <FormControl>
                                                {/* <FormLabel id="demo-radio-buttons-group-label"> Gender</FormLabel> */}
                                                <RadioGroup
                                                    aria-labelledby="demo-radio-buttons-group-label"
                                                    value={channelInput.isApproved == `true` ?'approve':'unapprove'}
                                                    name="isApproved"
                                                    onChange={handleChange}
                                                >
                                                    <Box sx={{display: 'flex'}}>
                                                        <FormControlLabel value="approve" control={<Radio />} label="Approve" />
                                                        <FormControlLabel value="unapprove" control={<Radio />} label="Unapprove" />
                                                    </Box>
                                                </RadioGroup>
                                            </FormControl>
                                            {/* {openDescriptionError?<Box sx={{color: 'red', fontWeight: 600}}>
                                                {descriptionErrorMessage}
                                            </Box>: null} */}
                                        </Grid>
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
                                                    value={channelInput.blocked == `true` ?'block':'unblock'}
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
                                </Typography>
                                <Typography sx={{textAlign: 'end'}}>
                                    <Button onClick={cancelBtnFunction} disabled={loading}>Cancel</Button>
                                    <Button onClick={handleFormSubmit} disabled={loading}>{loading ? 'Updating Channel...' : 'Update Channel'}</Button>
                                </Typography>
                            </CardContent>
                        </Box>
                    </Card>
                </Grid>
            </Container >
            {/* --------------------------------------------------------Error or success message------------------------------------------ */}
            <Stack spacing={2} sx={{ width: '100%' }}>
                <Snackbar anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }} open={open} autoHideDuration={6000} onClose={handleMessageBoxClose} >
                <Alert onClose={handleMessageBoxClose} variant="filled" severity={`${apiMessageType=='success'? 'success': 'error'}`} sx={{ width: '100%' }}>
                    {apiResponseMessage}
                </Alert>
                </Snackbar>
            </Stack>
        </>
    )
}

export default ChannelEdit;