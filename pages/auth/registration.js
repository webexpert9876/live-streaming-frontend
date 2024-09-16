import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image'

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



function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

const emailRegex = '/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/'

export default function SignInSide() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [promotions, setPromotions] = useState('');
  const [style, setStyle] = useState([]);
  const [styleList, setStyleList] = useState([]);
  const [errorMessage, setErrorMessage] = useState({
    firstNameMsg: '',
    lastNameMsg: '',
    usernameMsg: '',
    passwordMsg: '',
  });  
  const [emailErrorMessage, setEmailErrorMessage] = useState('');  
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignInGoogle, setIsSignInGoogle] = useState(false);
  const router = useRouter();

  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [styleError, setStyleError] = useState(false);


  useEffect(()=>{
    if(isSignInGoogle){
      window.open(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google/signin`, "_self");
    }
  },[isSignInGoogle])

  const handleFirstNameChange = (event) => {
    let val = event.target.value.trim()
    const nameRegex = /^[A-Za-z0-9]+$/;
    setFirstName(val);
    if(!nameRegex.test(val)) {
      setErrorMessage((prev)=>({...prev, firstNameMsg: 'Please enter valid first name, do not use special characters.'}));
      setFirstNameError(true);
    } else {
    }
  };

  const handleLastNameChange = (event) => {
    let val = event.target.value.trim()
    const nameRegex = /^[A-Za-z0-9]+$/;
    setLastName(val);
    if(!nameRegex.test(val)) {
      setErrorMessage((prev)=>({...prev, lastNameMsg: 'Please enter valid last name, do not use special characters.'}));
      setLastNameError(true);
    } else {
    }
    // setLastName(event.target.value.trim());
  };
  
  const handleUserNameChange = (event) => {
    let val = event.target.value.trim()
    const nameRegex = /^[A-Za-z0-9]+$/;
    setUsername(val);
    if(!nameRegex.test(val)) {
      setErrorMessage((prev)=>({...prev, usernameMsg: 'Please enter valid user name, do not use special characters.'}));
      setUsernameError(true);
    } else {
    }
    // setUsername(event.target.value.trim());
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    // let val = event.target.value.trim()
    // const nameRegex = /^[A-Za-z0-9]+$/;
    // if(nameRegex.test(val)) {
    //   setPassword(val);
    // } else {
    //   setErrorMessage((prev)=>({...prev, passwordMsg: 'Please enter valid password name, do not use special characters.'}));
    //   setPasswordError(true);
    // }
    setPassword(event.target.value.trim());
  };

  const handlePromotionsChange = (event) => {
    setPromotions(event.target.value);
  };

  const handleStyleChange = (event) => {
    setStyle(event.target.value);
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required('Email is required')
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format'),
  });

  const validateForm =async () => {
    let valid = true;

    if (!firstName) {
      setErrorMessage((prev)=>({...prev, firstNameMsg: 'First name is required'}));
      setFirstNameError(true);
      valid = false;
    } else {
        setFirstNameError(false);
    }
    if (!lastName) {
      setErrorMessage((prev)=>({...prev, lastNameMsg: 'Last name is required.'}));
      setLastNameError(true);
      valid = false;
    } else {
      setLastNameError(false);
    }
    if (!username) {
      setErrorMessage((prev)=>({...prev, usernameMsg: 'Username is required.'}));
      setUsernameError(true);
      valid = false;
    } else {
        setUsernameError(false);
    }
    if (!email) {
      setEmailErrorMessage('Email is required')
      setEmailError(true);
      valid = false;
    } else {
      try {
        await validationSchema.validate({ email: email })
        setEmailError(false)
      } catch(err) {
        valid = false
        setEmailError(true)
        setEmailErrorMessage('Please Enter valid email address')
      }
    }
    if (!password) {
      setErrorMessage((prev)=>({...prev, passwordMsg: 'Password is required.'}));
      setPasswordError(true);
      valid = false;
    } else {
        setPasswordError(false);
    }
    return valid;
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    let valid = await validateForm();
    console.log(`${valid} && ${!firstNameError} && ${!lastNameError} && ${!usernameError} && ${!passwordError} && ${!emailError}`)
    if(valid && !firstNameError && !lastNameError && !usernameError && !passwordError && !emailError) {
      console.log('fetching')
      setLoading(true);
      axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`, {
        firstName,
        lastName,
        username,
        email,
        password,
        style,
      })
      .then((response) => {
        setSuccessMessage('You are successfuly register!');
        setErrorMessage('');
        setLoading(false);
      })
      .catch((error) => {
        if (error.response) {          
          setSuccessMessage('');
          const errorMessage = error.response.data.message;
          setErrorMessage(errorMessage);
        } else if (error.request) {          
          console.error('No response received from the server.');
        } else {
          console.error('Error occurred while sending the request.', error.message);          
        }
        setLoading(false);
      });
    }      
  };

  // This is style start
  useEffect(() => {
    axios
    .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/api/free/get/all/category`)
    .then((response) => {
      setStyleList(response.data.TattoCategories)   
    })
    .catch((error) => {
      // Handle errors
      if (error.response) {
        // The request was made and the server responded with a status code outside the range of 2xx
        const errorMessage = error.response.data.message;
        setErrorMessage(errorMessage);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received from the server.');
      } else {
        // Something happened in setting up the request that triggered an error
        console.error('Error occurred while sending the request.', error.message);
      }
    });
  },[])
 
  // This is style End

  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  
  function getStyles(styles, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(styles) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }


  return (
    <ThemeProvider>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1640551500523-75069f08c3a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE1fHx8ZW58MHx8fHx8&w=1000&q=80)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <FormControl onSubmit={handleSubmit} style={{maxWidth: "400px", width: "100%"}}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="given-name"
                      name="firstName"
                      required
                      fullWidth
                      id="firstName"
                      value={firstName}
                      onChange={handleFirstNameChange}
                      label="First Name"
                      inputProps={{
                        pattern: "[A-Za-z ]+",
                      }}
                      autoFocus
                    />
                    {firstNameError && (
                      <Typography color="error" sx={{ textAlign: 'left', fontSize: '0.875em' }}>
                          {/* First Name is required. */}
                          {errorMessage.firstNameMsg}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="lastName"
                      value={lastName}
                      onChange={handleLastNameChange}
                      label="Last Name"
                      name="lastName"
                      autoComplete="family-name"
                    />
                    {lastNameError && (
                      <Typography color="error" sx={{ textAlign: 'left', fontSize: '0.875em' }}>
                          {/* Last Name is required. */}
                          {errorMessage.lastNameMsg}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="username"
                      value={username}
                      onChange={handleUserNameChange}
                      label="username"
                      name="username"
                    />
                    {usernameError && (
                      <Typography color="error" sx={{ textAlign: 'left', fontSize: '0.875em' }}>
                          {/* Username is required. */}
                          {errorMessage.usernameMsg}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      value={email}
                      onChange={handleEmailChange}
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                    />
                    {emailError && (
                      <Typography color="error" sx={{ textAlign: 'left', fontSize: '0.875em' }}>
                          {/* Email is required. */}
                          {emailErrorMessage}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      value={password}
                      onChange={handlePasswordChange}
                      autoComplete="new-password"
                    />
                    {passwordError && (
                      <Typography color="error" sx={{ textAlign: 'left', fontSize: '0.875em' }}>
                          {/* Password is required. */}
                          {errorMessage.passwordMsg}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl sx={{ width: "100%" }}>
                      <InputLabel id="demo-multiple-name-label">Styles</InputLabel>
                      <Select
                        labelId="demo-multiple-name-label"
                        multiple
                        id="style"
                        value={style}
                        onChange={handleStyleChange}
                        input={<OutlinedInput label="Name" />}
                        MenuProps={MenuProps}
                      >
                        {styleList.map((styles) => (
                          <MenuItem
                            key={styles._id}
                            value={styles._id}
                            style={getStyles(styles, personName, theme)}
                          >
                            {styles.title}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  {/* <Grid item xs={12}>
                    <FormControlLabel
                      onChange={handlePromotionsChange}
                      id={promotions}
                      control={<Checkbox value="allowExtraEmails" color="primary" />}
                      label="I want to receive inspiration, marketing promotions and updates via email."
                    />
                  </Grid> */}
                </Grid>
                {/* <FormControl>
                 
                  {errorMessage && <p style={{ color: "#f00" }}> {errorMessage} </p>} 
                  {successMessage && <p style={{ color: "#0f0" }}>{successMessage}</p>}
                </FormControl> */}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}                  
                  disabled={loading}
                >                  
                  {loading ? 'Sending...' : 'Sign Up'}
                </Button>
              </FormControl>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link 
                  onClick={()=> router.push("/auth/login")}
                  variant="body2"
                  style={{cursor: "pointer"}}
                  >
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
              <Box sx={{textAlign: 'center'}}>
                <Typography variant='h5' component='h5' mt={2}>OR</Typography>
                <Button variant='outlined' sx={{color: 'white', width: '150px', marginTop: '16px'}} onClick={()=>{setIsSignInGoogle(true)}}>
                {/* <Button variant='outlined' startIcon={<GoogleIcon color='error'/>} sx={{color: 'white', width: '150px', marginTop: '16px'}} onClick={()=>{setIsSignInGoogle(true)}}> */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap:'10px' }}>
                    <Box mt={'5px'}>
                      <Image
                        src='/google-logo-9808.png'
                        alt="google logo"
                        width="20px"
                        height="20px"
                        marginTop='5px'
                      />
                    </Box>
                    <Box>
                      <Typography variant='span' component='span'>Google</Typography>
                    </Box>
                  </Box>
                </Button>
              </Box>
            </Box>
          </Box>
          <Copyright sx={{ mt: 5 }} />
        </Grid >
      </Grid>

    </ThemeProvider >
  );
}