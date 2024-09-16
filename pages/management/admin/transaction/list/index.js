import { useEffect, useState } from 'react';
import SidebarLayout from 'src/layouts/SidebarLayout';

import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthUser, selectAuthState } from 'store/slices/authSlice';
import client from "../../../../../graphql";
import { gql } from "@apollo/client";
import Head from 'next/head';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { 
    Grid,
    Container,
    Card,
    useTheme,
    Divider,
    Box,
    FormControl,
    InputLabel,
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
} from '@mui/material';
import Label from 'src/components/Label';
import Footer from 'src/components/Footer';

const getStatusLabel = (transactionStatus) => {
    const map = {
      failed: {
        text: 'Failed',
        color: 'error'
      },
      succeeded: {
        text: 'Succeeded',
        color: 'success'
      },
      pending: {
        text: 'Pending',
        color: 'warning'
      },
      canceled: {
        text: 'Canceled',
        color: 'error'
      }
    };
    console.log('transactionStatus--->', transactionStatus)
    const { text, color } = map[transactionStatus];
  
    return <Label fontWeight={800} color={color}>{text}</Label>;
};

const applyFilters = (txnData, filters) => {
    return txnData.filter((txn) => {
      let matches = true;
  
      if (filters.status && txn.status !== filters.status) {
        matches = false;
      }
  
      return matches;
    });
};

const applyPagination = (txnData, page, limit) => {
    return txnData.slice(page * limit, page * limit + limit);
};

export default function TranscationList() {
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
    const [txnList, setTxnList] = useState(null);
    const [paginatedTransactionList, setPaginatedTransactionList]=useState([]);
    const [filteredTransactionList, setFilteredTransactionList]=useState([]);
    const [isCheckStatusChange, setIsCheckStatusChange]= useState(false)
    
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
                    getAllTransactions {
                        _id
                        amount
                        artistAccountId
                        channelDetails {
                            _id
                            channelName
                            urlSlug
                        }
                        usersDetail {
                            _id
                            firstName
                            lastName
                            urlSlug
                        }
                        planDuration
                        paymentMethod
                        planDurationUnit
                        status
                        reason
                        transactionDate
                        createdAt
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
                setTxnList(result.data.getAllTransactions)
                setIsCheckStatusChange(true)

                return result.data
            });
          }
        }
    },[userDetails])


    useEffect(()=>{
        if(isCheckStatusChange){
          
          const filteredTxnList = applyFilters(txnList, filters);
          setFilteredTransactionList(filteredTxnList);
          
          const paginatedTxnList = applyPagination(
            filteredTxnList,
            page,
            limit
          );
          console.log('')
          setPaginatedTransactionList(paginatedTxnList);
    
          setIsCheckStatusChange(false)
        }
      },[isCheckStatusChange])
    
      const statusOptions = [
        {
          id: 'all',
          name: 'All'
        },
        {
          id: 'succeeded',
          name: 'Succeeded'
        },
        {
          id: 'pending',
          name: 'Pending'
        },
        {
          id: 'failed',
          name: 'Failed'
        },
        {
          id: 'canceled',
          name: 'Canceled'
        }
      ];
    
      const handleStatusChange = (e) => {
        let value = null;
    
        if (e.target.value !== 'all') {
          value = e.target.value;
        }
    
        setFilters((prevFilters) => ({
          ...prevFilters,
          status: value
        }));
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

    return(
        <>
        {userDetail.length > 0?<SidebarLayout userData={userDetail}>
            <Head>
                <title>Transaction List</title>
            </Head>
            <PageTitleWrapper>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <Typography variant="h3" component="h3" gutterBottom>
                            All Transaction List
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
                                    <Box width={150}>
                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel>Status</InputLabel>
                                            <Select
                                                value={filters.status || 'all'}
                                                onChange={handleStatusChange}
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
                                }
                                title="Transactions"
                            />
                            <Divider />
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            {/* <TableCell align="center">ID</TableCell> */}
                                            <TableCell align="center">User Name</TableCell>
                                            <TableCell align="center">Channel Name</TableCell>
                                            <TableCell align="center">Transaction Date</TableCell>
                                            <TableCell align="center">Plan Duration</TableCell>
                                            <TableCell align="center">Plan Type</TableCell>
                                            <TableCell align="center">Payment Method</TableCell>
                                            <TableCell align="center">Amount</TableCell>
                                            <TableCell align="center">Status</TableCell>
                                            {/* <TableCell align="right">Actions</TableCell> */}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paginatedTransactionList.length > 0 ? paginatedTransactionList.map((txnData) => {
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
                                                                {`${txnData?.usersDetail[0]?.firstName} ${txnData?.usersDetail[0]?.lastName}`}
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
                                                        <TableCell align="center">
                                                            <Typography
                                                                variant="body1"
                                                                fontWeight="bold"
                                                                color="text.primary"
                                                                gutterBottom
                                                                noWrap
                                                            >
                                                                {txnData.planDuration}
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
                                                                {txnData.planDurationUnit}
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
                                                                {txnData.paymentMethod}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary" noWrap>
                                                                {txnData.paymentMethod}
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
                                                                ${txnData.amount}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {getStatusLabel(txnData.status)}
                                                        </TableCell>
                                                    </TableRow>
                                                </>
                                            );
                                        }) :
                                            <TableRow>
                                                <TableCell sx={{ textAlign: 'center', fontSize: '18px', p: '30px' }} colSpan={12}>No Transaction found...!!</TableCell>
                                            </TableRow>
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
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

            {/* --------------------------------------------------------Error or success message------------------------------------------ */}
            {/* <Stack spacing={2} sx={{ width: '100%' }}>
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
            </Stack> */}

        </SidebarLayout>:null}
      </>
    )
}