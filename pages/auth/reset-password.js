import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
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

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(20, 'Password must not exceed 20 characters'),

  confirmPassword: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .oneOf([Yop.ref('password'), null], 'Password must match')
});

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

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignInSide() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();
  // console.log('asdfsadf',router.query);
  const { token } = router.query;
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');


  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const formOptions = { resolver: yupResolver(validationSchema) };
  // get functions to build form with useForm() hook
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;

  function onSubmit(data) {
    setLoading(true);

    if (password !== confirmPassword) {
      // Handle password mismatch error
      console.error('Passwords do not match.');
      return;
    }


    // Send a request to the password reset API endpoint
    axios.put(`https://tattoo-live-streaming-api-server.onrender.com/auth/reset/password/${token}`, { password, confirmPassword })

      .then((response) => {
        // Handle the response from the API
        console.log(response.data);
        console.log("Password send sucsess!")
        setResponseMessage(`Password changed successfully`);
        setLoading(false);
      })
      .catch((error) => {
        // Handle errors
        if (error.response) {
          // The request was made and the server responded with a status code outside the range of 2xx
          const errorMessage = error.response.data.message;
          setResponseMessage(`Password changed successfully`);

        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response received from the server.');
          setResponseMessage(`Password changed successfully`);
        } else {
          // Something happened in setting up the request that triggered an error
          console.error('Error occurred while sending the request.', error.message);
          setResponseMessage(`Password changed successfully`);
        }
        setLoading(false);
      })
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
                Change Password
              </Typography>
              <FormControl onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: "400px", width: "100%" }}>
                <Box component="form" noValidate sx={{ mt: 1 }}>

                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    onChange={handlePasswordChange}
                    autoComplete="current-password"
                    {...register('password')}
                    error={Boolean(errors.password)}
                    helperText={errors.password?.message}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm password"
                    type="confirmPassword"
                    id="confirmPassword"
                    onChange={handleConfirmPasswordChange}
                    autoComplete="confirmPassword"
                    {...register('confirmPassword')}
                    error={Boolean(errors.confirmPassword)}
                    helperText={errors.confirmPassword?.message}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={loading}
                  >

                    {loading ? 'Sending...' : 'Change Password'}
                  </Button>
                  {responseMessage && <div style={{ color: "#0f0", textAlign: "center" }}>{responseMessage}</div>}
                  <Copyright sx={{ mt: 5 }} />
                </Box>
              </FormControl>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    );
  }