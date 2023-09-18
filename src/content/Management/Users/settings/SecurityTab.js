import { useEffect, useState, forwardRef } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  ListItem,
  List,
  ListItemText,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  ListItemAvatar,
  Avatar,
  Switch,
  CardHeader,
  Tooltip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  TextField,
  useTheme,
  styled
} from '@mui/material';

import DoneTwoToneIcon from '@mui/icons-material/DoneTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { format, subHours, subWeeks, subDays } from 'date-fns';
import axios from 'axios';
import { setAuthUser, selectAuthUser, selectAuthState } from '../../../../../store/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const ButtonError = styled(Button)(
  ({ theme }) => `
     background: ${theme.colors.error.main};
     color: ${theme.palette.error.contrastText};

     &:hover {
        background: ${theme.colors.error.dark};
     }
    `
);

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.success.light};
    width: ${theme.spacing(5)};
    height: ${theme.spacing(5)};
`
);

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    width: ${theme.spacing(5)};
    height: ${theme.spacing(5)};
`
);

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SecurityTab({userData}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [page, setPage] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [userInfo, setUserInfo] = useState(...userData)
  
  const [passwordInputs, setPasswordInputs] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [isPasswordChange, setIsPasswordChange] = useState(false);
  
  const [apiResponseMessage, setApiResponseMessage] = useState('');
  const [apiMessageType, setApiMessageType] = useState('');
  const [openOldPasswordError, setOpenOldPasswordError] = useState(false);
  const [oldPasswordErrorMessage, setOldPasswordErrorMessage] = useState('Old password is required');
  const [openNewPasswordError, setOpenNewPasswordError] = useState(false);
  const [newPasswordErrorMessage, setNewPasswordErrorMessage] = useState('New password is required');
  const [openConfirmPasswordError, setOpenConfirmPasswordError] = useState(false);
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState('Confirm password is required');
  const [openErrorBox, setOpenErrorBox] = useState(false);
  
  useEffect(()=>{
    if(isPasswordChange){
      
      if(passwordInputs.newPassword != passwordInputs.confirmPassword){
        setErrorMessage('New password and confirm password is not same');
        setLoading(false);
        setIsPasswordChange(false);
      } else {
        // console.log('userInfo', userInfo._id)

        let passwordData = {
          id: userInfo._id,
          oldPassword: passwordInputs.oldPassword,
          newPassword: passwordInputs.newPassword,
          confirmPassword: passwordInputs.confirmPassword
        }

        axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update/password/user`, passwordData, {headers: {'x-access-token': userInfo.jwtToken}}).then((data)=>{
          
          // console.log('data', data.data);
          dispatch(setAuthUser(data.data.user));
          localStorage.setItem('authUser', JSON.stringify(data.data.user))
          setSuccessMessage('Your password has been changed');
          setApiMessageType('success')
          setApiResponseMessage('Your password has been changed');
          setLoading(false);
          setIsPasswordChange(false)
          handleMessageBoxOpen()
          handleClose();
          
        }).catch((error)=>{
          console.log('error', error);
          const errorMessage = error.response.data.message;
          setSuccessMessage('');
          setErrorMessage(errorMessage);
          setApiMessageType('error')
          setApiResponseMessage(errorMessage);
          setIsPasswordChange(false)
          setLoading(false);
          handleMessageBoxOpen();
          handleClose();
        });

      }
    }
  }, [isPasswordChange])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const handleChangePassSubmit = () => {
    // setOpen(false);
    if(!passwordInputs.oldPassword){
      setOpenOldPasswordError(true)
    } 
    if(!passwordInputs.newPassword){
      setOpenNewPasswordError(true)
    }
    if(!passwordInputs.confirmPassword){
      setOpenConfirmPasswordError(true)
    } 

    if(passwordInputs.oldPassword && passwordInputs.newPassword && passwordInputs.confirmPassword){
      setIsPasswordChange(true);
      setLoading(true)
    }
    // setIsPasswordChange(true);
    // setLoading(true)
  };

  const handleFormChange = (e)=>{
    
    if (e.target.name == 'oldPassword') {
      setPasswordInputs((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value
      }))

      if (e.target.value) {
        setOpenOldPasswordError(false)
      } else {
        setOpenOldPasswordError(true)
        // setDescriptionErrorMessage('Video description is required');
      }
    } else if (e.target.name == 'newPassword') {
      setPasswordInputs((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value
      }))

      if (e.target.value) {
        setOpenNewPasswordError(false)
      } else {
        setOpenNewPasswordError(true)
        // setDescriptionErrorMessage('Video description is required');
      }
    } else if (e.target.name == 'confirmPassword') {
      setPasswordInputs((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value
      }))

      if (e.target.value) {
        setOpenConfirmPasswordError(false)
      } else {
        setOpenConfirmPasswordError(true)
        // setDescriptionErrorMessage('Video description is required');
      }
    }
    setErrorMessage('')
    setSuccessMessage('')
    // setPasswordInputs((prevState)=>({
    //   ...prevState,
    //   [e.target.name]: e.target.value
    // }))
    // setErrorMessage('')
    // setSuccessMessage('')
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const logs = [
    {
      id: 1,
      browser: ' Safari/537.36',
      ipaddress: '3.70.73.142',
      location: 'United States',
      date: subDays(new Date(), 2).getTime()
    },
    {
      id: 2,
      browser: 'Chrome/36.0.1985.67',
      ipaddress: '138.13.136.179',
      location: 'China',
      date: subDays(new Date(), 6).getTime()
    },
    {
      id: 3,
      browser: 'Googlebot/2.1',
      ipaddress: '119.229.170.253',
      location: 'China',
      date: subHours(new Date(), 15).getTime()
    },
    {
      id: 4,
      browser: 'AppleWebKit/535.1',
      ipaddress: '206.8.99.49',
      location: 'Philippines',
      date: subDays(new Date(), 4).getTime()
    },
    {
      id: 5,
      browser: 'Mozilla/5.0',
      ipaddress: '235.40.59.85',
      location: 'China',
      date: subWeeks(new Date(), 3).getTime()
    }
  ];

  const handleMessageBoxClose = () => {
    setOpenErrorBox(false);
    setApiResponseMessage('');
    setApiMessageType('')
  };
  const handleMessageBoxOpen = () => {
    setOpenErrorBox(true);
  };

  return (
    <>
      <Grid container spacing={3}>
        {/* <Grid item xs={12}>
          <Box pb={2}>
            <Typography variant="h3">Social Accounts</Typography>
            <Typography variant="subtitle2">
              Manage connected social accounts options
            </Typography>
          </Box>
          <Card>
            <List>
              <ListItem sx={{ p: 3 }}>
                <ListItemAvatar sx={{ pr: 2 }}>
                  <AvatarWrapper src="/static/images/logo/google.svg" />
                </ListItemAvatar>
                <ListItemText
                  primaryTypographyProps={{ variant: 'h5', gutterBottom: true }}
                  secondaryTypographyProps={{
                    variant: 'subtitle2',
                    lineHeight: 1
                  }}
                  primary="Google"
                  secondary="A Google account hasn’t been yet added to your account"
                />
                <Button color="secondary" size="large" variant="contained">
                  Connect
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <List>
              <ListItem sx={{ p: 3 }}>
                <ListItemAvatar sx={{ pr: 2 }}>
                  <AvatarSuccess>
                    <DoneTwoToneIcon />
                  </AvatarSuccess>
                </ListItemAvatar>
                <ListItemText
                  primaryTypographyProps={{ variant: 'h5', gutterBottom: true }}
                  secondaryTypographyProps={{
                    variant: 'subtitle2',
                    lineHeight: 1
                  }}
                  primary="Facebook"
                  secondary="Your Facebook account has been successfully connected"
                />
                <ButtonError size="large" variant="contained">
                  Revoke access
                </ButtonError>
              </ListItem>
              <Divider component="li" />
              <ListItem sx={{ p: 3 }}>
                <ListItemAvatar sx={{ pr: 2 }}>
                  <AvatarSuccess>
                    <DoneTwoToneIcon />
                  </AvatarSuccess>
                </ListItemAvatar>
                <ListItemText
                  primaryTypographyProps={{ variant: 'h5', gutterBottom: true }}
                  secondaryTypographyProps={{
                    variant: 'subtitle2',
                    lineHeight: 1
                  }}
                  primary="Twitter"
                  secondary="Your Twitter account was last syncronized 6 days ago"
                />
                <ButtonError size="large" variant="contained">
                  Revoke access
                </ButtonError>
              </ListItem>
            </List>
          </Card>
        </Grid> */}
        <Grid item xs={12}>
          <Box pb={2}>
            <Typography variant="h3">Security</Typography>
            <Typography variant="subtitle2">
              Change your security preferences below
            </Typography>
          </Box>
          <Card>
            <List>
              <ListItem sx={{ p: 3 }}>
                <ListItemText
                  primaryTypographyProps={{ variant: 'h5', gutterBottom: true }}
                  secondaryTypographyProps={{
                    variant: 'subtitle2',
                    lineHeight: 1
                  }}
                  primary="Change Password"
                  secondary="You can change your password here"
                />
                <Button size="large" variant="outlined" onClick={handleClickOpen}>
                  Change password
                </Button>
              </ListItem>
              <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Change Password</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Please Enter your new password below
                  </DialogContentText>
                  {errorMessage && <p style={{ color: "#f00" }}>{errorMessage}</p>}
                  {successMessage && <p style={{ color: "#008000" }}>{successMessage}</p>}
                  <TextField
                    autoFocus
                    margin="dense"
                    id="old-password"
                    label="Enter Old Password"
                    type="text"
                    fullWidth
                    variant="standard"
                    name='oldPassword'
                    onChange={handleFormChange}
                    error={openOldPasswordError}
                    helperText={openOldPasswordError?oldPasswordErrorMessage:null}
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    id="n-password"
                    label="Enter New Password"
                    type="text"
                    fullWidth
                    variant="standard"
                    name='newPassword'
                    onChange={handleFormChange}
                    error={openNewPasswordError}
                    helperText={openNewPasswordError?newPasswordErrorMessage:null}
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    id="c-password"
                    label="Enter Confirm Password"
                    type="text"
                    fullWidth
                    variant="standard"
                    name='confirmPassword'
                    onChange={handleFormChange}
                    error={openConfirmPasswordError}
                    helperText={openConfirmPasswordError?confirmPasswordErrorMessage:null}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button onClick={handleChangePassSubmit} disabled={loading}>{loading? 'Changing...': 'Change'}</Button>
                </DialogActions>
              </Dialog>
              <Divider component="li" />
              <ListItem sx={{ p: 3 }}>
                <ListItemText
                  primaryTypographyProps={{ variant: 'h5', gutterBottom: true }}
                  secondaryTypographyProps={{
                    variant: 'subtitle2',
                    lineHeight: 1
                  }}
                  primary="Two-Factor Authentication"
                  secondary="Enable PIN verification for all sign in attempts"
                />
                <Switch color="primary" />
              </ListItem>
            </List>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              subheaderTypographyProps={{}}
              titleTypographyProps={{}}
              title="Access Logs"
              subheader="Recent sign in activity logs"
            />
            <Divider />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Browser</TableCell>
                    <TableCell>IP Address</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Date/Time</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id} hover>
                      <TableCell>{log.browser}</TableCell>
                      <TableCell>{log.ipaddress}</TableCell>
                      <TableCell>{log.location}</TableCell>
                      <TableCell>
                        {format(log.date, 'dd MMMM, yyyy - h:mm:ss a')}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip placement="top" title="Delete" arrow>
                          <IconButton
                            sx={{
                              '&:hover': {
                                background: theme.colors.error.lighter
                              },
                              color: theme.palette.error.main
                            }}
                            color="inherit"
                            size="small"
                          >
                            <DeleteTwoToneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box p={2}>
              <TablePagination
                component="div"
                count={100}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }} open={openErrorBox} autoHideDuration={6000} onClose={handleMessageBoxClose} >
          <Alert onClose={handleMessageBoxClose} variant="filled" severity={`${apiMessageType=='success'? 'success': 'error'}`} sx={{ width: '100%' }}>
            {apiResponseMessage}
          </Alert>
        </Snackbar>
      </Stack>
    </>
  );
}

export default SecurityTab;
