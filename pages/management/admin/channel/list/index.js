import { useState, useEffect } from 'react';
import Head from 'next/head';
import SidebarLayout from 'src/layouts/SidebarLayout';
import Footer from 'src/components/Footer';
import PageHeader from '../../../../../src/components/channel/list/PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import {
    Tooltip,
    Grid,
    Container,
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
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';

import Label from 'src/components/Label';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import client from "../../../../../graphql";
import { gql } from "@apollo/client";
import axios from 'axios';


const RecentOrdersTable = () => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [filters, setFilters] = useState({
    status: null
  });

  const [userData, setUserData] = useState([]);
  const [allChannelDetails, setAllChannelDetails]= useState([])
  const [showAllChannelDetails, setShowAllChannelDetails]= useState([])
  const [isCheckStatusChange, setIsCheckStatusChange]= useState(false)
  const [filteredVideoList, setFilteredVideoList]= useState([])

  const statusOptions = [
    {
        id: 'all',
        name: 'All'
    },
    {
        id: true,
        name: 'Approaved'
    },
    {
        id: false,
        name: 'Unapproaved'
    },
];


  useEffect(()=>{
    let userId = JSON.parse(localStorage.getItem('authUser'));
    function getUserAllDetails(){
      client.query({
        variables: {
          usersId: userId._id,
        },
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
                }
                channels {
                    channelName
                    _id
                    channelCoverImage
                    blocked
                    channelPicture
                    createdAt
                    description
                    isApproved
                    location
                    subscribers
                    updatedAt
                    urlSlug
                    userId
                }
            }
        `,
      }).then((result) => {
          setUserData(result.data.users);
          setAllChannelDetails(result.data.channels);
          setShowAllChannelDetails(result.data.channels);
          setFilteredVideoList(result.data.channels);
          setIsCheckStatusChange(true)
        });
    }
    getUserAllDetails();
  },[])

  useEffect(()=>{
    if(isCheckStatusChange){

        const filteredChannels = applyFilters(allChannelDetails, filters);
        
        // setFilteredVideoList(filteredVideo)

        const paginatedChannel = applyPagination(
            filteredChannels,
            page,
            limit
        );
        setIsCheckStatusChange(false)
    }
  },[isCheckStatusChange])

  const getStatusLabel = (channelStatus) => {
    const map = {
        unapproved: {
            text: 'Unapproved',
            color: 'warning'
        },
        approved: {
            text: 'Approved',
            color: 'success'
        }
    };
    let channelCheck = `${channelStatus}` == 'true'? 'approved': 'unapproved';

    const { text, color } = map[channelCheck];

    return <Label color={color}>{text}</Label>;
};

const applyFilters = (allChannels, filters) => {
  return allChannels.filter((allChannel) => {
    let matches = true;

    if (filters.status && allChannel.status !== filters.status) {
      matches = false;
    }

    return matches;
  });
};

const applyPagination = (allChannels, page, limit) => {
    let selectedChannels =   allChannels.slice(page * limit, page * limit + limit);
    setShowAllChannelDetails(selectedChannels);
};

  const handleStatusChange = (e) => {
    let value = null;

    if (e.target.value !== 'all') {
      value = e.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      status: value
    }));
  };

  const handlePageChange = (_event, newPage) => {
    setPage(newPage);
    setIsCheckStatusChange(true)
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
    setIsCheckStatusChange(true)
  };

//   const filteredCryptoOrders = applyFilters(cryptoOrders, filters);
//   const paginatedCryptoOrders = applyPagination(
//     filteredCryptoOrders,
//     page,
//     limit
//   );
  const theme = useTheme();

  return (
    <>
        {userData.length > 0?
                <SidebarLayout userData={userData}>
                    <Head>
                        <title>All Channels</title>
                    </Head>
                    {
                        // isVideoEditing?
                            <>
                                <PageTitleWrapper>
                                    <PageHeader />
                                </PageTitleWrapper>
                                <Container maxWidth="lg">
                                    <Grid
                                        direction="row"
                                        justifyContent="center"
                                        alignItems="stretch"
                                        spacing={3}
                                    >
                                        <Grid item xs={12}></Grid>
                                        <Card>
                                            <CardHeader
                                                action={
                                                <Box width={150}>
                                                    <FormControl fullWidth variant="outlined">
                                                    <InputLabel>Channel Status</InputLabel>
                                                    <Select
                                                        value={filters.status == null ? 'all': filters.status ? true: false}
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
                                                title="Channels"
                                            />
                                            <Divider />
                                            <TableContainer>
                                                <Table>
                                                <TableHead>
                                                    <TableRow>
                                                    <TableCell>Channel Name</TableCell>
                                                    <TableCell>Description</TableCell>
                                                    <TableCell>Approaved Status</TableCell>
                                                    <TableCell align="right">Blocked status</TableCell>
                                                    <TableCell align="right">Status</TableCell>
                                                    <TableCell align="right">Actions</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {showAllChannelDetails.map((channel) => {
                                                    return (
                                                        <TableRow hover key={channel._id}>
                                                        <TableCell>
                                                            <Typography
                                                            variant="body1"
                                                            fontWeight="bold"
                                                            color="text.primary"
                                                            gutterBottom
                                                            noWrap
                                                            >
                                                            {channel.channelName}
                                                            </Typography>
                                                            {/* <Typography variant="body2" color="text.secondary" noWrap>
                                                            {format(cryptoOrder.orderDate, 'MMMM dd yyyy')}
                                                            </Typography> */}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography
                                                            variant="body1"
                                                            fontWeight="bold"
                                                            color="text.primary"
                                                            gutterBottom
                                                            noWrap
                                                            >
                                                            {channel.description}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography
                                                            variant="body1"
                                                            fontWeight="bold"
                                                            color="text.primary"
                                                            gutterBottom
                                                            noWrap
                                                            >
                                                            {channel.isApproved}
                                                            </Typography>
                                                            {/* <Typography variant="body2" color="text.secondary" noWrap>
                                                            {cryptoOrder.sourceDesc}
                                                            </Typography> */}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            {getStatusLabel(channel.isApproved)}
                                                        </TableCell>
                                                        <TableCell align="right">
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
                                                count={allChannelDetails.length}
                                                onPageChange={handlePageChange}
                                                onRowsPerPageChange={handleLimitChange}
                                                page={page}
                                                rowsPerPage={limit}
                                                rowsPerPageOptions={[5, 10, 25, 30]}
                                                />
                                            </Box>
                                            </Card>
                                    </Grid>
                                    
                {/* ---------------------------------------Video Delete box---------------------------------- */}
                                    {/* <Dialog open={openDeleteDialog} onClose={()=>handleClose('videoDelete')}>
                                        <DialogTitle>Delete Video Details</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText>
                                                Are you sure? You want delete this video. If you want to delete this video type delete in input box.
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
                                            <Button onClick={()=>handleClose('videoDelete')}>Cancel</Button>
                                            <Button onClick={handleDeleteVideo}>Delete</Button>
                                        </DialogActions>
                                    </Dialog> */}

                    {/* ---------------------------------------Video edit box---------------------------------- */}
                                    {/* <Dialog open={openVideoEditDialog} onClose={()=>handleClose('videoEdit')}>
                                        <DialogTitle>Edit Video Details</DialogTitle>
                                        <DialogContent>
                                            <TextField
                                                autoFocus
                                                margin="dense"
                                                id="title"
                                                label="Video Title"
                                                type="text"
                                                fullWidth
                                                variant="standard"
                                            />
                                            <TextField
                                                autoFocus
                                                margin="dense"
                                                id="description"
                                                label="Video description"
                                                type="text"
                                                fullWidth
                                                variant="standard"
                                            />
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={()=>handleClose('videoEdit')}>Cancel</Button>
                                            <Button >Update</Button>
                                        </DialogActions>
                                    </Dialog> */}

                                </Container >
                            </>
                        // :
                        //     (userData && selectedRowVideoDetails && tattooCategoryList && tagList) ? 
                        //         <VideoEditCard 
                        //             userData={userData} 
                        //             videoDetail={selectedRowVideoDetails} 
                        //             tattooCategoryList={tattooCategoryList} 
                        //             tagData={tagList}
                        //             cancelBtnFunction={handleCancelBtnFunction}
                        //             videoUpdateFunction={handleListVideoUpdate}
                        //         /> 
                        //         : null
                    }

                {/* --------------------------------------------------------Error or success message------------------------------------------ */}
                    {/* <Stack spacing={2} sx={{ width: '100%' }}>
                        <Snackbar anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }} open={open} autoHideDuration={6000} onClose={handleMessageBoxClose} >
                        <Alert onClose={handleMessageBoxClose} variant="filled" severity={`${apiMessageType=='success'? 'success': 'error'}`} sx={{ width: '100%' }}>
                            {apiResponseMessage}
                        </Alert>
                        </Snackbar>
                    </Stack> */}


                    <Footer />
                </SidebarLayout>
            : null}
    </>
  );
};

export default RecentOrdersTable;
