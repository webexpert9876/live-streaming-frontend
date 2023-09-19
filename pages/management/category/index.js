import Head from 'next/head';
import SidebarLayout from 'src/layouts/SidebarLayout';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import PageHeader from '../../../src/components/category/PageHeader';
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
    Alert
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
import VideoEditCard from "../../../src/components/VideoEdit/VideoEditCard";
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';


const Video = () => {
  const [userData, setUserData] = useState([]);

//  For pagination and video status filter  
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [filters, setFilters] = useState({
    status: null
  });
  const [privacyFilters, setPrivacyFilters] = useState({
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

  const [isVideoEditing, setIsVideoEditing] = useState(true);
  const [selectedRowVideoDetails, setSelectedRowVideoDetails] = useState({});
  
  const [tattooCategoryList, setTattooCategoryList] = useState([]);
  const [tagList, setTagList] = useState([]);

  const [isVideoPrivacyChange, setIsVideoPrivacyChange] = useState(false);

  const [isDeletingVideo, setIsDeletingVideo] = useState(false);
  const [deleteInputValue, setDeleteInputValue] = useState('');

  // -------------------------Error state------------------------
  const [apiResponseMessage, setApiResponseMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [apiMessageType, setApiMessageType] = useState('');
  
  const handleClickOpen = (dialogType, video) => {
    switch(dialogType){
        case 'tattooCategoryEdit':
            // setOpenVideoEditDialog(true);
            // router.push({pathname: '/components/videos/edit'})
            // console.log('selected row video', video)
            setSelectedRowVideoDetails(video)
            setIsVideoEditing(false)
            break;
        case 'tattooCategoryDelete':
            setSelectedRowVideoDetails(video)
            setOpenVideoDeleteDialog(true);
            break;
    }
  };

  const handleClose = (dialogType) => {
    switch(dialogType){
        case 'tattooCategoryEdit':
            setOpenVideoEditDialog(false);
            break;
        case 'tattooCategoryDelete':
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
          usersId: userId._id
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
                tattooCategories {
                    _id
                    urlSlug
                    title
                    description
                    createdAt
                    profilePicture
                    tags
                }
            }
        `,
      }).then((result) => {
        //   console.log('video page result', result.data)
          setUserData(result.data.users);
        //   setAllVideoDetails(result.data.videos);
        //   setShowAllVideoDetails(result.data.videos);
        //   setFilteredVideoList(result.data.videos);
          setTattooCategoryList(result.data.tattooCategories);
        //   setTagList(result.data.tagForStream)
        //   setIsCheckStatusChange(true)
        //   setIsVideoPrivacyChange(true)
        });
    }
    getUserAllDetails();
  },[])

  useEffect(()=>{
    if(isCheckStatusChange){
        // if(filters.status == 'all' || filters.status == null && privacyFilters.status == 'all' || privacyFilters.status == null ){

            const filteredVideo = applyFilters(allVideoDetails, filters, privacyFilters);
            
            setFilteredVideoList(filteredVideo)
    
            const paginatedVideo = applyPagination(
                filteredVideo,
                page,
                limit
            );
        // } else {
        //     const filteredVideo = applyFilters(showAllVideoDetails, filters, privacyFilters);
            
        //     setFilteredVideoList(filteredVideo)
    
        //     const paginatedVideo = applyPagination(
        //         filteredVideo,
        //         page,
        //         limit
        //     );
        // }
        setIsCheckStatusChange(false)
    }
  },[isCheckStatusChange])
  
  useEffect(()=>{
    if(isVideoPrivacyChange){

        // if(filters.status == 'all' || filters.status == null && privacyFilters.status == 'all' || privacyFilters.status == null ){

            const filteredVideo = applyPrivacyFilters(allVideoDetails, privacyFilters, filters);
            
            setFilteredVideoList(filteredVideo)
    
            const paginatedVideo = applyPagination(
                filteredVideo,
                page,
                limit
            );
        // } else {

        //     const filteredVideo = applyPrivacyFilters(showAllVideoDetails, privacyFilters, filters);
            
        //     setFilteredVideoList(filteredVideo)
    
        //     const paginatedVideo = applyPagination(
        //         filteredVideo,
        //         page,
        //         limit
        //     );
        // }
        setIsVideoPrivacyChange(false)
    }
  },[isVideoPrivacyChange])
  
  useEffect(()=>{
    if(isDeletingVideo){

        // console.log('selectedRowVideoDetails', selectedRowVideoDetails);

        axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/artist-admin/delete/video/${selectedRowVideoDetails._id}`, {headers: {'x-access-token': userData[0].jwtToken, 'Content-Type': 'multipart/form-data'}}).then((data)=>{
            // console.log('delete data ', data)
            setApiMessageType('success')
            setApiResponseMessage('Video deleted successfully');
            removeVideoFromList(selectedRowVideoDetails._id)
            setIsDeletingVideo(false);
            setLoading(false);
            handleMessageBoxOpen()
        }).catch((error)=>{
            console.log('error', error);
            setApiMessageType('error')
            const errorMessage = error.response.data.message;
            
            handleMessageBoxOpen()
            setApiResponseMessage(errorMessage);
            setIsDeletingVideo(false)
            setLoading(false);
        });

    }
  },[isDeletingVideo])

    const handleMessageBoxClose = () => {
        setOpen(false);
        setApiResponseMessage('');
        setApiMessageType('')
    };
    const handleMessageBoxOpen = () => {
        setOpen(true);
    };

    const removeVideoFromList = (id)=>{
        
        const updatedArray  = allVideoDetails.filter(obj => obj._id !== id);
        
        setAllVideoDetails(updatedArray)
        let selectedVideo = updatedArray.slice(page * limit, page * limit + limit);

        setShowAllVideoDetails(selectedVideo);
    }

    const statusOptions = [
        {
            id: 'all',
            name: 'All'
        },
        {
            id: true,
            name: 'Publish'
        },
        {
            id: false,
            name: 'Draft'
        },
    ];

    const videoPrivacyOption = [
        {
            id: 'all',
            name: 'All'
        },
        {
            id: 'public',
            name: 'Public'
        },
        {
            id: 'private',
            name: 'Private'
        },
        {
            id: 'subscriber',
            name: 'Subscriber'
        }
    ];


    const applyFilters = (allVideos, filters, privacyFilterParam) => {
        return allVideos.filter((video) => {
            let matches = true;
            
            if(privacyFilterParam.status != null ){
                matches = false

                if(filters.status == false){
    
                    if ( video.isPublished == filters.status && privacyFilterParam.status == video.videoPreviewStatus) {
                        matches = true;
                    }
                } else if(filters.status == true) {
                    
                    if (filters.status && video.isPublished == filters.status && privacyFilterParam.status == video.videoPreviewStatus) {
                        matches = true;
                    }
                } else if(filters.status == null) {
                    
                    if (privacyFilterParam.status == video.videoPreviewStatus) {
                        matches = true;
                    }
                }

            } else {
                if(filters.status == false){
    
                    if ( video.isPublished !== filters.status) {
                        matches = false;
                    }
                } else if(filters.status == true) {
                    
                    if (filters.status && video.isPublished !== filters.status) {
                        matches = false;
                    }
                } else if(filters.status == null) {
                    
                    if (filters.status && video.isPublished !== filters.status) {
                        matches = false;
                    }
                }
            }
    
            return matches;
        });
    };
    
    const applyPagination = (allVideos, page, limit) => {
        let selectedVideo = allVideos.slice(page * limit, page * limit + limit);
        setShowAllVideoDetails(selectedVideo);
    };


    const applyPrivacyFilters = (allVideos, filters, publistStatusParam) => {
        return allVideos.filter((video) => {
            let matches = true;

            if(publistStatusParam.status !== null){
                matches = false

                    if(filters.status == null){
                        if (video.videoPreviewStatus !== filters.status && video.isPublished == publistStatusParam.status) {
                            matches = true;
                        }
                    } else if ( video.isPublished == publistStatusParam.status && filters.status == video.videoPreviewStatus) {
                        matches = true;
                    }
            } else {
                if (filters.status && video.videoPreviewStatus !== filters.status && video.isPublished !== publistStatusParam.status) {
                    matches = false;
                }
            }
    
            return matches;
        });
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
    
    const handlePrivacyChange = (e) => {
        let value = null;

        if (e.target.value !== 'all') {
            value = e.target.value;
        }
        setPrivacyFilters((prevFilters) => ({
            ...prevFilters,
            status: value
        }));
        setIsVideoPrivacyChange(true)
    };

    const handlePageChange = (_event, newPage) => {
        setPage(newPage);
        setIsCheckStatusChange(true)
    };

    const handleLimitChange = (event) => {
        setLimit(parseInt(event.target.value));
        setIsCheckStatusChange(true)
    };

    const handleCancelBtnFunction = ()=>{
        setIsVideoEditing(true);
    }

    const handleListVideoUpdate = (id, videoData)=>{
          
        const updatedArray = allVideoDetails.map(obj => {
            if (obj._id === id) {
            //   return { ...obj, ...videoData }; 
                return { ...videoData }; 
            }
            return obj; // Keep other objects unchanged
        });
        
        setAllVideoDetails(updatedArray)
        let selectedVideo = updatedArray.slice(page * limit, page * limit + limit);
        setShowAllVideoDetails(selectedVideo);
    }

    const theme = useTheme();

    // console.log(video)

    const handleDeleteVideo= ()=>{
        if(deleteInputValue.toLowerCase() == 'delete'){
            setIsDeletingVideo(true)
            handleClose('tattooCategoryDelete')
        }
    }

    return (
        <>
            {/* <SidebarLayout userData={[{role: '647f15e20d8b7330ed890da4'}]}> */}
            {userData.length > 0?
                <SidebarLayout userData={userData}>
                    <Head>
                        <title>All Videos</title>
                    </Head>
                    {
                        isVideoEditing?
                            <>
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
                                                // action={
                                                //     <Box width={300} sx={{display: 'flex'}}>
                                                //         <FormControl fullWidth variant="outlined" sx={{mr:1}}>
                                                //             <InputLabel>Status</InputLabel>
                                                //             <Select
                                                //                 value={filters.status == null ? 'all': filters.status ? true: false}
                                                //                 onChange={handleStatusChange}
                                                //                 label="Status"
                                                //                 autoWidth
                                                //             >
                                                //                 {statusOptions.map((statusOption) => (
                                                //                     <MenuItem key={statusOption.id} value={statusOption.id}>
                                                //                         {statusOption.name}
                                                //                     </MenuItem>
                                                //                 ))}
                                                //             </Select>
                                                //         </FormControl>
                                                //         <FormControl fullWidth variant="outlined">
                                                //             <InputLabel>Video Privacy</InputLabel>
                                                //             <Select
                                                //                 value={privacyFilters.status || 'all'}
                                                //                 onChange={handlePrivacyChange}
                                                //                 label=" Video privacy"
                                                //                 autoWidth
                                                //             >
                                                //                 {videoPrivacyOption.map((statusOption) => (
                                                //                     <MenuItem key={statusOption.id} value={statusOption.id}>
                                                //                         {statusOption.name}
                                                //                     </MenuItem>
                                                //                 ))}
                                                //             </Select>
                                                //         </FormControl>
                                                //     </Box>
                                                // }
                                                title="Videos"
                                            />
                                            <Divider />
                                            <TableContainer>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Title</TableCell>
                                                            <TableCell>Description</TableCell>
                                                            <TableCell>Picture</TableCell>
                                                            <TableCell align='center'>Tags</TableCell>
                                                            <TableCell align="right">Actions</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {tattooCategoryList.map((category) => {
                                                            return (
                                                                <TableRow hover key={category._id}>
                                                                    <TableCell>
                                                                        <Typography
                                                                            variant="body1"
                                                                            fontWeight="bold"
                                                                            color="text.primary"
                                                                            gutterBottom
                                                                        >
                                                                            {category.title}
                                                                        </Typography>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Typography
                                                                            variant="body1"
                                                                            fontWeight="bold"
                                                                            color="text.primary"
                                                                            gutterBottom
                                                                        >
                                                                            {category.description.slice(0, 80)}...
                                                                        </Typography>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <img width={50} height={50} src={`${process.env.NEXT_PUBLIC_S3_URL}/${category.profilePicture}`}></img>
                                                                    </TableCell>
                                                                    <TableCell align='center'>
                                                                        <Typography
                                                                            variant="body1"
                                                                            fontWeight="bold"
                                                                            color="text.primary"
                                                                            gutterBottom
                                                                            noWrap
                                                                        >
                                                                            {category.tags.slice(0,2).map((tag, index)=>{
                                                                                return(<Button key={index} variant="contained" sx={{ fontWeight: 400, fontSize: '12px', borderRadius: '50px', padding: '5px', margin: '0px 2px' }}>
                                                                                {/* <Link href={`/tags/`} sx={{ color: '#fff' }}>{tag}</Link> */}{tag}
                                                                            </Button>)
                                                                            })}
                                                                        </Typography>
                                                            
                                                                    </TableCell>
                                                                    <TableCell align="right">
                                                                        <Tooltip title="Edit Tattoo Category" arrow>
                                                                            <IconButton
                                                                                sx={{
                                                                                    '&:hover': {
                                                                                        background: theme.colors.primary.lighter
                                                                                    },
                                                                                    color: theme.palette.primary.main
                                                                                }}
                                                                                color="inherit"
                                                                                size="small"
                                                                                onClick={()=>{handleClickOpen('tattooCategoryEdit', category)}}
                                                                            >
                                                                                <EditTwoToneIcon fontSize="small" />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                        <Tooltip title="Delete Tattoo Category" arrow>
                                                                            <IconButton
                                                                                sx={{
                                                                                    '&:hover': { background: theme.colors.error.lighter },
                                                                                    color: theme.palette.error.main
                                                                                }}
                                                                                color="inherit"
                                                                                size="small"
                                                                                onClick={()=>{handleClickOpen('tattooCategoryDelete', category)}}
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
                                                    count={allVideoDetails.length}
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
                                    <Dialog open={openDeleteDialog} onClose={()=>handleClose('tattooCategoryDelete')}>
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
                                            <Button onClick={()=>handleClose('tattooCategoryDelete')}>Cancel</Button>
                                            <Button onClick={handleDeleteVideo}>Delete</Button>
                                        </DialogActions>
                                    </Dialog>

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
                        :
                            (userData && selectedRowVideoDetails && tattooCategoryList && tagList) ? 
                                <VideoEditCard 
                                    userData={userData} 
                                    videoDetail={selectedRowVideoDetails} 
                                    tattooCategoryList={tattooCategoryList} 
                                    tagData={tagList}
                                    cancelBtnFunction={handleCancelBtnFunction}
                                    videoUpdateFunction={handleListVideoUpdate}
                                /> 
                                : null
                    }

                {/* --------------------------------------------------------Error or success message------------------------------------------ */}
                    <Stack spacing={2} sx={{ width: '100%' }}>
                        <Snackbar anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }} open={open} autoHideDuration={6000} onClose={handleMessageBoxClose} >
                        <Alert onClose={handleMessageBoxClose} variant="filled" severity={`${apiMessageType=='success'? 'success': 'error'}`} sx={{ width: '100%' }}>
                            {apiResponseMessage}
                        </Alert>
                        </Snackbar>
                    </Stack>


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
