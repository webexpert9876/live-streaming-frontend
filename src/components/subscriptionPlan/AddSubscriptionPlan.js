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
  
    const [totalAmount, setTotalAmount] = useState(0); // Example initial amount
    const [platformFee, setPlatformFee] = useState(0);
    const [stripeFee, setStripeFee] = useState(0);
    const [earnings, setEarnings] = useState(0);

    const [subscriptionPlanInput, setSubscriptionPlanInput] = useState({
        price: 0,
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
    const [priceBreakDown, setPriceBreakDown] = useState(true);

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
                if(data.data.isPriceExists){
                    setApiMessageType('error')
                    const errorMessage = data.data.message;
                    
                    handleMessageBoxOpen()
                    setApiResponseMessage(errorMessage);
                    setIsAddingPlan(false)
                    setLoading(false);
                } else {
                    setApiMessageType('success');
                    setApiResponseMessage('New Subscription plan added successfully');
                    setSubscriptionPlanInput({
                        price: 0,
                        planDuration: '',
                        planDurationUnit: "month"
                    });
                    
                    setPlatformFee(0);
                    setStripeFee(0);
                    setEarnings(0);
    
                    newPlanAddFunction(data.data.subscriptionPlan);
                    
                    setIsAddingPlan(false)
                    setLoading(false);
                    handleMessageBoxOpen()
                }
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

    useEffect(()=>{
        if(priceBreakDown){

            const totalAmount = subscriptionPlanInput.price;
            console.log('totalAmount', totalAmount);
            
            // Platform percentage (25%)
            const platformPercentage = 0.25;
            console.log('platformPercentage', platformPercentage);
    
            // Stripe fee calculation (2.9% + 30¢)
            const stripeFeePercentage = 0.029;
            console.log('stripeFeePercentage', stripeFeePercentage);
    
            const fixedStripeFee = 0.30;
            console.log('fixedStripeFee', fixedStripeFee);
            
            // // Step 1: Calculate Stripe fees
            // const stripeFee = (totalAmount * stripeFeePercentage) + fixedStripeFee;
            // console.log('stripeFee', stripeFee);
            
            // // Step 2: Calculate the platform's base share
            // const platformBaseShare = totalAmount * platformPercentage;
            // console.log('platformBaseShare', platformBaseShare);
            
            // // Step 3: Calculate the total platform fee including Stripe fees
            // const platformFee = platformBaseShare + stripeFee;
            // console.log('platformFee', platformFee);
            
            // // Step 4: Calculate the amount to be transferred to the user
            // const userAmount = totalAmount - platformFee;
            // console.log('userAmount', userAmount);

            let stripeFee = (totalAmount * stripeFeePercentage) + fixedStripeFee;
            stripeFee = Math.round((stripeFee * 100) / 100); // Round to the nearest cent

            // Step 2: Calculate the platform's base share
            let platformBaseShare = totalAmount * platformPercentage;
            platformBaseShare = Math.round((platformBaseShare * 100) / 100); // Round to the nearest cent

            // Step 3: Calculate the total platform fee including Stripe fees
            let platformFee = platformBaseShare + stripeFee;
            platformFee = Math.round((platformFee * 100) / 100); // Round to the nearest cent

            // Step 4: Calculate the amount to be transferred to the user
            let userAmount = totalAmount - platformFee;
            userAmount = Math.round((userAmount * 100) / 100);
            platformBaseShare = Math.trunc(platformBaseShare)
            stripeFee = Math.trunc(stripeFee)
            userAmount = Math.trunc(userAmount)

            setPlatformFee(platformBaseShare);
            setStripeFee(stripeFee);
            setEarnings(userAmount);
            setPriceBreakDown(false);
        }
    }, [priceBreakDown])

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
                    setPriceBreakDown(true);
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

                    <Container maxWidth="lg" className='add-subscription-main-div' >
                        <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="stretch"
                            spacing={3}
                            mt={3}
                        >
                            {/* <Grid item xs={12}></Grid> */}
                            <Card style={{width: "97%"}} >
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
                                    <CardContent sx={{ p: 4 }} className='add-sub-card-inner-content'>
                                        <Typography variant="div" component={'div'} className='common-flex'>
                                            <Grid container spacing={0} className='vertical-line'>
                                                <Grid item xs={12} sm={5} md={3} textAlign={{ sm: 'right' }} className='common-align'>
                                                    <Box mt={1} pr={3} pb={2} className='plan-text'>
                                                        Price:
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} sm={5} md={9} className='common-align'>
                                                    <Text color="black" sx={{display: 'flex'}}>
                                                        <Box marginRight={'5px'}>$</Box>
                                                        <TextField
                                                            autoFocus
                                                            margin="dense"
                                                            id="price"
                                                            type="text"
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
                                                <Grid item xs={12} sm={5} md={3} textAlign={{ sm: 'right' }} className='common-align'>
                                                    <Box mt={1} pr={3} pb={2} className='plan-text'>
                                                        Plan Type:
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} sm={5} md={9} sx={{marginTop: "10px"}} className='common-align'>
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
                                                <Grid item xs={12} sm={5} md={3} textAlign={{ sm: 'right' }} className='common-align'>
                                                    <Box mt={1} pr={3} pb={2} className='plan-text'>
                                                        plan Duration:
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} sm={5} md={9} className='common-align'>
                                                    <Typography width={250} color="black">
                                                        {/* <TextField
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
                                                        /> */}
                                                        <FormControl fullWidth>
                                                            <InputLabel id="simple-select-label">Plan Duration</InputLabel>
                                                            <Select
                                                                labelId="simple-select-label"
                                                                id="planDuration"
                                                                value={subscriptionPlanInput.planDuration}
                                                                label="Plan Type"
                                                                name='planDuration'
                                                                onChange={handleFormChange}
                                                                error={openPlanDurationError}
                                                                helperText={openPlanDurationError?planDurationErrorMessage:null}
                                                            >
                                                                <MenuItem value={1}>1</MenuItem>
                                                                <MenuItem value={2}>2</MenuItem>
                                                                <MenuItem value={3}>3</MenuItem>
                                                                <MenuItem value={4}>4</MenuItem>
                                                                <MenuItem value={5}>5</MenuItem>
                                                                <MenuItem value={6}>6</MenuItem>
                                                                <MenuItem value={7}>7</MenuItem>
                                                                <MenuItem value={8}>8</MenuItem>
                                                                <MenuItem value={9}>9</MenuItem>
                                                                <MenuItem value={10}>10</MenuItem>
                                                                <MenuItem value={11}>11</MenuItem>
                                                                <MenuItem value={12}>12</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                            <Box className='real-time-price-box-parent'>
                                                <Box className='common-flex real-time-price-box'>
                                                    <Typography component='h4'> Total amount:  </Typography>
                                                    <Typography component='h4' className='real-time-price-box-txt'> {`$ ${subscriptionPlanInput.price}`} </Typography>
                                                </Box>
                                                <Box className='common-flex real-time-price-box'>
                                                    <Typography component='h4'> Platform Fees:  </Typography>
                                                    <Typography component='h4' className='real-time-price-box-txt'>{`$ ${platformFee}`} </Typography>
                                                </Box>
                                                <Box className='common-flex real-time-price-box'>
                                                    <Typography component='h4'> Stripe Fees:  </Typography>
                                                    <Typography component='h4' className='real-time-price-box-txt'> {`$ ${stripeFee}`} </Typography>
                                                </Box>
                                                <Box className='common-flex real-time-price-box'>
                                                    <Typography component='h4'> Your earning:  </Typography>
                                                    <Typography component='h4' className='real-time-price-box-txt'> {`$ ${earnings}`} </Typography>
                                                </Box>
                                            </Box>
                                        </Typography>
                                        <Typography sx={{textAlign: 'end', marginTop: '30px'}}>
                                            <Button onClick={cancelBtnFunction} disabled={loading} sx={{marginRight: '10px'}} >Cancel</Button>
                                            <Button onClick={handleFormSubmit} disabled={loading} variant='contained'>{loading ? 'Adding Plan...' : 'Add Plan'}</Button>
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