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


const KeyCodes = {
    comma: 188,
    enter: 13
};
const delimiters = [KeyCodes.comma, KeyCodes.enter];

const prvVideoBanner = {
    width: '400px',
    height: '334px'
}

function CategoryEditCard({userData, tattooCategoryDetail, tagData, cancelBtnFunction, categoryUpdateFunction, tagUpdateFunction}){
    const router = useRouter();
    const [userInfo, setUserInfo] = useState([]);

    const [categoryInput, setCategoryInput] = useState({
        title: '',
        description: ''
    })

    const imageInputRef = useRef(null);

    var editor = "";
    const [picture, setPicture] = useState({
        cropperOpen: false,
        img: null,
        zoom: 1,
        croppedImg:
        "https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png"
    });

    const [tags, setTags] = useState([]);
    const [suggestions, setSuggestions] = useState([]);

    const [hideAvatarImage, setHideAvatarImage] = useState(false);
    const [selectedPreviewPic, setSelectedPreviewPic] = useState([]);
    const [previewPicOriginalFile, setPreviewPicOriginalFile] = useState([]);
    const [userUploadedImage, setUserUploadedImage] = useState('');
    const [categoryPreviewImage, setCategoryPreviewImage] = useState('');

    // -------------------------Error state------------------------
    const [loading, setLoading] = useState(false);
    const [apiResponseMessage, setApiResponseMessage] = useState('');

    const [open, setOpen] = useState(false);
    const [apiMessageType, setApiMessageType] = useState('');

    const [openTitleError, setOpenTitleError] = useState(false)
    const [titleErrorMessage, setTitleErrorMessage] = useState('Tattoo category title is required')
    const [openDescriptionError, setOpenDescriptionError] = useState(false)
    const [descriptionErrorMessage, setDescriptionErrorMessage] = useState('Tattoo category description is required')
    const [openImageError, setOpenImageError] = useState(false);
    const [imageErrorMessage, setImageErrorMessage] = useState('Please enter image file.');
    const [isUpdatingTattooCategory, setIsUpdatingTattooCategory] = useState(false);

    useEffect(()=>{

        if(tattooCategoryDetail){
            // setTattooCategoriesData(tattooCategoryDetail);
            setCategoryInput({
                title: tattooCategoryDetail.title,
                description: tattooCategoryDetail.description
            })
            setCategoryPreviewImage(tattooCategoryDetail.profilePicture);
        }
        
        if(userData.length > 0){
            setUserInfo(userData[0]);
        }

        if(tagData.length > 0){
            
            const matchingTags = tagData.filter(tagObj => tattooCategoryDetail.tags.includes(tagObj.text));
            
            const matchingTagIdsAndNames = matchingTags.map(tagObj => ({
              id: tagObj.id,
              text: tagObj.text,
            }));
      
            setTags(matchingTagIdsAndNames);
            setSuggestions(tagData);
      
        }
    }, [])

    useEffect(async()=>{
        if(isUpdatingTattooCategory){
            const formData = new FormData();
            formData.append('id', tattooCategoryDetail._id);
            formData.append('title', categoryInput.title);
            formData.append('description', categoryInput.description);
            
            if(selectedPreviewPic.length > 0){
                formData.append('file', selectedPreviewPic[0]);
            }

            let tagInfoArray = [];
            tags.forEach((tag) => {
                formData.append('tags', tag.text);
                tagInfoArray.push(tag.text);
            });

            let tagResult;
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create/new/tags`, {tagNames: tagInfoArray}, {headers: {'x-access-token': userData[0].jwtToken}
                }).then((data)=>{
                    tagResult = data.data.success
                    tags.forEach(tag => {
                        // Check if the value does not exist in the objectArray
                        if (!suggestions.some(obj => obj.text === tag.text)) {

                            // Create a new object and add it to the array
                            let newObj = { id: tag.text, text: tag.text };
                            setSuggestions([...suggestions, newObj]);
                            tagUpdateFunction([...suggestions, newObj])
                        }
                    });
                }).catch((error)=>{
                    console.log('error', error);
                    setApiMessageType('error')
                    const errorMessage = error.response.data.message;
                    
                    handleMessageBoxOpen()
                    setApiResponseMessage(errorMessage);
                    setIsUpdatingTattooCategory(false)
                    setLoading(false);
                });
            
            if(tagResult){
                axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/update/category`, formData, {headers: {'x-access-token': userData[0].jwtToken, 'Content-Type': 'multipart/form-data'}
                }).then((data)=>{
                    
                    setApiMessageType('success');
                    setApiResponseMessage('Tattoo category update successfully');
                    
                    categoryUpdateFunction(data.data.tattoCategoryData._id, data.data.tattoCategoryData)
                    setHideAvatarImage(false);
                    setIsUpdatingTattooCategory(false)
                    setLoading(false);
                    handleMessageBoxOpen()
                }).catch((error)=>{
                    console.log('error', error);
                    setApiMessageType('error')
                    const errorMessage = error.response.data.message;
                    
                    handleMessageBoxOpen()
                    setApiResponseMessage(errorMessage);
                    setIsUpdatingTattooCategory(false)
                    setLoading(false);
                });
            }
        }
    }, [isUpdatingTattooCategory])

    const handleFormChange = (e)=>{

        if(e.target.name == 'title'){
            setCategoryInput((prevState)=>({
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
            setCategoryInput((prevState)=>({
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
    }

    const handleFormSubmit = (e)=>{
        e.preventDefault();
        if(!categoryInput.title){
            setOpenTitleError(true)
        } 
        if(!categoryInput.description){
            setOpenDescriptionError(true)
        }
        if(!categoryPreviewImage && selectedPreviewPic.length == 0){
            setOpenImageError(true)
        }
        
        if(categoryInput.title && categoryInput.description && (selectedPreviewPic.length > 0 || categoryPreviewImage !== '')){
            setIsUpdatingTattooCategory(true);
            setLoading(true);
        } else {
            setApiMessageType('error')
            setApiResponseMessage('Please enter all the details.');
            setOpen(true);
        }
    }

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
    
    const handleMessageBoxClose = () => {
        setOpen(false);
        setApiResponseMessage('');
        setApiMessageType('')
    };
    const handleMessageBoxOpen = () => {
        setOpen(true);
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
            if(!categoryPreviewImage && selectedPreviewPic.length == 0){
                setOpenImageError(true);
            }
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

    const handleSlider = (event, value) => {
        setPicture({
          ...picture,
          zoom: value
        });
    };

    const handleCancel = () => {
        if(!categoryPreviewImage){
            setOpenImageError(true);
            setImageErrorMessage('Please enter image file.');
        }
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

    return(
        <>
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
                            <Tooltip arrow placement="top" title="Go back" disabled={loading} onClick={cancelBtnFunction}>
                                <IconButton color="primary" sx={{ p: 2 }}>
                                    <ArrowBackTwoToneIcon />
                                </IconButton>
                            </Tooltip>
                            <CardHeader
                                title="Update tattoo category"
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
                                                    value={categoryInput.title}
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
                                                    value={categoryInput.description}
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
                                                        categoryPreviewImage? 
                                                            <img style={prvVideoBanner} src={`${process.env.NEXT_PUBLIC_S3_URL}/${categoryPreviewImage}`}/> 
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
                                                            width={400}
                                                            height={400}
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
                                    <Button onClick={cancelBtnFunction} disabled={loading}>Cancel</Button>
                                    <Button onClick={handleFormSubmit} disabled={loading}>{loading ? 'Updating Category...' : 'Update Category'}</Button>
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

export default CategoryEditCard;