import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { useRouter } from 'next/router';
// import { setAuthUser, setAuthState } from '../../store/slices/authSlice';
import {
  Typography,
  Box,
  Card,
  Container,
  Button,
  styled,
  Link
} from '@mui/material';


import Logo from "../LogoSign";

const HeaderWrapper = styled(Card)(
    ({ theme }) => `
  width: 100%;
  display: flex;
  align-items: center;
  height: ${theme.spacing(10)};
  margin-bottom: ${theme.spacing(10)};
`);

const Header = ()=> {


    return (
        <>
            <HeaderWrapper className='stickyHeader'>
                <Container maxWidth="lg">
                    <Box display="flex" alignItems="center">
                        <Logo />
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            flex={1}
                        >
                            <Box />
                            <Box>
                                <Button
                                    component={Link}
                                    href="/auth/login"
                                    variant="contained"
                                    sx={{ ml: 2 }}
                                >
                                    Login
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Container>
            </HeaderWrapper>
            
            
        </>
    )
}

export default Header