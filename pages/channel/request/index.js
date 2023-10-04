import { useEffect, useState, forwardRef } from 'react';
import {
  Grid,
  Typography,
  CardContent,
  Card,
  CardHeader,
  Box,
  Divider,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Container,
  TextField,
  Checkbox,
  Select,
  ListItemText,
  FormControl,
  MenuItem,
  InputLabel,
  OutlinedInput,
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
import client from '../../../graphql';
import { gql } from "@apollo/client";
import AvatarEditor from 'react-avatar-editor'
import axios from 'axios';
import {v4 as uuidv4} from 'uuid';
import { useRouter } from 'next/router';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function ChannelRequest(){
    // const [socialInputs, setSocialInputs] = useState([{ platform: "facebook", url: "" },
    // { platform: "instagram", url: "" },
    // { platform: "twitter", url: "" },
    // { platform: "youTube", url: "" },
    // { platform: "discord", url: "" }])

    const authState = useSelector(selectAuthUser)
    const router = useRouter();
  const [authUserDetail, setAuthUserDetail] = useState(useSelector(selectAuthUser));
  const [userInfo, setUserInfo] = useState({});
  const [channelInfo, setChannelInfo]= useState({});
  const [hideAvatarImage, setHideAvatarImage] = useState(false);
  const [channelProfilePic, setChannelProfilePic] = useState('');
  const [userSocialLinks, setUserSocialLinks] = useState('');
  const [userSelectedProfilePic, setUserSelectedProfilePic] = useState([]);
  const [userUploadedImage, setUserUploadedImage] = useState('');
  const [channelProfileInput, setChannelProfileInput] = useState({
    channelName: '',
    description: '',
    experience: '',
    otherPlatformUrl: '',
    location: ''
  })
  const [socialInputs, setSocialInputs] = useState([]);
  const [channelDetailSubmit, setChannelDetailSubmit]= useState(false);
  const [isChannelApproved, setIsChannelApproved] = useState(false);
  const [isAppliedForChannel, setIsAppliedForChannel ] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [apiResponseMessage, setApiResponseMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [apiMessageType, setApiMessageType] = useState('');

  const [errorObject, setErrorObject]= useState({
    channelName: {
        error: false,
        message: 'Channel name is required'
    },
    description: {
        error: false,
        message: 'Description is required'
    },
    experience: {
        error: false,
        message: 'experience is required'
    },
    otherPlatformUrl: {
        error: false,
        message: 'Other platform streaming information is required'
    },
    location: {
        error: false,
        message: 'location is required'
    }
  });

  const handleMessageBoxClose = () => {
    setOpen(false);
    setApiResponseMessage('');
    setApiMessageType('')
  };
  const handleMessageBoxOpen = () => {
    setOpen(true);
  };
  

  var editor = "";
  const [picture, setPicture] = useState({
    cropperOpen: false,
    img: null,
    zoom: 2,
    croppedImg:
      "https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png"
  });

  // console.log('userInfo userInfo', userInfo);

  useEffect(()=>{
    // if(props.channelData.length > 0){
    //   // setUserSocialLinks(props.channelData[0].socialLinks);
    //   setChannelInfo(...props.channelData);
    //   setUserInfo(...props.userData);

    //   if(props.channelData[0].socialLinks){
    //     let userSocialAccount = props.channelData[0].socialLinks;
        
    //     let socialPlatform = [{ platform: "facebook", url: "" },
    //     { platform: "instagram", url: "" },
    //     { platform: "twitter", url: "" },
    //     { platform: "youTube", url: "" },
    //     { platform: "discord", url: "" }]

    //     userSocialAccount.forEach((item) => {
    //       const index = socialPlatform.findIndex((dataItem) => dataItem.platform.toLowerCase() === item.platform.toLowerCase());
    //       if (index !== -1) {
    //         socialPlatform[index].url = item.url;
    //       }
    //     });
        
    //     // setUserSocialLinks(socialPlatform);
    //     // setSocialInputsFormat(socialPlatform);
    //     setSocialInputs(socialPlatform);

    //   }

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
                    urlSlug
                    jwtToken
                    role
                    channelId
                }
                channels(userId: $artistId) {
                    _id
                    channelName
                    isApproved
                    description
                    createdAt
                    location
                    userId
                    urlSlug
                }
            }
        `,
      }).then((result) => {+
        setUserInfo(result.data.users[0]);
        setChannelInfo(result.data.channels[0]);
        
        if(result.data.channels.length > 0){

            let isApproved = `${result.data.channels[0].isApproved}`;

            if(isApproved == 'true' && (result.data.users[0].channelId !== null || result.data.users[0].channelId !== undefined)){
                setIsChannelApproved(true);
            } else if(isApproved == 'false'  && (result.data.users[0].channelId !== null || result.data.users[0].channelId !== undefined)){
                setIsAppliedForChannel(true);
            }
        } else {
            setIsChannelApproved(false);
            setIsAppliedForChannel(false);
        }
        //   setTagList(result.data.tagForStream)
        //   setTattooCategoryList(result.data.tattooCategories);
        //   setArtistStreamDetail(result.data.streams)
      });
    }
    getUserAllDetails();
  }, [])

  useEffect(()=>{

    if(channelDetailSubmit){

      const formData = new FormData();
      // formData.append('id', channelInfo._id);
      formData.append('channelName', channelProfileInput.channelName);
      formData.append('description', channelProfileInput.description);
      formData.append('experience', channelProfileInput.experience);
      formData.append('otherPlatformUrl', channelProfileInput.otherPlatformUrl);
      formData.append('location', channelProfileInput.location);
      formData.append('userId', userInfo._id);
      
      if(userSelectedProfilePic.length > 0){
        formData.append('channelProfilePicture', userSelectedProfilePic[0]);
      }

      axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create/channel`, formData, {headers: {'x-access-token': userInfo.jwtToken, 'Content-Type': 'multipart/form-data'}}).then((data)=>{

        // let userData = data.data.user
        setApiMessageType('success')
        setApiResponseMessage('Your request for channel is submitted');
        setIsAppliedForChannel(true)
        setLoading(false);
        
        // setChannelProfilePic(data.data.channelData.channelPicture);
        // setChannelInfo(data.data.channelData)
        // setUserSelectedProfilePic([])
        handleMessageBoxOpen()
        setChannelDetailSubmit(false)
      }).catch((error)=>{
        console.log('error', error);
        const errorMessage = error.response.data.message;
        setApiMessageType('error')
        handleMessageBoxOpen()
        setApiResponseMessage(errorMessage);
        setErrorMessage(errorMessage);
        setChannelDetailSubmit(false)
        setLoading(false);
      });
    }
  },[channelDetailSubmit])

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

      setUserSelectedProfilePic([newFile]);
    }
  };

  const handleFileChange = (e) => {
    setHideAvatarImage(true);
    let url = URL.createObjectURL(e.target.files[0]);
    // setUserUploadedImage(url);
    setPicture({
      ...picture,
      img: url,
      cropperOpen: true
    });
  };

  const handleFormChange = (e)=>{
    setChannelProfileInput((prevState)=>({
        ...prevState,
        [e.target.name]: e.target.value
    }))
    if(e.target.name == 'channelName'){
        
        setErrorObject((prevState) => ({
            ...prevState,
            [e.target.name]: {
              error: e.target.value? false: true,
              message: !e.target.value ? 'Please Enter Channel Name' : '',
            },
        }));

    } else if(e.target.name == 'description'){
        setErrorObject((prevState) => ({
            ...prevState,
            [e.target.name]: {
              error: e.target.value? false: true,
              message: !e.target.value ? 'Please Enter description' : '',
            },
        }));
    } else if(e.target.name == 'experience'){
        setErrorObject((prevState) => ({
            ...prevState,
            [e.target.name]: {
              error: e.target.value? false: true,
              message: !e.target.value ? 'Please Enter experience' : '',
            },
        }));
    } else if(e.target.name == 'location'){
        setErrorObject((prevState) => ({
            ...prevState,
            [e.target.name]: {
              error: e.target.value? false: true,
              message: !e.target.value ? 'Please Enter your location' : '',
            },
        }));
    } else if(e.target.name == 'otherPlatformUrl'){
        setErrorObject((prevState) => ({
            ...prevState,
            [e.target.name]: {
              error: e.target.value? false: true,
              message: !e.target.value ? 'Please Enter Other platform url where you stream' : '',
            },
        }));
    }
    setErrorMessage('')
  }

  const handleSocialLinks = (e, platform)=>{

    const { value } = e.target;

    // Create a copy of the socialInputs array
    const updatedSocialInputs = [...socialInputs];

    // Find the index of the object with the specified platform
    const index = updatedSocialInputs.findIndex(
      (input) => input.platform.toLowerCase() === platform.toLowerCase()
    );

    // Update the URL value of the object at the specified index
    if (index !== -1) {
      updatedSocialInputs[index].url = value;
      setSocialInputs(updatedSocialInputs);
    }


    setErrorMessage('')
  }

  const handleFormSubmit = (e)=>{
    e.preventDefault();
    if(!channelProfileInput.channelName){
        setErrorObject((prevState)=>({
            ...prevState,
            ['channelName']: {error: true, message: 'Please Enter Channel Name'}
        }))
    } 
    if(!channelProfileInput.description){
        setErrorObject((prevState) => ({
            ...prevState,
            ['description']: {
              error: e.target.value? false: true,
              message: !e.target.value ? 'Please Enter description' : '',
            },
        }));
    }
    if(!channelProfileInput.experience){
        setErrorObject((prevState) => ({
            ...prevState,
            ['experience']: {
              error: e.target.value? false: true,
              message: !e.target.value ? 'Please Enter experience' : '',
            },
        }));
    }
    if(!channelProfileInput.otherPlatformUrl){
        setErrorObject((prevState) => ({
            ...prevState,
            ['otherPlatformUrl']: {
              error: e.target.value? false: true,
              message: !e.target.value ? 'Please Enter Other platform url where you stream' : '',
            },
        }));
    }
    if(!channelProfileInput.location){
        setErrorObject((prevState) => ({
            ...prevState,
            ['location']: {
              error: e.target.value? false: true,
              message: !e.target.value ? 'Please Enter your location' : '',
            },
        }));
    } 
    if(channelProfileInput.channelName && channelProfileInput.description && channelProfileInput.experience && channelProfileInput.otherPlatformUrl && channelProfileInput.location) {
        setChannelDetailSubmit(true);
        setLoading(true)
        console.log('fetching');
    } else {
        setApiMessageType('error')
        setApiResponseMessage('Please enter all the details.');
        setOpen(true);
    }
  }


    return(
        <>
            <Container maxWidth="lg" sx={{position: 'relative', top: '115px'}}>
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
                            <CardHeader
                                title="Apply For Channel"
                            />
                        </Box>
                        <Divider />
                        <Box>
                            {isChannelApproved?
                                <CardContent sx={{ p: 4 }}>
                                    <Box p={10} textAlign={'center'}>
                                        <Typography sx={{ fontWeight: 800, fontSize:18}} mb={1}>
                                            Your Channel Has Been Proved
                                        </Typography>
                                        <Button onClick={()=>router.push(`/channel/${channelInfo.urlSlug}`)}>
                                            Go to channel
                                        </Button>
                                    </Box>
                                </CardContent>
                            :
                                <CardContent sx={{ p: 4 }}>
                                    {isAppliedForChannel? 
                                        <Typography sx={{textAlign: 'center', fontWeight: 800, fontSize:18}} p={10}>
                                            Your Request For Channel Submitted Successfully...!!!
                                        </Typography>
                                    :
                                        <>
                                            <Typography variant="subtitle2">
                                                <Grid container spacing={0}>
                                                    <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                                                        <Box mt={1} pr={3} pb={2}>
                                                            Channel Name:
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={12} sm={8} md={9}>
                                                        <Text color="black">
                                                            <TextField
                                                                autoFocus
                                                                margin="dense"
                                                                id="channelName"
                                                                type="text"
                                                                fullWidth
                                                                variant="standard"
                                                                name='channelName'
                                                                value={channelProfileInput.channelName}
                                                                onChange={handleFormChange}
                                                                required
                                                                error={errorObject.channelName.error}
                                                                helperText={errorObject.channelName.error?errorObject.channelName.message:null}
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
                                                                minRows={3}
                                                                type="text"
                                                                fullWidth
                                                                // variant="standard"
                                                                name='description'
                                                                value={channelProfileInput.description}
                                                                onChange={handleFormChange}
                                                                required
                                                                error={errorObject.description.error}
                                                                helperText={errorObject.description.error?errorObject.description.message:null}
                                                            />
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={4} md={3} mt={2} textAlign={{ sm: 'right' }}>
                                                        <Box mt={1} pr={3} pb={2}>
                                                            Experience:
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={12} sm={8} md={9} mt={2}>
                                                        <Typography width={250} color="black">
                                                            <FormControl fullWidth>
                                                                <InputLabel id="demo-simple-select-label">Experience</InputLabel>
                                                                <Select
                                                                    labelId="demo-simple-select-label"
                                                                    id="demo-simple-select"
                                                                    value={channelProfileInput.experience}
                                                                    label="Experience"
                                                                    name='experience'
                                                                    onChange={handleFormChange}
                                                                    required
                                                                >
                                                                    <MenuItem value={'0'}>{'Fresher/Beginner'}</MenuItem>
                                                                    <MenuItem value={1}>{'1 years'}</MenuItem>
                                                                    <MenuItem value={2}>{'2 years'}</MenuItem>
                                                                    <MenuItem value={3}>{'3 years'}</MenuItem>
                                                                    <MenuItem value={4}>{'4 years'}</MenuItem>
                                                                    <MenuItem value={5}>{'5+ years'}</MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                        </Typography>
                                                        {errorObject.experience.error? <Box sx={{color: 'red', fontWeight: 600}}>
                                                            {errorObject.experience.message}
                                                        </Box>:null}
                                                    </Grid>
                                                    <Grid item xs={12} sm={4} md={3} mt={2} textAlign={{ sm: 'right' }}>
                                                        <Box mt={1} pr={3} pb={2}>
                                                            Platform where you stream live if any:
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={12} sm={8} md={9} mt={4}>
                                                        <Typography width={250} color="black">
                                                            <TextField
                                                                autoFocus
                                                                margin="dense"
                                                                id="otherPlatformUrl"
                                                                multiline
                                                                type="text"
                                                                fullWidth
                                                                variant="standard"
                                                                name='otherPlatformUrl'
                                                                onChange={handleFormChange}
                                                                value={channelProfileInput.otherPlatformUrl}
                                                                required
                                                                error={errorObject.otherPlatformUrl.error}
                                                                helperText={errorObject.otherPlatformUrl.error?errorObject.otherPlatformUrl.message:null}
                                                            />
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={4} md={3} mt={2} textAlign={{ sm: 'right' }}>
                                                        <Box mt={1} pr={3} pb={2}>
                                                            Location:
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={12} sm={8} md={9} mt={2}>
                                                        <Typography width={250} color="black">
                                                            <TextField
                                                                autoFocus
                                                                margin="dense"
                                                                id="location"
                                                                multiline
                                                                type="text"
                                                                fullWidth
                                                                variant="standard"
                                                                name='location'
                                                                onChange={handleFormChange}
                                                                value={channelProfileInput.location}
                                                                required
                                                                error={errorObject.location.error}
                                                                helperText={errorObject.location.error?errorObject.location.message:null}
                                                            />
                                                        </Typography>
                                                    </Grid>
                                                    {/* <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                                                        <Box mt={2} pr={3} pb={2}>
                                                            Social Links:
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={12} sm={8} md={9}>
                                                        <Typography width={250} color="black">
                                                        {socialInputs.map((item)=>(
                                                            <TextField
                                                            autoFocus
                                                            margin="dense"
                                                            id={`${item.platform}`}
                                                            label={`${item.platform} url (Optional)`}
                                                            type="text"
                                                            fullWidth
                                                            variant="standard"
                                                            name={`${item.platform}`}
                                                            value={`${item.url}`}
                                                            // onChange={(e)=>handleSocialLinks(e, item.platform)}
                                                            />
                                                        ))}
                                                        </Typography>
                                                    </Grid> */}
                                                    <Grid item xs={12} sm={4} md={3} mt={5} textAlign={{ sm: 'right' }}>
                                                        <Box pr={3} pb={2}>
                                                            Channel Profile Picture:
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={12} sm={8} md={9} mt={2} sx={{paddingBottom: '20px'}}>
                                                        <Typography variant='body1' component={'div'}>
                                                            <Box>
                                                            {hideAvatarImage?
                                                                null
                                                            :
                                                                <Typography sx={{marginTop: '10px'}}>
                                                                {userUploadedImage?
                                                                    <img style={{width: '150px', height: '150px', borderRadius: '50%'}} src={userUploadedImage}/> 
                                                                :
                                                                // channelProfilePic? 
                                                                //     <img style={{width: '150px', height: '150px', borderRadius: '50%'}} src={`${process.env.NEXT_PUBLIC_S3_URL}/${channelProfilePic}`}/> 
                                                                //     : 
                                                                    <Avatar
                                                                    src={picture.croppedImg}
                                                                    sx={{ width: 150, height: 150, padding: "5" }}
                                                                    />
                                                                }
                                                                </Typography>
                                                            }
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
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Typography>
                                            <Typography sx={{textAlign: 'end'}}>
                                                {/* <Button disabled={loading}>Cancel</Button> */}
                                                <Button onClick={handleFormSubmit} disabled={loading}>{loading?'Requesting':'Apply'}</Button>
                                            </Typography>
                                        </>
                                    }
                                </CardContent>
                            }
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

export default ChannelRequest