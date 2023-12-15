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
import { socket } from '../../../../socket';


function ChannelEdit({userData, channelDetail, cancelBtnFunction, channelUpdateFunction}){
    const router = useRouter();
    const [userInfo, setUserInfo] = useState([]);

    // console.log('channelDetail', channelDetail)

    const [channelInput, setChannelInput] = useState({
        isApproved: 'pending',
        blocked: false,
        reason: '',
        blockReason: ''
    })
    const [channelData, setChannelData] = useState({});
    const [isChannelStatusChanged, setIsChannelStatusChanged] = useState(false);
    const [channelNewStatus, setChannelNewStatus] = useState('');
    const [channelStatusNotification, setChannelStatusNotification] = useState('');
    const [blockStatusNotification, setBlockStatusNotification] = useState('');

    // -------------------------Error state------------------------
    const [loading, setLoading] = useState(false);
    const [apiResponseMessage, setApiResponseMessage] = useState('');

    const [open, setOpen] = useState(false);
    const [apiMessageType, setApiMessageType] = useState('');
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

    // const [openTitleError, setOpenTitleError] = useState(false)
    // const [titleErrorMessage, setTitleErrorMessage] = useState('Tattoo category title is required')
    // const [openDescriptionError, setOpenDescriptionError] = useState(false)
    // const [descriptionErrorMessage, setDescriptionErrorMessage] = useState('Tattoo category description is required')
    const [isUpdatingChannel, setIsUpdatingChannel] = useState(false);

    const filterStatusOption = {
        approved: 'approved',
        declined: 'declined',
        pending: 'pending'
    };

    useEffect(()=>{

        if(channelDetail){
            setChannelData(channelDetail);
            setChannelInput({
                isApproved: channelDetail.isApproved,
                blocked: channelDetail.blocked,
                reason: channelDetail.isApproved?channelDetail.reason:'',
                blockReason: channelDetail.blocked? channelDetail.reason: ''
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
            formData.append('reason', channelInput.reason);
            formData.append('isChannelStatusChanged', isChannelStatusChanged);
            formData.append('channelNewStatus', channelNewStatus);
            formData.append('blockReason', channelInput.blockReason);
            
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
                // console.log('data.data.channelData._id', data.data.channelData._id)
                let channelApiData = data.data.channelData;

                if(channelStatusNotification == channelApiData.isApproved && channelApiData.isApproved != 'pending'){
                    
                    // Emitting socket event for channel approve notification.
                    socket.emit('channelApproveNotification', {receiverUserId: channelData.userId, userDetails: userInfo, status: channelApiData.isApproved, reason: channelInput.reason});

                } else if(`${channelApiData.blocked}` == blockStatusNotification){

                    // Emitting socket event for channel approve notification.
                    socket.emit('channelBlockNotification', {receiverUserId: channelData.userId, userDetails: userInfo, status: `${channelApiData.blocked}`, reason: channelInput.blockReason});
                }

                channelUpdateFunction(data.data.channelData._id, data.data.channelData)
                setChannelStatusNotification('');
                setBlockStatusNotification('');
                setIsUpdatingChannel(false)
                setLoading(false);
                handleMessageBoxOpen()
                setTimeout(() => {
                    cancelBtnFunction();
                }, 1000);
            }).catch((error)=>{
                console.log('error', error);
                setApiMessageType('error')

                let errorMessage;
                if(error.response){
                    errorMessage = error.response.data.message;
                }
                
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

        let isError = false;
        let message = '';

        if(channelData.isApproved != channelInput.isApproved){
            setChannelStatusNotification(channelInput.isApproved);
            setIsChannelStatusChanged(true);
            setChannelNewStatus(channelInput.isApproved);
        } else {
            setIsChannelStatusChanged(false);
            setChannelNewStatus(channelInput.isApproved);
        }



        if(channelInput.isApproved == 'declined' && !channelInput.reason){
            isError = true
            message = 'Please Enter Declined Reason'
        }

        let blockReasonError = false;
        // if(!channelInput.blockReason && !channelInput.blocked){
        //     console.log('in if blockReasonError');
        //     blockReasonError = true
        // }

        if(`${channelData.blocked}` != `${channelInput.blocked}`){
            setBlockStatusNotification(`${channelInput.blocked}`);
        }

        if(`${channelInput.blocked}` == `true`){
            if(!channelInput.blockReason && channelInput.blocked){
                blockReasonError = true
            }
        }

        if((channelInput.isApproved != null || channelInput.isApproved != undefined) && !isError && !blockReasonError){
            // console.log('true')
            setIsUpdatingChannel(true);
            setLoading(true);
            setErrorObject((prevState) => ({...prevState, ['reason']: { error: false, message: '' } }));
        } else {
            // console.log('false')
            setErrorObject((prevState) => ({...prevState, ['reason']: { error: isError, message: message } }));
            setErrorObject((prevState) => ({ ...prevState, ['blockReason']: { error: true, message: 'Please provide block reason' } }));
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
        if(e.target.name == 'isApproved'){
            setChannelInput((prevState)=>({
                ...prevState,
                [e.target.name]: filterStatusOption[e.target.value]
            }));
            setErrorObject((prevState) => ({ ...prevState, ['reason']: { error: false, message: '' } }));
        } else if(e.target.name == 'blocked'){
            setChannelInput((prevState)=>({
                ...prevState,
                [e.target.name]: e.target.value == 'block'? 'true': 'false'
            }))
        } else if(e.target.name == 'reason'){
            
            if(errorObject.reason.error){
                setErrorObject((prevState) => ({ ...prevState, ['reason']: { error: false, message: '' } }));
            }
            setChannelInput((prevState)=>({
                ...prevState,
                [e.target.name]: e.target.value
            }))
        } else if(e.target.name == 'blockReason'){
            
            if(errorObject.blockReason.error){
                setErrorObject((prevState) => ({ ...prevState, ['blockReason']: { error: false, message: '' } }));
            }
            setChannelInput((prevState)=>({
                ...prevState,
                [e.target.name]: e.target.value
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
                                                    // value={channelInput.isApproved == `true` ?'approve':'unapprove'}
                                                    value={filterStatusOption[channelInput.isApproved]}
                                                    name="isApproved"
                                                    onChange={handleChange}
                                                >
                                                    <Box sx={{display: 'flex'}}>
                                                        <FormControlLabel value="approved" control={<Radio />} label="Approve" />
                                                        <FormControlLabel value="declined" control={<Radio />} label="Decline" />
                                                        <FormControlLabel value="pending" control={<Radio />} label="Pending" />
                                                    </Box>
                                                </RadioGroup>
                                            </FormControl>
                                            {/* {openDescriptionError?<Box sx={{color: 'red', fontWeight: 600}}>
                                                {descriptionErrorMessage}
                                            </Box>: null} */}
                                        </Grid>
                                        {channelInput.isApproved == 'declined' && 
                                            <>
                                                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                                                    <Box mt={1} pr={3} pb={2}>
                                                        Declined reason:
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} sm={8} md={9}>
                                                    <Text color="black">
                                                        <TextField
                                                            autoFocus
                                                            margin="dense"
                                                            id="reason"
                                                            multiline
                                                            rows={4}
                                                            type="text"
                                                            fullWidth
                                                            name='reason'
                                                            value={channelInput.reason}
                                                            onChange={handleChange}
                                                            required
                                                            error={errorObject.reason.error}
                                                            helperText={errorObject.reason.error?errorObject.reason.message:null}
                                                        />
                                                    </Text>    
                                                    {/* {openDescriptionError?<Box sx={{color: 'red', fontWeight: 600}}>
                                                        {descriptionErrorMessage}
                                                    </Box>: null} */}
                                                </Grid>
                                            </>
                                        }
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
                                                    value={`${channelInput.blocked}` == `true` ?'block':'unblock'}
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
                                        {`${channelInput.blocked}` == 'true' && 
                                            <>
                                                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                                                    <Box mt={1} pr={3} pb={2}>
                                                        Block reason:
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} sm={8} md={9}>
                                                    <Text color="black">
                                                        <TextField
                                                            autoFocus
                                                            margin="dense"
                                                            id="blockReason"
                                                            multiline
                                                            rows={4}
                                                            type="text"
                                                            fullWidth
                                                            name='blockReason'
                                                            value={channelInput.blockReason}
                                                            onChange={handleChange}
                                                            required
                                                            error={errorObject.blockReason.error}
                                                            helperText={errorObject.blockReason.error?errorObject.blockReason.message:null}
                                                        />
                                                    </Text>    
                                                    {/* {openDescriptionError?<Box sx={{color: 'red', fontWeight: 600}}>
                                                        {descriptionErrorMessage}
                                                    </Box>: null} */}
                                                </Grid>
                                            </>
                                        }
                                    </Grid>
                                </Typography>
                                <Typography sx={{textAlign: 'end'}}>
                                    <Button onClick={cancelBtnFunction} disabled={loading}>Cancel</Button>
                                    <Button onClick={handleFormSubmit} disabled={errorObject.reason.error? true: loading}>{loading ? 'Updating Channel...' : 'Update Channel'}</Button>
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