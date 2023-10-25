import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import NextLink from 'next/link';
import { logout } from '../../../../../store/slices/authSlice';

import {
  Avatar,
  Box,
  Button,
  Divider,
  Hidden,
  lighten,
  List,
  ListItem,
  ListItemText,
  Popover,
  Typography
} from '@mui/material';

import InboxTwoToneIcon from '@mui/icons-material/InboxTwoTone';
import { styled } from '@mui/material/styles';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import AccountTreeTwoToneIcon from '@mui/icons-material/AccountTreeTwoTone';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthUser } from '../../../../../store/slices/authSlice';
import { setAuthUser, setAuthState } from '../../../../../store/slices/authSlice';
import axios from 'axios';


const UserBoxButton = styled(Button)(
  ({ theme }) => `
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(1)};
`
);

const MenuUserBox = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(2)};
`
);

const UserBoxText = styled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
);

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`
);

const UserBoxDescription = styled(Typography)(
  ({ theme }) => `
        color: ${lighten(theme.palette.secondary.main, 0.5)}
`
);

function HeaderUserbox() {
  const dispatch = useDispatch();
  const [roleInfo , setRoleInfo] = useState({});
  const router = useRouter();

 
  useEffect(() => {
    let authUser = JSON.parse(localStorage.getItem('authUser'))
    let authState = JSON.parse(localStorage.getItem('authState'))
    if (authUser) {
      dispatch(setAuthUser(authUser));
      dispatch(setAuthState(authState));
    }
    if(authState != true){
      router.push('/auth/login');
    }
  }, [])
  const authState = useSelector(selectAuthUser);
  
  useEffect(()=>{
    if(authState != undefined || authState != null){
      if(authState.role != null){

        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/single/role/${authState.role}`, {headers: {'x-access-token': authState.jwtToken}}).then((data)=>{
          setRoleInfo(data.data.role);
        }).catch((error)=>{
          console.log('error', error.response.data.message);
          if(error.response.data.message == 'Json Web Token is Expired, Try again '){
            router.push('/auth/login');
          }
        });
      }
    }
  }, [authState]);

  const ref = useRef(null);
  const [isOpen, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const handleLogout = () => {
    dispatch(logout());
    dispatch(setAuthUser(null));
    dispatch(setAuthState(false));
    router.push('/auth/login');

  };



  return (
    <>
      <UserBoxButton color="secondary" ref={ref} onClick={handleOpen}>
        <Avatar variant="rounded" alt={authState?.firstName} src={authState?authState.profilePicture?`${process.env.NEXT_PUBLIC_S3_URL}/${authState?.profilePicture}`: '':''} />
        <Hidden mdDown>
          <UserBoxText>            
            <UserBoxLabel variant="body1">{authState?.firstName} {authState?.lastName}</UserBoxLabel>
            <UserBoxDescription variant="body2">
              {roleInfo.role}
            </UserBoxDescription>
          </UserBoxText>
        </Hidden>
        <Hidden smDown>
          <ExpandMoreTwoToneIcon sx={{ ml: 1 }} />
        </Hidden>
      </UserBoxButton>
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
        <MenuUserBox sx={{ minWidth: 210 }} display="flex">
          <Avatar variant="rounded" alt={authState?.firstName} src={authState?authState.profilePicture?`${process.env.NEXT_PUBLIC_S3_URL}/${authState?.profilePicture}`: '': ''}/>
          <UserBoxText>
            <UserBoxLabel variant="body1">{authState?.firstName} {authState?.lastName}</UserBoxLabel>
            <UserBoxDescription variant="body2">
              {roleInfo.role}
            </UserBoxDescription>
          </UserBoxText>
        </MenuUserBox>
        <Divider sx={{ mb: 0 }} />
        <List sx={{ p: 1 }} component="nav">
          <NextLink href="/management/profile" passHref>
            <ListItem button>
              <AccountBoxTwoToneIcon fontSize="small" />
              <ListItemText primary="My Profile" />
            </ListItem>
          </NextLink>
          <NextLink href="/applications/messenger" passHref>
            <ListItem button>
              <InboxTwoToneIcon fontSize="small" />
              <ListItemText primary="Messenger" />
            </ListItem>
          </NextLink>
          
          {roleInfo.role == 'artist' && <NextLink href="/management/channel/settings" passHref>
            <ListItem button>
              <AccountTreeTwoToneIcon fontSize="small" />
              <ListItemText primary="Account Settings" />
            </ListItem>
          </NextLink>
          }
          {roleInfo.role == 'user' && <NextLink href="/management/profile/settings" passHref>
            <ListItem button>
              <AccountTreeTwoToneIcon fontSize="small" />
              <ListItemText primary="Account Settings" />
            </ListItem>
          </NextLink>}
        </List>
        <Divider />
        <Box sx={{ m: 1 }}>          
          <Button color="primary" fullWidth onClick={handleLogout}>
            <LockOpenTwoToneIcon sx={{ mr: 1 }} />
            Sign out
          </Button>
        </Box>
      </Popover>
    </>
  );
}

export default HeaderUserbox;
