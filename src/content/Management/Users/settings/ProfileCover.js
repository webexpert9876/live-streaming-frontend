import PropTypes from 'prop-types';
import { useState, useEffect, forwardRef } from 'react';
import {
  Box,
  Typography,
  Card,
  Tooltip,
  Avatar,
  CardMedia,
  Button,
  IconButton,
  CardContent,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slider
} from '@mui/material';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';

import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import ArrowForwardTwoToneIcon from '@mui/icons-material/ArrowForwardTwoTone';
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
import MoreHorizTwoToneIcon from '@mui/icons-material/MoreHorizTwoTone';
import AvatarEditor from 'react-avatar-editor'
import {v4 as uuidv4} from 'uuid';
import axios from 'axios';

const Input = styled('input')({
  display: 'none'
});

const AvatarWrapper = styled(Card)(
  ({ theme }) => `

    position: relative;
    overflow: visible;
    display: inline-block;
    margin-top: -${theme.spacing(9)};
    margin-left: ${theme.spacing(2)};
    border-radius: 49%;

    .MuiAvatar-root {
      width: ${theme.spacing(16)};
      height: ${theme.spacing(16)};
      border-radius: 50%;
    }
`
);

const ButtonUploadWrapper = styled(Box)(
  ({ theme }) => `
    position: absolute;
    width: ${theme.spacing(4)};
    height: ${theme.spacing(4)};
    bottom: -${theme.spacing(1)};
    right: -${theme.spacing(1)};

    .MuiIconButton-root {
      border-radius: 100%;
      background: ${theme.colors.primary.main};
      color: ${theme.palette.primary.contrastText};
      box-shadow: ${theme.colors.shadows.primary};
      width: ${theme.spacing(4)};
      height: ${theme.spacing(4)};
      padding: 0;
  
      &:hover {
        background: ${theme.colors.primary.dark};
      }
    }
`
);

const CardCover = styled(Card)(
  ({ theme }) => `
    position: relative;

    .MuiCardMedia-root {
      height: ${theme.spacing(26)};
    }
`
);

const CardCoverAction = styled(Box)(
  ({ theme }) => `
    position: absolute;
    right: ${theme.spacing(2)};
    bottom: ${theme.spacing(2)};
`
);

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ProfileCover = ({ userInfo, channelInfo }) => {
  // console.log('channelInfo', channelInfo)
  // console.log('channelTotalFollowers', channelTotalFollowers)
  const [userData, setUserData] = useState({});
  const [channelData, setChannelData] = useState({});
  const [hideAvatarImage, setHideAvatarImage] = useState(false);
  const [userCoverImage, setUserCoverImage] = useState('');
  const [selectedChannelCoverPic, setSelectedChannelCoverPic] = useState([]);
  const [channelCoverOriginalFile, setChannelCoverOriginalFile] = useState([]);
  const [isCoverImageUploaded, setIsCoverImageUploaded] = useState(false);
  const [userUploadedImage, setUserUploadedImage] = useState('');
  const [openCoverImageBox, setOpenCoverImageBox] = useState(false);
  
  // -------------------------Error state------------------------
  const [loading, setLoading] = useState(false);
  const [apiResponseMessage, setApiResponseMessage] = useState('');

  var editor = "";
  const [picture, setPicture] = useState({
    cropperOpen: false,
    img: null,
    zoom: 1,
    croppedImg:
      "https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png"
  });
  
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

  useEffect(()=>{
    setUserCoverImage(channelInfo.channelCoverImage);
    setChannelData(channelInfo);
    setUserData(userInfo);
  },[])

  // -------------------------------------------Upload Channel cover image-------------------------------------
  useEffect(()=>{

    if(isCoverImageUploaded){

      const formData = new FormData();
      formData.append('channelCoverImage', selectedChannelCoverPic);

      axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update/channel/cover-image/${channelInfo._id}`, formData, {headers: {'x-access-token': userData.jwtToken, 'Content-Type': 'multipart/form-data'}}).then((data)=>{
        // console.log(data)
        setApiMessageType('success')
        setApiResponseMessage('Channel cover image uploaded successfully');
        setChannelData(data.data.channelData);
        setUserCoverImage(data.data.channelData.channelCoverImage);
        setLoading(false);
        handleMessageBoxOpen()
        handleClose()
        setIsCoverImageUploaded(false);
      }).catch((error)=>{
        console.log('error', error);
        setApiMessageType('error')
        const errorMessage = error.response.data.message;
        handleMessageBoxOpen()
        setApiResponseMessage(errorMessage);
        setLoading(false);
        handleClose()
        setIsCoverImageUploaded(false)
      });
    }
  },[isCoverImageUploaded])

  const handleClickOpen = () => {
    setOpenCoverImageBox(true);
  };

  const handleClose = () => {
    setOpenCoverImageBox(false);
    setUserUploadedImage('')
    setPicture({
      cropperOpen: false,
      img: null,
      zoom: 1,
      croppedImg:
        "https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png"
    })
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

      setSelectedChannelCoverPic(newFile);
    }
  };

  const handleFileChange = (e) => {
    setHideAvatarImage(true);
    let url=[];
    if(e.target.files.length > 0){
      url = URL.createObjectURL(e.target.files[0]);
    }
    setChannelCoverOriginalFile(e.target.files[0]);
    // setUserUploadedImage(url);
    setPicture({
      ...picture,
      img: url,
      cropperOpen: true
    });
  };

  const handleUploadCoverImage = (e)=>{
    e.preventDefault();
    // setStreamInfoSubmit(true);
    setIsCoverImageUploaded(true)
    setLoading(true)
  }

  return (
    <>
      <CardCover >
        {Object.keys(channelData).length > 0 ?<CardMedia sx={{height: '400px !important'}} image={`${process.env.NEXT_PUBLIC_S3_URL}/${channelData.channelCoverImage}`} />: null}
        <CardCoverAction>
          {/* <Input accept="image/*" id="change-cover" multiple type="file" /> */}
          {/* <label htmlFor="change-cover"> */}
            <Button
              startIcon={<UploadTwoToneIcon />}
              variant="contained"
              component="span"
              onClick={handleClickOpen}
            >
              Change cover
            </Button>
          {/* </label> */}
        </CardCoverAction>
      </CardCover>
      <AvatarWrapper>
        {Object.keys(channelData).length> 0? <Avatar variant="rounded" alt={channelData.channelName} src={`${process.env.NEXT_PUBLIC_S3_URL}/${channelData.channelPicture}`} />: null}
        {/* <ButtonUploadWrapper>
          <Input
            accept="image/*"
            id="icon-button-file"
            name="icon-button-file"
            type="file"
          />
          <label htmlFor="icon-button-file">
            <IconButton component="span" color="primary">
              <UploadTwoToneIcon />
            </IconButton>
          </label>
        </ButtonUploadWrapper> */}
      </AvatarWrapper>
      
      <Dialog open={openCoverImageBox} onClose={handleClose}>
        <DialogTitle>Upload Channel cover image</DialogTitle>
        {/* {apiResponseMessage && <p style={{ color: "#f00" }}>{apiResponseMessage}</p>} */}
        <DialogContent >

          <Typography variant='body1' component={'div'} >
            <Typography variant='p' component={'p'} sx={{marginTop: '15px', color: 'rgba(203, 204, 210, 0.7)'}}>Upload cover image</Typography>
            {channelData && <Box >
              {hideAvatarImage?
                null
              :
                <Typography sx={{marginTop: '10px'}}>
                  {userUploadedImage?
                    <img style={{width: '550px', height: '300px'}} src={userUploadedImage}/> 
                  :
                    userCoverImage? 
                      <img style={{width: '550px', height: '300px'}} src={`${process.env.NEXT_PUBLIC_S3_URL}/${userCoverImage}`}/> 
                    : 
                      <Avatar
                      variant='rounded'
                      src={picture.croppedImg}
                      sx={{ width: 550, height: 300, padding: "5" }}
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
                    height={500}
                    border={50}
                    color={[255, 255, 255, 0.6]} // RGBA
                    rotate={0}
                    scale={picture.zoom}
                    style={{width: '550px', height: '300px'}}
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
            </Box>}
          </Typography>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleUploadCoverImage} disabled={loading}>{loading ? 'Uploading...' : 'Upload'}</Button>
        </DialogActions>
      </Dialog>

      <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }} open={open} autoHideDuration={6000} onClose={handleMessageBoxClose} >
          <Alert onClose={handleMessageBoxClose} variant="filled" severity={`${apiMessageType=='success'? 'success': 'error'}`} sx={{ width: '100%' }}>
            {apiResponseMessage}
          </Alert>
        </Snackbar>
      </Stack>
    </>
  );
};

ProfileCover.propTypes = {
  // @ts-ignore
  channelInfo: PropTypes.object.isRequired
};

export default ProfileCover;
