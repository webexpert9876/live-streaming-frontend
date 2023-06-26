import { useRef, useState, useEffect } from 'react';
import { Typography, Button, Grid } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthState } from '../../../store/slices/authSlice';
import { selectAuthUser } from '../../../store/slices/authSlice';
import { setAuthUser, setAuthState } from '../../../store/slices/authSlice';

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

function PageHeader() {
    const dispatch = useDispatch();
    const user = {
        name: 'Catherine Pike',
        avatar: '/static/images/avatars/1.jpg'
    };

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
                    All Video
                </Typography>
                <Typography variant="subtitle2">
                    {authState?.firstName} {authState?.lastName}, these are your recent videos
                </Typography>
            </Grid>
            <Grid item>
                <Button
                    sx={{ mt: { xs: 2, md: 0 } }}
                    variant="contained"
                    startIcon={<AddTwoToneIcon fontSize="small" />}
                >
                    Add video
                </Button>
            </Grid>
        </Grid>
    );
}

export default PageHeader;
