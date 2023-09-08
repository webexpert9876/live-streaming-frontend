import Head from 'next/head';
import SidebarLayout from 'src/layouts/SidebarLayout';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import PageHeader from './PageHeader';
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
    TextField
} from '@mui/material';

import Label from 'src/components/Label';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import Footer from 'src/components/Footer';
import { subDays } from 'date-fns';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthUser } from 'store/slices/authSlice';
import client from "../../../graphql";
import { gql } from "@apollo/client";
import axios from 'axios';

const getStatusLabel = (videoStatus) => {
    let map = {        
        public: {
            text: 'Public',
            color: 'warning'
        },
        draft: {
            text: 'Draft',
            color: 'error'
        },
        subscriber: {
            text: 'Subscriber',
            color: 'success'
        }
    };

    const { text, color } = map[videoStatus];

    return <Label color={color}>{text}</Label>;
};

// const applyFilters = (allVideos, filters) => {
//     console.log('applyFilters allVideos', allVideos)
//     console.log('applyFilters filters', filters)
//     return allVideos.filter((video) => {
//         let matches = true;

//         if (filters.status && video.videoPreviewStatus !== filters.status) {
//             matches = false;
//         }

//         return matches;
//     });
// };

// const applyPagination = (allVideos, page, limit) => {
//     console.log('applyPagination allvideos', allVideos)
//     console.log('applyPagination page', page)
//     console.log('applyPagination limit', limit)
//     return allVideos.slice(page * limit, page * limit + limit);
// };

const Video = () => {
  const [userData, setUserData] = useState([]);

//  For pagination and video status filter  
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [filters, setFilters] = useState({
    status: null
  });
  const [allVideoDetails, setAllVideoDetails]= useState([])
  const [showAllVideoDetails, setShowAllVideoDetails]= useState([])
  const [isCheckStatusChange, setIsCheckStatusChange]= useState(false)
  const [filteredVideoList, setFilteredVideoList]= useState([])


  const [userInfo, setUserInfo]= useState({});
  const authState = useSelector(selectAuthUser)
  const router = useRouter();

  const [openVideoEditDialog, setOpenVideoEditDialog] = useState(false);
  const [openDeleteDialog, setOpenVideoDeleteDialog] = useState(false);
  
  const handleClickOpen = (dialogType) => {
    switch(dialogType){
        case 'videoEdit':
            setOpenVideoEditDialog(true);
            break;
        case 'videoDelete':
            setOpenVideoDeleteDialog(true);
            break;
    }
  };

  const handleClose = (dialogType) => {
    switch(dialogType){
        case 'videoEdit':
            setOpenVideoEditDialog(false);
            break;
        case 'videoDelete':
            setOpenVideoDeleteDialog(false);
            break;
    }
  };

  useEffect(()=>{
    // if(userInfo.length == 0){
    //   setUserInfo(authState);
    // }
    let userId = JSON.parse(localStorage.getItem('authUser'));
    function getUserAllDetails(){
      client.query({
        variables: {
          usersId: userId._id,
          artistId: userId._id,
        },
        query: gql`
            query Query($usersId: ID, $artistId: String) {
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
                        socialLinks {
                            platform
                            url
                        }
                    }
                    interestedStyleDetail {
                        title
                        _id
                    }
                }
                videos(userId: $artistId) {
                    _id
                    videoServiceType
                    views
                    tattooCategoryId
                    title
                    url
                    updatedAt
                    userId
                    videoPreviewImage
                    videoPreviewStatus
                    channelId
                    createdAt
                    description
                    isPublished
                    isStreamed
                    isUploaded
                    streamId
                    tags
                    videoQualityUrl {
                    url
                    quality
                    }
                    channelDetails {
                    channelCoverImage
                    channelPicture
                    channelName
                    description
                    isApproved
                    subscribers
                    urlSlug
                    userId
                    }
                    tattooCategoryDetails {
                    description
                    title
                    profilePicture
                    _id
                    urlSlug
                    }
                }
            }
        `,
      }).then((result) => {
          console.log('video page result', result.data)
          setUserData(result.data.users);
          setAllVideoDetails(result.data.videos);
          setShowAllVideoDetails(result.data.videos);
          setFilteredVideoList(result.data.videos);
          setIsCheckStatusChange(true)
        });
    }
    getUserAllDetails();
  },[])

  useEffect(()=>{
    if(isCheckStatusChange){
        const filteredVideo = applyFilters(allVideoDetails, filters);
        
        setFilteredVideoList(filteredVideo)

        const paginatedVideo = applyPagination(
            filteredVideo,
            page,
            limit
        );
        setIsCheckStatusChange(false)
    }
  },[isCheckStatusChange])

    const statusOptions = [
        {
            id: 'all',
            name: 'All'
        },
        {
            id: 'public',
            name: 'Public'
        },
        {
            id: 'draft',
            name: 'Draft'
        },
        {
            id: 'subscriber',
            name: 'Subscriber'
        }
    ];


    const applyFilters = (allVideos, filters) => {
        return allVideos.filter((video) => {
            let matches = true;
    
            if (filters.status && video.videoPreviewStatus !== filters.status) {
                matches = false;
            }
    
            return matches;
        });
    };
    
    const applyPagination = (allVideos, page, limit) => {
        let selectedVideo = allVideos.slice(page * limit, page * limit + limit);
        setShowAllVideoDetails(selectedVideo);
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
    const video = [
        {
            id: '1',
            orderDetails: 'Video 1',
            orderDate: new Date().getTime(),
            status: 'public',
            orderID: 'VUVX709ET7BY',
            styleName: 'Style 1',            
            videoView: "10005",
        },
        {
            id: '2',
            orderDetails: 'Video 2',
            orderDate: subDays(new Date(), 1).getTime(),
            status: 'public',
            orderID: '23M3UOG65G8K',
            styleName: 'Style 2',
            videoView: "85585",
        },
        
    ];

    // console.log(video)

    return (
        <>
            {/* <SidebarLayout userData={[{role: '647f15e20d8b7330ed890da4'}]}> */}
            {userData.length > 0?
                <SidebarLayout userData={userData}>
                    <Head>
                        <title>All Videos</title>
                    </Head>
                    <PageTitleWrapper>
                        <PageHeader />
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
                            <Card style={{width: "97%"}}>
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
                                    title="Recent Videos"
                                />
                                <Divider />
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Video Title</TableCell>
                                                <TableCell>Video ID</TableCell>
                                                <TableCell>Style</TableCell>
                                                <TableCell align="right">Views</TableCell>
                                                <TableCell align="right">Status</TableCell>
                                                <TableCell align="right">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {showAllVideoDetails.map((video) => {
                                                return (
                                                    <TableRow hover key={video.id}>
                                                        <TableCell>
                                                            <Typography
                                                                variant="body1"
                                                                fontWeight="bold"
                                                                color="text.primary"
                                                                gutterBottom
                                                                noWrap
                                                            >
                                                                {video.title}
                                                            </Typography>
                                                            {/* <Typography variant="body2" color="text.secondary" noWrap>
                                                                {format(video.createdAt, 'MMMM dd yyyy')}
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
                                                                {video._id}
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
                                                                {video.tattooCategoryDetails[0].title}
                                                            </Typography>
                                                            {/* <Typography variant="body2" color="text.secondary" noWrap>
                                                                {video.sourceDesc}
                                                            </Typography> */}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Typography
                                                                variant="body1"
                                                                fontWeight="bold"
                                                                color="text.primary"
                                                                gutterBottom
                                                                noWrap
                                                            >
                                                                {video.views}
                                                            </Typography>
                                                
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            {getStatusLabel(video.videoPreviewStatus)}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Tooltip title="Edit Video Details" arrow>
                                                                <IconButton
                                                                    sx={{
                                                                        '&:hover': {
                                                                            background: theme.colors.primary.lighter
                                                                        },
                                                                        color: theme.palette.primary.main
                                                                    }}
                                                                    color="inherit"
                                                                    size="small"
                                                                    onClick={()=>{handleClickOpen('videoEdit')}}
                                                                >
                                                                    <EditTwoToneIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Delete Video" arrow>
                                                                <IconButton
                                                                    sx={{
                                                                        '&:hover': { background: theme.colors.error.lighter },
                                                                        color: theme.palette.error.main
                                                                    }}
                                                                    color="inherit"
                                                                    size="small"
                                                                    onClick={()=>{handleClickOpen('videoDelete')}}
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
                                        count={filteredVideoList.length}
                                        onPageChange={handlePageChange}
                                        onRowsPerPageChange={handleLimitChange}
                                        page={page}
                                        rowsPerPage={limit}
                                        rowsPerPageOptions={[5, 10, 25, 30]}
                                    />
                                </Box>
                            </Card>
                        </Grid>
                        
    {/* ---------------------------------------Video edit box---------------------------------- */}
                        <Dialog open={openVideoEditDialog} onClose={()=>handleClose('videoEdit')}>
                            <DialogTitle>Edit Video Details</DialogTitle>
                            <DialogContent>
                                {/* <DialogContentText>
                                    To subscribe to this website, please enter your email address here. We
                                    will send updates occasionally.
                                </DialogContentText> */}
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
                        </Dialog>

    {/* ---------------------------------------Video Delete box---------------------------------- */}
                        <Dialog open={openDeleteDialog} onClose={()=>handleClose('videoDelete')}>
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
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={()=>handleClose('videoDelete')}>Cancel</Button>
                                <Button >Delete</Button>
                            </DialogActions>
                        </Dialog>

                    </Container >
                    <Footer />
                </SidebarLayout>
            : null}

        </>
    );
};

// Video.propTypes = {
//     cryptoOrders: PropTypes.array.isRequired
// };

// Video.defaultProps = {
//     cryptoOrders: []
// };
// Video.getLayout = (page) => (
//     <SidebarLayout>{page}</SidebarLayout>
// );
export default Video;
