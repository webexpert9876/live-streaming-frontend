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
import client from "../../../graphql";
import { gql } from "@apollo/client";
import axios from 'axios';
import Text from '../Text';
import { WithContext as ReactTags } from 'react-tag-input';
import AvatarEditor from 'react-avatar-editor';
import {v4 as uuidv4} from 'uuid';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


const KeyCodes = {
    comma: 188,
    enter: 13
};
const delimiters = [KeyCodes.comma, KeyCodes.enter];

const prvVideoBanner = {
    width: '400px',
    height: '334px'
}

function SubscriptionPlanEditCard({userData, subscriptionPlanDetail, cancelBtnFunction, subscriptionPlanUpdateFunction}){
    const router = useRouter();
    const [userInfo, setUserInfo] = useState([]);

    const [subscriptionPlanInput, setSubscriptionPlanInput] = useState({
        price: '',
        planDuration: '',
        planDurationUnit: "month"
    })

    // -------------------------Error state------------------------
    const [loading, setLoading] = useState(false);
    const [apiResponseMessage, setApiResponseMessage] = useState('');

    const [open, setOpen] = useState(false);
    const [apiMessageType, setApiMessageType] = useState('');

    const [openPriceError, setOpenPriceError] = useState(false);
    const [priceErrorMessage, setPriceErrorMessage] = useState('Subscription Plan Price is required');
    const [openPlanDurationUnitError, setOpenPlanDurationUnitError] = useState(false);
    const [planDurationUnitErrorMessage, setPlanDurationUnitErrorMessage] = useState('Subscription Plan Duration Unit is required');
    const [openPlanDurationError, setOpenPlanDurationError] = useState(false);
    const [planDurationErrorMessage, setPlanDurationErrorMessage] = useState('Subscription Plan Duration is required');
    const [isUpdatingSubscriptionPlan, setIsUpdatingSubscriptionPlan] = useState(false);

    useEffect(()=>{

        if(subscriptionPlanDetail){
            // setTattooCategoriesData(subscriptionPlanDetail);
            setSubscriptionPlanInput({
                price: subscriptionPlanDetail.price,
                planDuration: subscriptionPlanDetail.planDuration,
                planDurationUnit: subscriptionPlanDetail.planDurationUnit
            })
        }
        
        if(userData.length > 0){
            setUserInfo(userData[0]);
        }

    }, [])

    useEffect(async()=>{
        if(isUpdatingSubscriptionPlan){
            
            console.log("subscriptionPlanDetail._id", subscriptionPlanDetail._id)
            console.log("subscriptionPlanInput", subscriptionPlanInput)
            console.log("userData[0].jwtToken", userData)

            let subscriptionPlanNewDetail = {
                id: subscriptionPlanDetail._id,
                price: subscriptionPlanInput.price,
                planDurationUnit: subscriptionPlanInput.planDurationUnit,
                planDuration: subscriptionPlanInput.planDuration
            }
            
            axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update/subscription/plan`, subscriptionPlanNewDetail, { headers: {'x-access-token': userData[0].jwtToken}
            }).then((data)=>{
                
                setApiMessageType('success');
                setApiResponseMessage('Subscription plan update successfully');

                subscriptionPlanUpdateFunction(data.data.subscriptionInfoData._id, data.data.subscriptionInfoData)
                setIsUpdatingSubscriptionPlan(false)
                setLoading(false);
                handleMessageBoxOpen()
            }).catch((error)=>{
                console.log('error', error);
                setApiMessageType('error')
                const errorMessage = error.response.data.message;
                
                handleMessageBoxOpen()
                setApiResponseMessage(errorMessage);
                setIsUpdatingSubscriptionPlan(false)
                setLoading(false);
            });
        }
    }, [isUpdatingSubscriptionPlan])

    const handleFormChange = (e)=>{

        if(e.target.name == 'price'){
            setSubscriptionPlanInput((prevState)=>({
                ...prevState,
                [e.target.name]: e.target.value
            }))

            if(e.target.value){
                if(!/^[0-9]+$/.test(e.target.value)){
                    setPriceErrorMessage("Please enter number only");
                } else {
                    setOpenPriceError(false)
                }
            } else {
                setOpenPriceError(true)
                setPriceErrorMessage("Subscription Plan Price is required");
            }
        } else if(e.target.name == 'planDurationUnit'){
            setSubscriptionPlanInput((prevState)=>({
                ...prevState,
                [e.target.name]: e.target.value
            }))

            if(e.target.value){
                setOpenPlanDurationUnitError(false)
            } else {
                setOpenPlanDurationUnitError(true)
                // setPlanDurationErrorMessage('Video description is required');
            }
        } else if(e.target.name == 'planDuration'){
            setSubscriptionPlanInput((prevState)=>({
                ...prevState,
                [e.target.name]: e.target.value
            }))

            if(e.target.value){
                if(!/^[0-9]+$/.test(e.target.value)){
                    setPlanDurationErrorMessage("Please enter number only");
                } else {
                    setOpenPlanDurationError(false)
                }
            } else {
                setPlanDurationErrorMessage("Subscription Plan Duration is required");
                setOpenPlanDurationError(true)
                // setPlanDurationErrorMessage('Video description is required');
            }
        }
    }

    const handleFormSubmit = (e)=>{
        e.preventDefault();
        if(!subscriptionPlanInput.price){
            if(!/^[0-9]+$/.test(z)){
                alert("Please only enter numeric characters only for your Age! (Allowed input:0-9)")
            }
            setOpenPriceError(true)
        } 
        if(!subscriptionPlanInput.planDurationUnit){
            setOpenPlanDurationUnitError(true)
        }
        if(!subscriptionPlanInput.planDuration){
            setOpenPlanDurationError(true)
        }
        
        if(subscriptionPlanInput.price && subscriptionPlanInput.planDurationUnit && subscriptionPlanInput.planDuration ){
            setIsUpdatingSubscriptionPlan(true);
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
                                title="Update Subscription plan"
                            />
                        </Box>
                        <Divider />
                        <Box>
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="subtitle2">
                                    <Grid container spacing={0}>
                                        <Grid item xs={12} sm={3} md={2} textAlign={{ sm: 'center' }}>
                                            <Box mt={1} pr={3} pb={2}>
                                                Price:
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={8} md={9}>
                                            <Text color="black">
                                                <TextField
                                                    autoFocus
                                                    margin="dense"
                                                    id="price"
                                                    type="text"
                                                    fullWidth
                                                    variant="standard"
                                                    name='price'
                                                    value={subscriptionPlanInput.price}
                                                    onChange={handleFormChange}
                                                    required
                                                    error={openPriceError}
                                                    helperText={openPriceError?priceErrorMessage:null}
                                                />
                                            </Text>
                                            {/* {openPriceError?<Box sx={{color: 'red', fontWeight: 600}}>
                                                    {priceErrorMessage}
                                            </Box>: null} */}
                                        </Grid>
                                        <Grid item xs={12} sm={3} md={2} textAlign={{ sm: 'center' }}>
                                            <Box mt={1} pr={3} pb={2}>
                                                Plan Type:
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={8} md={9} sx={{marginTop: "10px"}}>
                                            <Typography width={250} color="black">
                                            <FormControl fullWidth>
                                                <InputLabel id="simple-select-label">Plan Type</InputLabel>
                                                <Select
                                                    labelId="simple-select-label"
                                                    id="planDurationUnit"
                                                    value={subscriptionPlanInput.planDurationUnit}
                                                    label="Plan Type"
                                                    name='planDurationUnit'
                                                    onChange={handleFormChange}
                                                    error={openPlanDurationUnitError}
                                                    helperText={openPlanDurationUnitError?planDurationUnitErrorMessage:null}
                                                >
                                                    <MenuItem value={"month"}>Month</MenuItem>
                                                    <MenuItem value={"year"}>year</MenuItem>
                                                </Select>
                                            </FormControl>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={3} md={2} textAlign={{ sm: 'center' }}>
                                            <Box mt={1} pr={3} pb={2}>
                                                plan Duration:
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={8} md={9}>
                                            <Typography width={250} color="black">
                                                <TextField
                                                    autoFocus
                                                    margin="dense"
                                                    id="planDuration"
                                                    multiline
                                                    type="text"
                                                    fullWidth
                                                    variant="standard"
                                                    name='planDuration'
                                                    value={subscriptionPlanInput.planDuration}
                                                    onChange={handleFormChange}
                                                    required
                                                    error={openPlanDurationError}
                                                    helperText={openPlanDurationError?planDurationErrorMessage:null}
                                                />
                                            </Typography>
                                        </Grid>
                                        
                                    </Grid>
                                </Typography>
                                <Typography sx={{textAlign: 'end'}}>
                                    <Button onClick={cancelBtnFunction} disabled={loading}>Cancel</Button>
                                    <Button onClick={handleFormSubmit} disabled={loading}>{loading ? 'Updating Plan...' : 'Update Plan'}</Button>
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
                }} open={open} 
                autoHideDuration={6000}
                onClose={handleMessageBoxClose} >
                <Alert onClose={handleMessageBoxClose} variant="filled" severity={`${apiMessageType=='success'? 'success': 'error'}`} sx={{ width: '100%' }}>
                    {apiResponseMessage}
                </Alert>
                </Snackbar>
            </Stack>
        </>
    )
}

export default SubscriptionPlanEditCard;