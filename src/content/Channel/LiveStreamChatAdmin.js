// import * as React from 'react';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import io from 'socket.io-client';
import client from "../../../graphql";
import { gql } from "@apollo/client";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BlockIcon from '@mui/icons-material/Block';
import DeleteIcon from '@mui/icons-material/Delete';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {
  styled,
  Button,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Card,
  CardActions,
  CardContent,
  Tooltip
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
// import EmojiPicker, {Emoji} from 'emoji-picker-react';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import {socket} from '../../../socket';
import MessageMenu from '../../components/chatBox/messageMenu';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';

import dynamic from 'next/dynamic';

const EmojiPicker = dynamic(
  () => {
    return import('emoji-picker-react');
  },
  { ssr: false }
);


const drawerWidth = 350;
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);
const chatBoxContainer = { zoom: 1.0, MozTransform: 'scale(0.5)', MozTransformOrigin: '0 0', border: '1px solid gray', width: '460px', fontFamily: 'arial', height: '550px', position: 'relative', margin: 'auto', marginTop: '30px' }

const showChatBox = { position: 'fixed', margin: '10px 10px 10px 30px', height: '350px', width: '420px', overflow: 'auto', textAlign: 'left' };

const chatButton = { marginTop: '10px', border: 'none', background: '#9147FF', borderRadius: '3px', padding: '5px 10px 5px 10px', color: 'white', float: 'right' };

// const messageInput = { marginTop: '10px', borderRadius: '3px', border: 'none', background: '#ededed', padding: '10px', width: '100%', color: '#000' };
const messageInput = { marginTop: '10px', borderRadius: '3px', border: 'none', width: '100%', color: '#000' };

const messageDivStyle = { display: 'flex', justifyContent: 'space-between' };

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));
export default function LiveStreamChat(props) {

  const [open, setOpen] = React.useState(true);
  const [receivedMessages, setReceivedMessages] = React.useState([]);
  const [oldReceivedMessages, setOldReceivedMessages] = React.useState([]);
  const [roomId, setRoomId] = React.useState('');
  const [userName, setUserName] = React.useState('');
  const [userId, setUserId] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [key, setKey] = React.useState('');
  const [viewer, setViewer] = React.useState(0);
  const [isJoinedChat, setIsJoinedChat] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChannelRoomJoined, setIsChannelRoomJoined] = useState(false);
  const [isClickOnEmoji, setIsClickOnEmoji] = useState(false);
  const [chosenEmoji, setChosenEmoji] = useState({emoji: ''});
  const [pinnedMessage, setPinnedMessage] = useState({});
  const [isPinnedMessage, setIsPinnedMessage] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [messageAllDetails, setMessageAllDetails] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const chatBoxRef = useRef(null);
  const router = useRouter();



  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  var drawerStyle = open ? { justifyContent: 'left' } : { justifyContent: 'end' }

  useEffect(() => {
    if(props.liveStreamInfo.length > 0 && props.viewerUser && props.oldReceivedMessages){
      console.log('3 condition true', props)
      if(props.liveStreamInfo.length > 0){
        console.log('1st condition true', props)
        setRoomId(props.liveStreamInfo[0].videoId);
        if(!isChannelRoomJoined){
          console.log('is not joined', props);
          console.log('props.liveStreamInfo', props.liveStreamInfo);
          console.log('props.liveStreamInfo', props.liveStreamInfo[0].videoId);
          console.log('props.liveStreamInfo', props.liveStreamInfo[0]._id);
          addRoomId(props.liveStreamInfo[0].videoId, props.liveStreamInfo[0]._id);
          setIsChannelRoomJoined(true);
        }
      }

      // console.log('view user ', props)
      if( props.viewerUser){
        console.log('2nd true', props)
        setUserName(`${props.viewerUser.username}`)
        setUserId(`${props.viewerUser._id}`)
        setIsLoggedIn(true);
        // if(props.videoId && props.viewerUser.username && props.viewerUser._id){
        //   addRoomId();
        // }
      }

      if(props.oldReceivedMessages.length > 0){
        console.log('props.oldReceivedMessages', props.oldReceivedMessages);
        setOldReceivedMessages(props.oldReceivedMessages);
      }
    }
  }, [props.liveStreamInfo, props.viewerUser, props.oldReceivedMessages])

  useEffect(() => {
    const chatBox = chatBoxRef.current;
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight - chatBox.clientHeight;
    }
  }, [oldReceivedMessages]);

  useEffect(() => {
    const chatBox = chatBoxRef.current;
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight - chatBox.clientHeight;
    }
  }, [receivedMessages]);

  // var socket = io('http://localhost:8080/', {query: {
  //   roomId: , // This is where you pass the user ID
  // }});
  // var socket = io('http://localhost:8080/', { query: {
  //   roomId: roomId,
  // }});

  useEffect(()=>{
    console.log('Mount----------------------')
    return () => {
      console.log('Unmount----------------------')
      socket.disconnect();
    };
  }, [])

  useEffect(()=>{
    if(isPinnedMessage){
    
      console.log('oldReceivedMessagesClone (after a delay)', oldReceivedMessages);
      const index = oldReceivedMessages.findIndex(item => `${item._id}` === `${pinnedMessage._id}` );
      
      console.log('index', index);
      if (index != -1) {
        
        const newOldPinnedMessage = oldReceivedMessages.map(item => {
          if (`${item._id}` === `${pinnedMessage._id}`) {
            return { ...item, isPinned: pinnedMessage.isPinned };
          } else {
            return { ...item, isPinned: false };
          }
        });

        const newPinnedMessage = receivedMessages.map(item => {
          if (`${item._id}` === `${pinnedMessage._id}`) {
            return { ...item, isPinned: pinnedMessage.isPinned };
          }else {
            return { ...item, isPinned: false };
          }
        });

        setOldReceivedMessages(newOldPinnedMessage);
        setReceivedMessages(newPinnedMessage);
      } else {
        
        let messageIndex = receivedMessages.findIndex(item => `${item._id}` === `${pinnedMessage._id}`);
        console.log('messageIndex', messageIndex);

        if (messageIndex != -1) {
        
          const newPinnedMessage = receivedMessages.map(item => {
            if (`${item._id}` === `${pinnedMessage._id}`) {
              return { ...item, isPinned: pinnedMessage.isPinned };
            }else {
              return { ...item, isPinned: false };
            }
          });

          const newOldPinnedMessage = oldReceivedMessages.map(item => {
            if (`${item._id}` === `${pinnedMessage._id}`) {
              return { ...item, isPinned: pinnedMessage.isPinned };
            } else {
              return { ...item, isPinned: false };
            }
          });

          setReceivedMessages(newPinnedMessage);
          setOldReceivedMessages(newOldPinnedMessage);
          
        }
      }
      setIsPinnedMessage(false)
      
    }
  },[isPinnedMessage])

  function addRoomId(id, streamId) {
    console.log('room id', id)
    console.log('stream id', streamId)
    socket.emit('joinLiveViewerRoom', id, {streamId});
    socket.on('receiveMessage', ({ roomId, message, sender, chatInfo }) => {
      console.log('received roomId', roomId)
      console.log('received Message', message)
      console.log('received sender', sender)
      console.log('received Message chatInfo', chatInfo)
      const messageInfo = {
        videoId: roomId,
        message: message,
        sender: sender,
        _id: chatInfo._id,
        isPinned: chatInfo.isPinned,
        userId: chatInfo.userId,
        liveStreamId: chatInfo.liveStreamId
      }
      // setReceivedMessages((prevMessages) => [...prevMessages, { roomId, message, sender }]);
      setReceivedMessages((prevMessages) => [...prevMessages, messageInfo]);
    });
    
    
    socket.on('receivePinMessage', ({ pinnedMessage }) => {
      setPinnedMessage(pinnedMessage);
      console.log('received pinnedMessage', pinnedMessage);
      setIsPinnedMessage(true);
      // setReceivedMessages((prevMessages) => [...prevMessages, { roomId, message, sender }]);
    });
    
    // socket.emit('updateLiveStreamingViewerCount', '64be4c9cc1e7b7e58ab24b82', '648174e0bed9a5f8f56950e1');
    socket.on('viewerCounts', ({ viewerCount }) => {
      console.log('viewerCount', viewerCount);
      setViewer(viewerCount)
      // props.funcHandleViewers(viewerCount)
    })
  }


  const handleSendMessage = () => {
    console.log('userId', userId);
    console.log('userName', userName);
    if(`${userId}` !== 'undefined' && `${userName}` !== `undefined`) {
      if (message.trim() !== '') {
        console.log('message', message);
        socket.emit('sendMessage', { roomId, message, userId, userName: userName });
        // setReceivedMessages((prevMessages) => [...prevMessages, { roomId, message, sender: 'you' }]);
      }
    } else {
      console.log('else ', userName);
      setIsLoggedIn(false);
    }
    setMessage('');
  }

  const handleUserLeftChat = () => {
    // Emit leaveRoom event to disconnect from a room
    socket.emit('leaveRoom', roomId, userId);
  }

  const handleLoggedOutUser = () =>{
    router.push('/auth/login');
  }
  
  const handleEmojiOpen = () =>{
    setIsClickOnEmoji(!isClickOnEmoji);
  }

  const onEmojiClick = (emojiObject, event) => {
    console.log('emojiObject', emojiObject);
    setMessage(
      (message) =>
        message + (emojiObject ? emojiObject.emoji : null)
    );
    // setSelectedEmoji(emojiData.unified);
    setChosenEmoji(emojiObject);
  };

  const handlePinMessage = (messageAllDetail) => {
    console.log('running', messageAllDetail);
    // messageAllDetail.isPinned = true
    let messagePin = {
      ...messageAllDetail
    }
    messagePin.isPinned = true
    console.log('messagePin messagePin', messagePin)
    socket.emit('pinMessage', messageAllDetail._id, { videoId: messageAllDetail.videoId, liveStreamId: messageAllDetail.liveStreamId, isPinned: true });
    setPinnedMessage(messagePin);
      console.log('received pinnedMessage', messagePin);
      setIsPinnedMessage(true);
    // handleClose();
  }
  
  const handleUnpinMessage = (messageAllDetail)=>{
    // messageAllDetail.isPinned = false
    let messagePin = {
      ...messageAllDetail
    }
    messagePin.isPinned = false
    console.log('running', messageAllDetail);
    console.log('running', messageAllDetail._id);
    console.log('running', messageAllDetail.videoId);
    socket.emit('pinMessage', messageAllDetail._id, { videoId: messageAllDetail.videoId, liveStreamId: messageAllDetail.liveStreamId, isPinned: false });
    setPinnedMessage(messagePin);
      console.log('received pinnedMessage', messagePin);
      setIsPinnedMessage(true);
    // handleClose();
  }

  return (

    <Box sx={{ backgroundColor: '#0c1028', width: '30%', margin: 'auto' }}> {/* Set the background color of the Drawer */}
      <Box  className='minHeightTitleMenu'>
        {/* <IconButton onClick={handleDrawerClose} sx={{
          ...(!open && { display: 'none' }),
        }}>
        </IconButton> */}
          <div style={{ fontSize: "12px", color: "#fff" }}>CHATS</div>
        {/* <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{
            marginRight: 5,
            ...(open && { display: 'none' }),
          }}
          style={{ color: "#fff" }}>
          <ChevronLeftIcon />
        </IconButton> */}
      </Box>
      <Divider />
      {/* {!isLoggedIn && <Typography>Please login first</Typography>} */}
      {
        oldReceivedMessages.length > 0 || receivedMessages.length > 0 ? 
          <>
            {open ?
              <>
                <Typography ref={chatBoxRef} sx={{ margin: '15px', height: '650px', overflowY: 'scroll', scrollbarWidth: 'none' }}>
                  {oldReceivedMessages.map((data, index) => (

                    `${data.isPinned}` === `true` ?
                      <Card sx={{ minWidth: 275, display: 'flex', justifyContent: 'space-between' }} key={index}>
                        <CardContent>
                          <Box sx={{}}>
                            <Typography sx={{ display: 'flex', mb: '4px' }} fontSize={'12px'} >
                              <PushPinIcon fontSize='small' /> Pinned by &nbsp;&nbsp;
                              <span style={{ color: 'red', fontSize: '15px' }}>
                                {`${data.userDetail[0].username}`}
                              </span>
                            </Typography>
                            <Typography variant='h4' component={'h4'} sx={{ textWrap: 'wrap' }}>
                              {data.message}
                            </Typography>
                          </Box>
                        </CardContent>
                        <CardActions>
                          {data && <MessageMenu messageData={data} handleUnpinFunc={handleUnpinMessage} handlePinFunc={handlePinMessage} />}
                          {/* <Typography sx={{display: 'flex', mb: '4px'}} fontSize={'12px'} > */}
                          {/* <Tooltip title="Unpin message">
                            <PushPinOutlinedIcon fontSize='medium'/>
                          </Tooltip> */}
                          {/* </Typography> */}
                        </CardActions>
                      </Card>
                    :
                      (data.userDetail[0]._id != userId ?
                        <Typography variant="body1" component="div" sx={{ paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} key={index}>
                          {/* <MessageMenu/> */}
                          {/* <Box sx={messageDivStyle}> */}
                          <Box>
                            <span style={{ color: 'gray', fontSize: '12px' }}>{data.hours}:{data.mins.length > 1 ? data.mins : '0' + data.mins} </span>
                            {/* <span style={{color:'gray', fontSize: '12px'}}>{data.hours.length>1? data.hours: '0'+ data.hours}:{data.mins.length>1?data.mins: '0'+ data.mins} </span> */}
                            {/* <img style={{verticalAlign:'middle', display:'inline',height:'1.5em', fontSize: '12px'}} src="https://external-preview.redd.it/NyXHl-pCWaAdYwZ3B10rzcjSHaPYX_ZnJy93L6WJ-M0.jpg?auto=webp&s=f05aa5512f72f3fc58e7cf18a7d6c8bbbfa10c94" /> */}
                            <b style={{ color: 'rgb(180, 38, 38)', fontSize: '15px' }}>{`${data.userDetail[0].firstName} ${data.userDetail[0].lastName}`}{'  => '} </b>
                            <span style={{ textWrap: 'wrap', whiteSpace: 'normal' }}>: {data.message}</span>
                          </Box>
                          {data && <MessageMenu messageData={data} handleUnpinFunc={handleUnpinMessage} handlePinFunc={handlePinMessage} />}
                          {/* </Box> */}
                        </Typography>
                        :
                        <Typography variant="body1" component="div" sx={{ paddingBottom: '10px', textAlign: 'end', mr: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} key={index}>

                          {data && <MessageMenu messageData={data} handleUnpinFunc={handleUnpinMessage} handlePinFunc={handlePinMessage} />}
                          <Box>
                            <span style={{ textWrap: 'wrap', whiteSpace: 'normal' }}>{data.message} :</span>
                            <b style={{ color: 'rgb(180, 38, 38)', fontSize: '15px' }}>{' <= '}You </b>
                            {/* <b style={{ color: 'rgb(180, 38, 38)', fontSize: '15px' }}>{' <= '}{`${data.userDetail[0].firstName} ${data.userDetail[0].lastName}`} </b> */}
                            <span style={{ color: 'gray', fontSize: '12px' }}>{data.hours}:{data.mins.length > 1 ? data.mins : '0' + data.mins} </span>
                          </Box>

                        </Typography>)
                    ))
                  }
                  {oldReceivedMessages ? receivedMessages.length > 0 ? <div style={{ color: 'red' }}>----------------------------------------- NEW</div> : null : null}
                  {receivedMessages.map((data, index) => (
                    `${data.isPinned}` === `true` ?
                      <Card sx={{ minWidth: 275, display: 'flex', justifyContent: 'space-between' }} key={index}>
                        <CardContent>
                          <Box sx={{}}>
                            <Typography sx={{ display: 'flex', mb: '4px' }} fontSize={'12px'} >
                              <PushPinIcon fontSize='small' /> Pinned by &nbsp;&nbsp;
                              <span style={{ color: 'red', fontSize: '15px' }}>
                                {`${data.sender}`}
                              </span>
                            </Typography>
                            <Typography variant='h4' component={'h4'} sx={{ textWrap: 'wrap' }}>
                              {data.message}
                            </Typography>
                          </Box>
                        </CardContent>
                        <CardActions>
                          {data && <MessageMenu messageData={data} handleUnpinFunc={handleUnpinMessage} handlePinFunc={handlePinMessage} />}
                          {/* <Typography sx={{display: 'flex', mb: '4px'}} fontSize={'12px'} > */}
                          {/* <Tooltip title="Unpin message">
                            <PushPinOutlinedIcon fontSize='medium'/>
                          </Tooltip> */}
                          {/* </Typography> */}
                        </CardActions>
                      </Card>
                    :
                      (data.userId !== userId ? <Typography variant="body1" component="div" sx={{ paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} key={index}>
                          <Box>
                            {/* <span style={{color:'gray', fontSize: '12px'}}>14:36</span> */}
                            {/* <img style={{verticalAlign:'middle', display:'inline',height:'1.5em', fontSize: '12px'}} src="https://external-preview.redd.it/NyXHl-pCWaAdYwZ3B10rzcjSHaPYX_ZnJy93L6WJ-M0.jpg?auto=webp&s=f05aa5512f72f3fc58e7cf18a7d6c8bbbfa10c94" /> */}
                            {/* <b style={{color:'rgb(180, 38, 38)', fontSize: '15px'}}>{sender}:{roomId + '  => '} </b> */}
                            <b style={{ color: 'rgb(180, 38, 38)', fontSize: '15px' }}>{data.sender} </b>
                            <span style={{ textWrap: 'wrap', whiteSpace: 'normal'}}>: {data.message}</span>
                          </Box>
                          {data && <MessageMenu messageData={data} handleUnpinFunc={handleUnpinMessage} handlePinFunc={handlePinMessage} />}
                        </Typography>
                      :
                        <Typography variant="body1" component="div" sx={{ paddingBottom: '10px', textAlign: 'end', mr: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} key={index}>
                          {data && <MessageMenu messageData={data} handleUnpinFunc={handleUnpinMessage} handlePinFunc={handlePinMessage} />}
                          <Box>
                            <span style={{ textWrap: 'wrap', whiteSpace: 'normal'}}>{data.message} :</span>
                            <b style={{ color: 'rgb(180, 38, 38)', fontSize: '15px' }}> You </b>
                            {/* <b style={{ color: 'rgb(180, 38, 38)', fontSize: '15px' }}> {data.sender} </b> */}
                          </Box>
                        </Typography>)
                    ))
                  }
                </Typography>
                {/* <Typography variant="body1" component="div"  sx={{ padding: '20px 20px 10px', bottom: 0, width: '100%' }}> */}
                  {
                    isLoggedIn?
                      <Typography variant="body1" component="div" sx={{ padding: '20px 20px 10px', bottom: 0, width: '100%' }}>
                            {/* <Typography>{chosenEmoji.emoji}</Typography> */}
                            {/* {chosenEmoji ? <Emoji unified={chosenEmoji.unified} size={77} /> : null} */}
                            <TextField style={messageInput} multiline placeholder="Send a message" value={message} onChange={(e) => setMessage(e.target.value)} InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <InsertEmoticonIcon onClick={handleEmojiOpen}/>
                                </InputAdornment>
                              )
                            }}/>
                              <Button style={chatButton} onClick={handleSendMessage}>Chat</Button>
                            {/* <Box>
                              <Typography variant="body1" component="div" onClick={handleEmojiOpen}>
                                <InsertEmoticonIcon />
                              </Typography>
                            </Box> */}
                            { isClickOnEmoji && <EmojiPicker width={325} height={450} onEmojiClick={onEmojiClick}/> }
                      </Typography>
                    :
                      <Typography variant="body1" component="div" sx={{ backgroundColor: '#fff', color: '#000', textAlign: 'center', padding: '20px 20px 10px', bottom: 0, width: '100%' }}>
                          <Button variant="contained" onClick={handleLoggedOutUser}>Login to join the chat</Button>
                          <p>All messages you send will appear publicly</p>
                      </Typography>
                }
              </>
              : null}
          </> 
        :
          // <>
          //   {open ? <Typography variant='p' component={'p'} sx={{ padding: '5%' }}>
          //     No chat found
          //         <input type="text" placeholder='Enter room id' value={roomId} onChange={(e) => setRoomId(e.target.value)} /><br/>
          //         <input style={{marginLeft: '10px'}} type="text" placeholder='Enter user id' value={userId} onChange={(e) => setUserId(e.target.value)} /><br/>
          //         <input style={{marginLeft: '10px'}} type="text" placeholder='Enter user name' value={userName} onChange={(e) => setUserName(e.target.value)} /><br/>
          //         <button style={{marginLeft: '10px'}} onClick={addRoomId}>Join room</button>
          //         <button style={{marginLeft: '10px'}} onClick={handleUserLeftChat}>Leave room</button>

          //   </Typography> : null}
          // </>
          <>
          {open ?
            <>
              <Typography variant='p' component={'p'} sx={{ padding: '5%' }}>
                No chat found
              </Typography>
              <Typography variant="body1" component="div" sx={{ padding: '20px 20px 10px', bottom: 0, width: '100%' }}>
                <TextField style={messageInput} placeholder="Send a message" value={message} onChange={(e) => setMessage(e.target.value)} />
                <Button style={chatButton} onClick={handleSendMessage}>Chat</Button>
              </Typography>
            </>
          : null}
        </>
      }
    </Box >
  );
}
