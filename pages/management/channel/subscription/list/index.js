import Head from 'next/head';
import SidebarLayout from 'src/layouts/SidebarLayout';
import { useState, useEffect } from 'react';
import PageHeader from 'src/components/subscriptionPlan/PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import {
    Tooltip,
    Divider,
    Box,
    FormControl,
    InputLabel,
    Card,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    TableContainer,
    Select,
    MenuItem,
    Typography,
    useTheme,
    CardHeader,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Alert,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormLabel
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Label from 'src/components/Label';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import Footer from 'src/components/Footer';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthUser } from 'store/slices/authSlice';
import client from "../../../../../graphql";
import { gql } from "@apollo/client";
import axios from 'axios';
import SubscriptionPlanEdit from "src/components/subscriptionPlan/SubscriptionPlanEdit";
import AddSubscriptionPlan from "src/components/subscriptionPlan/AddSubscriptionPlan";
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import LoginDialog from 'src/components/pageAccessDialog/loginDialog'
import PermissionDeniedDialog from 'src/components/pageAccessDialog/permissionDeniedDialog'


function ChannelSubscriptionPrice() {
  const [userData, setUserData] = useState([]);
  const [isUserAvailable, setIsUserAvailable] = useState(false);
  const [isFetchedApi, setIsFetchedApi] = useState(true);
  const [isAdminUser, setIsAdminUser] = useState(false);

//  For pagination
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [showAllSubscriptionPlanDetails, setShowAllSubscriptionPlanDetails]= useState([]);
  const [isCheckPaginationChange, setIsCheckPaginationChange]= useState(false);

  const authState = useSelector(selectAuthUser)
  const router = useRouter();

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openSubscriptionActivationDialog, setOpenSubscriptionActivationDialog] = useState(false);

  const [isSubscriptionPlanEditing, setIsSubscriptionPlanEditing] = useState(true);
  const [isAddingSubscriptionPlan, setIsAddingSubscriptionPlan] = useState(false);
  const [selectedRowDetails, setSelectedRowDetails] = useState({});
  const [isPageLoading, setIsPageLoading]= useState(true);
  
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [channelActivePlansDetail, setChannelActivePlansDetail] = useState([]);

  const [isDeletingSubscriptionPlan, setIsDeletingSubscriptionPlan] = useState(false);
  const [deleteInputValue, setDeleteInputValue] = useState('');
  
  
  const [isUpdatingActivePlan, setIsUpdatingActivePlan] = useState(false);
  const [activePlanInput, setActivePlanInput] = useState();

  // -------------------------Error state------------------------
  const [apiResponseMessage, setApiResponseMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [apiMessageType, setApiMessageType] = useState('');
  
  const [isPlanNeed, setIsPlanNeed] = useState(false);

  useEffect(()=>{
    // if(userInfo.length == 0){
    //   setUserInfo(authState);
    // }
    // let userId = JSON.parse(localStorage.getItem('authUser'));
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
          
        if(roleInfo.data.roles[0].role == 'admin' || roleInfo.data.roles[0].role == 'artist'){
            setIsAdminUser(true);
            setIsPageLoading(false);
            client.query({
                variables: {
                usersId: userData[0]._id,
                // channelId: "650d7b91542338448f5daceb"
                channelId: userData[0].channelId,
                channelId2: userData[0].channelId
            },
                query: gql`
                    query Query($usersId: ID, $channelId: ID, $channelId2: String) {
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
                        subscriptionPlans(channelId: $channelId) {
                            _id
                            planDuration
                            planDurationUnit
                            price
                            createdAt
                            channelId
                        }
                        getChannelActivePlans(channelId: $channelId2) {
                            _id
                            channelId
                            isPaid
                        }
                    }
                `,
            }).then((result) => {

                setUserData(result.data.users);
                setSubscriptionPlans(result.data.subscriptionPlans);
                setShowAllSubscriptionPlanDetails(result.data.subscriptionPlans);
                setChannelActivePlansDetail(result.data.getChannelActivePlans);
                setIsCheckPaginationChange(true)
            });
        } else {
            setIsAdminUser(false);
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
    },[authState]);
  
  useEffect(()=>{
    if(isDeletingSubscriptionPlan){

        axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete/subscription/plan/${selectedRowDetails._id}`, {headers: {'x-access-token': userData[0].jwtToken }}).then((data)=>{
            setApiMessageType('danger')
            setApiResponseMessage('Subscription plan deleted successfully');
            removeSubscriptionPlanFromList(selectedRowDetails._id)
            setIsDeletingSubscriptionPlan(false);
            setLoading(false);
            handleMessageBoxOpen()
        }).catch((error)=>{
            console.log('error', error);
            setApiMessageType('error')
            const errorMessage = error.response.data.message;
            
            handleMessageBoxOpen();
            setApiResponseMessage(errorMessage);
            setIsDeletingSubscriptionPlan(false)
            setLoading(false);
        });

    }
  },[isDeletingSubscriptionPlan])


    useEffect(()=>{
        if(isCheckPaginationChange){

            applyPagination(
                subscriptionPlans,
                page,
                limit
            );
            setIsCheckPaginationChange(false)
        }
    },[isCheckPaginationChange])


    useEffect(()=>{
        if(isUpdatingActivePlan) {
            // console.log("channelActivePlansDetail[0].channelId", channelActivePlansDetail);
            axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update/channel/active/plan/${channelActivePlansDetail[0]._id}`, {isPaid: activePlanInput}, {headers: {'x-access-token': userData[0].jwtToken }}).then((data)=>{
                setApiMessageType('danger')
                setApiResponseMessage('Channel Active plan changed successfully');
                setIsUpdatingActivePlan(false);
                setLoading(false);
                // handleMessageBoxOpen()
                setChannelActivePlansDetail([data.data.activePlan]);
                handleClose("activatePlanChange");
            }).catch((error)=>{
                console.log('error', error);
                setApiMessageType('error')
                const errorMessage = error.response.data.message;
                
                // handleMessageBoxOpen()
                setApiResponseMessage(errorMessage);
                setIsUpdatingActivePlan(false)
                // setLoading(false);
            });
        }
    }, [isUpdatingActivePlan])

    
    const handleClickOpen = (dialogType, plan) => {
        switch(dialogType){
            case 'subscriptionPlanEdit':
                setSelectedRowDetails(plan)
                setIsSubscriptionPlanEditing(false)
                break;
            case 'subscriptionPlanDelete':
                if(channelActivePlansDetail[0].isPaid && subscriptionPlans.length == 1 ){
                    setApiMessageType('error')
                    setApiResponseMessage("To delete last plan you need to change active plan type to free");
                    handleMessageBoxOpen();
                } else {
                    setSelectedRowDetails(plan)
                    setOpenDeleteDialog(true);
                }
                break;
            case 'changeActivatePlan':
                setOpenSubscriptionActivationDialog(true);
                break;
        }
    };

    const handleClose = (dialogType) => {
        switch(dialogType){
            case 'subscriptionPlanEdit':
                setOpenEditDialog(false);
                break;
            case 'subscriptionPlanDelete':
                setOpenDeleteDialog(false);
                break;
            case 'activatePlanChange':
                setOpenSubscriptionActivationDialog(false);
                break;
        }
    };

    const handleMessageBoxClose = () => {
        setOpen(false);
        setApiResponseMessage('');
        setApiMessageType('')
    };
    const handleMessageBoxOpen = () => {
        setOpen(true);
    };

    const removeSubscriptionPlanFromList = (id)=>{
        
        const updatedArray  = subscriptionPlans.filter(obj => obj._id !== id);
        
        setSubscriptionPlans(updatedArray)
        let selectedCategory = updatedArray.slice(page * limit, page * limit + limit);

        setShowAllSubscriptionPlanDetails(selectedCategory);
    }
    
    const applyPagination = (allSubscriptionPlan, page, limit) => {
        let selectedCategories = allSubscriptionPlan.slice(page * limit, page * limit + limit);
        setShowAllSubscriptionPlanDetails(selectedCategories);
    };

    const handlePageChange = (_event, newPage) => {
        setPage(newPage);
        setIsCheckPaginationChange(true)
    };

    const handleLimitChange = (event) => {
        setLimit(parseInt(event.target.value));
        setIsCheckPaginationChange(true)
    };

    const handleCancelBtnFunction = ()=>{
        setIsSubscriptionPlanEditing(true);
        setIsAddingSubscriptionPlan(false);
        setIsPlanNeed(false);
    }
    
    const handleAddingSubscriptionPlan = ()=>{
        setIsSubscriptionPlanEditing(false);
        setIsAddingSubscriptionPlan(true);
        setIsPlanNeed(false);
    }

    const handleListPlanUpdate = (id, planData)=>{
          
        const updatedArray = subscriptionPlans.map(obj => {
            if (obj._id === id) {
                return { ...planData }; 
            }
            return obj;
        });
        
        setSubscriptionPlans(updatedArray)
        let selectedPlan = updatedArray.slice(page * limit, page * limit + limit);
        setShowAllSubscriptionPlanDetails(selectedPlan);
    }

    const handleAddNewPlan = (newPlan)=>{
        console.log('newPlan', newPlan)
        setSubscriptionPlans([...subscriptionPlans, newPlan]);
        setShowAllSubscriptionPlanDetails([...subscriptionPlans, newPlan]);

    }

    const theme = useTheme();

    const handleDeleteSubscriptionPlan= ()=>{
        if(deleteInputValue.toLowerCase() == 'delete'){
            setIsDeletingSubscriptionPlan(true)
            handleClose('subscriptionPlanDelete')
        }
    }

    const handleActivePlanUpdate = ()=>{
        if(subscriptionPlans.length > 0){
            setIsUpdatingActivePlan(true);
            setLoading(true);
        } else {
            setIsPlanNeed(true);
            setIsSubscriptionPlanEditing(false);
            setIsAddingSubscriptionPlan(true);
        }
    }

    return (
        <>
            {/* <SidebarLayout userData={[{role: '647f15e20d8b7330ed890da4'}]}> */}
            {userData.length > 0?
                (
                    isPageLoading?
                        <Box sx={{textAlign: 'center', width: '100%', padding: '15%'}}>
                            <CircularProgress />
                            <Typography>
                                Loading...
                            </Typography>
                        </Box>
                    : 
                        isAdminUser?
                            (<SidebarLayout userData={userData}>
                                <Head>
                                    <title>Channel Subscription Price List</title>
                                </Head>
                                {
                                    isSubscriptionPlanEditing?
                                        <>
                                            <PageTitleWrapper>
                                                <PageHeader categoryAddFunction={handleAddingSubscriptionPlan}/>
                                            </PageTitleWrapper>
                                            <Container maxWidth="lg">
                                                <Grid
                                                    container
                                                    direction="row"
                                                    justifyContent="center"
                                                    alignItems="stretch"
                                                    spacing={3}
                                                >
                                                    <Grid item xs={12}></Grid>
                                                    
                                                    <Card style={{width: "97%", marginBottom:'35px' }}>
                                                        <CardHeader title="Active channel plan" />
                                                        <Divider />
                                                        <Box>
                                                            {/* <FormControl>
                                                                <FormLabel id="demo-radio-buttons-group-label">The free plan is currently active, would you like to change your channel plan for users</FormLabel>
                                                                <RadioGroup
                                                                    aria-labelledby="demo-radio-buttons-group-label"
                                                                    defaultValue="Free"
                                                                    name="radio-buttons-group"
                                                                >
                                                                    <FormControlLabel value="free" control={<Radio />} label="Free" />
                                                                    <FormControlLabel value="paid" control={<Radio />} label="Paid" />
                                                                </RadioGroup>
                                                            </FormControl> */}
                                                            <Box style={{ display:'flex', justifyContent:'space-between', alignItems: 'center', padding: '20px' }} >
                                                                <Typography variant='h4' component='h4'> The {channelActivePlansDetail.length > 0 && `${channelActivePlansDetail[0].isPaid}` == "true" ? "paid": "free"} plan is currently active, would you like to change your channel plan for users </Typography>
                                                                <Button variant='contained' onClick={()=>handleClickOpen('changeActivatePlan')} style={{ marginRight: '10px', minWidth: '100px', height: '45px' }}> Edit </Button>
                                                            </Box>
                                                            {/* <FormControl style={{padding: '0px 20px'}}>
                                                                <RadioGroup
                                                                    aria-labelledby="demo-radio-buttons-group-label"
                                                                    defaultValue="free"
                                                                    name="radio-buttons-group"
                                                                    style={{display: 'flex', flexDirection: 'row'}}
                                                                >
                                                                    <FormControlLabel value="free" control={<Radio />} label="Free" />
                                                                    <FormControlLabel value="paid" control={<Radio />} label="Paid" />
                                                                </RadioGroup>
                                                            </FormControl> */}
                                                        </Box>
                                                        {/* <Box display='flex' justifyContent='end' marginRight='15px' marginBottom='15px'>
                                                            <Button onClick={()=>handleClose('activatePlanChange')}>Cancel</Button>
                                                            <Button autoFocus>
                                                                Update
                                                            </Button>
                                                        </Box> */}
                                                    </Card>

                                                    

                                                    <Card style={{width: "97%"}}>
                                                        <CardHeader title="Channel Subscription Plans" />
                                                        <Divider />
                                                        <TableContainer>
                                                            <Table>
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell>Price</TableCell>
                                                                        <TableCell>Duration</TableCell>
                                                                        <TableCell align="right">Actions</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {showAllSubscriptionPlanDetails.map((plan) => {
                                                                        return (
                                                                            <TableRow hover key={plan._id}>
                                                                                <TableCell>
                                                                                    <Typography
                                                                                        variant="body1"
                                                                                        fontWeight="bold"
                                                                                        color="text.primary"
                                                                                        gutterBottom
                                                                                    >
                                                                                        {plan.price}
                                                                                    </Typography>
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <Typography
                                                                                        variant="body1"
                                                                                        fontWeight="bold"
                                                                                        color="text.primary"
                                                                                        gutterBottom
                                                                                    >
                                                                                        {`${plan.planDuration} ${plan.planDurationUnit} `}
                                                                                    </Typography>
                                                                                </TableCell>
                                                                                <TableCell align="right">
                                                                                    <Tooltip title="Edit Subscription Plan" arrow>
                                                                                        <IconButton
                                                                                            sx={{
                                                                                                '&:hover': {
                                                                                                    background: theme.colors.primary.lighter
                                                                                                },
                                                                                                color: theme.palette.primary.main
                                                                                            }}
                                                                                            color="inherit"
                                                                                            size="small"
                                                                                            onClick={()=>{handleClickOpen('subscriptionPlanEdit', plan)}}
                                                                                        >
                                                                                            <EditTwoToneIcon fontSize="small" />
                                                                                        </IconButton>
                                                                                    </Tooltip>
                                                                                    <Tooltip title="Delete Subscription Plan" arrow>
                                                                                        <IconButton
                                                                                            sx={{
                                                                                                '&:hover': { background: theme.colors.error.lighter },
                                                                                                color: theme.palette.error.main
                                                                                            }}
                                                                                            color="inherit"
                                                                                            size="small"
                                                                                            onClick={()=>{handleClickOpen('subscriptionPlanDelete', plan)}}
                                                                                        >
                                                                                            <DeleteTwoToneIcon fontSize="small" />
                                                                                        </IconButton>
                                                                                    </Tooltip>
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        );
                                                                    })}
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                        <Box p={2}>
                                                            <TablePagination
                                                                component="div"
                                                                count={subscriptionPlans.length}
                                                                onPageChange={handlePageChange}
                                                                onRowsPerPageChange={handleLimitChange}
                                                                page={page}
                                                                rowsPerPage={limit}
                                                                rowsPerPageOptions={[5, 10, 25, 30]}
                                                            />
                                                        </Box>
                                                    </Card>
                                                </Grid>
                                                
                            {/* ---------------------------------------Tattoo Category Delete box---------------------------------- */}
                                                <Dialog open={openDeleteDialog} onClose={()=>handleClose('subscriptionPlanDelete')}>
                                                    <DialogTitle>Delete Subscription plan</DialogTitle>
                                                    <DialogContent>
                                                        <DialogContentText>
                                                            Are you sure? You want delete this Subscription plan. If you want to delete this Subscription plan type delete in input box.
                                                        </DialogContentText>
                                                        <TextField
                                                            autoFocus
                                                            margin="dense"
                                                            id="delete-text"
                                                            label="Delete"
                                                            type="text"
                                                            fullWidth
                                                            variant="standard"
                                                            value={deleteInputValue}
                                                            onChange={(e)=>{setDeleteInputValue(e.target.value)}}
                                                        />
                                                    </DialogContent>
                                                    <DialogActions>
                                                        <Button onClick={()=>handleClose('subscriptionPlanDelete')}>Cancel</Button>
                                                        <Button onClick={handleDeleteSubscriptionPlan}>Delete</Button>
                                                    </DialogActions>
                                                </Dialog>

                                                <Dialog
                                                    open={openSubscriptionActivationDialog}
                                                    onClose={()=>handleClose('activatePlanChange')}
                                                    aria-labelledby="alert-dialog-title"
                                                    aria-describedby="alert-dialog-description"

                                                >
                                                    <DialogTitle id="alert-dialog-title">
                                                        {"Change Channel Active Plan"}
                                                    </DialogTitle>
                                                    <DialogContent style={{ padding: '5px 24px' }}>
                                                        <DialogContentText id="alert-dialog-description">
                                                            <FormControl>
                                                                <FormLabel style={{ marginBottom: '10px' }} id="demo-radio-buttons-group-label">The {channelActivePlansDetail.length > 0 && channelActivePlansDetail[0].isPaid == true ? "paid": "free"} plan is currently active, would you like to change your channel plan for users</FormLabel>
                                                                <RadioGroup
                                                                    aria-labelledby="demo-radio-buttons-group-label"
                                                                    defaultValue={channelActivePlansDetail.length > 0 && channelActivePlansDetail[0].isPaid == true ? "true": "false"}
                                                                    name="radio-buttons-group"
                                                                    style={{display: 'flex', flexDirection: 'row'}}
                                                                >
                                                                    <FormControlLabel value="false" onClick={()=>{setActivePlanInput("false")}} control={<Radio />} label="Free" />
                                                                    <FormControlLabel value="true" onClick={()=>{setActivePlanInput("true")}} control={<Radio />} label="Paid" />
                                                                </RadioGroup>
                                                            </FormControl>
                                                        </DialogContentText>
                                                    </DialogContent>
                                                    <DialogActions style={{marginRight:'15px', marginBottom:'15px'}} >
                                                        <Button onClick={()=>handleClose('activatePlanChange')}>Cancel</Button>
                                                        <Button autoFocus onClick={handleActivePlanUpdate} disabled={loading}>
                                                            {loading ? 'Updating plan...' : 'Update'}
                                                        </Button>
                                                    </DialogActions>
                                                </Dialog>
                                            </Container >
                                        </>
                                    :
                                        isAddingSubscriptionPlan?
                                            userData &&
                                            <AddSubscriptionPlan 
                                                userData={userData}
                                                isPlanNeeded={isPlanNeed}
                                                cancelBtnFunction={handleCancelBtnFunction}
                                                newPlanAddFunction={handleAddNewPlan}
                                            />
                                        :
                                            // (userData && selectedRowDetails && subscriptionPlans) ? 
                                            (userData && selectedRowDetails) ? 
                                                <SubscriptionPlanEdit 
                                                    userData={userData} 
                                                    subscriptionPlanDetail={selectedRowDetails}
                                                    // subscriptionPlans={subscriptionPlans}
                                                    cancelBtnFunction={handleCancelBtnFunction}
                                                    subscriptionPlanUpdateFunction={handleListPlanUpdate}
                                                /> 
                                                : null
                                }
        
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
        
        
                                <Footer />
                            </SidebarLayout>)
                        :
                            (
                                <PermissionDeniedDialog/>
                            )
                )
        
            : 
                <LoginDialog/>
            }

        </>
    );
};

export default ChannelSubscriptionPrice;
