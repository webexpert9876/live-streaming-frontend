import { useRef, useState, useEffect } from 'react';
import { Typography, Button, Grid } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthState } from '../../../store/slices/authSlice';
import { selectAuthUser } from '../../../store/slices/authSlice';
import { setAuthUser, setAuthState } from '../../../store/slices/authSlice';
import { useRouter } from 'next/router';

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

function PageHeader({categoryAddFunction, isLimitReached}) {
    const dispatch = useDispatch();
    const nextRouter = useRouter();

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

    return (
        <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
                <Typography variant="h3" component="h3" gutterBottom>
                    All Subscription Plans
                </Typography>
                <Typography variant="subtitle2">
                    Subscription Plans List
                </Typography>
            </Grid>
            <Grid item>
                <Button
                    sx={{ mt: { xs: 2, md: 0 } }}
                    variant="contained"
                    startIcon={<AddTwoToneIcon fontSize="small" />}
                    disabled={isLimitReached}
                    // onClick={()=>{nextRouter.push('/management/video/add')}}
                    onClick={categoryAddFunction}
                >
                    Add Subscription Plans
                </Button>
            </Grid>
        </Grid>
    );
}

export default PageHeader;
