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
        background-color: ${alpha(theme.palette.error.main, 0.5)};
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
  const [newReceiveNotification, setNewReceiveNotification] = useState({});
  const [addReceiveNotification, setAddReceiveNotification] = useState(false);
  const [removeReceiveNotification, setRemoveReceiveNotification] = useState({});
  const [isRemoveNotification, setIsRemoveNotification] = useState(false);
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

      // setNotificationList(notifications);
      sortNotifications(notifications);
      // setCheckReadNotification(true);

      connectUserWithSocket(userDetails._id);

    }
    if(userIsLogedIn){
      setUserAuthState(userIsLogedIn);
    }
    return () => {
      console.log('Unmount----------------------');
      socket.disconnect();
    };
  }, [])

  useEffect(()=>{
    if(checkReadNotification){
      const countUnreadNotification = ()=>{
        console.log('useEffect ', notificationList)
        const countReadNotifications = notificationList.reduce((count, notificationInfo) => {
          let notificationType = notificationInfo.notificationType;
          if( notificationType == 'single' || notificationType == 'block' || notificationType == 'unblock' || notificationType == 'approved' || notificationType == 'declined'){
            if (`${notificationInfo.isRead}` === 'false') {
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
  
  useEffect(()=>{
    if(addReceiveNotification){
      const mergeOldNewNotification = [...notificationList, newReceiveNotification];
      console.log('mergeOldNewNotification', mergeOldNewNotification);
      sortNotifications(mergeOldNewNotification);
      setAddReceiveNotification(false);
    }
  }, [addReceiveNotification]);
  
  useEffect(()=>{
    if(isRemoveNotification){
      const newNotificationList = notificationList.filter((notification)=>{
        console.log('single notification of all', notification._id)
        console.log('notification delete id', removeReceiveNotification._id)
        if (notification._id != removeReceiveNotification._id) {
          return notification
        }
      });
      sortNotifications(newNotificationList);
      setIsRemoveNotification(false);
    }
  }, [isRemoveNotification]);

  function connectUserWithSocket(id){
    console.log('id for check notification', id)
    
    // It connect user for single to single notification
    socket.emit('userConnected', id);

    // It connect user with notification
    socket.emit('connectUserWithNotification', id);

    // Receive notification when artist live stream
    socket.on('receiveLiveNotification', (notificationData)=>{
      console.log('receiveLiveNotification', notificationData);
      setNewReceiveNotification(notificationData);
      setAddReceiveNotification(true);
      
    });

    // Event for new follower notification
    socket.on('newFollower', ({ userInfo, followingInfo, notificationDetails})=>{
      setNewReceiveNotification(notificationDetails);
      setAddReceiveNotification(true);
    });
    
    // Event for unfollowing notification
    socket.on('removeFollow', ({ notificationDetails})=>{
      if(notificationDetails){
        setRemoveReceiveNotification(notificationDetails);
        setIsRemoveNotification(true);
      }
    });
    
    socket.on('channelApproveAndBlock', ({ userInfo, notificationDetails})=>{
      console.log('approve block notification received');
      setNewReceiveNotification(notificationDetails);
      setAddReceiveNotification(true);
    });
    
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNotificationOpen =async (notificationDetail)=>{
    let notificationTypeInfo = notificationDetail.notificationType;
    if(notificationTypeInfo == 'single'){
      
      let userUrlInfo = await client.query({
        query: gql`
            query Query ($usersId: ID) {
              users(id: $usersId) {
                urlSlug
              }
            }
          `,
        variables: {
            "usersId": notificationDetail.senderUserId
        }
      }).then((result) => {
        console.log('result.data.users[0]', result.data.users[0])
          return result.data.users[0]
      });

      const result = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update/notification/${notificationDetail._id}`, {}, { headers: { 'x-access-token': userInfo.jwtToken } });
      console.log('result notification', result);

      if(result){
        const newNotificationList = notificationList.map((notification)=>{
          if (notification._id === notificationDetail._id) {
            return { ...notification, isRead: true };
          }
          return notification;
        });
         console.log('newNotificationList single notification', newNotificationList);
         sortNotifications(newNotificationList);

        setOpen(false);
        if(userUrlInfo){
          router.push(`/user/${userUrlInfo.urlSlug}`)
        }
      }


    } else if(notificationTypeInfo == 'live'){
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

      const result = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update/notification/${notificationDetail._id}`, {userId: userInfo._id}, { headers: { 'x-access-token': userInfo.jwtToken } });
      console.log('result notification for live', result);
      
      setRemoveReceiveNotification(notificationDetail);
      setIsRemoveNotification(true)

      setOpen(false);

      if(result){
        router.push(`/channel/${channelInfo[0].urlSlug}`)
      }
    } else if(notificationTypeInfo == 'approved' || notificationTypeInfo == 'unblock'){
      console.log('notificationDetail=======================', notificationDetail)
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
            "usersId": userInfo._id
        }
      }).then((result) => {
          return result.data.users[0].channelDetails
      });

      const result = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update/notification/${notificationDetail._id}`, {userId: userInfo._id}, { headers: { 'x-access-token': userInfo.jwtToken } });
      console.log('result notification for live', result);
      
      setRemoveReceiveNotification(notificationDetail);
      setIsRemoveNotification(true)

      setOpen(false);

      if(result){
        router.push(`/channel/${channelInfo[0].urlSlug}`)
      }
    } else if(notificationTypeInfo == 'declined' || notificationTypeInfo == 'block' || notificationTypeInfo == 'pending'){
      // console.log('notificationDetail=======================', notificationDetail)
      // let channelInfo = await client.query({
      //   query: gql`
      //       query Query ($usersId: ID) {
      //         users(id: $usersId) {
      //           channelDetails {
      //             urlSlug
      //           }
      //         }
      //       }
      //     `,
      //   variables: {
      //       "usersId": userInfo._id
      //   }
      // }).then((result) => {
      //     return result.data.users[0].channelDetails
      // });

      const result = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update/notification/${notificationDetail._id}`, {userId: userInfo._id}, { headers: { 'x-access-token': userInfo.jwtToken } });
      console.log('result notification for live', result);
      
      if(result){
        const newNotificationList = notificationList.map((notification)=>{
          if (notification._id === notificationDetail._id) {
            return { ...notification, isRead: true };
          }
          return notification;
        });
         console.log('newNotificationList single notification', newNotificationList);
         sortNotifications(newNotificationList);

        setOpen(false);
      }
    }
  }

  function calculateDaysAgo(uploadDate) {
    const currentDate = new Date();
    let uploadDateTime;

    if(uploadDate > 0 && uploadDate < Date.now()){
      uploadDateTime = new Date(parseInt(uploadDate));
    } else {
      uploadDateTime = new Date(uploadDate);
    }
    
    const timeDifference = currentDate - uploadDateTime;
    const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (daysAgo === 0) {
        const hoursAgo = Math.floor(timeDifference / (1000 * 60 * 60));
        if (hoursAgo === 0) {
            const minutesAgo = Math.floor(timeDifference / (1000 * 60));
            if (minutesAgo === 0) {
                const secondsAgo = Math.floor(timeDifference / 1000);
                return `${secondsAgo} seconds ago`;
            }
            return `${minutesAgo} minutes ago`;
        }
        return `${hoursAgo} hours ago`;
    }

    return `${daysAgo} days ago`;
  }

  function sortNotifications (allNotifications) {
    let notifications = [...allNotifications];
    let sortedData = notifications.sort((a, b) => {
      let uploadDateTimeA;
      let uploadDateTimeB;
  
      if(a.createdAt > 0 && a.createdAt < Date.now()){
        uploadDateTimeA = new Date(parseInt(a.createdAt));
      } else {
        uploadDateTimeA = new Date(a.createdAt);
      }

      if(b.createdAt > 0 && b.createdAt < Date.now()){
        uploadDateTimeB = new Date(parseInt(b.createdAt));
      } else {
        uploadDateTimeB = new Date(b.createdAt);
      }
      return uploadDateTimeB - uploadDateTimeA;
    });

    setNotificationList(sortedData);
    setCheckReadNotification(true);
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
                    {/* {formatDistance(subDays(new Date(), 3), new Date(), {
                      addSuffix: true
                    })} */}
                    {calculateDaysAgo(notification.createdAt)}
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
