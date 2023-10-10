import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import React, { useState } from 'react';
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
import { useRouter } from 'next/router';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .email('Email is invalid')
    .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/),
});





const defaultTheme = createTheme();

export default function SignInSide() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const router = useRouter();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };


  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;

  function onSubmit(data) {
    // display form data on success
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(data, null, 4));
    // return false;
    // event.preventDefault();
    setLoading(true);

    // Perform forgot password logic here
    // For example, send a reset password email to the provided email address

    // Reset the email input field
    axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/forgot/password`, {
      email: data.email
    })
      .then((response) => {
        // Handle the response from the API 
        setResponseMessage(`If the ${email} address you entered matched an existing account, please check your email for instructions on what to do next.`);
        setLoading(false);
      })
      .catch((error) => {
        // Handle errors        
          const errorMessage = error.response.data.message;
          setResponseMessage(`If the ${email} address you entered matched an existing account, please check your email for instructions on what to do next.`);
        setLoading(false);
      })
  };

  function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        <Button variant="contained"
        // onClick={()=> router.push("/")}
        ><a href="javascript:window.history.go(-1)" style={{color:"#fff", textDecoration:"none"}}>Back to login</a></Button>
        
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
              Reset your password
            </Typography>
            <FormControl onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: "400px", width: "100%" }}>
              <Box component="form" noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  {...register('email')}
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={loading}
                >

                  {loading ? 'Sending...' : 'Reset your password'}

                </Button>
                {/* {loading && <div style={{ color: "#fff" }}>Loading...</div>} */}
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