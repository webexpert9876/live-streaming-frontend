import Head from 'next/head';
import { useState, useEffect } from 'react';
import { Grid, Container } from '@mui/material';
import {
    Tooltip,
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

function VideoEditCard({userData, videoDetail, tattooCategoryList, tagData, cancelBtnFunction}){
    const [videoInput, setVideoInput] = useState({
        title: '',
        description: '',
        tattooCategoryId: '',
        isPublished: '',
        videoPreviewStatus: ''
    })

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
    const [userProfilePic, setUserProfilePic] = useState(videoDetail? videoDetail.videoPreviewImage: '');
    const [selectedPreviewPic, setSelectedPreviewPic] = useState([]);
    const [previewPicOriginalFile, setPreviewPicOriginalFile] = useState([]);
    const [isPreviewImageUploaded, setIsPreviewImageUploaded] = useState(false);
    const [userUploadedImage, setUserUploadedImage] = useState('');
    const [isUpdatingVideoInfo, setIsUpdatingVideoInfo] = useState(false);

    // -------------------------Error state------------------------
    const [apiResponseMessage, setApiResponseMessage] = useState('');

    const [open, setOpen] = useState(false);
    const [apiMessageType, setApiMessageType] = useState('');

    const handleMessageBoxClose = () => {
        setOpen(false);
        setApiResponseMessage('');
        setApiMessageType('')
    };
    const handleMessageBoxOpen = () => {
        setOpen(true);
    };


    console.log('userData', userData)
    console.log('videoDetail', videoDetail)
    console.log('videoDetail', tattooCategoryList)
    console.log('tagData', tagData)

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

    useEffect(()=>{
        if(isUpdatingVideoInfo){
            console.log('video input ', videoInput)
            console.log('video tags ', tags)
            console.log('video selected Preview Pic ', selectedPreviewPic)

            const formData = new FormData();
            formData.append('title', videoInput.title);
            formData.append('description', videoInput.description);
            formData.append('tattooCategoryId', videoInput.tattooCategoryId);
            formData.append('isPublished', videoInput.isPublished);
            formData.append('videoPreviewStatus', videoInput.videoPreviewStatus);
            console.log('video selectedPreviewPic ', selectedPreviewPic)
            if(selectedPreviewPic){
                console.log('if video selectedPreviewPic ', selectedPreviewPic)
                formData.append('files', selectedPreviewPic);
            }

            tags.forEach((tag) => {
                formData.append('tags', tag.text);
            });

            axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/artist/update/video/${videoDetails._id}`, formData, {headers: {'x-access-token': userInfo.jwtToken, 'Content-Type': 'multipart/form-data'}}).then((data)=>{

                setApiMessageType('success')
                setApiResponseMessage('Video detail update successfully');
                setIsUpdatingVideoInfo(false);
                // setStreamInfo(data.data.streamData);
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
    }, [isUpdatingVideoInfo])

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
        setVideoInput((prevState)=>({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    const handleFormSubmit = (e)=>{
        e.preventDefault();
        setIsUpdatingVideoInfo(true);
        setLoading(true);
    }

    const handleSlider = (event, value) => {
        setPicture({
          ...picture,
          zoom: value
        });
    };

    const handleCancel = () => {
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
        setHideAvatarImage(true);
        let url = URL.createObjectURL(e.target.files[0]);
        setPreviewPicOriginalFile(e.target.files[0]);
        // setUserUploadedImage(url);
        setPicture({
            ...picture,
            img: url,
            cropperOpen: true
        });
    };

    return(
        <>
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
                                                    <img style={{width: '200px', height: '200px'}} src={userUploadedImage}/> 
                                                :
                                                    userProfilePic? 
                                                        <img style={{width: '200px', height: '200px'}} src={`${process.env.NEXT_PUBLIC_S3_URL}/${userProfilePic}`}/> 
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
                                            />
                                        </Typography>
                                    </Grid>
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
                                                    defaultValue={videoDetail.tattooCategoryId}
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
                                                    defaultValue={videoDetail.isPublished}
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
                                                    defaultValue={videoDetail.videoPreviewStatus}
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
                }} open={open} autoHideDuration={6000} onClose={handleMessageBoxClose} >
                <Alert onClose={handleMessageBoxClose} severity={`${apiMessageType=='success'? 'success': 'error'}`} sx={{ width: '100%' }}>
                    {apiResponseMessage}
                </Alert>
                </Snackbar>
            </Stack>
        </>
    )

}

export default VideoEditCard;