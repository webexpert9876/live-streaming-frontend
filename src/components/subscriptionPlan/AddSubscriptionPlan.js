import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import SidebarLayout from 'src/layouts/SidebarLayout';
// import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import {
    Tooltip,
    Divider,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Card,
    IconButton,
    Typography,
    useTheme,
    CardHeader,
    Button,
    TextField,
    CardContent,
    NativeSelect,
    Avatar,
    Slider,
    Alert
} from '@mui/material';
import AvatarEditor from 'react-avatar-editor';
import {v4 as uuidv4} from 'uuid';

import Footer from 'src/components/Footer';
import { subDays } from 'date-fns';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthUser } from 'store/slices/authSlice';
import client from "../../../graphql";
import { gql } from "@apollo/client";
import axios from 'axios';
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import { WithContext as ReactTags } from 'react-tag-input';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Text from '../Text'

const prvVideoBanner = {
    width: '400px',
    height: '334px'
}

const KeyCodes = {
    comma: 188,
    enter: 13
};
const delimiters = [KeyCodes.comma, KeyCodes.enter];

function AddSubscriptionPlan({userData, isPlanNeeded, cancelBtnFunction, newPlanAddFunction}){

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

    const [isAddingPlan, setIsAddingPlan] = useState(false);

    useEffect(()=>{
        if(userData.length > 0){
            setUserInfo(userData);
        }
        
    },[]);

    useEffect(async ()=>{
        if(isAddingPlan){

            let subscriptionPlanNewDetail = {
                price: subscriptionPlanInput.price,
                planDurationUnit: subscriptionPlanInput.planDurationUnit,
                planDuration: subscriptionPlanInput.planDuration,
                channelId: userInfo[0].channelId
            }

            axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create/subscription/plan`, subscriptionPlanNewDetail, {headers: {'x-access-token': userInfo[0].jwtToken }
            }).then((data)=>{
                
                setApiMessageType('success');
                setApiResponseMessage('New Subscription plan added successfully');
                setSubscriptionPlanInput({
                    price: '',
                    planDuration: '',
                    planDurationUnit: "month"
                });

                
                newPlanAddFunction(data.data.subscriptionPlan);
                
                setIsAddingPlan(false)
                setLoading(false);
                handleMessageBoxOpen()
            }).catch((error)=>{
                console.log('error', error);
                setApiMessageType('error')
                const errorMessage = error.response.data.message;
                
                handleMessageBoxOpen()
                setApiResponseMessage(errorMessage);
                setIsAddingPlan(false)
                setLoading(false);
            });
            
        }
    },[isAddingPlan]);
    
    const handleMessageBoxClose = () => {
        setOpen(false);
        setApiResponseMessage('');
        setApiMessageType('')
    };
    const handleMessageBoxOpen = () => {
        setOpen(true);
    };

    const handleFormChange = (e)=>{

        if(e.target.name == 'price'){
            setSubscriptionPlanInput((prevState)=>({
                ...prevState,
                [e.target.name]: e.target.value
            }))

            if(e.target.value){
                if(!/^[0-9]+$/.test(e.target.value)){
                    console.log("in if")
                    setPriceErrorMessage("Please enter number only");
                    setOpenPriceError(true)
                } else {
                    setOpenPriceError(false)
                }
            } else {
                setPriceErrorMessage("Subscription Plan Price is required");
                setOpenPriceError(true)
            }
        } else if(e.target.name == 'planDuration'){
            setSubscriptionPlanInput((prevState)=>({
                ...prevState,
                [e.target.name]: e.target.value
            }))

            if(e.target.value){
                if(!/^[0-9]+$/.test(e.target.value)){
                    setPlanDurationErrorMessage("Please enter number only");
                    setOpenPlanDurationError(true)
                } else {
                    setOpenPlanDurationError(false)
                }
            } else {
                setPlanDurationErrorMessage("Subscription Plan Duration is required");
                setOpenPlanDurationError(true)
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
            }
        }
    }

    const handleFormSubmit = (e)=>{
        e.preventDefault();
        if(!subscriptionPlanInput.price){
            setOpenPriceError(true)
        } 
        if(!subscriptionPlanInput.planDuration){
            setOpenPlanDurationError(true)
        }
        if(!subscriptionPlanInput.planDurationUnit){
            setOpenPlanDurationUnitError(true)
        }
        
        if(subscriptionPlanInput.price && subscriptionPlanInput.planDuration && subscriptionPlanInput.planDurationUnit ){
            setIsAddingPlan(true);
            setLoading(true);
        } else {
            setApiMessageType('error')
            setApiResponseMessage('Please enter all the details.');
            setOpen(true);
        }
    }

    
    return(
        <>
            {userInfo.length > 0?
                <>
                    <Head>
                        <title>Add subscription plan</title>
                    </Head>

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
                                        title="Add subscription plan"
                                    />
                                </Box>
                                <Divider />
                                {isPlanNeeded && <Typography component={'h4'} variant='h4' style={{marginLeft: '20px', marginTop: '20px', color: 'red'}}>To activate the paid plan you need to add subscription plan first.</Typography>}
                                <Box>
                                    <CardContent sx={{ p: 4 }}>
                                        <Typography variant="subtitle2">
                                            <Grid container spacing={0}>
                                                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
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
                                                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
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
                                                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
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
                                            <Button onClick={handleFormSubmit} disabled={loading}>{loading ? 'Adding Plan...' : 'Add Plan'}</Button>
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
            : null}
        </>
    )
}

export default AddSubscriptionPlan;