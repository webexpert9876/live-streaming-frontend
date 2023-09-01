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
import MultiSelectComponent from './MultiSelectComponent';
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


function EditProfileTab(props) {  
  const authState = useSelector(selectAuthUser)
  const [authUserDetail, setAuthUserDetail] = useState(useSelector(selectAuthUser));
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [openEmailEdit, setOpenEmailEdit] = useState(false);
  const [userTattooInterest, setUserTattooInterest] = useState([])
  // const [userInfo, setUserInfo] = useState(userData);
  const [userInfo, setUserInfo]= useState({});
  // console.log('props.tattooCategoryList', props.tattooCategoryList)
  const [tattooCategoryList, setTattooCategoryList]= useState([]);
  const [tattooCategoryMenuList, setTattooCategoryMenuList]= useState([]);
  // console.log('props.tattooCategoryList 2', tattooCategoryList)
  const [hideAvatarImage, setHideAvatarImage] = useState(false);
  const [userProfilePic, setUserProfilePic] = useState(props.userData[0].profilePicture);
  const [userSelectedProfilePic, setUserSelectedProfilePic] = useState([]);
  const [userUploadedImage, setUserUploadedImage] = useState('');
  const [userSelectedStyle, setUserSelectedStyle]= useState([]);
  const [userEditedStyle, setUserEditedStyle]= useState([]);
  const [userProfileInput, setUserProfileInput] = useState({
    firstName: props.userData[0].firstName,
    lastName: props.userData[0].lastName
  })
  const [profileSubmit, setProfileSubmit]= useState(false);

  // Email state management
  const [userEmail, setUserEmail] = useState(props.userData[0].email);
  const [userNewEmail, setUserNewEmail] = useState(props.userData[0].email);
  const [userNewEmailSubmitted, setUserNewEmailSubmitted] = useState(false);
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
    // console.log('authUserDetail', authUserDetail);
    // console.log('authState', authState);
    // if(userInfo.length == 0){
    //   setUserInfo(authState);
    // }
    // if(userInfo.length != 0 ){
    //   client.query({
    //     variables: {
    //         usersId: authState._id,
    //     },
    //     query: gql`
    //         query Query($usersId: ID) {
    //             users(id: $usersId) {
    //               _id
    //               firstName
    //               lastName
    //               username
    //               email
    //               password
    //               profilePicture
    //               urlSlug
    //               interestedStyleDetail {
    //                 title
    //                 _id
    //               }
    //             }
    //         }
    //     `,
    //   }).then((result) => {
    //       console.log('result', result.data.users)

          console.log('props.userData', props)
          // User already selected tattoo category list
          if(props.userData.length > 0){

            console.log('props.userData', props)
            let interestedStyleList = props.userData[0].interestedStyleDetail
            console.log('interestedStyleList', interestedStyleList)
            
            let selectedStyle = []; 
            for(let interestedStyle of interestedStyleList){
              selectedStyle.push(interestedStyle.title);
            }
            setUserSelectedStyle([...selectedStyle])
            setUserInfo(...props.userData);
          }

          if(props.tattooCategoryList.length > 0){

            // Tattoo category list came from parent component
            let tattooList = [...props.tattooCategoryList]
            setTattooCategoryList(tattooList)
  
  
            // Tattoo Category list for multiple select dropdown
            let tattooCategoryMenu = [];
            for(let tattoo of tattooList){
              tattooCategoryMenu.push(tattoo.title)
            }
            setTattooCategoryMenuList(tattooCategoryMenu);
          }

      // });
    // }
  // }, [userInfo])
  }, [])

  // console.log('userTattooInterest', userTattooInterest);

  // useEffect(()=>{
  //   function getTattooCategoryList(){
  //     client.query({
  //       query: gql`
  //           query Query {
  //               tattooCategories {
  //                 title
  //                 _id
  //               }
  //           }
  //       `,
  //     }).then((result) => {
  //         console.log('result tattoo', result.data)
  //         setTattooCategoryList(...result.data.tattooCategories);
  //     });
  //   }
  //   getTattooCategoryList();
  // },[])

  useEffect(()=>{
    console.log('userSelectedStyle in use effect', userSelectedStyle)
    setUserEditedStyle(userSelectedStyle);
  }, [userSelectedStyle]);
  useEffect(()=>{
    console.log('userSelectedProfilePic ', userSelectedProfilePic)
  }, [userSelectedProfilePic]);

  useEffect(()=>{

    if(profileSubmit){

      console.log('userProfileInput', userProfileInput)
      console.log('userSelectedStyle userTattooInterest', userTattooInterest)
      console.log('userUploadedImage', userSelectedProfilePic);
      console.log('userInfo', userInfo);

      const tattooCategoryObj = tattooCategoryList.filter(obj => userSelectedStyle.includes(obj.title));
      console.log('foundObjects tattooCategoryObj', tattooCategoryObj)

      let selectedTitle = [];
      for(let selectedTattoo of tattooCategoryObj) {
        selectedTitle.push(selectedTattoo._id)
      }

      console.log('foundObjects selectedTitle', selectedTitle)

      // setUserTattooInterest(selectedTitle)

      const formData = new FormData();
      formData.append('id', userInfo._id);
      formData.append('firstName', userProfileInput.firstName);
      formData.append('lastName', userProfileInput.lastName);      
      console.log('userSelectedProfilePic', userSelectedProfilePic)
      formData.append('file', userSelectedProfilePic);
      // formData.append('interestStyles', selectedTitle);

      selectedTitle.forEach((value) => { 
        formData.append('interestStyles', value); 
      });

      console.log('formData', formData);

      axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update/user`, formData, {headers: {'x-access-token': userInfo.jwtToken, 'Content-Type': 'multipart/form-data'}}).then((data)=>{
        console.log('data', data.data.user);
        setProfileSubmit(false)
        let userData = data.data.user
        userData.interestedStyleDetail = []
        userSelectedStyle.forEach(element => {
          userData.interestedStyleDetail.push({title: element})
          setLoading(false);
          handleClose('profile');
        });
        setUserInfo(userData);
        setUserProfilePic(data.data.user.profilePicture)
      }).catch((err)=>{
        console.log('err', err);
        setProfileSubmit(false)
        setLoading(false);
      });
    }
  },[profileSubmit])
  
  useEffect(()=>{

    if(userNewEmailSubmitted){

      console.log('userProfileInput', userProfileInput)

      const formData = new FormData();
      formData.append('id', userInfo._id);
      formData.append('email', userNewEmail);
      
      axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update/user`, formData, {headers: {'x-access-token': userInfo.jwtToken}}).then((data)=>{
        console.log('data', data.data.user);

        setUserEmail(data.data.user.email);
        setUserNewEmailSubmitted(false);
        setLoading(false);
        handleClose('email')
      }).catch((error)=>{
        console.log('error', error);
        const errorMessage = error.response.data.message;
        
        if('Validation failed: email: Please Enter a valid Email' == errorMessage){
          setErrorMessage('Please Enter a valid Email');
        } else {
          setErrorMessage(errorMessage);
        }

        setLoading(false);
        setUserNewEmailSubmitted(false)
      });
    }
  },[userNewEmailSubmitted])

  const handleChange = (event, value) => {
    // const {
    //   target: { value },
    // } = event;
    
    // const tattooCategoryObj = tattooCategoryList.filter(obj => value.includes(obj.title));
    // console.log('foundObjects tattooCategoryObj', tattooCategoryObj)

    // let selectedTitle = [];
    // for(let selectedTattoo of tattooCategoryObj) {
    //   selectedTitle.push(selectedTattoo._id)
    // }
    // setUserSelectedStyle([...selectedTitle]);

    // console.log('selectedValues', userSelectedStyle)

    // setUserTattooInterest(
    //   typeof value === 'string' ? value.split(',') : value,
    // );
    setUserSelectedStyle(value)
  };

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

      
      console.log('picture.croppedImg', croppedImg)
      let imageUniqueName = `${uuidv4()}.png`
      console.log('imageUniqueName', imageUniqueName)
      
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
    console.log('e.target.files', e.target.files)
    let url = URL.createObjectURL(e.target.files[0]);
    // console.log('picture.croppedImg', picture.croppedImg)
    // setUserUploadedImage(url);
    console.log(url);
    setPicture({
      ...picture,
      img: url,
      cropperOpen: true
    });
  };

  const handleFormChange = (e)=>{
    setUserProfileInput((prevState)=>({
      ...prevState,
      [e.target.name]: e.target.value
    }))
    setErrorMessage('')
  }
  
  const handleEmailChange = (e)=>{
    setUserNewEmail(e.target.value);
    setErrorMessage('')
  }
  
  const handleEmailSubmit = ()=>{
    setUserNewEmailSubmitted(true);
    setLoading(true)
    // handleClose('email');
  }

  const handleFormSubmit = (e)=>{
    e.preventDefault();
    setProfileSubmit(true);
    setLoading(true)
    // handleClose('profile');
  }

  return (
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
                Personal Details
              </Typography>
              <Typography variant="subtitle2">
                Manage informations related to your personal details
              </Typography>
            </Box>
            <Button variant="text" startIcon={<EditTwoToneIcon />} onClick={()=>{handleClickOpen('profile')}}>
              Edit
            </Button>
            <Dialog open={openEditProfile} onClose={()=>{handleClose('profile')}}>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogContent>
                {/* <DialogContentText>
                  To subscribe to this website, please enter your email address here. We
                  will send updates occasionally.
                </DialogContentText> */}
                <TextField
                  autoFocus
                  margin="dense"
                  id="fname"
                  label="First Name"
                  type="text"
                  fullWidth
                  variant="standard"
                  name='firstName'
                  value={userProfileInput.firstName}
                  onChange={handleFormChange}
                />
                <TextField
                  autoFocus
                  margin="dense"
                  id="lname"
                  label="last Name"
                  type="text"
                  fullWidth
                  variant="standard"
                  name='lastName'
                  value={userProfileInput.lastName}
                  onChange={handleFormChange}
                />

                <Typography variant='body1' component={'div'}>
                  <Typography variant='p' component={'p'} sx={{marginTop: '15px', color: 'rgba(203, 204, 210, 0.7)'}}>Upload profile picture</Typography>
                  <Box>
                    {hideAvatarImage?
                      null
                    :
                      <Typography sx={{marginTop: '10px'}}>
                        {userUploadedImage?
                          <img style={{width: '150px', height: '150px', borderRadius: '50%'}} src={userUploadedImage}/> 
                        :
                          userProfilePic? 
                            <img style={{width: '150px', height: '150px', borderRadius: '50%'}} src={`${process.env.NEXT_PUBLIC_S3_URL}/${userProfilePic}`}/> 
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
                <Typography sx={{marginTop: '30px'}}>
                  <MultiSelectComponent
                    getOptionLabel={(options) => options}
                    label="Select your tattoo category"
                    value={userSelectedStyle}
                    options={tattooCategoryMenuList}
                    onChange={handleChange}
                    limitTags={3} // limits number of chip to render while out of focus, useful for responsiveness
                    getLimitTagsText={(count) => `+${count}📦`} // modify the limit tag text, useful for translation too
                    // filterOptions={}
                  />
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={()=>{handleClose('profile')}}>Cancel</Button>
                <Button onClick={handleFormSubmit} disabled={loading}>{loading ? 'Updating...' : 'Update'}</Button>
              </DialogActions>
            </Dialog>
          </Box>
          <Divider />
          <CardContent sx={{ p: 4 }}>
            <Typography variant="subtitle2">
              <Grid container spacing={0}>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    Profile Picture:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9} sx={{paddingBottom: '20px'}}>
                  {/* <Text color="black">
                    <b> {authState && `${authState.firstName} ${authState.lastName}`}</b>
                  </Text> */}
                  {/* {authState.profilePicture?<img src={`${process.env.NEXT_PUBLIC_S3_URL}/${authState.profilePicture}`}></img>: <img src={`https://picsum.photos/seed/picsum/200/300`}></img>} */}
                  {/* {userProfilePic?<img  src={`${process.env.NEXT_PUBLIC_S3_URL}/${userProfilePic}`}></img>: <img src={`https://picsum.photos/seed/picsum/200/300`}></img>} */}
                  {userProfilePic? 
                    <img style={{width: '150px', height: '150px', borderRadius: '50%'}} src={`${process.env.NEXT_PUBLIC_S3_URL}/${userProfilePic}`}/> 
                    : <Avatar
                      src={picture.croppedImg}
                      sx={{ width: 150, height: 150, padding: "5" }}
                    />
                  }
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    Full Name:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Text color="black">
                    {/* <b> {authState && `${authState.firstName} ${authState.lastName}`}</b> */}
                    <b> {userInfo && `${userInfo.firstName} ${userInfo.lastName}`}</b>
                  </Text>
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    Interested Styles:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Text color="black">
                    {Object.keys(userInfo).length != 0?
                      (
                        userInfo.interestedStyleDetail?
                          userInfo.interestedStyleDetail.map((style)=>(
                            <b>{style.title}, </b>
                          ))
                          : 
                          <b>No interested style found</b>
                      )
                      :
                       <b>No user data found</b>
                    }
                  </Text>
                </Grid>
                {/* <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    Style:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Box sx={{ maxWidth: { xs: 'auto', sm: 300 } }}>
                    <Text color="black">
                      style code
                    </Text>
                  </Box>
                </Grid> */}
              </Grid>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
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
              <DialogContent>
                {/* <DialogContentText>
                  To subscribe to this website, please enter your email address here. We
                  will send updates occasionally.
                </DialogContentText> */}
                <TextField
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
  );
}

export default EditProfileTab;
