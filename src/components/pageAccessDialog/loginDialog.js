import * as React from 'react';
import {Box, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Button} from '@mui/material';
import { useRouter } from 'next/router';

function LoginDialog() {
    const router = useRouter();
    return (
        <>
            <Dialog
                open={true}
                // onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Box padding={1}>
                    <DialogTitle id="alert-dialog-title">
                        {"Login Required"}
                    </DialogTitle>
                    <DialogContent >
                        <DialogContentText id="alert-dialog-description">
                            Please login to access this page.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{justifyContent: 'center'}}>
                        <Button variant='contained' onClick={()=>{router.push('/auth/login')}} autoFocus>
                            Login
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    );
}

export default LoginDialog;