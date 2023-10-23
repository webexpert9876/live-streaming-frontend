import { useEffect, useState, forwardRef } from 'react';
import {
  Grid,
  Typography,
  CardContent,
  Card,
  Box,
  Divider,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Checkbox,
  Select,
  ListItemText,
  FormControl,
  MenuItem,
  InputLabel,
  OutlinedInput,
  NativeSelect,
  Avatar,
  Slider
} from '@mui/material';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
// import { Avatar, Slider } from "@material-ui/core";

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DoneTwoToneIcon from '@mui/icons-material/DoneTwoTone';
import Text from 'src/components/Text';
import Label from 'src/components/Label';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthUser } from 'store/slices/authSlice';
import client from "../../../../../graphql";
import { gql } from "@apollo/client";
import AvatarEditor from 'react-avatar-editor'
import MultiSelectComponent from './MultiSelectComponent';
import axios from 'axios';
import {v4 as uuidv4} from 'uuid';
import { WithContext as ReactTags } from 'react-tag-input';

const KeyCodes = {
  comma: 188,
  enter: 13
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const prvVideoBanner = {
  width: '500px',
  height: '334px'
}

function EditStreamTab({ streamData, isStreamFound, tattooCategoriesData, tagData, userData, isStreamManagementPage}) {  
  const authState = useSelector(selectAuthUser)
  const [authUserDetail, setAuthUserDetail] = useState(useSelector(selectAuthUser));
  const [openEditPreviewImage, setOpenEditPreviewImage] = useState(false);
  const [openEmailEdit, setOpenEmailEdit] = useState(false);

  // ---------------------Props state----------------
  const [userInfo, setUserInfo]= useState({});
  const [streamInfo, setStreamInfo]= useState(isStreamFound? streamData[0]: {});
  const [tattooCategoryList, setTattooCategoryList]= useState([]);
  // const [tattooCategoryMenuList, setTattooCategoryMenuList]= useState([]);


  const [hideAvatarImage, setHideAvatarImage] = useState(false);
  const [userProfilePic, setUserProfilePic] = useState(isStreamFound? streamData[0].streamPreviewImage: '');
  const [selectedPreviewPic, setSelectedPreviewPic] = useState([]);
  const [previewPicOriginalFile, setPreviewPicOriginalFile] = useState([]);
  const [isPreviewImageUploaded, setIsPreviewImageUploaded] = useState(false);
  const [userUploadedImage, setUserUploadedImage] = useState('');

  // --------------------------stream related input values---------------------------------------------
  const [streamInput, setStreamInput] = useState({
    title: streamData[0].title,
    description: streamData[0].description,
    streamCategory: streamData[0].streamCategory
  })
  const [streamInfoSubmit, setStreamInfoSubmit]= useState(false);

  // -----------------stream key state management----------------------
  const [oldStreamKey, setOldStreamKey] = useState(isStreamFound? streamData[0].streamKey: '');
  const [isRegenerateKey, setIsRegenerateKey] = useState(false);

  // -------------------------Error state------------------------
  const [loading, setLoading] = useState(false);
  const [apiResponseMessage, setApiResponseMessage] = useState('');
  
  // ---------------Tag State-----------------------
  const [tags, setTags] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

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
  

  var editor = "";
  const [picture, setPicture] = useState({
    cropperOpen: false,
    img: null,
    zoom: 1,
    croppedImg:
      "https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png"
  });

  useEffect(()=>{
    if(userData.length > 0){
      setUserInfo(...userData);
    }
    if(tattooCategoriesData.length > 0){

      // Tattoo category list came from parent component
      let tattooList = [tattooCategoriesData]
      setTattooCategoryList(tattooList)

    }

    if(tagData.length > 0){
      // let tagList = tagData.map(tag => {
      //   return {
      //     id: tag.id,
      //     text: tag.name
      //   };
      // });
      
      const matchingTags = tagData.filter(tagObj => streamData[0].tags.includes(tagObj.text));

      // Use the map method to extract the id and name fields of matching tags
      const matchingTagIdsAndNames = matchingTags.map(tagObj => ({
        id: tagObj.id,
        text: tagObj.text,
      }));

      setTags(matchingTagIdsAndNames);
      setSuggestions(tagData);

    }
  }, [])

// -------------------------------------------Stream detail updaing api call -------------------------------------------
  useEffect( async()=>{

    if(streamInfoSubmit){

      const formData = new FormData();
      formData.append('title', streamInput.title);
      formData.append('description', streamInput.description);
      formData.append('streamCategory', streamInput.streamCategory);

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
              setStreamInfoSubmit(false)
              setLoading(false);
          });

      if(tagResult){
        axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update/stream/${streamInfo._id}`, formData, {headers: {'x-access-token': userInfo.jwtToken, 'Content-Type': 'multipart/form-data'}}).then((data)=>{

          setApiMessageType('success')
          setApiResponseMessage('Stream detail update successfully');
          setStreamInfoSubmit(false);
          setStreamInfo(data.data.streamData);
          setLoading(false);
          handleMessageBoxOpen()
        }).catch((error)=>{
          console.log('error', error);
          setApiMessageType('error')
          const errorMessage = error.response.data.message;
          
          handleMessageBoxOpen()
          setApiResponseMessage(errorMessage);
          setStreamInfoSubmit(false)
          setLoading(false);
        });
      }
    }
  },[streamInfoSubmit])
  
  // -------------------------------------------Upload preview image for live streaming-------------------------------------
  useEffect(()=>{

    if(isPreviewImageUploaded){

      const formData = new FormData();
      formData.append('streamPreviewImage', selectedPreviewPic);

      axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update/stream/${streamInfo._id}`, formData, {headers: {'x-access-token': userInfo.jwtToken, 'Content-Type': 'multipart/form-data'}}).then((data)=>{

        setApiMessageType('success')
        setApiResponseMessage('Live stream preview image uploaded successfully');
        setUserProfilePic(data.data.streamData.streamPreviewImage);
        setLoading(false);
        handleMessageBoxOpen()
        handleClose('stream')
        setIsPreviewImageUploaded(false);
      }).catch((error)=>{
        console.log('error', error);
        setApiMessageType('error')
        const errorMessage = error.response.data.message;
        handleMessageBoxOpen()
        setApiResponseMessage(errorMessage);
        setLoading(false);
        handleClose('stream')
        setIsPreviewImageUploaded(false)
      });
    }
  },[isPreviewImageUploaded])
  
  // -------------------------------------------Stream key regenerate api call -------------------------------------------
  useEffect(()=>{
    let formData = {}

    if(isRegenerateKey){
      
      axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/regenerate/stream/key/${streamInfo._id}`, formData, {headers: {'x-access-token': userInfo.jwtToken}}).then((data)=>{

        setApiMessageType('success')
        setApiResponseMessage('Stream key regenerated successfully');
        setOldStreamKey(data.data.newStreamKey);
        setIsRegenerateKey(false)
        setLoading(false);
        handleMessageBoxOpen()
      }).catch((error)=>{
        console.log('error', error);
        const errorMessage = error.response.data.message;
        
        setApiMessageType('error')
        setApiResponseMessage(errorMessage);

        setLoading(false);
        setIsRegenerateKey(false)
        handleMessageBoxOpen()
      });
    }
  },[isRegenerateKey])


  const handleClickOpen = (dialogInfo) => {

    switch(dialogInfo) {
      case 'stream':
        setOpenEditPreviewImage(true);
        break;
      case 'email':
        // setOpenEditPreviewImage(true)
        break;
    }

  };

  const handleClose = (dialogInfo) => {
    switch(dialogInfo) {
      case 'stream':
        setOpenEditPreviewImage(false);
        break;
      case 'email':
        setOpenEmailEdit(false);
        break;
    }
  };

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

  const handleFormChange = (e)=>{
    setStreamInput((prevState)=>({
      ...prevState,
      [e.target.name]: e.target.value
    }))
    setApiResponseMessage('')
  }
  
  const handleFormSubmit = (e)=>{
    e.preventDefault();
    setStreamInfoSubmit(true);
    setLoading(true)
  }
  
  const handleStreamPreviewImageSubmit = (e)=>{
    e.preventDefault();
    setIsPreviewImageUploaded(true)
    setLoading(true)
  }

  return (
    <>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>

          {/* ------------------------------------------------Stream preview image upload modal----------------------------------------------- */}
          <Box
            p={3}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                Stream Details
              </Typography>
              <Typography variant="subtitle2">
                Manage informations related to your Stream details
              </Typography>
            </Box>
            <Button variant="text" startIcon={<EditTwoToneIcon />} onClick={()=>{handleClickOpen('stream')}}>
              Update Live Stream Preview Image
            </Button>
            <Dialog open={openEditPreviewImage} onClose={()=>{handleClose('stream')}}>
              <DialogTitle>Upload live stream preview image</DialogTitle>
              {/* {apiResponseMessage && <p style={{ color: "#f00" }}>{apiResponseMessage}</p>} */}
              <DialogContent >

                <Typography variant='body1' component={'div'} >
                  <Typography variant='p' component={'p'} sx={{marginTop: '15px', color: 'rgba(203, 204, 210, 0.7)'}}>Upload Stream Preview Image</Typography>
                  <Box >
                    {hideAvatarImage?
                      null
                    :
                      <Typography sx={{marginTop: '10px'}}>
                        {userUploadedImage?
                          <img style={prvVideoBanner} src={userUploadedImage}/> 
                        :
                          userProfilePic? 
                            <img style={prvVideoBanner} src={`${process.env.NEXT_PUBLIC_S3_URL}/${userProfilePic}`}/> 
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
                      <input type="file" accept="image/*" onChange={handleFileChange} />
                    </Button>
                  </Box>
                </Typography>

              </DialogContent>
              <DialogActions>
                <Button onClick={()=>{handleClose('stream')}}>Cancel</Button>
                <Button onClick={handleStreamPreviewImageSubmit} disabled={loading}>{loading ? 'Updating...' : 'Update'}</Button>
              </DialogActions>
            </Dialog>
          </Box>
          <Divider />
          
          {/* ----------------------------------------------------------Stream Related information----------------------------------------------------------------- */}
          <CardContent sx={{ p: 4 }}>
            <Typography variant="subtitle2">
              <Grid container spacing={0}>
                {/* <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    Stream Preview Image:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9} sx={{paddingBottom: '20px'}}>
                  {userProfilePic? 
                    <img style={{width: '150px', height: '150px', borderRadius: '50%'}} src={`${process.env.NEXT_PUBLIC_S3_URL}/${userProfilePic}`}/> 
                    : <Avatar
                      src={picture.croppedImg}
                      sx={{ width: 150, height: 150, padding: "5" }}
                    />
                  }
                </Grid> */}
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box mt={1} pr={3} pb={2}>
                    Stream Title:
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
                      value={streamInput.title}
                      onChange={handleFormChange}
                      required
                    />
                  </Text>
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box mt={1} pr={3} pb={2}>
                    Stream Description:
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
                      value={streamInput.description}
                      onChange={handleFormChange}
                      required
                    />
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box mt={1} pr={3} pb={2}>
                    Stream Tattoo Category:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Typography width={250} mt={1.5} color="black">
                    <FormControl fullWidth>
                      {/* <InputLabel variant="standard" htmlFor="uncontrolled-native">
                        Select Stream Tattoo Category
                      </InputLabel> */}
                      <NativeSelect
                        defaultValue={streamInfo.streamCategory}
                        onChange={handleFormChange}
                        inputProps={{
                          name: 'streamCategory',
                          id: 'uncontrolled-native',
                        }}
                        >
                          {tattooCategoriesData.map((category)=>(
                            <option key={category._id} value={category._id}>{category.title}</option>
                          ))}
                      </NativeSelect>
                    </FormControl>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box mt={2} pr={3} pb={2}>
                    Stream Tags:
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
              </Grid>
            </Typography>
            <Typography sx={{textAlign: 'end'}}>
              <Button onClick={handleFormSubmit} disabled={loading}>{loading ? 'Updating...' : 'Update'}</Button>
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* ----------------------------------------------------------------------Stream key regenerate box----------------------------------------------------------------- */}
      {`${isStreamManagementPage}` !== 'false' && <Grid item xs={12}>
        <Card>
          <Box
            p={3}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                Stream key
              </Typography>
              <Typography variant="subtitle2">
                Manage your stream key ( Do not share stream key with any one )
              </Typography>
            </Box>
          </Box>
          <Divider />
          <CardContent sx={{ p: 4 }}>
            <Typography variant="subtitle2">
              <Grid container spacing={0}>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={1} mt={1}>
                    Stream key:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Text color="black">
                    {oldStreamKey? 
                      <b>{oldStreamKey}</b>
                    :
                      <b>No stream key found</b>
                    }
                  </Text>
                  <Box pl={3} component="span">
                    <Button variant="text" disabled={loading} onClick={()=>{
                        setLoading(true); setIsRegenerateKey(true)
                      }}>
                      {loading ? 'Regenerating key...' : 'Regenerate key'}
                    </Button>
                  </Box>
                </Grid>     
              </Grid>
            </Typography>
          </CardContent>
        </Card>
      </Grid>}
    </Grid>

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
);
}

export default EditStreamTab;
