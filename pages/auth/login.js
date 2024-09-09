
import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FormControl } from '@mui/material';
import axios from 'axios';
import Container from '@mui/material/Container';
import { useRouter } from 'next/router';
import { setAuthUser, setAuthState } from '../../store/slices/authSlice';
import GoogleIcon from '@mui/icons-material/Google';
import Image from 'next/image'




// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();
const LoginForm = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSignInGoogle, setIsSignInGoogle] = useState(false);
  const router = useRouter();


  useEffect(()=>{
    if(isSignInGoogle){
      window.open(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google/signin`, "_self");
    }
  },[isSignInGoogle])

  const handleUsernameChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    // Send login request to the API using Axios    
    axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
      email,
      password
    })
      .then((response) => {
        // Handle the response from the API      
        // console.log(response.data);
        localStorage.setItem('authUser', JSON.stringify(response.data.user))
        localStorage.setItem('authState', true)
        dispatch(setAuthState(true));
        dispatch(setAuthUser(response.data.user));
        // console.log(response.data);
        router.push('/dashboards');
        setLoading(false);
      })
      .catch((error) => {
          // The request was made and the server responded with a status code outside the range of 2xx
          const errorMessage = error.response.data.message;
          setErrorMessage(errorMessage);        
        setLoading(false);
      });
  };

  const mapStateToProps = (state) => ({
    authUser: state.auth.authUser, // Replace 'auth' with the key where your authUser is stored in the Redux store
  });


  function HomeButton(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        <Button variant="contained"
        onClick={()=> router.push("/")}
        >Home</Button>
      </Typography>
    );
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
            <Typography variant="h5">
              Sign in
            </Typography>
            <FormControl onSubmit={handleSubmit} style={{ maxWidth: "400px", width: "100%", }}>
              <Container maxWidth="sm" max-auto>

                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    value={email}
                    onChange={handleUsernameChange}
                    autoComplete="email"
                    autoFocus
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                    autoComplete="current-password"
                  />
                  {errorMessage && <p style={{ color: "#f00" }}>{errorMessage}</p>}
                  <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={loading}
                  >                    
                    {loading ? 'Sending...' : 'Sign In'}
                  </Button>
                  <Grid container>
                    <Grid item xs>
                      <Link                       
                      onClick={()=> router.push("/auth/forgot")}
                      variant="body2"
                      style={{cursor: "pointer"}}
                      >
                        Forgot password?
                      </Link>
                    </Grid>
                    <Grid item>
                      <Link 
                      onClick={()=> router.push("/auth/registration")}
                      variant="body2"
                      style={{cursor: "pointer"}}
                      >
                        {"Don't have an account? Sign Up"}
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
                  <HomeButton sx={{ mt: 5 }} />
                </Box>
              </Container>
            </FormControl>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
export default LoginForm;