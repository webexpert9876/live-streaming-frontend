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

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

function EditProfileTab({userData}) {  
  const authState = useSelector(selectAuthUser)
  const [authUserDetail, setAuthUserDetail] = useState(useSelector(selectAuthUser));
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [openEmailEdit, setOpenEmailEdit] = useState(false);
  const [userTattooInterest, setUserTattooInterest] = useState([]);
  // const [userInfo, setUserInfo] = useState(userData);
  const [userInfo, setUserInfo]= useState({});
  const [tattooCategoryList, setTattooCategoryList]= useState([]);
  const [hideAvatarImage, setHideAvatarImage] = useState(false);
  var editor = "";
  const [picture, setPicture] = useState({
    cropperOpen: false,
    img: null,
    zoom: 2,
    croppedImg:
      "https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png"
  });

  console.log('userInfo userInfo', userInfo);

  useEffect(()=>{
    console.log('authUserDetail', authUserDetail);
    console.log('authState', authState);
    if(userInfo.length == 0){
      setUserInfo(authState);
    }
    if(userInfo.length != 0 ){
      client.query({
        variables: {
            usersId: authState._id,
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
                  interestedStyleDetail {
                    title
                    _id
                  }
                }
                tattooCategories {
                  title
                  _id
                }
            }
        `,
      }).then((result) => {
          console.log('result', result.data.users)
          // setOldReceivedMessages(result.data.chatMessages)
          setUserInfo(...result.data.users);
          setTattooCategoryList(...result.data.tattooCategories);
      });
    }
  }, [userInfo])

  useEffect(()=>{
    function getTattooCategoryList(){
      client.query({
        query: gql`
            query Query {
                tattooCategories {
                  title
                  _id
                }
            }
        `,
      }).then((result) => {
          console.log('result tattoo', result.data)
          setTattooCategoryList(...result.data.tattooCategories);
      });
    }
    getTattooCategoryList();
  },[])

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setUserTattooInterest(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleClickOpen = (dialogInfo) => {
    
    // if(dialogInfo == 'profile'){
    //   setOpenEditProfile(true);
    // } else if()

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
  };

  const setEditorRef = (ed) => {
    editor = ed;
  };

  const handleSave = (e) => {
    if (setEditorRef) {
      const canvasScaled = editor.getImageScaledToCanvas();
      const croppedImg = canvasScaled.toDataURL();

      setPicture({
        ...picture,
        img: null,
        cropperOpen: false,
        croppedImg: croppedImg
      });
      setHideAvatarImage(true);
    }
  };

  const handleFileChange = (e) => {
    setHideAvatarImage(false);
    console.log('e.target.files', e.target.files)
    let url = URL.createObjectURL(e.target.files[0]);
    console.log(url);
    setPicture({
      ...picture,
      img: url,
      cropperOpen: true
    });
  };

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
                />
                <TextField
                  autoFocus
                  margin="dense"
                  id="lname"
                  label="last Name"
                  type="text"
                  fullWidth
                  variant="standard"
                />
                {/* <FormControl sx={{ m: 1, width: 300 }}>
                  <InputLabel id="demo-multiple-checkbox-label">Select Tattoo Interested Style</InputLabel>
                  <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={userTattooInterest}
                    onChange={handleChange}
                    input={<OutlinedInput label="Tag" />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                  >
                    {tattooCategoryList.length > 0?
                      tattooCategoryList.map((tattooCategory) => (
                        <MenuItem key={tattooCategory._id} value={tattooCategory._id}>
                          <Checkbox checked={userTattooInterest.indexOf(tattooCategory) > -1} />
                          <ListItemText primary={tattooCategory._id} />
                        </MenuItem>
                      )): null
                    }
                  </Select>
                </FormControl> */}
                {hideAvatarImage?<Avatar
                  src={picture.croppedImg}
                  style={{ width: "100%", height: "auto", padding: "5" }}
                />: null}
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
                      <Button onClick={handleSave}>Save</Button>
                    </Box>
                  </Box>
                )}
                <Button
                  variant="contained"
                  width="100%"
                  sx={{marginTop: '20px', padding: '10px 0px 10px 20px'}}
                >
                  <input type="file" accept="image/*" onChange={handleFileChange} />
                </Button>
              </DialogContent>
              <DialogActions>
                <Button onClick={()=>{handleClose('profile')}}>Cancel</Button>
                <Button onClick={()=>{handleClose('profile')}}>Update</Button>
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
                <Grid item xs={12} sm={8} md={9}>
                  {/* <Text color="black">
                    <b> {authState && `${authState.firstName} ${authState.lastName}`}</b>
                  </Text> */}
                  {authState.profilePicture?<img src={`${process.env.NEXT_PUBLIC_S3_URL}/${authState.profilePicture}`}></img>: <img src={`https://picsum.photos/seed/picsum/200/300`}></img>}
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    Full Name:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Text color="black">
                    <b> {authState && `${authState.firstName} ${authState.lastName}`}</b>
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
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={()=>{handleClose('email')}}>Cancel</Button>
                <Button onClick={()=>{handleClose('email')}}>Update</Button>
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
                    <b>{authState && authState.email}</b>
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
