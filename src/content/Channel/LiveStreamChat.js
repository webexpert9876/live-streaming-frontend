// import * as React from 'react';
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import client from "../../../graphql";
import { gql } from "@apollo/client";

import {
  styled,
  Button,
  Typography,
} from '@mui/material';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {socket} from '../../../socket';


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

const messageInput = { marginTop: '10px', borderRadius: '3px', border: 'none', background: '#ededed', padding: '10px', width: '100%', color: '#000' };
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
  const chatBoxRef = useRef(null);


  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  var drawerStyle = open ? { justifyContent: 'left' } : { justifyContent: 'end' }
  //   const handleSendMessage = () => {
  //     if (message.trim() !== '') {
  //       socket.emit('sendMessage', { roomId, message, userId, userName: userName });
  //       setMessage('');
  //     }
  // }

  // const handleUserLeftChat = () => {
  //     // Emit leaveRoom event to disconnect from a room
  //     socket.emit('leaveRoom', roomId, userId);
  // }

  useEffect(() => {
    if(props.liveStreamInfo.videoId && props.viewerUser && props.oldReceivedMessages){
      if(props.liveStreamInfo){
        setRoomId(props.liveStreamInfo.videoId);
        if(!isChannelRoomJoined){
          console.log('props.liveStreamInfo', props.liveStreamInfo)
          addRoomId(props.liveStreamInfo.videoId, props.liveStreamInfo._id);
          setIsChannelRoomJoined(true);
        }
      }

      console.log('view user ', props)
      if( props.viewerUser){
        setUserName(`${props.viewerUser.username}`)
        setUserId(`${props.viewerUser._id}`)
        setIsLoggedIn(true);
        // if(props.videoId && props.viewerUser.username && props.viewerUser._id){
        //   addRoomId();
        // }
      }

      if(props.oldReceivedMessages){

        setOldReceivedMessages(props.oldReceivedMessages);
      }
    }
  }, [props.liveStreamInfo.videoId, props.viewerUser, props.oldReceivedMessages])

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

  function addRoomId(id, streamId) {
    console.log('room id', id)
    console.log('stream id', streamId)
    socket.emit('joinLiveViewerRoom', id, {streamId});
    socket.on('receiveMessage', ({ roomId, message, sender }) => {
      console.log('received Message', roomId)
      console.log('received Message', message)
      console.log('received Message', sender)
      setReceivedMessages((prevMessages) => [...prevMessages, { roomId, message, sender }]);
    });
    // socket.emit('updateLiveStreamingViewerCount', '64be4c9cc1e7b7e58ab24b82', '648174e0bed9a5f8f56950e1');
  }
  socket.on('viewerCounts', ({ viewerCount }) => {
    console.log('viewerCount', viewerCount);
    setViewer(viewerCount)
    props.funcHandleViewers(viewerCount)
  })


  const handleSendMessage = () => {
    console.log('userId', userId);
    console.log('userName', userName);
    if(`${userId}` !== 'undefined' && `${userName}` !== `undefined`) {
      if (message.trim() !== '') {
        socket.emit('sendMessage', { roomId, message, userId, userName: userName });
        setMessage('');
      }
    } else {
      console.log('else ', userName);
      setIsLoggedIn(false);
    }
  }

  const handleUserLeftChat = () => {
    // Emit leaveRoom event to disconnect from a room
    socket.emit('leaveRoom', roomId, userId);
  }

  return (

    <Drawer sx={{
      '& .MuiDrawer-paper': {
        position: 'relative'
      },
    }} variant="permanent" open={open} className='' style={{ backgroundColor: '#0c1028' }}> {/* Set the background color of the Drawer */}
      <DrawerHeader sx={drawerStyle} className='minHeightTitleMenu'>
        <IconButton onClick={handleDrawerClose} sx={{
          ...(!open && { display: 'none' }),
        }}>
          <div style={{ fontSize: "12px", color: "#fff" }}>CHATS</div> {<ChevronRightIcon style={{ color: "#fff" }} />}
        </IconButton>
        <IconButton
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
        </IconButton>
      </DrawerHeader>
      <Divider />
      {!isLoggedIn && <Typography>Please login first</Typography>}
      {oldReceivedMessages.length > 0 || receivedMessages.length > 0 ? <>
        {open ?
          <>
            <Typography sx={{ margin: '15px', height: '650px', overflowY: 'scroll', scrollbarWidth: 'none' }}>
              {oldReceivedMessages.map((data, index) => (
                <Typography variant="body1" component="div" sx={{ paddingBottom: '10px' }} key={index}>
                  <span style={{ color: 'gray', fontSize: '12px' }}>{data.hours}:{data.mins.length > 1 ? data.mins : '0' + data.mins} </span>
                  {/* <span style={{color:'gray', fontSize: '12px'}}>{data.hours.length>1? data.hours: '0'+ data.hours}:{data.mins.length>1?data.mins: '0'+ data.mins} </span> */}
                  {/* <img style={{verticalAlign:'middle', display:'inline',height:'1.5em', fontSize: '12px'}} src="https://external-preview.redd.it/NyXHl-pCWaAdYwZ3B10rzcjSHaPYX_ZnJy93L6WJ-M0.jpg?auto=webp&s=f05aa5512f72f3fc58e7cf18a7d6c8bbbfa10c94" /> */}
                  <b style={{ color: 'rgb(180, 38, 38)', fontSize: '15px' }}>{`${data.userDetail[0].firstName} ${data.userDetail[0].lastName}`}{'  => '} </b>
                  <span>: {data.message}</span>
                </Typography>
              ))}
              {oldReceivedMessages ? receivedMessages.length > 0 ? <div style={{ color: 'red' }}>----------------------------------- NEW</div> : null : null}
              {receivedMessages.map(({ roomId, message, sender }, index) => (
                <Typography variant="body1" component="div" sx={{ paddingBottom: '10px' }} key={index}>
                  {/* <span style={{color:'gray', fontSize: '12px'}}>14:36</span> */}
                  {/* <img style={{verticalAlign:'middle', display:'inline',height:'1.5em', fontSize: '12px'}} src="https://external-preview.redd.it/NyXHl-pCWaAdYwZ3B10rzcjSHaPYX_ZnJy93L6WJ-M0.jpg?auto=webp&s=f05aa5512f72f3fc58e7cf18a7d6c8bbbfa10c94" /> */}
                  {/* <b style={{color:'rgb(180, 38, 38)', fontSize: '15px'}}>{sender}:{roomId + '  => '} </b> */}
                  <b style={{ color: 'rgb(180, 38, 38)', fontSize: '15px' }}>{sender} </b>
                  <span>: {message}</span>
                </Typography>
              ))}
            </Typography>
            <Typography variant="body1" component="div" sx={{ padding: '20px 20px 10px', bottom: 0, width: '100%' }}>
              <input style={messageInput} placeholder="Send a message" value={message} onChange={(e) => setMessage(e.target.value)} />
              <Button style={chatButton} onClick={handleSendMessage}>Chat</Button>
            </Typography>
          </>
          : null}
      </> :
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
              <input style={messageInput} placeholder="Send a message" value={message} onChange={(e) => setMessage(e.target.value)} />
              <Button style={chatButton} onClick={handleSendMessage}>Chat</Button>
            </Typography>
          </>
          : null}
      </>
      }
    </Drawer >
  );
}
