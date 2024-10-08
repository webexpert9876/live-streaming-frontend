import React, { useEffect, useState, useContext } from 'react';
import {
    Typography,
    Box,
    Card,
    Container,
    Button,
    styled,
    Link,
    alpha,
    Stack,
    lighten,
    Divider,
    IconButton,
    Tooltip,
    useTheme
} from '@mui/material';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import client from "../../../graphql";
import { gql } from "@apollo/client";

import Logo from "../LogoSign";
import { selectRouteInfo } from '../../../store/slices/routeSlice';

import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import { SidebarContext } from 'src/contexts/SidebarContext';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';


// import Dropdown from '@mui/joy/Dropdown';
// import Menu from '@mui/joy/Menu';
// import MenuButton from '@mui/joy/MenuButton';
// import MenuItem from '@mui/joy/MenuItem';


import HeaderButtons from '../../layouts/SidebarLayout/Header/Buttons';
import HeaderUserbox from '../../layouts/SidebarLayout/Header/Userbox';
import HeaderMenu from '../../layouts/SidebarLayout/Header/Menu';
import { setAuthUser, setAuthState, selectAuthState, selectAuthUser } from '../../../store/slices/authSlice';

const HeaderWrapperLogin = styled(Box)(
    ({ theme }) => `
        height: ${theme.header.height};
        color: ${theme.header.textColor};
        padding: ${theme.spacing(0, 2)};
        right: 0;
        z-index: 6;
        background-color: ${alpha(theme.header.background, 0.95)};
        backdrop-filter: blur(3px);
        position: fixed;
        justify-content: space-between;
        width: 100%;
        @media (min-width: ${theme.breakpoints.values.lg}px) {
            left: ${theme.sidebar.width};
            width: auto;
        }
`
);

const HeaderWrapper = styled(Card)(
    ({ theme }) => `
  width: 100%;
  display: flex;
  align-items: center;
  height: ${theme.spacing(10)};
  margin-bottom: ${theme.spacing(10)};
`);

const Header = () => {
    const authState = useSelector(selectAuthState);
    const [isLoggedIn, setIsLoggedIn] = useState(authState);
    const router = useRouter()
    const currentPath = router.pathname;
    const routeInfo = useSelector(selectRouteInfo);
    const [currentRouteInfo, setCurrentRouteInfo] = useState(routeInfo)
    const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);
    const theme = useTheme();
    const authStateUser = useSelector(selectAuthUser);
    const dispatch = useDispatch();
    const [loginType, setLoginType] = useState('')
    const [userDetail, setUserDetail] = useState([]);

    const hideUrls = [
        '/single-category/[categorySlug]',
        '/tag/[slug]',
        '/channel/[channelName]',
        '/channel/request',
        '/user/[userName]',
        'video/[id]',
        '/live/channels',
        '/'
    ]

    const shouldHideIcon = hideUrls.some((url) => {
        return (
          currentPath === url
        );
    });

    useEffect(async ()=>{
        if(!router.query.id) {
            setLoginType('normal');
            return;
        }

        // setSlug(router.query.channelName[0].toUpperCase() + router.query.channelName.slice(1));
        
        // setChannelSlug(router.query.channelName);
        // setIsFetchingChannel(true)
        await client.query({
            query: gql`
                query Query ($usersId: ID) {
                    users(id: $usersId) {
                        _id
                        blocked
                        channelId
                        email
                        firstName
                        interestStyles
                        isActive
                        jwtToken
                        lastName
                        profilePicture
                        role
                        urlSlug
                        username
                    }
                }
            `,
            variables: {
                "usersId": router.query.id
            }
        }).then((result) => {
            if(result.data.users.length > 0){
                localStorage.setItem('authUser', JSON.stringify(result.data.users[0]));
                localStorage.setItem('authState', true);
                
                dispatch(setAuthState(true));
                dispatch(setAuthUser(result.data.users[0]));
                setLoginType('google');
                setIsLoggedIn(true);
                setUserDetail([...result.data.users]);
                // console.log(response.data);
                router.push('/dashboards');
            }
        });
    }, [router.query.id]);

    useEffect(() => {
        if(loginType == 'normal'){

            let check = localStorage.getItem("authState")
            let authUser = JSON.parse(localStorage.getItem('authUser'))
            let authState = JSON.parse(localStorage.getItem('authState'))
            if (authUser) {
                setUserDetail([authUser]);
                dispatch(setAuthUser(authUser));
                dispatch(setAuthState(authState));
                if (JSON.parse(check) == true) {
                    setIsLoggedIn(true)
                }
            }
        }
    }, [loginType])

    useEffect(() => {
        if (authState == true) {
            setUserDetail([authStateUser]);
            setIsLoggedIn(true)
        } else {
            setIsLoggedIn(false)
        }
    }, [authState])

    return (
        <>
            {router.pathname.includes('/auth') ? null : (isLoggedIn ? (<HeaderWrapperLogin
                display="flex"
                alignItems="center"
                style={{ left: "0" }}
                sx={{
                    boxShadow:
                        theme.palette.mode === 'dark'
                            ? `0 1px 0 ${alpha(
                                lighten(theme.colors.primary.main, 0.7),
                                0.15
                            )}, 0px 2px 8px -3px rgba(0, 0, 0, 0.2), 0px 5px 22px -4px rgba(0, 0, 0, .1)`
                            : `0px 2px 8px -3px ${alpha(
                                theme.colors.alpha.black[100],
                                0.2
                            )}, 0px 5px 22px -4px ${alpha(
                                theme.colors.alpha.black[100],
                                0.1
                            )}`
                }}
            >

                <Stack
                    direction="row"
                    divider={<Divider orientation="vertical" flexItem />}
                    alignItems="center"
                    spacing={2}
                    ml={'9px'}
                >
                    {/* <HeaderMenu /> */}
                    <Logo />
                </Stack>
                <Box display="flex" alignItems="center">
                    {userDetail.length > 0 && 
                    <>
                        <HeaderButtons />
                        <HeaderUserbox />
                    </>
                    }
                    {!shouldHideIcon && <Box
                        component="span"
                        sx={{
                            ml: 2,
                            display: { lg: 'none', xs: 'inline-block' }
                        }}
                    >
                        <Tooltip arrow title="Toggle Menu">
                            <IconButton color="primary" onClick={toggleSidebar}>
                                {!sidebarToggle ? (
                                    <MenuTwoToneIcon fontSize="small" />
                                ) : (
                                    <CloseTwoToneIcon fontSize="small" />
                                )}
                            </IconButton>
                        </Tooltip>
                    </Box>}
                </Box>
            </HeaderWrapperLogin>) : (<HeaderWrapper className='stickyHeader'>
                {/* {currentRouteInfo ? (<HeaderWrapper className='stickyHeader'> */}
                <Container maxWidth="false">
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
                                {/* <Button
                                    component={Link}
                                    href="/auth/login"
                                    variant="contained"
                                    sx={{ ml: 2 }}
                                >
                                    Login
                                </Button> */}

                                <Button
                                    component={Link}
                                    // href="/auth/login"
                                    variant="contained"
                                    sx={{ ml: 2 }}
                                    onClick={()=> router.push("/auth/login")}
                                >
                                    Login
                                </Button>

                                {/* 
                                <Dropdown>
                                    <MenuButton>Dashboard...</MenuButton>
                                    <Menu>
                                        <MenuItem>Profile</MenuItem>
                                        <MenuItem>My account</MenuItem>
                                        <MenuItem>Logout</MenuItem>
                                    </Menu>
                                </Dropdown> */}


                            </Box>
                        </Box>
                    </Box>
                </Container>
            </HeaderWrapper>))}


        </>
    )
}

export default Header