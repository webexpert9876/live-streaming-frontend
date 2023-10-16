// import * as React from 'react';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import io from 'socket.io-client';
import client from "../../../graphql";
import { gql } from "@apollo/client";

import {
  styled,
  Button,
  Typography,
  Box,
  TextField,
  InputAdornment,
} from '@mui/material';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
// import EmojiPicker, {Emoji} from 'emoji-picker-react';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
// import {socket} from '../../../socket';

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
  const [isChatClosed, setIsChatClosed] = useState(false);
  const [isChannelRoomJoined, setIsChannelRoomJoined] = useState(false);
  const [isClickOnEmoji, setIsClickOnEmoji] = useState(false);
  const [chosenEmoji, setChosenEmoji] = useState({emoji: ''});
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
    if(props.oldReceivedMessages){

      console.log('props.oldReceivedMessages', props.oldReceivedMessages);
      setOldReceivedMessages(props.oldReceivedMessages);
    }
  }, [props.oldReceivedMessages])

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


  const handleSendMessage = () => {
    setIsChatClosed(true)
    setMessage('');
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
      {
        oldReceivedMessages.length > 0 ? 
          <>
            {open ?
              <>
                <Typography ref={chatBoxRef} sx={{ margin: '15px', height: '650px', overflowY: 'scroll', scrollbarWidth: 'none' }}>
                  {oldReceivedMessages.map((data, index) => (
                    // data.userDetail[0]._id != userId ?
                      <Typography variant="body1" component="div" sx={{ paddingBottom: '10px' }} key={index}>
                        <span style={{ color: 'gray', fontSize: '12px' }}>{data.hours}:{data.mins.length > 1 ? data.mins : '0' + data.mins} </span>
                        <b style={{ color: 'rgb(180, 38, 38)', fontSize: '15px' }}>{`${data.userDetail[0].firstName} ${data.userDetail[0].lastName}`}{'  => '} </b>
                        <span style={{ textWrap: 'wrap', whiteSpace: 'normal'}}>: {data.message}</span>
                      </Typography>
                    // :
                      // <Typography variant="body1" component="div" sx={{ paddingBottom: '10px', textAlign: 'end', mr: '20px' }} key={index}>
                      //   <span style={{ textWrap: 'wrap', whiteSpace: 'normal'}}>{data.message} :</span>
                      //   <b style={{ color: 'rgb(180, 38, 38)', fontSize: '15px' }}>{' <= '}{`${data.userDetail[0].firstName} ${data.userDetail[0].lastName}`} </b>
                      //   <span style={{ color: 'gray', fontSize: '12px' }}>{data.hours}:{data.mins.length > 1 ? data.mins : '0' + data.mins} </span>
                      // </Typography>
                  ))}
                </Typography>
                  {
                    !isChatClosed?
                      <Typography variant="body1" component="div" sx={{ padding: '20px 20px 10px', bottom: 0, width: '100%' }}>
                            <TextField style={messageInput} multiline placeholder="Send a message" value={message} onChange={(e) => setMessage(e.target.value)} InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <InsertEmoticonIcon onClick={handleEmojiOpen}/>
                                </InputAdornment>
                              )
                            }}/>
                              <Button style={chatButton} onClick={handleSendMessage}>Chat</Button>

                            { isClickOnEmoji && <EmojiPicker width={325} height={450} onEmojiClick={onEmojiClick}/> }
                      </Typography>
                    :
                      <Typography variant="body1" component="div" sx={{ backgroundColor: '#fff', color: '#000', textAlign: 'center', padding: '20px 20px 10px', bottom: 0, width: '100%' }}>
                          <p>Chat has been closed for this stream</p>
                      </Typography>
                }
              </>
              : null}
          </> 
        :
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
    </Drawer >
  );
}
