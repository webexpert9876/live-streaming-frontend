import Head from 'next/head';
import SidebarLayout from 'src/layouts/SidebarLayout';
import { useState, useEffect, useRef } from 'react';
// import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import {
    Tooltip,
    Divider,
    Box,
    FormControl,
    Card,
    IconButton,
    Typography,
    useTheme,
    CardHeader,
    Button,
    TextField,
    CardContent,
    NativeSelect,
    Avatar,
    Slider,
    Alert,
    Dialog
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
import LinearProgressWithLabel from '../../../../src/components/ProgressBar/LinearProgressBar'
import LoginDialog from 'src/components/pageAccessDialog/loginDialog'
import PermissionDeniedDialog from 'src/components/pageAccessDialog/permissionDeniedDialog'

const KeyCodes = {
    comma: 188,
    enter: 13
};
const delimiters = [KeyCodes.comma, KeyCodes.enter];

const Video = () => {
  const [userData, setUserData] = useState([]);
  const [isUserAvailable, setIsUserAvailable] = useState(false);
  const [isFetchedApi, setIsFetchedApi] = useState(true);
  const [allowUser, setAllowUser] = useState(false);

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

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

    const [selectedVideo, setSelectedVideo] = useState([])

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
  const [openTattooCategoryIdError, setOpenTattooCategoryIdError] = useState(false)
  const [tattooCategoryIdErrorMessage, setTattooCategoryIdErrorMessage] = useState('Tattoo category is required')

  const [progress, setProgress] = useState(0);

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

            if(roleInfo.data.roles[0].role == 'admin' || roleInfo.data.roles[0].role == 'artist'){

                client.query({
                    variables: {
                    usersId: userData[0]._id
                    },
                    query: gql`
                        query Query($usersId: ID) {
                            users(id: $usersId) {
                                _id
                                firstName
                                lastName
                                username
                                email
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
                    setUserData(result.data.users);
                    setTattooCategoryList(result.data.tattooCategories);
                //   setTagList(result.data.tagForStream);
                    setSuggestions(result.data.tagForStream);
                    setAllowUser(true);
                });
            } else {
                setAllowUser(false);
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
            if(isFetchedApi){
                setUserData([{...authState}])
                setIsUserAvailable(true);
            }
        }
    },[authState])

    useEffect(async ()=>{
        if(isAddingVideo){

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
            formData.append('files', selectedPreviewPic[0]);
            formData.append('files', selectedVideo[0]);

            let tagInfoArray = [];
            tags.forEach((tag) => {
                formData.append('tags', tag.text);
                tagInfoArray.push(tag.text);
            });
            
            let tagResult;
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create/new/tags`, {tagNames: tagInfoArray}, {headers: {'x-access-token': userData[0].jwtToken}
                }).then((data)=>{
                    tagResult = data.data.success        
                }).catch((error)=>{
                    console.log('error', error);
                    setApiMessageType('error')
                    const errorMessage = error.response.data.message;
                    
                    handleMessageBoxOpen()
                    setApiResponseMessage(errorMessage);
                    setIsAddingVideo(false)
                    setLoading(false);
                });

            if(tagResult){
                axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/artist-admin/create/video`, formData,
                    {
                        onUploadProgress: data => {
                            setProgress(Math.round((100 * data.loaded) / data.total))
                        },
                        headers: {'x-access-token': userData[0].jwtToken, 'Content-Type': 'multipart/form-data'}
                }).then((data)=>{

                    setApiMessageType('success')
                    setApiResponseMessage('Video added successfully');
                    
                    setVideoInput({
                        title: '',
                        description: '',
                        tattooCategoryId: '',
                        isPublished: false,
                        videoPreviewStatus: 'public'
                    })
                    setSelectedPreviewPic([]);
                    setSelectedVideo([]);
                    setPicture({
                        cropperOpen: false,
                        img: null,
                        zoom: 1,
                        croppedImg:
                        "https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png"
                    });
                    setUserUploadedImage('');
                    setHideAvatarImage(false);
                    setTags([]);
                    imageInputRef.current.value = '';
                    videoInputRef.current.value = '';
                    setProgress(0);

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
        }
    },[isAddingVideo])
    
    const theme = useTheme();

    const handleDelete = i => {
        setTags(tags.filter((tag, index) => index !== i));
    };

    const handleAddition = tag => {
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
    };

    const handleFormChange = (e)=>{

        if(e.target.name == 'title'){
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
        } else if(e.target.name == 'tattooCategoryId'){
            setVideoInput((prevState)=>({
                ...prevState,
                [e.target.name]: e.target.value
            }))

            if(e.target.value){
                setOpenTattooCategoryIdError(false)
            } else {
                setOpenTattooCategoryIdError(true)
                // setDescriptionErrorMessage('Video description is required');
            }
        } else if(e.target.name == 'isPublished'){
            setVideoInput((prevState)=>({
                ...prevState,
                [e.target.name]: e.target.value
            }))

        } else if(e.target.name == 'videoPreviewStatus'){
            setVideoInput((prevState)=>({
                ...prevState,
                [e.target.name]: e.target.value
            }))

        }
    }

    const handleFormSubmit = (e)=>{
        e.preventDefault();
        if(!videoInput.title){
            setOpenTitleError(true)
        } 
        if(!videoInput.description){
            setOpenDescriptionError(true)
        }
        if(!videoInput.tattooCategoryId){
            setOpenTattooCategoryIdError(true)
        }
        if(selectedPreviewPic.length == 0){
            setOpenImageError(true)
        }
        if(selectedVideo.length == 0){
            setOpenVideoError(true)
        }
        
        if(videoInput.title && videoInput.description && videoInput.tattooCategoryId && videoInput.videoPreviewStatus && selectedPreviewPic.length > 0 && selectedVideo.length > 0){
            setIsAddingVideo(true)
            setLoading(true);
        } else {
            setApiMessageType('error')
            setApiResponseMessage('Please enter all the details.');
            setOpen(true);
        }
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

            setSelectedPreviewPic([newFile]);
        }
    };

    const handleFileChange = (e) => {

        if(e.target.files.length == 0 ){
            setPicture({
                cropperOpen: false,
                img: null,
                zoom: 1,
                croppedImg:
                "https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png"
            });
            setSelectedPreviewPic([])
            setUserUploadedImage('')
            setHideAvatarImage(false)
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
        
        if(e.target.files.length == 0 ){
            setSelectedVideo([])
            setOpenVideoError(true)
            // setVideoErrorMessage('Please enter video file.');
        } else if (!e.target.files[0] || e.target.files[0].type.indexOf("video") !== -1) {
            setSelectedVideo(e.target.files)
            setOpenVideoError(false)
        } else {
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

    const prvVideoBanner = {
        width: '600px',
        height: '334px'
    }

    return (
        <>
            {userData.length > 0?
                allowUser?
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
                                        <Tooltip arrow placement="top" title="Go back" disabled={loading} onClick={()=>{router.push('/videos')}}>
                                            <IconButton color="primary" sx={{ p: 2 }}>
                                                <ArrowBackTwoToneIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <CardHeader
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
                                                                {openTattooCategoryIdError?<Box sx={{color: 'red', fontWeight: 600}}>
                                                                    {tattooCategoryIdErrorMessage}
                                                                </Box>: null}
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
                                                                <input type="file" ref={videoInputRef}  accept="video/*" onChange={handleVideoFileChange} />
                                                            </Button>
                                                        </Box>
                                                        {progress > 0 ?<LinearProgressWithLabel value={progress} />: null}
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
                                                                    <img style={prvVideoBanner} src={userUploadedImage}/> 
                                                                :
                                                                    <Avatar
                                                                        variant='rounded'
                                                                        src={picture.croppedImg}
                                                                        style={prvVideoBanner}
                                                                        sx={{ padding: "5" }}
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
                                                                        width={1600}
                                                                        height={890}
                                                                        border={50}
                                                                        color={[255, 255, 255, 0.6]} // RGBA
                                                                        rotate={0}
                                                                        scale={picture.zoom}
                                                                        style={prvVideoBanner}
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
                                                                <input type="file" ref={imageInputRef} accept="image/*" onChange={handleFileChange} />
                                                            </Button>
                                                        </Box>
                                                        {/* {progress > 0 ?<LinearProgressWithLabel value={progress} />: null} */}
                                                        {openImageError?<Box sx={{color: 'red', fontWeight: 600}}>
                                                            {imageErrorMessage}
                                                        </Box>: null}
                                                    </Grid>
                                                </Grid>
                                            </Typography>
                                            <Typography sx={{textAlign: 'end'}}>
                                                <Button onClick={()=>{router.push('/videos')}} disabled={loading}>Cancel</Button>
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
                            }} open={open}
                            autoHideDuration={6000}
                            onClose={handleMessageBoxClose} >
                            <Alert onClose={handleMessageBoxClose} variant="filled" severity={`${apiMessageType=='success'? 'success': 'error'}`} sx={{ width: '100%' }}>
                                {apiResponseMessage}
                            </Alert>
                            </Snackbar>
                        </Stack>
                        
                        <Footer />
                    </SidebarLayout>
                :
                    <PermissionDeniedDialog/>
            : 
                <LoginDialog/>
            }

        </>
    );
};
export default Video;
