import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from 'next/router';
import client from "../../graphql";
import { gql } from "@apollo/client";
import { useDispatch } from 'react-redux';
import { setAuthUser, setAuthState } from '../../store/slices/authSlice';


export default function GoogleSuccess() {
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();
  

  return (
    <>
      {/* <Dialog open={open} aria-labelledby="google-login-success-dialog">
          <DialogTitle id="google-login-success-dialog">Successfully Logged In!</DialogTitle>
          <DialogContent dividers>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
              </div>
          </DialogContent>
      </Dialog> */}
      <Box sx={{textAlign: 'center', width: '100%', padding: '15%'}}>
        <CircularProgress />
        <Typography>
            Loading...
        </Typography>
      </Box>
    </>
  );
}