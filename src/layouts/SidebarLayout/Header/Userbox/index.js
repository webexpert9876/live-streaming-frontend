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

  const nextRouter = useRouter();

  // const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); 

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     nextRouter.push('/auth/login');
  //   }
  // }, [isAuthenticated, nextRouter]);

  // if (!isAuthenticated) {
  //   return null; // Optional: Show a loading state or message here
  // }


  
  useEffect(() => {
    let authUser = JSON.parse(localStorage.getItem('authUser'))
    let authState = JSON.parse(localStorage.getItem('authState'))
    if (authUser) {
      dispatch(setAuthUser(authUser));
      dispatch(setAuthState(authState));
    }
    if(authState != true){
      nextRouter.push('/auth/login');
    }
  }, [])
  const authState = useSelector(selectAuthUser);
  const user = {
    name: 'Catherine Pike',
    avatar: '/static/images/avatars/1.jpg',
    jobtitle: 'Project Manager'
  };
  console.log(authState)

  const ref = useRef(null);
  const [isOpen, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const router = useRouter();

  const handleLogout = () => {
    // Perform logout logic here, such as clearing user session or JWT token
    // After logout, you can redirect the user to the login page or any other desired page
    // For example, redirecting to the login page:
    dispatch(logout());
    router.push('/auth/login');
    console.log("Click to logout")

  };



  return (
    <>
      <UserBoxButton color="secondary" ref={ref} onClick={handleOpen}>
        <Avatar variant="rounded" alt={user.name} src={user.avatar} />
        <Hidden mdDown>
          <UserBoxText>
            {/* <UserBoxLabel variant="body1">{user.name}</UserBoxLabel> */}
            <UserBoxLabel variant="body1">{authState?.firstName} {authState?.lastName}</UserBoxLabel>
            <UserBoxDescription variant="body2">
              {user.jobtitle}
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
          <Avatar variant="rounded" alt={user.name} src={user.avatar} />
          <UserBoxText>
            <UserBoxLabel variant="body1">{authState?.firstName} {authState?.lastName}</UserBoxLabel>
            <UserBoxDescription variant="body2">
              {user.jobtitle}
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
          <NextLink href="/management/profile/settings" passHref>
            <ListItem button>
              <AccountTreeTwoToneIcon fontSize="small" />
              <ListItemText primary="Account Settings" />
            </ListItem>
          </NextLink>
        </List>
        <Divider />
        <Box sx={{ m: 1 }}>
          {/* <Button color="primary" fullWidth onClick={() => dispatch(logout())}>
            <LockOpenTwoToneIcon sx={{ mr: 1 }} />
            Sign out           
          </Button> */}
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
