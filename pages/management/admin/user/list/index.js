import { useState, useEffect } from 'react';
import Head from 'next/head';
import SidebarLayout from 'src/layouts/SidebarLayout';
import Footer from 'src/components/Footer';
import PageHeader from '../../../../../src/components/user/list/PageHeader';
import UserProfile from '../../../../../src/components/admin/user/UserEdit';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import CircularProgress from '@mui/material/CircularProgress';
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
import axios from 'axios';
import LoginDialog from 'src/components/pageAccessDialog/loginDialog'
import PermissionDeniedDialog from 'src/components/pageAccessDialog/permissionDeniedDialog'


const UserListPage = () => {
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

  const [allUserDetails, setAllUserDetails]= useState([]);
  const [showAllUserDetails, setShowAllUserDetails]= useState([]);
  const [isCheckStatusChange, setIsCheckStatusChange]= useState(false);
  const [filterCount, setFilterCount]= useState(0);

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [isUserEditing, setIsUserEditing] = useState(false);
//   const [isAddingTattooCategory, setIsAddingTattooCategory] = useState(false);
  const [selectedRowDetails, setSelectedRowDetails] = useState({});
  const [isPageLoading, setIsPageLoading]= useState(true);

//   const [isDeletingCategory, setIsDeletingCategory] = useState(false);
//   const [deleteInputValue, setDeleteInputValue] = useState('');

  // -------------------------Error state------------------------
  const [apiResponseMessage, setApiResponseMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [apiMessageType, setApiMessageType] = useState('');

    const statusOptions = [
        { id: 'all', name: 'All' },
        { id: 'user', name: 'User' },
        { id: 'artist', name: 'Artist' },
        { id: 'admin', name: 'Admin' }
    ];

    const filterStatusOption = { null: 'all', user: 'user', artist: 'artist', admin: 'admin' };


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
            setIsPageLoading(false);
            const adminUserDetail = await client.query({
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
                  }
              `,
            })

            setUserData(adminUserDetail.data.users);

            if(adminUserDetail.data.users.length > 0){
                client.query({
                    query: gql`
                        query Query {
                            users {
                                _id
                                firstName
                                lastName
                                email
                                username
                                profilePicture
                                urlSlug
                                channelId
                                blocked
                                channelDetails {
                                    _id
                                    channelName
                                    description
                                    channelPicture
                                    createdAt
                                    isApproved
                                    urlSlug
                                }
                                roleDetails {
                                    role
                                    _id
                                }
                                interestedStyleDetail {
                                    _id
                                    title
                                    urlSlug
                                }
                            }
                        }
                    `,
                  }).then((result) => {
                      setAllUserDetails(result.data.users);
                      setShowAllUserDetails(result.data.users);
                      setFilterCount(result.data.users.length);
                      setIsCheckStatusChange(true)
                });
            }
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

        const filteredUsers = applyFilters(allUserDetails, filters);
        setFilterCount(filteredUsers.length)

        const paginatedChannel = applyPagination(
            filteredUsers,
            page,
            limit
        );
        setIsCheckStatusChange(false)
    }
  },[isCheckStatusChange])

  const getStatusLabel = (channelStatus) => {
    const map = {
        user: {
            text: 'User',
            color: 'warning'
        },
        artist: {
            text: 'Artist',
            color: 'error'
        },
        admin: {
            text: 'Admin',
            color: 'success'
        }
    };
    let channelCheck = channelStatus == 'admin'? 'admin': ( channelStatus == 'artist'? 'artist': 'user');

    const { text, color } = map[channelCheck];

    return <Label color={color}>{text}</Label>;
  };

  const getBlockedStatusLabel = (userStatus) => {
    const map = {
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

    const { text, color } = map[userStatus];

    return <Label color={color}>{text}</Label>;
};

const applyFilters = (allUsers, filters) => {
  return allUsers.filter((user) => {
    let matches = true;

    if (filters.status && user.roleDetails[0].role !== filters.status) {
        matches = false;
    }

    return matches;
  });
};

const applyPagination = (allUsers, page, limit) => {
    let selectedUsers =   allUsers.slice(page * limit, page * limit + limit);
    setShowAllUserDetails(selectedUsers);
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

  const handleEditUser = (userData) => {
    setSelectedRowDetails(userData);
    setIsUserEditing(true)
  }

    const handleCancelBtnFunction = ()=>{
        setIsUserEditing(false);
    }

    const handleListUserUpdate = (id, userData)=>{
        
        const updatedArray = allUserDetails.map(obj => {
            if (obj._id === id) {
            //   return { ...obj, ...videoData };
                console.log('userData', userData);
                return { ...userData };
            }
            return obj; // Keep other objects unchanged
        });
        
        setAllUserDetails(updatedArray);
        let selectedChannel = updatedArray.slice(page * limit, page * limit + limit);
        setShowAllUserDetails(selectedChannel);
    }

  const theme = useTheme();

  return (
    <>
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
                        <SidebarLayout userData={userData}>
                            <Head>
                                <title>All Users</title>
                            </Head>
                            {
                                isUserEditing?
                                    (userData.length > 0 && selectedRowDetails) ? 
                                        <UserProfile 
                                            userDetail={userData}
                                            selectedUserInfo={selectedRowDetails}
                                            cancelBtnFunction={handleCancelBtnFunction}
                                            channelUpdateFunction={handleListUserUpdate}
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
                                                            <InputLabel>User Role</InputLabel>
                                                            <Select
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
                                                        title="Users"
                                                    />
                                                    <Divider />
                                                    <TableContainer>
                                                        <Table>
                                                        <TableHead>
                                                            <TableRow>
                                                            <TableCell>Full Name</TableCell>
                                                            <TableCell>Username</TableCell>
                                                            <TableCell>Email</TableCell>
                                                            <TableCell>Role</TableCell>
                                                            <TableCell >Blocked status</TableCell>
                                                            <TableCell align="center">Actions</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {showAllUserDetails.map((user) => {
                                                                return (
                                                                    <TableRow hover key={user._id}>
                                                                        <TableCell>
                                                                            <Typography
                                                                            variant="body1"
                                                                            fontWeight="bold"
                                                                            color="text.primary"
                                                                            gutterBottom
                                                                            noWrap
                                                                            >
                                                                            {user.firstName} {user.lastName}
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
                                                                            {user.username}
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
                                                                                {user.email}
                                                                            </Typography>
                                                                        </TableCell>
                                                                        <TableCell >
                                                                            <Typography
                                                                                variant="body1"
                                                                                fontWeight="bold"
                                                                                color="text.primary"
                                                                                gutterBottom
                                                                                noWrap
                                                                            >
                                                                                {user.roleDetails[0].role}
                                                                            </Typography>
                                                                        </TableCell>
                                                                        <TableCell >
                                                                            <Typography
                                                                                variant="body1"
                                                                                fontWeight="bold"
                                                                                color="text.primary"
                                                                                gutterBottom
                                                                                noWrap
                                                                            >
                                                                                {getBlockedStatusLabel(`${user.blocked}` == 'true'? 'true': 'false')}
                                                                            </Typography>
                                                                        </TableCell>
                                                                        <TableCell align="center">
                                                                            <Tooltip title="Edit User" arrow>
                                                                                <IconButton
                                                                                    sx={{
                                                                                    '&:hover': {
                                                                                        background: theme.colors.primary.lighter
                                                                                    },
                                                                                    color: theme.palette.primary.main
                                                                                    }}
                                                                                    color="inherit"
                                                                                    size="small"
                                                                                    onClick={()=>handleEditUser(user)}
                                                                                >
                                                                                    <EditTwoToneIcon fontSize="small" />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                            {/* <Tooltip title="Delete User" arrow>
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
                                                                            </Tooltip> */}
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
            )
        : 
            <LoginDialog/>
        }
    </>
  );
};

export default UserListPage;
