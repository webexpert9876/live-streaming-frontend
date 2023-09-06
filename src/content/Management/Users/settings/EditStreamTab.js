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
  NativeSelect,
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


function EditStreamTab({ streamData, isStreamFound, tattooCategoriesData, tagData }) {  
  const authState = useSelector(selectAuthUser)
  const [authUserDetail, setAuthUserDetail] = useState(useSelector(selectAuthUser));
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [openEmailEdit, setOpenEmailEdit] = useState(false);
  const [userTattooInterest, setUserTattooInterest] = useState([])
  // const [userInfo, setUserInfo] = useState(userData);
  const [userInfo, setUserInfo]= useState({});
  const [streamInfo, setStreamInfo]= useState(isStreamFound? streamData[0]: {});
  console.log('props.tattooCategoryList', tattooCategoriesData)
  console.log('props.streamData', streamData)
  const [tattooCategoryList, setTattooCategoryList]= useState([]);
  const [tattooCategoryMenuList, setTattooCategoryMenuList]= useState([]);
  // console.log('props.tattooCategoryList 2', tattooCategoryList)
  const [hideAvatarImage, setHideAvatarImage] = useState(false);
  const [userProfilePic, setUserProfilePic] = useState(isStreamFound? streamData[0].streamPreviewImage: '');
  const [userSelectedProfilePic, setUserSelectedProfilePic] = useState([]);
  const [userUploadedImage, setUserUploadedImage] = useState('');
  const [userSelectedStyle, setUserSelectedStyle]= useState([]);
  const [userEditedStyle, setUserEditedStyle]= useState([]);
  const [streamInput, setStreamInput] = useState({
    title: streamData[0].title,
    description: streamData[0].description,
    streamCategory: streamData[0].streamCategory
  })
  const [profileSubmit, setProfileSubmit]= useState(false);

  // // stream state management
  const [oldStreamKey, setOldStreamKey] = useState(isStreamFound? streamData[0].streamKey: '');
  const [isRegenerateKey, setIsRegenerateKey] = useState(false);
  const [userNewEmailSubmitted, setUserNewEmailSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  
  const [tags, setTags] = useState([]);
  const [suggestions, setSuggestions] = useState([]);


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

          // console.log('props.userData', props)
          // User already selected tattoo category list
          // if(props.userData.length > 0){

          //   let interestedStyleList = props.userData[0].interestedStyleDetail
            
          //   let selectedStyle = []; 
          //   for(let interestedStyle of interestedStyleList){
          //     selectedStyle.push(interestedStyle.title);
          //   }
          //   setUserSelectedStyle([...selectedStyle])
          //   setUserInfo(...props.userData);
          // }

          if(tattooCategoriesData.length > 0){

            // Tattoo category list came from parent component
            let tattooList = [tattooCategoriesData]
            setTattooCategoryList(tattooList)

          }

          if(tagData.length > 0){
            let tagList = tagData.map(tag => {
              return {
                id: tag._id,
                text: tag.name
              };
            });
            console.log('tagList', tagList)
            
            const matchingTags = tagData.filter(tagObj => streamData[0].tags.includes(tagObj.name));

            // Use the map method to extract the id and name fields of matching tags
            const matchingTagIdsAndNames = matchingTags.map(tagObj => ({
              id: tagObj._id,
              text: tagObj.name,
            }));

            console.log('oldSelectedTagInfo', matchingTagIdsAndNames)
            setTags(matchingTagIdsAndNames);
            setSuggestions(tagList);

          }

      // });
    // }
  // }, [userInfo])
  }, [])


  useEffect(()=>{
    setUserEditedStyle(userSelectedStyle);
  }, [userSelectedStyle]);

  useEffect(()=>{

    if(profileSubmit){

      const tattooCategoryObj = tattooCategoryList.filter(obj => userSelectedStyle.includes(obj.title));

      let selectedTitle = [];
      for(let selectedTattoo of tattooCategoryObj) {
        selectedTitle.push(selectedTattoo._id)
      }

      // setUserTattooInterest(selectedTitle)

      const formData = new FormData();
      formData.append('id', userInfo._id);
      formData.append('firstName', streamInput.firstName);
      formData.append('lastName', streamInput.lastName);
      formData.append('file', userSelectedProfilePic);
      // formData.append('interestStyles', selectedTitle);

      selectedTitle.forEach((value) => { 
        formData.append('interestStyles', value); 
      });

      axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update/user`, formData, {headers: {'x-access-token': userInfo.jwtToken, 'Content-Type': 'multipart/form-data'}}).then((data)=>{
        // console.log('data', data.data.user);
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
      }).catch((error)=>{
        console.log('error', error);
        const errorMessage = error.response.data.message;
        
        setErrorMessage(errorMessage);
        setProfileSubmit(false)
        setLoading(false);
      });
    }
  },[profileSubmit])
  
  useEffect(()=>{

    if(isRegenerateKey){
      
      axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update/user`, formData, {headers: {'x-access-token': userInfo.jwtToken}}).then((data)=>{
        // console.log('data', data.data.user);

        setUserEmail(data.data);
        setUserNewEmailSubmitted(false);
        setLoading(false);
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
  },[isRegenerateKey])

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

      let imageUniqueName = `${uuidv4()}.png`
      
      let newFile = new File([croppedImageBlob], imageUniqueName, { type: 'image/png' });

      setUserSelectedProfilePic(newFile);
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
    setStreamInput((prevState)=>({
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
                Stream Details
              </Typography>
              <Typography variant="subtitle2">
                Manage informations related to your Stream details
              </Typography>
            </Box>
            <Button variant="text" startIcon={<EditTwoToneIcon />} onClick={()=>{handleClickOpen('profile')}}>
              Edit
            </Button>
            <Dialog open={openEditProfile} onClose={()=>{handleClose('profile')}}>
              <DialogTitle>Edit streams</DialogTitle>
              {errorMessage && <p style={{ color: "#f00" }}>{errorMessage}</p>}
              <DialogContent>
                {/* <DialogContentText>
                  To subscribe to this website, please enter your email address here. We
                  will send updates occasionally.
                </DialogContentText> */}
                <TextField
                  autoFocus
                  margin="dense"
                  id="title"
                  label="Stream title"
                  type="text"
                  fullWidth
                  variant="standard"
                  name='title'
                  value={streamInput.title}
                  onChange={handleFormChange}
                  required
                />
                <TextField
                  autoFocus
                  margin="dense"
                  id="description"
                  label="Stream description"
                  type="text"
                  fullWidth
                  variant="standard"
                  name='description'
                  value={streamInput.description}
                  onChange={handleFormChange}
                  required
                />
                {/* <TextField
                  autoFocus
                  margin="dense"
                  id="category"
                  label="Stream tattoo category"
                  type="text"
                  fullWidth
                  variant="standard"
                  name='category'
                  value={streamInput.streamCategory}
                  onChange={handleFormChange}
                  required
                /> */}

                <Typography mt={2}>
                  <FormControl fullWidth>
                    <InputLabel variant="standard" htmlFor="uncontrolled-native">
                      Select Stream Tattoo Category
                    </InputLabel>
                    <NativeSelect
                      defaultValue={30}
                      inputProps={{
                        name: 'category',
                        id: 'uncontrolled-native',
                      }}
                      >
                      {tattooCategoryList.map((category)=>{
                        <option value={category._id}>{category.title}</option>
                      })}
                    {/* <option value={10}>te</option> */}
                    </NativeSelect>
                  </FormControl>
                </Typography>

                <Typography variant='body1' component={'div'}>
                  <Typography variant='p' component={'p'} sx={{marginTop: '15px', color: 'rgba(203, 204, 210, 0.7)'}}>Upload Stream Preview Image</Typography>
                  <Box>
                    {hideAvatarImage?
                      null
                    :
                      <Typography sx={{marginTop: '10px'}}>
                        {userUploadedImage?
                          <img style={{width: '150px', height: '150px'}} src={userUploadedImage}/> 
                        :
                          userProfilePic? 
                            <img style={{width: '150px', height: '150px'}} src={`${process.env.NEXT_PUBLIC_S3_URL}/${userProfilePic}`}/> 
                          : 
                            <Avatar
                            variant='rounded'
                            src={picture.croppedImg}
                            sx={{ width: 300, height: 300, padding: "5" }}
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
                        defaultValue={30}
                        inputProps={{
                          name: 'category',
                          id: 'uncontrolled-native',
                        }}
                        >
                          {tattooCategoriesData.map((category)=>(
                            <option value={category._id}>{category.title}</option>
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
                    {/* {Object.keys(userInfo).length != 0?
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
                    } */}
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
                Stream key
              </Typography>
              <Typography variant="subtitle2">
                Manage your stream key ( Do not share stream key with any one )
              </Typography>
            </Box>
            {/* <Button variant="text" startIcon={<EditTwoToneIcon />} onClick={()=>{handleClickOpen('email')}}>
              Edit
            </Button> */}
            <Dialog open={openEmailEdit} onClose={()=>{handleClose('email')}}>
              <DialogTitle>Regenerate stream key</DialogTitle>
              <DialogContent>
                {/* <DialogContentText>
                  To subscribe to this website, please enter your email address here. We
                  will send updates occasionally.
                </DialogContentText> */}
                <TextField
                  autoFocus
                  margin="dense"
                  id="stream-key"
                  label="Stream key"
                  type="text"
                  fullWidth
                  variant="standard"
                  name='key'
                  onChange={handleEmailChange}
                  // value={userNewEmail}
                />
                {errorMessage && <p style={{ color: "#f00" }}>{errorMessage}</p>}
              </DialogContent>
              <DialogActions>
                <Button onClick={()=>{handleClose('email')}}>Cancel</Button>
                <Button onClick={handleEmailSubmit} disabled={loading}>{loading ? 'Regenerating key...' : 'Regenerate key'}</Button>
              </DialogActions>
            </Dialog>
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
                      // <TextField
                      //   autoFocus
                      //   margin="dense"
                      //   id="stream-key"
                      //   type="text"
                      //   fullWidth
                      //   variant="standard"
                      //   name='key'
                      //   // onChange={(e)=>setNewStreamKey(e.target.value)}
                      //   value={oldStreamKey}
                      // />
                    :
                      <b>No stream key found</b>
                    }
                  </Text>
                  <Box pl={3} component="span">
                    {/* <Label color="success">Primary</Label> */}
                    <Button variant="text" onClick={()=>{setIsRegenerateKey(true)}}>
                      Regenerate key
                    </Button>
                  </Box>
                </Grid>     
              </Grid>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
    </Grid>
);
}

export default EditStreamTab;
