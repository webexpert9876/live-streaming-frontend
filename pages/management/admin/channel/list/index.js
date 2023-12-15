import { useState, useEffect } from 'react';
import Head from 'next/head';
import SidebarLayout from 'src/layouts/SidebarLayout';
import Footer from 'src/components/Footer';
import PageHeader from '../../../../../src/components/channel/list/PageHeader';
import ChannelEdit from '../../../../../src/components/admin/channel/ChannelEdit';
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
    CardHeader
} from '@mui/material';

import Label from 'src/components/Label';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import client from "../../../../../graphql";
import { gql } from "@apollo/client";
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthUser } from 'store/slices/authSlice';
import { useRouter } from 'next/router';
import axios, { all } from 'axios';
import LoginDialog from 'src/components/pageAccessDialog/loginDialog'
import PermissionDeniedDialog from 'src/components/pageAccessDialog/permissionDeniedDialog'


const ChannelListPage = () => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [filters, setFilters] = useState({
    status: null
  });

  const [userData, setUserData] = useState([]);
  const [isUserAvailable, setIsUserAvailable] = useState(false);
  const [isFetchedApi, setIsFetchedApi] = useState(true);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const authState = useSelector(selectAuthUser)
  const router = useRouter();

  const [allChannelDetails, setAllChannelDetails]= useState([]);
  const [showAllChannelDetails, setShowAllChannelDetails]= useState([]);
  const [isCheckStatusChange, setIsCheckStatusChange]= useState(false);
  const [filterCount, setFilterCount]= useState(0);

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [isChannelEditing, setIsChannelEditing] = useState(false);
//   const [isAddingTattooCategory, setIsAddingTattooCategory] = useState(false);
  const [selectedRowDetails, setSelectedRowDetails] = useState({});

//   const [isDeletingCategory, setIsDeletingCategory] = useState(false);
//   const [deleteInputValue, setDeleteInputValue] = useState('');

  // -------------------------Error state------------------------
  const [apiResponseMessage, setApiResponseMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [apiMessageType, setApiMessageType] = useState('');

    const statusOptions = [
        {
            id: 'all',
            name: 'All'
        },
        {
            id: 'approved',
            name: 'Approved'
        },
        {
            id: 'pending',
            name: 'Pending'
        },
        {
            id: 'declined',
            name: 'Declined'
        }
    ];

const filterStatusOption = {
    null: 'all',
    approved: 'approved',
    declined: 'declined',
    pending: 'pending'
  };


  useEffect(()=>{
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

        if(roleInfo.data.roles[0].role == 'admin'){
            setIsAdminUser(true);
            client.query({
              variables: {
                usersId: userData[0]._id,
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
                setFilterCount(result.data.channels.length);
                setIsCheckStatusChange(true)
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
},[authState])

  useEffect(()=>{
    if(isCheckStatusChange){

        const filteredChannels = applyFilters(allChannelDetails, filters);
        setFilterCount(filteredChannels.length)

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
        // unapproved: {
        //     text: 'Unapproved',
        //     color: 'warning'
        // },
        pending: {
            text: 'Pending',
            color: 'warning'
        },
        declined: {
            text: 'Declined',
            color: 'error'
        },
        approved: {
            text: 'Approved',
            color: 'success'
        }
    };
    let channelCheck = channelStatus == 'approved'? 'approved': ( channelStatus == 'declined'? 'declined': 'pending');

    const { text, color } = map[channelCheck];

    return <Label color={color}>{text}</Label>;
  };

  const getBlockedStatusLabel = (channelStatus) => {
    const map = {
        // unapproved: {
        //     text: 'Unapproved',
        //     color: 'warning'
        // },
        'true': {
            text: 'Blocked',
            color: 'error'
        },
        'false': {
            text: 'Unblocked',
            color: 'success'
        }
    };
    // let channelCheck = channelStatus == 'approved'? 'approved': ( channelStatus == 'declined'? 'declined': 'pending');

    const { text, color } = map[channelStatus];

    return <Label color={color}>{text}</Label>;
};

const applyFilters = (allChannels, filters) => {
  return allChannels.filter((allChannel) => {
    let matches = true;

    if (filters.status && allChannel.isApproved !== filters.status) {
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
    setIsCheckStatusChange(true);
  };

  const handlePageChange = (_event, newPage) => {
    setPage(newPage);
    setIsCheckStatusChange(true)
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
    setIsCheckStatusChange(true)
  };

  const handleEditChannel = (channelData) => {
    setSelectedRowDetails(channelData);
    setIsChannelEditing(true)
  }

    const handleCancelBtnFunction = ()=>{
        setIsChannelEditing(false);
    }

    const handleListChannelUpdate = (id, channelData)=>{
        
        const updatedArray = allChannelDetails.map(obj => {
            if (obj._id === id) {
            //   return { ...obj, ...videoData };
                console.log('channelData', channelData)
                return { ...channelData }; 
            }
            return obj; // Keep other objects unchanged
        });
        
        setAllChannelDetails(updatedArray);
        let selectedChannel = updatedArray.slice(page * limit, page * limit + limit);
        setShowAllChannelDetails(selectedChannel);
    }
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
            isAdminUser?
                <SidebarLayout userData={userData}>
                    <Head>
                        <title>All Channels</title>
                    </Head>
                    {
                        isChannelEditing?
                            (userData && selectedRowDetails) ? 
                                <ChannelEdit 
                                    userData={userData}
                                    channelDetail={selectedRowDetails}
                                    cancelBtnFunction={handleCancelBtnFunction}
                                    channelUpdateFunction={handleListChannelUpdate}
                                /> 
                                : null
                        :
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
                                                        // value={filters.status == null ? 'all': (filters.status == 'approved' ? 'approved' : filters.status == 'declined' ? 'declined' : 'pending')}
                                                        value={filterStatusOption[filters.status] || all}
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
                                                    <TableCell>Approved Status</TableCell>
                                                    <TableCell >Blocked status</TableCell>
                                                    {/* <TableCell align="right">Status</TableCell> */}
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
                                                                {getStatusLabel(channel.isApproved)}
                                                            </Typography>
                                                            {/* <Typography variant="body2" color="text.secondary" noWrap>
                                                            {cryptoOrder.sourceDesc}
                                                            </Typography> */}
                                                        </TableCell>
                                                        <TableCell >
                                                            <Typography
                                                                variant="body1"
                                                                fontWeight="bold"
                                                                color="text.primary"
                                                                gutterBottom
                                                                noWrap
                                                            >
                                                                {getBlockedStatusLabel(`${channel.blocked}` == 'true'? 'true': 'false')}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Tooltip title="Edit Channel" arrow>
                                                                <IconButton
                                                                    sx={{
                                                                    '&:hover': {
                                                                        background: theme.colors.primary.lighter
                                                                    },
                                                                    color: theme.palette.primary.main
                                                                    }}
                                                                    color="inherit"
                                                                    size="small"
                                                                    onClick={()=>handleEditChannel(channel)}
                                                                >
                                                                    <EditTwoToneIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Delete Channel" arrow>
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
                                                count={filterCount}
                                                onPageChange={handlePageChange}
                                                onRowsPerPageChange={handleLimitChange}
                                                page={page}
                                                rowsPerPage={limit}
                                                rowsPerPageOptions={[5, 10, 25, 30]}
                                                />
                                            </Box>
                                            </Card>
                                    </Grid>
                                </Container >
                            </>
                    }
                    <Footer />
                </SidebarLayout>
            :
                (
                    <PermissionDeniedDialog/>
                )
        : 
            <LoginDialog/>
        }
    </>
  );
};

export default ChannelListPage;
