import Head from 'next/head';
import SidebarLayout from 'src/layouts/SidebarLayout';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
// import PageHeader from './PageHeader';
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
import client from "../../../../graphql";
import { gql } from "@apollo/client";
import axios from 'axios';
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import { WithContext as ReactTags } from 'react-tag-input';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Text from '../../../../src/components/Text'

const KeyCodes = {
    comma: 188,
    enter: 13
};
const delimiters = [KeyCodes.comma, KeyCodes.enter];

const Video = () => {
  const [userData, setUserData] = useState([]);


  const [isCheckStatusChange, setIsCheckStatusChange]= useState(false)


  const [userInfo, setUserInfo]= useState({});
  const authState = useSelector(selectAuthUser)
  const router = useRouter();
  
  const [tattooCategoryList, setTattooCategoryList] = useState([]);
//   const [tagList, setTagList] = useState([]);

  var editor = "";
    const [picture, setPicture] = useState({
        cropperOpen: false,
        img: null,
        zoom: 1,
        croppedImg:
        "https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png"
    });

    const [hideAvatarImage, setHideAvatarImage] = useState(false);
    const [selectedPreviewPic, setSelectedPreviewPic] = useState([]);
    const [previewPicOriginalFile, setPreviewPicOriginalFile] = useState([]);
    const [userUploadedImage, setUserUploadedImage] = useState('');
    
    const [isAddingVideo, setIsAddingVideo] = useState(false);

    const [videoInput, setVideoInput] = useState({
        title: '',
        description: '',
        tattooCategoryId: tattooCategoryList.length>0? tattooCategoryList[0]._id : '',
        isPublished: false,
        videoPreviewStatus: 'public'
    })

    const [tags, setTags] = useState([]);
    const [suggestions, setSuggestions] = useState([]);

    const [selectedVideo, setSelectedVideo] = useState({})

  // -------------------------Error state------------------------
  const [loading, setLoading] = useState(false);
  const [apiResponseMessage, setApiResponseMessage] = useState('');

  const [open, setOpen] = useState(false);
  const [apiMessageType, setApiMessageType] = useState('');

//   ------------------------file error message-----------------------------
  const [openVideoError, setOpenVideoError] = useState(false);
  const [videoErrorMessage, setVideoErrorMessage] = useState('Please enter video file.');
  const [openImageError, setOpenImageError] = useState(false);
  const [imageErrorMessage, setImageErrorMessage] = useState('Please enter image file.');

  const [openTitleError, setOpenTitleError] = useState(false)
  const [titleErrorMessage, setTitleErrorMessage] = useState('Video title is required')
  const [openDescriptionError, setOpenDescriptionError] = useState(false)
  const [descriptionErrorMessage, setDescriptionErrorMessage] = useState('Video description is required')

  useEffect(()=>{

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
                tattooCategories {
                    _id
                    urlSlug
                    title
                }
                tagForStream {
                    text
                    id
                }
            }
        `,
      }).then((result) => {
          console.log('video page result', result.data);
          setUserData(result.data.users);
          setTattooCategoryList(result.data.tattooCategories);
        //   setTagList(result.data.tagForStream);
          setSuggestions(result.data.tagForStream);
        });
    }
    getUserAllDetails();
  },[])

    useEffect(()=>{
        if(isAddingVideo){
            console.log('videoInput===========', videoInput)

            const formData = new FormData();
            formData.append('title', videoInput.title);
            formData.append('description', videoInput.description);
            formData.append('tattooCategoryId', videoInput.tattooCategoryId);
            formData.append('userId', userData[0]._id);
            formData.append('channelId', userData[0].channelId);
            formData.append('isUploaded', true);
            formData.append('isStreamed', false);
            formData.append('isPublished', videoInput.isPublished);
            formData.append('videoPreviewStatus', videoInput.videoPreviewStatus);
            console.log('video selectedPreviewPic ', selectedPreviewPic)
            
            // if(Object.keys(selectedPreviewPic).length > 0 ){
                console.log('if video selectedPreviewPic ', selectedPreviewPic)
                formData.append('files', selectedPreviewPic);
                // }
                
                // if(selectedVideo.length > 0){
                    console.log('selectedVideo', selectedVideo)
                    formData.append('files', selectedVideo);
            // }

            tags.forEach((tag) => {
                formData.append('tags', tag.text);
            });
            
            axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/artist/create/video`, formData, {headers: {'x-access-token': userData[0].jwtToken, 'Content-Type': 'multipart/form-data'}}).then((data)=>{
                console.log('data.data updated data', data.data);

                setApiMessageType('success')
                setApiResponseMessage('Video added successfully');
                setIsAddingVideo(false)
                setLoading(false);
                handleMessageBoxOpen()
            }).catch((error)=>{
                console.log('error', error);
                setApiMessageType('error')
                const errorMessage = error.response.data.message;
                
                handleMessageBoxOpen()
                setApiResponseMessage(errorMessage);
                setIsAddingVideo(false)
                setLoading(false);
            });
            
        }
    },[isAddingVideo])
    
    const handleCancelBtnFunction = ()=>{

    }

    const theme = useTheme();

    const handleDelete = i => {
        console.log('delete', i)
        console.log('delete', tags)
        setTags(tags.filter((tag, index) => index !== i));
    };

    const handleAddition = tag => {
    console.log('add', tag)
    setTags([...tags, tag]);
    };

    const handleDrag = (tag, currPos, newPos) => {
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    setTags(newTags);
    };

    const handleTagClick = index => {
    console.log('tag click', index)
    console.log('The tag at index ' + index + ' was clicked');
    };

    const handleFormChange = (e)=>{

        if(e.target.name == 'title'){
            console.log('e.target.value', e.target.value)
            setVideoInput((prevState)=>({
                ...prevState,
                [e.target.name]: e.target.value
            }))

            if(e.target.value){
                setOpenTitleError(false)
            } else {
                
                setOpenTitleError(true)
                // setTitleErrorMessage('Video title is required');
            }
        } else if(e.target.name == 'description'){
            setVideoInput((prevState)=>({
                ...prevState,
                [e.target.name]: e.target.value
            }))

            if(e.target.value){
                setOpenDescriptionError(false)
            } else {
                setOpenDescriptionError(true)
                // setDescriptionErrorMessage('Video description is required');
            }
        }
        // setVideoInput((prevState)=>({
        //     ...prevState,
        //     [e.target.name]: e.target.value
        // }))
    }

    const handleFormSubmit = (e)=>{
        e.preventDefault();
        // setIsAddingVideo(true)
            // setLoading(true);
        // if(videoInput.title && videoInput.description && videoInput.tattooCategoryId && videoInput.isPublished && videoInput.videoPreviewStatus ){
        if(!videoInput.title){
            setOpenTitleError(true)    
            console.log('all detail filled')

        } 
        if(!videoInput.description){
            setOpenDescriptionError(true)
        }
        if(selectedPreviewPic){
            setOpenImageError(true)
        }
         if(selectedVideo){
            setOpenVideoError(true)
        }
        //  else {
        //     console.log('all detail not filled')
        //     // setApiMessageType('error')
        //     // setApiResponseMessage('Please enter all the details.');
        //     // setOpen(true);
        // }
    }

    const handleSlider = (event, value) => {
        setPicture({
          ...picture,
          zoom: value
        });
    };

    const handleCancel = () => {
        setOpenImageError(true);
        setImageErrorMessage('Please enter image file.');
        setPicture({
            ...picture,
            cropperOpen: false
        });
        setHideAvatarImage(false)
    };

    const setEditorRef = (ed) => {
        editor = ed;
    };

    const handleSave = async (e) => {
        if (setEditorRef) {
            const canvasScaled = editor.getImageScaledToCanvas();
            const croppedImg = canvasScaled.toDataURL();
            
            setPicture({
                ...picture,
                img: null,
                cropperOpen: false,
                croppedImg: croppedImg
            });
            setHideAvatarImage(false);
            setUserUploadedImage(croppedImg);

            const croppedImageBlob = await fetch(croppedImg).then(res => res.blob());

            let imageUniqueName = `${uuidv4()}.png`
            
            let newFile = new File([croppedImageBlob], imageUniqueName, { type: 'image/png' });

            setSelectedPreviewPic(newFile);
        }
    };

    const handleFileChange = (e) => {

        if(e.target.files[0] == undefined ){
            setOpenImageError(true);
            // setImageErrorMessage('Please enter image file.');
        } else if ( !e.target.files[0] || e.target.files[0].type.indexOf("image") !== -1) {
            setHideAvatarImage(true);
            let url = URL.createObjectURL(e.target.files[0]);
            setPreviewPicOriginalFile(e.target.files[0]);
            // setUserUploadedImage(url);
            setPicture({
                ...picture,
                img: url,
                cropperOpen: true
            });
            setOpenImageError(false);
        } else {
            setOpenImageError(true);
            // setImageErrorMessage('Unexpected file type. Please enter only image file.');
        }
    };
    
    const handleVideoFileChange = (e) => {
        
        console.log('e.target.files[0]', e.target.files[0])
        if(e.target.files[0] == undefined ){
            setOpenVideoError(true)
            // setVideoErrorMessage('Please enter video file.');
        } else if (!e.target.files[0] || e.target.files[0].type.indexOf("video") !== -1) {
            setSelectedVideo(e.target.files[0])
            setOpenVideoError(false)
        } else {
            console.log('cancel image ')
            setOpenVideoError(true)
            // setVideoErrorMessage('Unexpected file type. Please enter only video file.');
        }
      
        // prepareFileUpload(files[0]);
        
        // setSelectedVideo(e.target.files[0])
        
    };

    // const checkIsVideo = (file)=> {
    //     if (file.type.indexOf("video") !== -1) {
    //         setSelectedVideo(e.target.files[0])
    //         return "video";
    //     }

    //     setApiMessageType('error')
    //     setApiResponseMessage('Unexpected file type. Please enter only video file.');
    //     setOpen(true);
    // };

    const handleMessageBoxClose = () => {
        setOpen(false);
        setApiResponseMessage('');
        setApiMessageType('')
    };
    const handleMessageBoxOpen = () => {
        setOpen(true);
    };

    // console.log(video)

    return (
        <>
            {userData.length > 0?
                <SidebarLayout userData={userData}>
                    <Head>
                        <title>Add Video</title>
                    </Head>
                    
                    <Container maxWidth="lg" >
                        <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="stretch"
                            spacing={3}
                            mt={3}
                        >
                            {/* <Grid item xs={12}></Grid> */}
                            <Card style={{width: "97%"}}>
                                <Box sx={{display: 'flex'}}>
                                    <Tooltip arrow placement="top" title="Go back" disabled={loading} onClick={()=>{router.push('/components/videos')}}>
                                        <IconButton color="primary" sx={{ p: 2 }}>
                                            <ArrowBackTwoToneIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <CardHeader
                                        // action={
                                        //     <Box width={150}>
                                        //         <FormControl fullWidth variant="outlined">
                                        //             <InputLabel>Status</InputLabel>
                                        //             <Select
                                        //                 value={filters.status || 'all'}
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
                                        //     </Box>
                                        // }
                                        title="Add Video"
                                    />
                                </Box>
                                <Divider />
                                <Box>
                                    <CardContent sx={{ p: 4 }}>
                                        <Typography variant="subtitle2">
                                            <Grid container spacing={0}>
                                                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                                                    <Box mt={1} pr={3} pb={2}>
                                                        Title:
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} sm={8} md={9}>
                                                    <Text color="black">
                                                        <TextField
                                                            autoFocus
                                                            margin="dense"
                                                            id="title"
                                                            type="text"
                                                            fullWidth
                                                            variant="standard"
                                                            name='title'
                                                            value={videoInput.title}
                                                            onChange={handleFormChange}
                                                            required
                                                            error={openTitleError}
                                                            helperText={openTitleError?titleErrorMessage:null}
                                                        />
                                                    </Text>
                                                    {/* {openTitleError?<Box sx={{color: 'red', fontWeight: 600}}>
                                                            {titleErrorMessage}
                                                    </Box>: null} */}
                                                </Grid>
                                                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                                                    <Box mt={1} pr={3} pb={2}>
                                                        Description:
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} sm={8} md={9}>
                                                    <Typography width={250} color="black">
                                                        <TextField
                                                            autoFocus
                                                            margin="dense"
                                                            id="description"
                                                            multiline
                                                            type="text"
                                                            fullWidth
                                                            variant="standard"
                                                            name='description'
                                                            value={videoInput.description}
                                                            onChange={handleFormChange}
                                                            required
                                                            error={openDescriptionError}
                                                            helperText={openDescriptionError?descriptionErrorMessage:null}
                                                        />
                                                    </Typography>
                                                    {/* {openDescriptionError?<Box sx={{color: 'red', fontWeight: 600}}>
                                                        {descriptionErrorMessage}
                                                    </Box>: null} */}
                                                </Grid>
                                                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                                                    <Box mt={2} pr={3} pb={2}>
                                                        Tags:
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} sm={8} md={9}>
                                                    <Text color="black">
                                                        <Box mt={2}>
                                                            <ReactTags
                                                                tags={tags}
                                                                renderSuggestion = {({ text }) => <div style={{}}>{text}</div>}
                                                                suggestions={suggestions}
                                                                delimiters={delimiters}
                                                                handleDelete={handleDelete}
                                                                handleAddition={handleAddition}
                                                                handleDrag={handleDrag}
                                                                handleTagClick={handleTagClick}
                                                                inputFieldPosition="top"
                                                                autocomplete
                                                            />
                                                        </Box>
                                                    </Text>
                                                </Grid>
                                                {tattooCategoryList.length>0?
                                                    <>
                                                        <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                                                            <Box mt={1} pr={3} pb={2}>
                                                                Tattoo Category:
                                                            </Box>
                                                        </Grid>
                                                        <Grid item xs={12} sm={8} md={9}>
                                                            <Typography width={250} mt={1.5} color="black">
                                                                <FormControl fullWidth>
                                                                    <NativeSelect
                                                                        defaultValue={tattooCategoryList[0]._id}
                                                                        onChange={handleFormChange}
                                                                        inputProps={{
                                                                            name: 'tattooCategoryId',
                                                                            id: 'uncontrolled-native',
                                                                        }}
                                                                    >
                                                                        {tattooCategoryList.map((category)=>(
                                                                            <option key={category._id} value={category._id}>{category.title}</option>
                                                                        ))}
                                                                    </NativeSelect>
                                                                </FormControl>
                                                            </Typography>
                                                        </Grid>
                                                    </>
                                                : null}
                                                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                                                    <Box mt={2} pr={3} pb={2}>
                                                        Video status:
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} sm={8} md={9}>
                                                    <Typography width={250} mt={1.5} color="black">
                                                        <FormControl fullWidth>
                                                            <NativeSelect
                                                                defaultValue={false}
                                                                onChange={handleFormChange}
                                                                inputProps={{
                                                                    name: 'isPublished',
                                                                    id: 'uncontrolled-native',
                                                                }}
                                                            >
                                                                <option key={1} value={true}>Publish</option>
                                                                <option key={2} value={false}>Draft</option>
                                                            </NativeSelect>
                                                        </FormControl>
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                                                    <Box mt={2} pr={3} pb={2}>
                                                        Video Privacy:
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} sm={8} md={9}>
                                                    <Typography width={250} mt={1.5} color="black">
                                                        <FormControl fullWidth>
                                                            <NativeSelect
                                                                defaultValue={'public'}
                                                                onChange={handleFormChange}
                                                                inputProps={{
                                                                    name: 'videoPreviewStatus',
                                                                    id: 'uncontrolled-native',
                                                                }}
                                                            >
                                                                <option key={1} value={'public'}>Public</option>
                                                                <option key={2} value={'private'}>Private</option>
                                                                <option key={3} value={'subscriber'}>Subscriber</option>
                                                            </NativeSelect>
                                                        </FormControl>
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                                                    <Box pr={3} pb={2}>
                                                        Upload Video:
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} sm={8} md={9} sx={{paddingBottom: '20px'}}>
                                                    <Box >
                                                        <Button
                                                            variant="contained"
                                                            width="100%"
                                                            sx={{marginTop: '10px', padding: '10px 0px 10px 20px'}}
                                                        >
                                                            <input type="file" accept="video/*" onChange={handleVideoFileChange} />
                                                        </Button>
                                                    </Box>
                                                    {openVideoError?<Box sx={{color: 'red', fontWeight: 600}}>
                                                        {videoErrorMessage}
                                                    </Box>: null}
                                                </Grid>
                                                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                                                    <Box pr={3} pb={2}>
                                                        Video Preview Image:
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} sm={8} md={9} sx={{paddingBottom: '20px'}}>
                                                    <Box >
                                                        {hideAvatarImage?
                                                            null
                                                        :
                                                        <Typography sx={{marginTop: '10px'}}>
                                                            {userUploadedImage?
                                                                <img style={{width: '200px', height: '200px'}} src={userUploadedImage}/> 
                                                            :
                                                                <Avatar
                                                                    variant='rounded'
                                                                    src={picture.croppedImg}
                                                                    sx={{ width: 200, height: 200, padding: "5" }}
                                                                />
                                                            }
                                                        </Typography>
                                                        }
                                                        {/* {hideAvatarImage?<Avatar
                                                        src={picture.croppedImg}
                                                        style={{ width: "100%", height: "auto", padding: "5" }}
                                                        />: null} */}
                                                        {picture.cropperOpen && (
                                                            <Box display="block">
                                                                <AvatarEditor
                                                                    ref={setEditorRef}
                                                                    image={picture.img}
                                                                    width={200}
                                                                    height={200}
                                                                    border={50}
                                                                    color={[255, 255, 255, 0.6]} // RGBA
                                                                    rotate={0}
                                                                    scale={picture.zoom}
                                                                />
                                                                <Slider
                                                                    aria-label="raceSlider"
                                                                    value={picture.zoom}
                                                                    min={1}
                                                                    max={10}
                                                                    step={0.1}
                                                                    onChange={handleSlider}
                                                                ></Slider>
                                                                <Box>
                                                                    <Button variant="contained" onClick={handleCancel}>
                                                                        Cancel
                                                                    </Button>
                                                                    <Button onClick={handleSave}> Save</Button>
                                                                </Box>
                                                            </Box>
                                                        )}
                                                        <Button
                                                            variant="contained"
                                                            width="100%"
                                                            sx={{marginTop: '10px', padding: '10px 0px 10px 20px'}}
                                                        >
                                                            <input type="file" accept="image/*" onChange={handleFileChange} />
                                                        </Button>
                                                    </Box>
                                                    {openImageError?<Box sx={{color: 'red', fontWeight: 600}}>
                                                        {imageErrorMessage}
                                                    </Box>: null}
                                                </Grid>
                                            </Grid>
                                        </Typography>
                                        <Typography sx={{textAlign: 'end'}}>
                                            <Button onClick={handleCancelBtnFunction} disabled={loading}>Cancel</Button>
                                            <Button onClick={handleFormSubmit} disabled={loading}>{loading ? 'Adding Video...' : 'Add Video'}</Button>
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
export default Video;
