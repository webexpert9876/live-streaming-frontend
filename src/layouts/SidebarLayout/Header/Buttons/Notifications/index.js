import {
  alpha,
  Badge,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Popover,
  Tooltip,
  Typography
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import NotificationsActiveTwoToneIcon from '@mui/icons-material/NotificationsActiveTwoTone';
import { styled } from '@mui/material/styles';
import {socket} from '../../../../../../socket';
import { setAuthUser, setAuthState, selectAuthState, selectAuthUser } from '../../../../../../store/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import client from "../../../../../../graphql";
import { gql } from "@apollo/client";
import axios from 'axios';
import { useRouter } from 'next/router';

import { formatDistance, subDays } from 'date-fns';

const NotificationsBadge = styled(Badge)(
  ({ theme }) => `
    
    .MuiBadge-badge {
        background-color: ${alpha(theme.palette.error.main, 1.1)};
        // color: ${theme.palette.error.main};
        color: #fff;
        min-width: 16px; 
        height: 16px;
        padding: 0;

        &::after {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            box-shadow: 0 0 0 1px ${alpha(theme.palette.error.main, 0.3)};
            content: "";
        }
    }
`
);

function HeaderNotifications() {
  const ref = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [userAuthState, setUserAuthState] = useState({});
  const [notificationList, setNotificationList] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [checkReadNotification, setCheckReadNotification] = useState(false);
  const router = useRouter();

  let userDetails = useSelector(selectAuthUser);
  let userIsLogedIn = useSelector(selectAuthState);

  useEffect(async ()=>{
    console.log('userDetails', userDetails)
    console.log('userIsLogedIn', userIsLogedIn)

    if(userDetails){
      setUserInfo(userDetails);
      let notifications = await client.query({
        query: gql`
            query Query ($receiverId: String) {
              notification(receiverId: $receiverId) {
                _id
                message
                notificationType
                isRead
                senderUserId
                createdAt
              }
            }
          `,
        variables: {
            "receiverId": userDetails._id
        }
      }).then((result) => {
          return result.data.notification
      });

      setNotificationList(notifications);
      setCheckReadNotification(true);

      connectUserWithSocket(userDetails._id);

    }
    if(userIsLogedIn){
      setUserAuthState(userIsLogedIn);
    }

  }, [])

  useEffect(()=>{
    if(checkReadNotification){
      const countUnreadNotification = ()=>{
        console.log('useEffect ', notificationList)
        const countReadNotifications = notificationList.reduce((count, notificationInfo) => {
          if( notificationInfo.notificationType == 'single'){
            if (notificationInfo.isRead === false) {
              return count + 1;
            }
          } else if(notificationInfo.notificationType == 'live'){
            return count + 1;
          }
          return count;
        }, 0);
    
        setNotificationCount(countReadNotifications);
        setCheckReadNotification(false)
      }
      countUnreadNotification()
    }
  }, [checkReadNotification]);

  function connectUserWithSocket(id){
    console.log('id for check notification', id)
    socket.emit('connectUserWithNotification', id);
    socket.on('receiveLiveNotification', (notificationData)=>{
      console.log('receiveLiveNotification', notificationData);
      
      setNotificationList(prevNotificationList => [...prevNotificationList, notificationData]);
      // countUnreadNotification(newNotificationList);
      setCheckReadNotification(true);
    });
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNotificationOpen =async (notificationDetail)=>{
    if(notificationDetail.notificationType == 'single'){
      
      const result = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update/notification/${notificationDetail._id}`, {}, { headers: { 'x-access-token': userInfo.jwtToken } });
      console.log('result notification', result);

      if(result){
        const newNotificationList = notificationList.filter((notification)=>{
          if (notification._id === notificationDetail._id) {
            return { ...notification, isRead: true };
          }
          return notification;
        });
        setNotificationList(newNotificationList);

        // countUnreadNotification(newNotificationList);
        setCheckReadNotification(true);
      }

    } else if(notificationDetail.notificationType == 'live'){
      let channelInfo = await client.query({
        query: gql`
            query Query ($usersId: ID) {
              users(id: $usersId) {
                channelDetails {
                  urlSlug
                }
              }
            }
          `,
        variables: {
            "usersId": notificationDetail.senderUserId
        }
      }).then((result) => {
          return result.data.users[0].channelDetails
      });
      console.log('channelInfo for redirect', channelInfo[0].urlSlug);

      const result = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update/notification/${notificationDetail._id}`, {userId: userInfo._id}, { headers: { 'x-access-token': userInfo.jwtToken } });
      console.log('result notification for live', result);

      const newNotificationList = notificationList.filter((notification)=>{
        if (notification._id != notificationDetail._id) {
          return notification
        }
      });

      setNotificationList(newNotificationList);
      
      setCheckReadNotification(true);
      setOpen(false);

      if(result){
        router.push(`/channel/${channelInfo[0].urlSlug}`)
      }
    }
  }
  
  return (
    <>
      <Tooltip arrow title="Notifications">
        <IconButton color="primary" ref={ref} onClick={handleOpen}>
          <NotificationsBadge
            badgeContent={notificationCount}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
          >
            <NotificationsActiveTwoToneIcon />
          </NotificationsBadge>
        </IconButton>
      </Tooltip>
      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <Box
          sx={{ p: 2 }}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h5">Notifications</Typography>
        </Box>
        <Divider />
        <List sx={{ p: 0 }}>
        {
          notificationList.length > 0 ?
          notificationList.map((notification, index)=>(
            // notification.notificationType == 'live' && 
            <ListItemButton
              key={index}
              selected={notification.notificationType == 'live'? true: notification.isRead == false? true: false}
              sx={{ p: 2, minWidth: 350, display: { xs: 'block', sm: 'flex' } }}
              onClick={()=>{ handleNotificationOpen(notification)}}
            >
              <Box flex="1">
                <Box display="flex" justifyContent="space-between">
                  <Typography sx={{ fontWeight: 'bold' }}>
                    {notification.message}
                  </Typography>
                  <Typography variant="caption" sx={{ textTransform: 'none' }}>
                    {formatDistance(subDays(new Date(), 3), new Date(), {
                      addSuffix: true
                    })}
                  </Typography>
                </Box>
                {/* <Typography
                  component="span"
                  variant="body2"
                  color="text.secondary"
                >
                  {' '}
                  new messages in your inbox
                </Typography> */}
              </Box>
            </ListItemButton>


          ))
          :
            <ListItem sx={{ p: 2, minWidth: 350, display: { xs: 'block', sm: 'flex' } }}>
              No notification found...!!
            </ListItem>
                  
        }
        </List>
      </Popover>
    </>
  );
}

export default HeaderNotifications;
