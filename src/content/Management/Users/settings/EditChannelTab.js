import { useEffect, useState } from 'react';
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
import ProfileCover from 'src/content/Management/Users/settings/ProfileCover';
import axios from 'axios';
import {v4 as uuidv4} from 'uuid';


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


function EditChannelTab(props) {  
  const authState = useSelector(selectAuthUser)
  const [authUserDetail, setAuthUserDetail] = useState(useSelector(selectAuthUser));
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [openEmailEdit, setOpenEmailEdit] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [channelInfo, setChannelInfo]= useState({});
  const [hideAvatarImage, setHideAvatarImage] = useState(false);
  const [channelProfilePic, setChannelProfilePic] = useState(props.channelData[0].channelPicture);
  const [userSocialLinks, setUserSocialLinks] = useState(props.channelData[0].socialLinks);
  const [userSelectedProfilePic, setUserSelectedProfilePic] = useState([]);
  const [userUploadedImage, setUserUploadedImage] = useState('');
  const [channelProfileInput, setChannelProfileInput] = useState({
    channelName: props.channelData[0].channelName,
    description: props.channelData[0].description,
    location: props.channelData[0].location
  })
  const [socialInputs, setSocialInputs] = useState([]);
  const [socialInputsFormat, setSocialInputsFormat] = useState();
  const [channelDetailSubmit, setChannelDetailSubmit]= useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  

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
    if(props.channelData.length > 0){
      // setUserSocialLinks(props.channelData[0].socialLinks);
      setChannelInfo(...props.channelData);
      setUserInfo(...props.userData);

      let userSocialAccount = props.channelData[0].socialLinks;

      if(props.channelData[0].socialLinks){
        
        let socialPlatform = [{ platform: "facebook", url: "" },
        { platform: "instagram", url: "" },
        { platform: "twitter", url: "" },
        { platform: "youTube", url: "" },
        { platform: "discord", url: "" }]

        userSocialAccount.forEach((item) => {
          const index = socialPlatform.findIndex((dataItem) => dataItem.platform.toLowerCase() === item.platform.toLowerCase());
          if (index !== -1) {
            socialPlatform[index].url = item.url;
          }
        });
        
        console.log()
        setUserSocialLinks(socialPlatform);
        setSocialInputsFormat(socialPlatform);
        setSocialInputs(socialPlatform);

      }

    }

  }, [])

  useEffect(()=>{

    if(channelDetailSubmit){

      const formData = new FormData();
      // formData.append('id', channelInfo._id);
      formData.append('channelName', channelProfileInput.channelName);
      formData.append('description', channelProfileInput.description);
      formData.append('location', channelProfileInput.location);
      
      if(userSelectedProfilePic.length > 0){
        formData.append('channelProfilePicture', userSelectedProfilePic);
      }
      // formData.append('socialLinks', socialInputs);

      // socialInputs.forEach((value) => { 
      //   // formData.append('interestStyles', value); 
      //   formData.append('socialLinks', value);
      // });
      for(let i=0; i< socialInputs.length; i++){
        formData.append(`socialLinks[${i}][platform]`, socialInputs[i].platform);
        formData.append(`socialLinks[${i}][url]`, socialInputs[i].url);
      }

      axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update/channel/${channelInfo._id}`, formData, {headers: {'x-access-token': userInfo.jwtToken, 'Content-Type': 'multipart/form-data'}}).then((data)=>{
        console.log('data', data.data);
        setChannelDetailSubmit(false)
        // let userData = data.data.user
        
        setLoading(false);
        handleClose('profile');
        setChannelProfilePic(data.data.channelData.channelPicture);
        setChannelInfo(data.data.channelData)
        setUserSelectedProfilePic([])
      }).catch((error)=>{
        console.log('error', error);
        const errorMessage = error.response.data.message;
        
        setErrorMessage(errorMessage);
        setChannelDetailSubmit(false)
        setLoading(false);
      });
    }
  },[channelDetailSubmit])


  const handleClickOpen = (dialogInfo) => {

    switch(dialogInfo) {
      case 'profile':
        // code block
        setOpenEditProfile(true);
        break;
      case 'email':
        // code block
        setOpenEmailEdit(true)
        break;
    }

  };

  const handleClose = (dialogInfo) => {
    switch(dialogInfo) {
      case 'profile':
        // code block
        setOpenEditProfile(false);
        break;
      case 'email':
        // code block
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

      // croppedImageBlob.name = imageUniqueName
      // // croppedImageBlob.originalname = imageUniqueName
      // croppedImageBlob.lastModified = Date.now()
      // console.log('picture.croppedImageBlob', croppedImageBlob)
      // setUserSelectedProfilePic(croppedImageBlob);
      setUserSelectedProfilePic(newFile);

      // const croppedImageBlob = await fetch(croppedImg).then(res => res.blob());
      // console.log('picture.croppedImg', croppedImg)
      // let imageUniqueName = `${uuidv4()}.png`
      // console.log('imageUniqueName', imageUniqueName)
      // croppedImageBlob.name = imageUniqueName
      // croppedImageBlob.originalname = imageUniqueName
      // croppedImageBlob.lastModified = Date.now()
      // console.log('picture.croppedImageBlob', croppedImageBlob)
      // setUserSelectedProfilePic(croppedImageBlob);
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
    setErrorMessage('')
  }

  const handleSocialLinks = (e, platform)=>{
    // setSocialInputs([...socialInputs, {platform: e.target.name, url: e.target.value}]);
    // const platform = e.target.name;
    // const url = e.target.value;

    // // Check if the platform already exists in the socialInputs array
    // const existingInputIndex = socialInputs.findIndex((input) => input.platform === platform);

    // if (existingInputIndex !== -1) {
    //   // If the platform exists, update its URL value
    //   const updatedSocialInputs = [...socialInputs];
    //   updatedSocialInputs[existingInputIndex] = { platform, url };
    //   setSocialInputs(updatedSocialInputs);
    // } else {
    //   // If the platform doesn't exist, create a new object and add it to the array
    //   setSocialInputs([...socialInputs, { platform, url }]);
    // }
    // console.log(socialInputs);


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
    setChannelDetailSubmit(true);
    setLoading(true)
    // handleClose('profile');
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <Box
              p={3}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Typography variant="h4" gutterBottom>
                  Channel Details
                </Typography>
                <Typography variant="subtitle2">
                  Manage informations related to your channel details
                </Typography>
              </Box>
              <Button variant="text" startIcon={<EditTwoToneIcon />} onClick={()=>{handleClickOpen('profile')}}>
                Edit
              </Button>
              <Dialog open={openEditProfile} onClose={()=>{handleClose('profile')}}>
                <DialogTitle>Edit Channel information</DialogTitle>
                {errorMessage && <p style={{ color: "#f00" }}>{errorMessage}</p>}
                <DialogContent>
                  {/* <DialogContentText>
                    To subscribe to this website, please enter your email address here. We
                    will send updates occasionally.
                  </DialogContentText> */}
                  <TextField
                    autoFocus
                    margin="dense"
                    id="channelName"
                    label="Channel Name"
                    type="text"
                    fullWidth
                    variant="standard"
                    name='channelName'
                    value={channelProfileInput.channelName}
                    onChange={handleFormChange}
                    required
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    id="description"
                    label="Description"
                    type="text"
                    fullWidth
                    variant="standard"
                    name='description'
                    value={channelProfileInput.description}
                    onChange={handleFormChange}
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    id="location"
                    label="Location"
                    type="text"
                    fullWidth
                    variant="standard"
                    name='location'
                    value={channelProfileInput.location}
                    onChange={handleFormChange}
                  />

                  <Typography variant='body1' component={'div'}>
                    <Typography variant='p' component={'p'} sx={{marginTop: '15px', color: 'rgba(203, 204, 210, 0.7)'}}>Upload channel logo/picture</Typography>
                    <Box>
                      {hideAvatarImage?
                        null
                      :
                        <Typography sx={{marginTop: '10px'}}>
                          {userUploadedImage?
                            <img style={{width: '150px', height: '150px', borderRadius: '50%'}} src={userUploadedImage}/> 
                          :
                          channelProfilePic? 
                              <img style={{width: '150px', height: '150px', borderRadius: '50%'}} src={`${process.env.NEXT_PUBLIC_S3_URL}/${channelProfilePic}`}/> 
                            : 
                              <Avatar
                              src={picture.croppedImg}
                              sx={{ width: 150, height: 150, padding: "5" }}
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
                  </Typography>


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
                      onChange={(e)=>handleSocialLinks(e, item.platform)}
                    />
                  ))}
                  

                  {/* <TextField
                    autoFocus
                    margin="dense"
                    id="facebook"
                    label="Facebook url (Optional)"
                    type="text"
                    fullWidth
                    variant="standard"
                    name='facebook'
                    onChange={handleSocialLinks}
                  />

                  <TextField
                    autoFocus
                    margin="dense"
                    id="instagram"
                    label="Instagram url (Optional)"
                    type="text"
                    fullWidth
                    variant="standard"
                    name='instagram'
                    onChange={handleSocialLinks}
                  />

                  <TextField
                    autoFocus
                    margin="dense"
                    id="youtube"
                    label="Youtube url (Optional)"
                    type="text"
                    fullWidth
                    variant="standard"
                    name='youtube'
                    onChange={handleSocialLinks}
                  />

                  <TextField
                    autoFocus
                    margin="dense"
                    id="twitter"
                    label="Twitter url (Optional)"
                    type="text"
                    fullWidth
                    variant="standard"
                    name='twitter'
                    onChange={handleSocialLinks}
                  />

                  <TextField
                    autoFocus
                    margin="dense"
                    id="discord"
                    label="Discord url (Optional)"
                    type="text"
                    fullWidth
                    variant="standard"
                    name='discord'
                    onChange={handleSocialLinks}
                  /> */}


                  {/* <FormControl sx={{ m: 1, width: 300 }}>
                    <InputLabel id="demo-multiple-checkbox-label">Select Tattoo Interested Style</InputLabel>
                    <Select
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      multiple
                      value={userTattooInterest}
                      onChange={handleChange}
                      input={<OutlinedInput label="Tag" />}
                      // renderValue={(selected) => selected.join(', ')}
                      renderValue={(selected) => selected.join(', ')}
                      MenuProps={MenuProps}
                    >
                      {tattooCategoryList.length > 0?
                      
                        tattooCategoryList.map((tattooCategory) => (
                          <MenuItem key={tattooCategory._id} value={tattooCategory.title}>
                            
                            <Checkbox checked={
                                userTattooInterest.find(item => item === tattooCategory.title) ? true : false
                              }/>
                            <ListItemText primary={tattooCategory.title} />
                          </MenuItem>
                        )): null
                      }
                    </Select>
                  </FormControl> */}
                  
                </DialogContent>
                <DialogActions>
                  <Button onClick={()=>{handleClose('profile')}}>Cancel</Button>
                  <Button onClick={handleFormSubmit} disabled={loading}>{loading ? 'Updating...' : 'Update'}</Button>
                </DialogActions>
              </Dialog>
            </Box>
            <Divider />
            <CardContent sx={{ p: 4 }}>
              <ProfileCover channelInfo={channelInfo} />
              <Typography variant="subtitle2" sx={{marginTop: '30px'}}>
                <Grid container spacing={0}>
                  {/* <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                    <Box pr={3} pb={2}>
                      Profile Picture:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9} sx={{paddingBottom: '20px'}}>
                    {channelProfilePic? 
                      <img style={{width: '150px', height: '150px', borderRadius: '50%'}} src={`${process.env.NEXT_PUBLIC_S3_URL}/${channelProfilePic}`}/> 
                      : <Avatar
                        src={picture.croppedImg}
                        sx={{ width: 150, height: 150, padding: "5" }}
                      />
                    }
                  </Grid> */}
                  <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                    <Box pr={3} pb={2}>
                      Channel Name:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    <Text color="black">
                      {/* <b> {authState && `${authState.firstName} ${authState.lastName}`}</b> */}
                      <b> {channelInfo && `${channelInfo.channelName}`}</b>
                    </Text>
                  </Grid>
                  <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                    <Box pr={3} pb={2}>
                      Description:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    <Text color="black">
                      {Object.keys(channelInfo).length != 0?
                          <b>{channelInfo.description} </b>
                        :
                        <b>Channel description not found</b>
                      }
                    </Text>
                  </Grid>
                  <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                    <Box pr={3} pb={2}>
                      Location:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    <Box sx={{ maxWidth: { xs: 'auto', sm: 300 } }}>
                      <Text color="black">
                        {channelInfo.location}
                      </Text>
                    </Box>
                  </Grid>
                  {channelInfo.socialLinks ? 
                    <>
                      {channelInfo.socialLinks.map((item)=>(
                        <>
                          <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                            <Box pr={3} pb={2}>
                              {item.platform}:
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={8} md={9}>
                            <Box sx={{ maxWidth: { xs: 'auto', sm: 300 } }}>
                              <Text color="black">
                                {`${item.url}`}
                              </Text>
                            </Box>
                          </Grid>
                        </>
                        ))
                      }
                    </>
                  : null}
                </Grid>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* <Grid item xs={12}>
          <Card>
            <Box
              p={3}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Typography variant="h4" gutterBottom>
                  Email Addresses
                </Typography>
                <Typography variant="subtitle2">
                  Manage details related to your associated email addresses
                </Typography>
              </Box>
              <Button variant="text" startIcon={<EditTwoToneIcon />} onClick={()=>{handleClickOpen('email')}}>
                Edit
              </Button>
              <Dialog open={openEmailEdit} onClose={()=>{handleClose('email')}}>
                <DialogTitle>Update email</DialogTitle>
                <DialogContent> */}
                  {/* <DialogContentText>
                    To subscribe to this website, please enter your email address here. We
                    will send updates occasionally.
                  </DialogContentText> */}
                  {/* <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Email Address"
                    type="email"
                    fullWidth
                    variant="standard"
                    name='email'
                    onChange={handleEmailChange}
                    value={userNewEmail}
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  />
                  {errorMessage && <p style={{ color: "#f00" }}>{errorMessage}</p>}
                </DialogContent>
                <DialogActions>
                  <Button onClick={()=>{handleClose('email')}}>Cancel</Button>
                  <Button onClick={handleEmailSubmit} disabled={loading}>{loading ? 'Updating...' : 'Update'}</Button>
                </DialogActions>
              </Dialog>
            </Box>
            <Divider />
            <CardContent sx={{ p: 4 }}>
              <Typography variant="subtitle2">
                <Grid container spacing={0}>
                  <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                    <Box pr={3} pb={2}>
                      Email ID:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    <Text color="black">
                      {userEmail? 
                        <b>{userEmail}</b>
                      :
                        <b>No email found</b>
                      }
                    </Text>
                    <Box pl={1} component="span">
                      <Label color="success">Primary</Label>
                    </Box>
                  </Grid>     
                </Grid>
              </Typography>
            </CardContent>
          </Card>
        </Grid> */}
        {/* <Grid item xs={12}>
          <Card>
            <Box
              p={3}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Typography variant="h4" gutterBottom>
                  Account Settings
                </Typography>
                <Typography variant="subtitle2">
                  Manage details related to your account
                </Typography>
              </Box>
              <Button variant="text" startIcon={<EditTwoToneIcon />}>
                Edit
              </Button>
            </Box>
            <Divider />
            <CardContent sx={{ p: 4 }}>
              <Typography variant="subtitle2">
                <Grid container spacing={0}>
                  <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                    <Box pr={3} pb={2}>
                      Language:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    <Text color="black">
                      <b>English (US)</b>
                    </Text>
                  </Grid>
                  <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                    <Box pr={3} pb={2}>
                      Timezone:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    <Text color="black">
                      <b>GMT +2</b>
                    </Text>
                  </Grid>
                  <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                    <Box pr={3} pb={2}>
                      Account status:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    <Label color="success">
                      <DoneTwoToneIcon fontSize="small" />
                      <b>Active</b>
                    </Label>
                  </Grid>
                </Grid>
              </Typography>
            </CardContent>
          </Card>
        </Grid> */}
      </Grid>
    </>
  );
}

export default EditChannelTab;
