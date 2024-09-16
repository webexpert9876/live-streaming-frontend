import { useEffect, useState } from 'react';
import SidebarLayout from 'src/layouts/SidebarLayout';

import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthUser, selectAuthState } from 'store/slices/authSlice';
import client from "../../../../../graphql";
import { gql } from "@apollo/client";
import Head from 'next/head';
import PageHeader from 'src/content/Management/Transactions/PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import CircularProgress from '@mui/material/CircularProgress';
import { 
    Grid,
    Container,
    Card,
    useTheme,
    Tooltip,
    Divider,
    Box,
    FormControl,
    FormControlLabel,
    RadioGroup,
    FormLabel,
    Radio,
    InputLabel,
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
    CardHeader,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogContentText,
    DialogActions,
    Button,
    Alert
} from '@mui/material';
import Label from 'src/components/Label';
import Footer from 'src/components/Footer';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';

const getStatusLabel = (transactionStatus) => {
    const map = {
    notCreated: {
        text: 'NotCreated',
        color: 'error'
    },
    rejected: {
        text: 'Rejected',
        color: 'error'
    },
    created: {
        text: 'Created',
        color: 'success'
    },
    pending: {
        text: 'Pending',
        color: 'warning'
    }
    };
    console.log('transactionStatus--->', transactionStatus)
    const { text, color } = map[transactionStatus];

    return <Label fontWeight={800} color={color}>{text}</Label>;
};

const getTransferStatusLabel = (transactionStatus) => {
    const map = {
        rejected: {
            text: 'Rejected',
            color: 'error'
        },
        disabled: {
            text: 'Disabled',
            color: 'error'
        },
        restricted: {
            text: 'Restricted',
            color: 'error'
        },
        enabled: {
            text: 'Enabled',
            color: 'success'
        },
        active: {
            text: 'Active',
            color: 'success'
        },
        in_review: {
            text: 'In Review',
            color: 'warning'
        },
        pending: {
            text: 'Pending',
            color: 'warning'
        },
        restricted_soon: {
            text: 'Restricted Soon',
            color: 'warning'
        }
    };
    console.log('transfer status --->', transactionStatus)
    const { text, color } = map[transactionStatus];

    return <Label fontWeight={800} color={color}>{text}</Label>;
};

const applyFilters = (txnData, filters) => {
    return txnData.filter((txn) => {
        let matches = true;

        if (filters.status && txn.isAccountCreated !== filters.status) {
            matches = false;
        }

        return matches;
    });
};

const applyTransferFilters = (txnData, filters) => {
    return txnData.filter((txn) => {
        let matches = true;

        if (filters.status && txn.isTransfer !== filters.status) {
            matches = false;
        }

        return matches;
    });
};

const applyRequireDocFilters = (txnData, filters) => {
    console.log('txnData applyRequireDocFilters', txnData)
    return txnData.filter((txn) => {
        let matches = true;

        let requirement = `${txn.isRequirementPending}`
        
        if (filters.status && requirement !== filters.status) {
            matches = false;
        }

        return matches;
    });
};
const applyPayoutEnabledFilters = (txnData, filters) => {
    console.log('txnData applyRequireDocFilters', txnData)
    return txnData.filter((txn) => {
        let matches = true;

        let requirement = `${txn.isPayoutEnabled}`
        
        if (filters.status && requirement !== filters.status) {
            matches = false;
        }

        return matches;
    });
};
const applyPayoutTypeFilters = (txnData, filters) => {
    console.log('txnData applyRequireDocFilters', txnData)
    return txnData.filter((txn) => {
        let matches = true;
        
        if (filters.status && txn.payoutType !== filters.status) {
            matches = false;
        }

        return matches;
    });
};

const applyPagination = (txnData, page, limit) => {
    console.log('txnData', txnData)
    return txnData.slice(page * limit, page * limit + limit);
};
  



export default function ConnectAccountList(){
    const [isFetched, setIsFetched]=useState(false);
    const router = useRouter();
    let userDetails = useSelector(selectAuthUser);
    let userIsLogedIn = useSelector(selectAuthState);
    const [userDetail, setUserDetail] = useState([]);

    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(5);
    const [filters, setFilters] = useState({
        status: null
    });
    const [filtersSecond, setFiltersSecond] = useState({
        status: null
    });
    const [filterDocRequirement, setFilterDocRequirement] = useState({
        status: null
    });
    const [filterPayoutEnabled, setFilterPayoutEnabled] = useState({
        status: null
    });
    const [filterPayoutType, setFilterPayoutType] = useState({
        status: null
    });
    const [txnList, setTxnList] = useState(null);
    const [connectAccountList, setConnectAccountList]=useState([]);
    const [filteredTransactionList, setFilteredTransactionList]=useState([]);
    const [filterName, setFilterName]=useState(null);
    const [isCheckStatusChange, setIsCheckStatusChange]= useState(false)

    const [openAccountRejectDialog, setOpenAccountRejectDialog] = useState(false);
    const [openEditPayoutDialog, setOpenEditPayoutDialog] = useState(false);
    const [openRejectDialog, setOpenRejectDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    
    const [isChangingPayout, setIsChangingPayout] = useState(false);
    const [isRejectingAccount, setIsRejectingAccount] = useState(false);
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);
    
    const [editPayoutLoading, setEditPayoutLoading] = useState(false);
    const [rejectLoading, setRejectLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [selectedAccountDetails, setSelectedAccountDetails] = useState(null);
    
    const [selectedChangePayout, setSelectedChangePayout] = useState('');
    
// -------------------------Error state------------------------
    const [apiResponseMessage, setApiResponseMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [apiMessageType, setApiMessageType] = useState('');

    useEffect(()=>{
        console.log('running')
        if(userDetails && userIsLogedIn) {
          if(!isFetched){
            client.query({
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
                        channelDetails {
                            channelName
                            _id
                            channelPicture
                            channelCoverImage
                            description
                            subscribers
                            userId
                            urlSlug
                            location
                            createdAt
                        }
                        interestedStyleDetail {
                            title
                            _id
                        }
                    }
                    getConnectAccountList {
                        _id
                        AccountPaymentStatus
                        channelDetails {
                            _id
                            channelName
                            urlSlug
                        }
                        userId
                        channelId
                        connectAccountId
                        isAccountCreated
                        isTransfer
                        isPayoutEnabled
                        payoutType
                        isRequirementPending
                        isAccountActive
                        createdAt
                        updatedAt
                    }
                }
            `,
                variables: {
                  "usersId": userDetails._id
                }
            }).then((result) => {
                console.log('subscription detail', result.data);
                setUserDetail(result.data.users);
                setIsFetched(true);
                setTxnList(result.data.getConnectAccountList)
                setIsCheckStatusChange(true)

                return result.data
            });
          }
        }
    },[userDetails])

    // useEffect(()=>{
    //     axios.get({})
    // }, [])
    

    useEffect(()=>{
        if(isCheckStatusChange){
            let filteredTxnList;
            if(filterName == 'account'){
             filteredTxnList = applyFilters(txnList, filters);
            } else if(filterName == 'transfer') {
                filteredTxnList = applyTransferFilters(txnList, filtersSecond);
            } else if(filterName == 'requirementPending') {                
                filteredTxnList = applyRequireDocFilters(txnList, filterDocRequirement);
            } else if(filterName == 'payoutEnabled') {                
                filteredTxnList = applyPayoutEnabledFilters(txnList, filterPayoutEnabled);
            } else if(filterName == 'payoutType') {                
                filteredTxnList = applyPayoutTypeFilters(txnList, filterPayoutType);
            } else {
                filteredTxnList = applyFilters(txnList, filters);
            }
            
            setFilteredTransactionList(filteredTxnList);
            
            const paginatedTxnList = applyPagination(
                filteredTxnList,
                page,
                limit
            );
            setConnectAccountList(paginatedTxnList);

            setIsCheckStatusChange(false)
        }
    },[isCheckStatusChange])

    const statusOptions = [
        {
            id: 'all',
            name: 'All'
        },
        {
            id: 'created',
            name: 'Created'
        },
        {
            id: 'notCreated',
            name: 'Not Created'
        },
        {
            id: 'pending',
            name: 'Pending'
        }
    ];
    const transferStatusOptions = [
        {
            id: 'all',
            name: 'All'
        },
        {
            id: 'enabled',
            name: 'Enabled'
        },
        {
            id: 'active',
            name: 'Active'
        },
        {
            id: 'pending',
            name: 'Pending'
        },
        {
            id: 'in_review',
            name: 'In Review'
        },
        {
            id: 'restricted',
            name: 'Restricted'
        },
        {
            id: 'restricted_soon',
            name: 'Restricted Soon'
        },
        {
            id: 'disabled',
            name: 'Disabled'
        },
        {
            id: 'rejected',
            name: 'Rejected'
        }
    ];
    const requirementPending = [
        {
            id: 'all',
            name: 'All'
        },
        {
            id: 'true',
            name: 'Yes'
        },
        {
            id: 'false',
            name: 'No'
        }
    ];
    const payoutEnabledOptions = [
        {
            id: 'all',
            name: 'All'
        },
        {
            id: 'true',
            name: 'Yes'
        },
        {
            id: 'false',
            name: 'No'
        }
    ];
    const payoutTypeOptions = [
        {
            id: 'all',
            name: 'All'
        },
        {
            id: 'daily',
            name: 'Daily'
        },
        {
            id: 'week',
            name: 'Week'
        },
        {
            id: 'month',
            name: 'Month'
        },
        {
            id: 'manual',
            name: 'Manual'
        }
    ];

    const handleStatusChange = (e, filterStatus) => {
        let value = null;

        if (e.target.value !== 'all') {
            value = e.target.value;
        }

        if(filterStatus == 'account'){
            setFilters((prevFilters) => ({
                ...prevFilters,
                status: value
            }));
        }
        if(filterStatus == 'transfer') {
            setFiltersSecond((prevFilters) => ({
                ...prevFilters,
                status: value
            }));
        }
        if(filterStatus == 'requirementPending') {
            setFilterDocRequirement((prevFilters) => ({
                ...prevFilters,
                status: value
            }));
        }
        if(filterStatus == 'payoutEnabled') {
            setFilterPayoutEnabled((prevFilters) => ({
                ...prevFilters,
                status: value
            }));
        }
        if(filterStatus == 'payoutType') {
            setFilterPayoutType((prevFilters) => ({
                ...prevFilters,
                status: value
            }));
        }

        console.log('filterStatus', filterStatus)
        setFilterName(filterStatus)
        setPage(0)
        setIsCheckStatusChange(true)
    };

    const handlePageChange = (_event, newPage) => {
        setPage(newPage);
        setIsCheckStatusChange(true)
    };

    const handleLimitChange = (event) => {
        setLimit(parseInt(event.target.value));
        setIsCheckStatusChange(true)
    };

    const theme = useTheme();
    
    const handleClickOpen = (dialogType, accountData) => {
        switch(dialogType){
            case 'editPayout':
                console.log('accountData edit payout', accountData)
                setSelectedAccountDetails(accountData)
                setOpenEditPayoutDialog(true);
                break;
            case 'rejectAccount':
                setSelectedAccountDetails(accountData)
                setOpenRejectDialog(true);
                break;
            case 'deleteAccount':
                setSelectedAccountDetails(accountData)
                setOpenDeleteDialog(true);
                break;
        }
    };

    const handleClose = (dialogType) => {
        switch(dialogType){
            case 'editPayout':
                setOpenEditPayoutDialog(false);
                break;
            case 'rejectAccount':
                setOpenRejectDialog(false);
                break;
            case 'deleteAccount':
                setOpenDeleteDialog(false);
                break;
        }
    };

    const handleAccountPayout= ()=>{
        setIsChangingPayout(true)
        handleClose('editPayout')
    }

    const handleRejectAccount= ()=>{
        setIsRejectingAccount(true)
        handleClose('rejectAccount')
    }
    
    const handleDeleteAccount= ()=>{
        setIsDeletingAccount(true)
        handleClose('deleteAccount')
    }


    useEffect(()=>{
        if(isRejectingAccount){
            setRejectLoading(true)
            let rejectData = {
                connectAccountId: selectedAccountDetails.connectAccountId,
                adminUserId: userDetail[0]._id
            }
            axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reject/connected/account/${selectedAccountDetails.connectAccountId}`, rejectData, {headers: {'x-access-token': userDetail[0].jwtToken }}).then((data)=>{
                setApiMessageType('success')
                setApiResponseMessage('Account Rejected successfully');
                handleRejectAccountDetail(selectedAccountDetails._id)
                setIsRejectingAccount(false);
                setLoading(false);
                handleMessageBoxOpen();
                setRejectLoading(false);
            }).catch((error)=>{
                console.log('error', error);
                setApiMessageType('error')
                const errorMessage = error.response.data.message;
                
                handleMessageBoxOpen()
                setApiResponseMessage(errorMessage);
                setIsRejectingAccount(false)
                setLoading(false);
                setRejectLoading(false);
            });
        }
    },[isRejectingAccount])

    useEffect(()=>{
        if(isChangingPayout){
            setEditPayoutLoading(true)
            let payoutData = { connectAccountId: selectedAccountDetails.connectAccountId,
                payoutType: selectedChangePayout,
                adminUserId: userDetail[0]._id
            }
            axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pause/account/payout/${selectedAccountDetails.connectAccountId}`, payoutData, { headers: {'x-access-token': userDetail[0].jwtToken} }).then((data)=>{
                setApiMessageType('success')
                setApiResponseMessage('Payout setting successfully changed');
                handleUpdateAccountDetail(selectedAccountDetails._id);
                setIsChangingPayout(false);
                setLoading(false);
                handleMessageBoxOpen();
                setEditPayoutLoading(false);
                setSelectedChangePayout('');
            }).catch((error)=>{
                console.log('error', error);
                setApiMessageType('error')
                const errorMessage = error.response.data.message;
                
                handleMessageBoxOpen()
                setApiResponseMessage(errorMessage);
                setIsChangingPayout(false)
                setLoading(false);
                setEditPayoutLoading(false);
                setSelectedChangePayout('')
            });
    
        }
    },[isChangingPayout])

    useEffect(()=>{
        if(isDeletingAccount){
            setDeleteLoading(true)
            let deleteData = { connectAccountId: selectedAccountDetails.connectAccountId,
                adminUserId: userDetail[0]._id
            }
            axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/remove/connected/account/${selectedAccountDetails.connectAccountId}`, deleteData, {headers: {'x-access-token': userDetail[0].jwtToken }}).then((data)=>{
                setApiMessageType('success')
                setApiResponseMessage('Account deleted successfully');
                removeAccountFromList(selectedAccountDetails._id)
                setIsDeletingAccount(false);
                setLoading(false);
                handleMessageBoxOpen();
                setDeleteLoading(false);
            }).catch((error)=>{
                console.log('error', error);
                setApiMessageType('error')
                const errorMessage = error.response.data.message;
                
                handleMessageBoxOpen()
                setApiResponseMessage(errorMessage);
                setIsDeletingAccount(false)
                setLoading(false);
                setDeleteLoading(false);
            });
    
        }
    },[isDeletingAccount])

    const handleMessageBoxClose = () => {
        setOpen(false);
        setApiResponseMessage('');
        setApiMessageType('')
    };
    const handleMessageBoxOpen = () => {
        setOpen(true);
    };

    const handleUpdateAccountDetail = () => {
                                                 
        setConnectAccountList(updatedList);
    }
    
    const handleRejectAccountDetail = () => {
        const updatedList = connectAccountList.map(account => 
            account.connectAccountId === selectedAccountDetails.connectAccountId ? { ...account, isAccountCreated: 'rejected', isTransfer: 'rejected', isPayoutEnabled: false, payoutType: 'manual'} : account
        );
        setTxnList(updatedList);
        setConnectAccountList(updatedList);
    }

    const removeAccountFromList = (id)=>{
        const updatedArray  = filteredTransactionList.filter(obj => obj._id !== id);
        setFilteredTransactionList(updatedArray)
        let newList = updatedArray.slice(page * limit, page * limit + limit);
        
        setTxnList(newList);
        setConnectAccountList(newList);
    }

    const handlePayoutChange = (e) => {
        console.log('e.target.value', e.target.value);
        setSelectedChangePayout(e.target.value);
    }

    return(
        <>
        {userDetail.length > 0?<SidebarLayout userData={userDetail}>
            <Head>
                <title>Connect Account List</title>
            </Head>
            <PageTitleWrapper>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <Typography variant="h3" component="h3" gutterBottom>
                            Connected Account List
                        </Typography>
                        {/* <Typography variant="subtitle2" sx={{textTransform: 'capitalize'}}>
                        {`${userData[0].firstName} ${userData[0].lastName}`}, these are your recent transactions
                        </Typography> */}
                    </Grid>
                </Grid>
            </PageTitleWrapper>
            <Container maxWidth="xl">
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="stretch"
                    spacing={3}
                >
                    <Grid item xs={12}>
                        <Card>
                            <CardHeader
                                action={
                                    <Box minWidth={800} padding={'10px 5px 0px 0px'} display={'flex'}>
                                        <Box width={'100%'}>
                                            <FormControl fullWidth variant="outlined">
                                                <InputLabel>Account Status</InputLabel>
                                                <Select
                                                    value={filters.status || 'all'}
                                                    onChange={(e)=>{handleStatusChange(e, 'account')}}
                                                    label="Status"
                                                    autoWidth
                                                >
                                                    {statusOptions.map((statusOption) => (
                                                        <MenuItem key={statusOption.id} value={statusOption.id}>
                                                            {statusOption.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Box>
                                        <Box ml={'10px'} width={'100%'}>
                                            <FormControl fullWidth variant="outlined" >
                                                <InputLabel>Payment Transfer Status</InputLabel>
                                                <Select
                                                    value={filtersSecond.status || 'all'}
                                                    onChange={(e)=>{handleStatusChange(e, 'transfer')}}
                                                    label="Status"
                                                    autoWidth
                                                >
                                                    {transferStatusOptions.map((statusOption) => (
                                                        <MenuItem key={statusOption.id} value={statusOption.id}>
                                                            {statusOption.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Box>
                                        <Box ml={'10px'} width={'100%'}>
                                            <FormControl fullWidth variant="outlined" >
                                                <InputLabel>Requirement Pending</InputLabel>
                                                <Select
                                                    value={filterDocRequirement.status || 'all'}
                                                    onChange={(e)=>{handleStatusChange(e, 'requirementPending')}}
                                                    label="Status"
                                                    autoWidth
                                                >
                                                    {requirementPending.map((statusOption) => (
                                                        <MenuItem key={statusOption.id} value={statusOption.id}>
                                                            {statusOption.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Box>
                                        <Box ml={'10px'} width={'100%'}>
                                            <FormControl fullWidth variant="outlined" >
                                                <InputLabel>Payout Enabled</InputLabel>
                                                <Select
                                                    value={filterPayoutEnabled.status || 'all'}
                                                    onChange={(e)=>{handleStatusChange(e, 'payoutEnabled')}}
                                                    label="Status"
                                                    autoWidth
                                                >
                                                    {payoutEnabledOptions.map((statusOption) => (
                                                        <MenuItem key={statusOption.id} value={statusOption.id}>
                                                            {statusOption.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Box>
                                        <Box ml={'10px'} width={'100%'}>
                                            <FormControl fullWidth variant="outlined" >
                                                <InputLabel>Payout Type</InputLabel>
                                                <Select
                                                    value={filterPayoutType.status || 'all'}
                                                    onChange={(e)=>{handleStatusChange(e, 'payoutType')}}
                                                    label="Status"
                                                    autoWidth
                                                >
                                                    {payoutTypeOptions.map((statusOption) => (
                                                        <MenuItem key={statusOption.id} value={statusOption.id}>
                                                            {statusOption.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Box>
                                    </Box>
                                }
                                title="Connected Accounts"
                            />
                            <Divider />
                            {
                                deleteLoading || rejectLoading || editPayoutLoading?
                                    <Box sx={{textAlign: 'center', width: '100%', padding: '15%'}}>
                                        <CircularProgress />
                                        <Typography>
                                            Loading...
                                        </Typography>
                                    </Box>
                            :
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="center">Connected Account ID</TableCell>
                                                <TableCell align="center">Channel Name</TableCell>
                                                <TableCell align="center">Account Status</TableCell>
                                                <TableCell align="center">Payment Transfer Status</TableCell>
                                                <TableCell align="center">Requirement Pending</TableCell>
                                                <TableCell align="center">Payout Enabled</TableCell>
                                                <TableCell align="center">Payout</TableCell>
                                                <TableCell align="center">Is Active</TableCell>
                                                <TableCell align="center">Account Creation Date</TableCell>
                                                <TableCell align="center">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {connectAccountList.length > 0 ? connectAccountList.map((txnData) => {
                                                // console.log("txnData", txnData)
                                                let d;
                                                let newD;
                                                const transactionDate = txnData.createdAt;

                                                if (typeof transactionDate === 'string') {
                                                    if (!isNaN(transactionDate) && transactionDate.length >= 10) {
                                                        // Handle as Unix timestamp string
                                                        newD = new Date(parseInt(transactionDate, 10));
                                                    } else {
                                                        // Handle as ISO string
                                                        newD = new Date(transactionDate);
                                                    }
                                                } else if (typeof transactionDate === 'number') {
                                                    if (transactionDate.toString().length === 10) {
                                                        // Unix timestamp in seconds
                                                        newD = new Date(transactionDate * 1000);
                                                    } else if (transactionDate.toString().length === 13) {
                                                        // Unix timestamp in milliseconds
                                                        newD = new Date(transactionDate);
                                                    }
                                                }

                                                if (newD && !isNaN(newD.getTime())) {
                                                    d = newD.toLocaleDateString()
                                                } else {
                                                    d = transactionDate
                                                }

                                                return (
                                                    <>
                                                        <TableRow hover >
                                                            <TableCell align="center">
                                                                <Typography
                                                                    variant="body1"
                                                                    fontWeight="bold"
                                                                    color="text.primary"
                                                                    gutterBottom
                                                                    noWrap
                                                                >
                                                                    {txnData.connectAccountId} 
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Typography
                                                                    variant="body1"
                                                                    fontWeight="bold"
                                                                    color="text.primary"
                                                                    gutterBottom
                                                                    noWrap
                                                                >
                                                                    {txnData?.channelDetails[0]?.channelName}
                                                                </Typography>
                                                            </TableCell>
                                                            
                                                            <TableCell align="center">
                                                                {getStatusLabel(txnData.isAccountCreated)}
                                                            </TableCell>

                                                            <TableCell align="center">
                                                                {getTransferStatusLabel(txnData.isTransfer)}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                {txnData.isRequirementPending ? 'Yes': 'No'}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                {txnData.isPayoutEnabled ? 'Yes': 'No'}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                {txnData.payoutType.charAt(0).toUpperCase() + txnData.payoutType.slice(1)}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                {txnData.isAccountActive ? 'Yes': 'No'}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Typography
                                                                    variant="body1"
                                                                    fontWeight="bold"
                                                                    color="text.primary"
                                                                    gutterBottom
                                                                    noWrap
                                                                >
                                                                    {d}
                                                                </Typography>

                                                            </TableCell>
                                                            <TableCell align="center" sx={{display: 'flex', gap: '5px'}}>
                                                                <Tooltip title="Edit Payout" arrow>
                                                                    <IconButton
                                                                    sx={{
                                                                        '&:hover': {
                                                                        background: theme.colors.primary.lighter
                                                                        },
                                                                        color: theme.palette.primary.main,
                                                                        marginRight: '7px'
                                                                    }}
                                                                    color="inherit"
                                                                    size="small"
                                                                    onClick={()=>{handleClickOpen('editPayout', txnData)}}
                                                                    >
                                                                    <EditTwoToneIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title="Reject Account" arrow>
                                                                    <IconButton
                                                                        sx={{
                                                                            '&:hover': { background: theme.colors.error.lighter },
                                                                            color: theme.palette.error.main,
                                                                            marginRight: '7px'
                                                                        }}
                                                                        color="inherit"
                                                                        size="small"
                                                                        onClick={()=>{handleClickOpen('rejectAccount', txnData)}}
                                                                    >
                                                                    <CancelIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title="Delete Account" arrow>
                                                                    <IconButton
                                                                        sx={{
                                                                            '&:hover': { background: theme.colors.error.lighter },
                                                                            color: theme.palette.error.main
                                                                        }}
                                                                        color="inherit"
                                                                        size="small"
                                                                        onClick={()=>{handleClickOpen('deleteAccount', txnData)}}
                                                                    >
                                                                    <DeleteTwoToneIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </TableCell>
                                                        </TableRow>
                                                    </>
                                                );
                                            }) :
                                                <TableRow>
                                                    <TableCell sx={{ textAlign: 'center', fontSize: '18px', p: '30px' }} colSpan={12}>No Connected Account found...!!</TableCell>
                                                </TableRow>
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            }
                            <Box p={2}>
                                <TablePagination
                                    component="div"
                                    count={filteredTransactionList.length}
                                    onPageChange={handlePageChange}
                                    onRowsPerPageChange={handleLimitChange}
                                    page={page}
                                    rowsPerPage={limit}
                                    rowsPerPageOptions={[5, 10, 25, 30]}
                                />
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <Footer />

            { /* ---------------------------------------------------------------- Dialog Edit Payout ---------------------------------------------------------------- */ }
            <Dialog open={openEditPayoutDialog} onClose={()=>handleClose('editPayout')}>
                <DialogTitle>Edit Artist Stripe Account Payout</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure? You want change payout settings for this Stripe Connect Account.
                        {/* <FormControl fullWidth>
                            <InputLabel id="simple-select-label">Payout</InputLabel>
                            <Select
                                labelId="simple-select-label"
                                id="payout"
                                value={subscriptionPlanInput.planDurationUnit}
                                label="Plan Type"
                                name='planDurationUnit'
                                onChange={handleFormChange}
                                // error={openPlanDurationUnitError}
                                // helperText={openPlanDurationUnitError?planDurationUnitErrorMessage:null}
                            >
                                <MenuItem value={"daily"}>Daily</MenuItem>
                                <MenuItem value={"manual"}>Manual</MenuItem>
                            </Select>
                        </FormControl> */}
                        <FormControl>
                            <FormLabel id="demo-radio-buttons-group-label">Payout</FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue={selectedAccountDetails?.payoutType}
                                name="radio-buttons-group"
                                onChange={handlePayoutChange}
                            >
                                <FormControlLabel value="daily" control={<Radio />} label="Daily" />
                                <FormControlLabel value="manual" control={<Radio />} label="Manual" />
                            </RadioGroup>
                        </FormControl>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>handleClose('editPayout')}>Cancel</Button>
                    <Button onClick={handleAccountPayout}>Change</Button>
                </DialogActions>
            </Dialog>

            { /* ---------------------------------------------------------------- Dialog Reject---------------------------------------------------------------- */ }
            <Dialog open={openRejectDialog} onClose={()=>handleClose('rejectAccount')}>
                <DialogTitle>Reject Artist Stripe Account</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure? You want to Reject this Stripe Connect account. After Reject, you won't be able to re-enable this account.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>handleClose('rejectAccount')}>Cancel</Button>
                    <Button onClick={handleRejectAccount}>Reject</Button>
                </DialogActions>
            </Dialog>

            { /* ---------------------------------------------------------------- Dialog Delete---------------------------------------------------------------- */ }
            <Dialog open={openDeleteDialog} onClose={()=>handleClose('deleteAccount')}>
                <DialogTitle>Delete Artist Stripe Account</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure? You want to delete this Stripe Connect account. This will permanently remove the Artist Stripe account from Stripe.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>handleClose('deleteAccount')}>Cancel</Button>
                    <Button onClick={handleDeleteAccount}>Delete</Button>
                </DialogActions>
            </Dialog>

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

        </SidebarLayout>:null}
      </>
    )
}