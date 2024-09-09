import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import numeral from 'numeral';
import PropTypes from 'prop-types';
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
  CardHeader
} from '@mui/material';

import Label from 'src/components/Label';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import client from "../../../../graphql";
import { gql } from "@apollo/client";

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

const RecentTransactionTable = ({userDetails}) => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [filters, setFilters] = useState({
    status: null
  });
  const [txnList, setTxnList] = useState(null);
  const [isFetched, setIsFetched]=useState(false);
  const [paginatedTransactionList, setPaginatedTransactionList]=useState([]);
  const [filteredTransactionList, setFilteredTransactionList]=useState([]);
  const [isCheckStatusChange, setIsCheckStatusChange]= useState(false)


  useEffect(()=>{
    console.log('running', userDetails)
    if(userDetails.length > 0 ) {
      if(!isFetched){
        client.query({
            query: gql`
            query Query($userId: String) {
              getTransactionList(userId: $userId) {
                _id
                amount
                planDuration
                paymentMethod
                planDurationUnit
                status
                reason
                transactionDate
                createdAt
                channelDetails {
                  _id
                  channelName
                  urlSlug
                }
              }
            }
        `,
            variables: {
              "userId": userDetails[0]._id
            }
        }).then((result) => {
            console.log('transaction details', result);
            // setUserDetail(result.data.users);
            setIsFetched(true);
            setTxnList(result.data.getTransactionList)
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
  
  return (
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
        title="Recent Transaction"
      />
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {/* <TableCell align="center">ID</TableCell> */}
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
                const transactionDate = txnData.createdAt ;

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
                    {/* <TableCell align="center">
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {txnData._id} 
                      </Typography>
                      
                    </TableCell> */}
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
                      {/* <Typography variant="body2" color="text.secondary" noWrap>
                      {txnDate? format(newD.toLocaleDateString(), 'MMMM dd yyyy'): ''}
                      {d}
                      </Typography> */}
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
                      {/* <Typography variant="body2" color="text.secondary" noWrap>
                        {numeral(txnData.amount).format(
                          `${txnData.currency}0,0.00`
                        )}
                      </Typography> */}
                    </TableCell>
                    <TableCell align="center">
                      {getStatusLabel(txnData.status)}
                    </TableCell>
                    {/* <TableCell align="right">
                      <Tooltip title="Edit Order" arrow>
                        <IconButton
                          sx={{
                            '&:hover': {
                              background: theme.colors.primary.lighter
                            },
                            color: theme.palette.primary.main
                          }}
                          color="inherit"
                          size="small"
                        >
                          <EditTwoToneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Order" arrow>
                        <IconButton
                          sx={{
                            '&:hover': { background: theme.colors.error.lighter },
                            color: theme.palette.error.main
                          }}
                          color="inherit"
                          size="small"
                        >
                          <DeleteTwoToneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell> */}
                  </TableRow>
                </>
              );
            }): 
              <TableRow>
                <TableCell sx={{textAlign: 'center', fontSize: '18px', p: '30px'}} colSpan={12}>No Transaction found...!!</TableCell>
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
  );
};

RecentTransactionTable.propTypes = {
  userDetails: PropTypes.array.isRequired
};

RecentTransactionTable.defaultProps = {
  userDetails: []
};

export default RecentTransactionTable;
