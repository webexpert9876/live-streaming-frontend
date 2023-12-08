import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { Grid, Container } from '@mui/material';
import {
    Tooltip,
    IconButton,
    Divider,
    Box,
    FormControl,
    InputLabel,
    Card,
    Select,
    MenuItem,
    Typography,
    useTheme,
    CardHeader,
    CardContent,
    NativeSelect,
    TextField,
    Button,
    Avatar,
    Slider,
    Alert
} from '@mui/material';
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';

import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthUser } from 'store/slices/authSlice';
import client from "../../../graphql";
import { gql } from "@apollo/client";
import axios from 'axios';
import Text from '../Text';
import { WithContext as ReactTags } from 'react-tag-input';
import AvatarEditor from 'react-avatar-editor';
import {v4 as uuidv4} from 'uuid';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import LinearProgressWithLabel from '../../components/ProgressBar/LinearProgressBar';


const KeyCodes = {
    comma: 188,
    enter: 13
};
const delimiters = [KeyCodes.comma, KeyCodes.enter];

function VideoEditCard({userData, videoDetail, tattooCategoryList, tagData, cancelBtnFunction, videoUpdateFunction}){
    const [videoInput, setVideoInput] = useState({
        title: '',
        description: '',
        tattooCategoryId: '',
        isPublished: '',
        videoPreviewStatus: ''
    })
    const videoInputRef = useRef(null);
    const [tags, setTags] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    
    const [videoDetails, setVideoDetails] = useState({});
    const [userInfo, setUserInfo] = useState({});
    const [tattooCategoriesData, setTattooCategoriesData] = useState([]);

    const [loading, setLoading] = useState(false);
    
    var editor = "";
    const [picture, setPicture] = useState({
        cropperOpen: false,
        img: null,
        zoom: 1,
        croppedImg:
        "https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png"
    });

    const [hideAvatarImage, setHideAvatarImage] = useState(false);
    // const [userProfilePic, setUserProfilePic] = useState(videoDetail? videoDetail.videoPreviewImage: '');
    const [videoPreviewImage, setVideoPreviewImage] = useState(videoDetail? videoDetail.videoPreviewImage: '');
    const [selectedPreviewPic, setSelectedPreviewPic] = useState([]);
    const [previewPicOriginalFile, setPreviewPicOriginalFile] = useState([]);
    const [isPreviewImageUploaded, setIsPreviewImageUploaded] = useState(false);
    const [userUploadedImage, setUserUploadedImage] = useState('');
    const [isUpdatingVideoInfo, setIsUpdatingVideoInfo] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState([])

    // -------------------------Error state------------------------
    const [apiResponseMessage, setApiResponseMessage] = useState('');

    const [open, setOpen] = useState(false);
    const [apiMessageType, setApiMessageType] = useState('');

    const [openImageError, setOpenImageError] = useState(false);
    const [imageErrorMessage, setImageErrorMessage] = useState('Please enter image file.');

    const [openTitleError, setOpenTitleError] = useState(false);
    const [titleErrorMessage, setTitleErrorMessage] = useState('Video title is required');
    const [openDescriptionError, setOpenDescriptionError] = useState(false);
    const [descriptionErrorMessage, setDescriptionErrorMessage] = useState('Video description is required');
    const [openTattooCategoryIdError, setOpenTattooCategoryIdError] = useState(false);
    const [tattooCategoryIdErrorMessage, setTattooCategoryIdErrorMessage] = useState('Tattoo category is required');
    const [progress, setProgress] = useState(0);


    const handleMessageBoxClose = () => {
        setOpen(false);
        setApiResponseMessage('');
        setApiMessageType('')
    };
    const handleMessageBoxOpen = () => {
        setOpen(true);
    };

    useEffect(()=>{
        setTattooCategoriesData(tattooCategoryList);
        
        if(userData.length > 0){
            setUserInfo(userData[0]);
        }
        if(videoDetail){
            setVideoDetails(videoDetail);
            setVideoInput({
                title: videoDetail.title,
                description: videoDetail.description,
                tattooCategoryId: videoDetail.tattooCategoryId,
                isPublished: videoDetail.isPublished,
                videoPreviewStatus: videoDetail.videoPreviewStatus
            })
        }

        if(tagData.length > 0){
            
            const matchingTags = tagData.filter(tagObj => videoDetail.tags.includes(tagObj.text));
            
            const matchingTagIdsAndNames = matchingTags.map(tagObj => ({
              id: tagObj.id,
              text: tagObj.text,
            }));
      
            setTags(matchingTagIdsAndNames);
            setSuggestions(tagData);
      
        }

    }, [])

    useEffect(async()=>{
        if(isUpdatingVideoInfo){

            const formData = new FormData();
            formData.append('title', videoInput.title);
            formData.append('description', videoInput.description);
            formData.append('tattooCategoryId', videoInput.tattooCategoryId);
            formData.append('isPublished', videoInput.isPublished);
            formData.append('videoPreviewStatus', videoInput.videoPreviewStatus);
            formData.append('files', selectedVideo[0]);
            if(selectedPreviewPic.length > 0){
                formData.append('files', selectedPreviewPic[0]);
            }

            let tagInfoArray = [];
            tags.forEach((tag) => {
                formData.append('tags', tag.text);
                tagInfoArray.push(tag.text);
            });

            let tagResult;
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create/new/tags`, {tagNames: tagInfoArray}, {headers: {'x-access-token': userInfo.jwtToken}
                }).then((data)=>{
                    tagResult = data.data.success        
                }).catch((error)=>{
                    console.log('error', error);
                    setApiMessageType('error')
                    const errorMessage = error.response.data.message;
                    
                    handleMessageBoxOpen()
                    setApiResponseMessage(errorMessage);
                    setIsUpdatingVideoInfo(false)
                    setLoading(false);
                });

            if(tagResult){

                axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/artist/update/video/${videoDetails._id}`, formData, {
                    onUploadProgress: data => {
                        setProgress(Math.round((100 * data.loaded) / data.total))
                    },
                    headers: {'x-access-token': userInfo.jwtToken, 'Content-Type': 'multipart/form-data'}
                }).then((data)=>{
                    let videoNewInfo = data.data.videoData;
    
                    setApiMessageType('success')
                    setApiResponseMessage('Video detail update successfully');
                    setIsUpdatingVideoInfo(false);
                    setVideoDetails(videoNewInfo);
                    videoUpdateFunction(videoNewInfo._id, videoNewInfo)
                    setSelectedVideo([]);
                    videoInputRef.current.value = '';
                    setLoading(false);
                    handleMessageBoxOpen()
                }).catch((error)=>{
                    console.log('error', error);
                    setApiMessageType('error')
                    const errorMessage = error.response.data.message;
                    
                    handleMessageBoxOpen()
                    setApiResponseMessage(errorMessage);
                    setIsUpdatingVideoInfo(false)
                    setLoading(false);
                });
            }

        }
    }, [isUpdatingVideoInfo])

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
        // setVideoInput((prevState)=>({
        //     ...prevState,
        //     [e.target.name]: e.target.value
        // }))
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
        if(!videoPreviewImage && selectedPreviewPic.length == 0){
            setOpenImageError(true)
        } 
        // if(selectedPreviewPic.length == 0){
        //     setOpenImageError(true)
        // }

        if(videoInput.title && videoInput.description && videoInput.tattooCategoryId && videoInput.videoPreviewStatus && (selectedPreviewPic.length > 0 || videoPreviewImage !== '') ){
            setIsUpdatingVideoInfo(true);
            setLoading(true);
        } else {
            setApiMessageType('error')
            setApiResponseMessage('Please enter all the required details.');
            setOpen(true);
        }
        // setIsUpdatingVideoInfo(true);
        // setLoading(true);
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
        // setHideAvatarImage(true);
        // let url = URL.createObjectURL(e.target.files[0]);
        // setPreviewPicOriginalFile(e.target.files[0]);
        // // setUserUploadedImage(url);
        // setPicture({
        //     ...picture,
        //     img: url,
        //     cropperOpen: true
        // });

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
        } else if (!e.target.files[0] || e.target.files[0].type.indexOf("video") !== -1) {
            setSelectedVideo(e.target.files)
        }
      
        // prepareFileUpload(files[0]);
        
        // setSelectedVideo(e.target.files[0])
        
    };

    const prvVideoBanner = {
        width: '600px',
        height: '334px'
    }

    return(
        <>
            <Container maxWidth="lg">
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
                            <Tooltip arrow placement="top" title="Go back" disabled={loading} onClick={cancelBtnFunction}>
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
                                title="Edit Videos"
                            />
                        </Box>
                        <Divider />
                        <Box>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="subtitle2">
                                <Grid container spacing={0}>
                                    <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                                        <Box pr={3} pb={2}>
                                            Video Preview Image:
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={8} md={9} sx={{paddingBottom: '20px'}}>
                                        {/* {videoDetails.videoPreviewImage? 
                                            <img style={{width: '150px', height: '150px', borderRadius: '50%'}} src={`${process.env.NEXT_PUBLIC_S3_URL}/${videoDetails.videoPreviewImage}`}/> 
                                            : <Avatar
                                                src={picture.croppedImg}
                                                variant='rounded'
                                                sx={{ width: 400, height: 400, padding: "5" }}
                                              />
                                        } */}
                                        <Box >
                                            {hideAvatarImage?
                                                null
                                            :
                                            <Typography sx={{marginTop: '10px'}}>
                                                {userUploadedImage?
                                                    <img style={prvVideoBanner} src={userUploadedImage}/> 
                                                :
                                                videoPreviewImage? 
                                                        <img style={prvVideoBanner} src={`${process.env.NEXT_PUBLIC_S3_URL}/${videoPreviewImage}`}/> 
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
                                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                                <Button
                                                    variant="contained"
                                                    width="100%"
                                                    sx={{marginTop: '10px', padding: '10px 0px 10px 20px'}}
                                                >
                                                    <input type="file" accept="image/*" onChange={handleFileChange} />
                                                </Button>
                                                <Typography pl='10px'>
                                                    Upload new preview image here
                                                </Typography>
                                            </Box>
                                        </Box>
                                        {openImageError?<Box sx={{color: 'red', fontWeight: 600}}>
                                            {imageErrorMessage}
                                        </Box>: null}
                                    </Grid>
                                    <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }} pt={'15px'}>
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
                                    </Grid>
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
                                    {Object.keys(videoDetails).length>0?
                                        <>
                                            <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                                                <Box mt={1} pr={3} pb={2}>
                                                    Tattoo Category:
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={8} md={9}>
                                                <Typography width={250} mt={1.5} color="black">
                                                    <FormControl fullWidth>
                                                    {/* <InputLabel variant="standard" htmlFor="uncontrolled-native">
                                                        Select Stream Tattoo Category
                                                    </InputLabel> */}
                                                        <NativeSelect
                                                            defaultValue={videoDetails.tattooCategoryId}
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
                                            <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                                                <Box mt={2} pr={3} pb={2}>
                                                    Video status:
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={8} md={9}>
                                                <Typography width={250} mt={1.5} color="black">
                                                    <FormControl fullWidth>
                                                    {/* <InputLabel variant="standard" htmlFor="uncontrolled-native">
                                                        Select Stream Tattoo Category
                                                    </InputLabel> */}
                                                        <NativeSelect
                                                            defaultValue={videoDetails.isPublished}
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
                                                    {/* <InputLabel variant="standard" htmlFor="uncontrolled-native">
                                                        Select Stream Tattoo Category
                                                    </InputLabel> */}
                                                        <NativeSelect
                                                            defaultValue={videoDetails.videoPreviewStatus}
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

                                        </>
                                    :null}
                                </Grid>
                            </Typography>
                            <Typography sx={{textAlign: 'end'}}>
                            <Button onClick={cancelBtnFunction} disabled={loading}>Cancel</Button>
                            <Button onClick={handleFormSubmit} disabled={loading}>{loading ? 'Updating...' : 'Update'}</Button>
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
        </>
    )

}

export default VideoEditCard;