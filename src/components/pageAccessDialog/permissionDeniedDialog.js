import * as React from 'react';
import {Box, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Button} from '@mui/material';
import { useRouter } from 'next/router';

function permissionDeniedDialog() {
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
                    <DialogContent >
                        <DialogContentText id="alert-dialog-description">
                            You don't have permission to access this page.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{justifyContent: 'center'}}>
                        <Button variant='contained' onClick={()=>{router.push('/')}} autoFocus>
                            Home
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    );
}

export default permissionDeniedDialog;