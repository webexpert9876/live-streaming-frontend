import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import {
  ListSubheader,
  alpha,
  Box,
  List,
  styled,
  Button,
  ListItem
} from '@mui/material';
import NextLink from 'next/link';
import { SidebarContext } from 'src/contexts/SidebarContext';

import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser, setAuthState, selectAuthState, selectAuthUser } from '../../../../../store/slices/authSlice';
import axios from 'axios';
import AdminSidebarMenu from './AdminSidebarMenu';
import ArtistSidebarMenu from './ArtistSidebarMenu';
import UserSidebarMenu from './UserSidebarMenu';

const MenuWrapper = styled(Box)(
  ({ theme }) => `
  .MuiList-root {
    padding: ${theme.spacing(1)};

    & > .MuiList-root {
      padding: 0 ${theme.spacing(0)} ${theme.spacing(1)};
    }
  }

    .MuiListSubheader-root {
      text-transform: uppercase;
      font-weight: bold;
      font-size: ${theme.typography.pxToRem(12)};
      color: ${theme.colors.alpha.trueWhite[50]};
      padding: ${theme.spacing(0, 2.5)};
      line-height: 1.4;
    }
`
);

const SubMenuWrapper = styled(Box)(
  ({ theme }) => `
    .MuiList-root {

      .MuiListItem-root {
        padding: 1px 0;

        .MuiBadge-root {
          position: absolute;
          right: ${theme.spacing(3.2)};

          .MuiBadge-standard {
            background: ${theme.colors.primary.main};
            font-size: ${theme.typography.pxToRem(10)};
            font-weight: bold;
            text-transform: uppercase;
            color: ${theme.palette.primary.contrastText};
          }
        }
    
        .MuiButton-root {
          display: flex;
          color: ${theme.colors.alpha.trueWhite[70]};
          background-color: transparent;
          width: 100%;
          justify-content: flex-start;
          padding: ${theme.spacing(1.2, 3)};

          .MuiButton-startIcon,
          .MuiButton-endIcon {
            transition: ${theme.transitions.create(['color'])};

            .MuiSvgIcon-root {
              font-size: inherit;
              transition: none;
            }
          }

          .MuiButton-startIcon {
            color: ${theme.colors.alpha.trueWhite[30]};
            font-size: ${theme.typography.pxToRem(20)};
            margin-right: ${theme.spacing(1)};
          }
          
          .MuiButton-endIcon {
            color: ${theme.colors.alpha.trueWhite[50]};
            margin-left: auto;
            opacity: .8;
            font-size: ${theme.typography.pxToRem(20)};
          }

          &.active,
          &:hover {
            background-color: ${alpha(theme.colors.alpha.trueWhite[100], 0.06)};
            color: ${theme.colors.alpha.trueWhite[100]};

            .MuiButton-startIcon,
            .MuiButton-endIcon {
              color: ${theme.colors.alpha.trueWhite[100]};
            }
          }
        }

        &.Mui-children {
          flex-direction: column;

          .MuiBadge-root {
            position: absolute;
            right: ${theme.spacing(7)};
          }
        }

        .MuiCollapse-root {
          width: 100%;

          .MuiList-root {
            padding: ${theme.spacing(1, 0)};
          }

          .MuiListItem-root {
            padding: 1px 0;

            .MuiButton-root {
              padding: ${theme.spacing(0.8, 3)};

              .MuiBadge-root {
                right: ${theme.spacing(3.2)};
              }

              &:before {
                content: ' ';
                background: ${theme.colors.alpha.trueWhite[100]};
                opacity: 0;
                transition: ${theme.transitions.create([
                  'transform',
                  'opacity'
                ])};
                width: 6px;
                height: 6px;
                transform: scale(0);
                transform-origin: center;
                border-radius: 20px;
                margin-right: ${theme.spacing(1.8)};
              }

              &.active,
              &:hover {

                &:before {
                  transform: scale(1);
                  opacity: 1;
                }
              }
            }
          }
        }
      }
    }
`
);

function SidebarMenu({userData}) {
  const dispatch = useDispatch();
  const authUserInfo = useSelector(selectAuthUser);
  const [userInfo, setUserInfo] = useState(userData?userData[0]:{});
  const [roleInfo, setRoleInfo] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const { closeSidebar } = useContext(SidebarContext);
  const router = useRouter();
  const currentRoute = router.pathname;

  // if(Object.keys(userInfo).length > 0){
  //   setFetchData(true)
  // }

  useEffect(()=>{

    if(Object.keys(userInfo).length > 0){
      setIsFetched(true)
    }
  }, [userInfo])

  useEffect(async()=>{
    if(isFetched){
      // let roleId;
      // await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get/user/${userInfo._id}`, {headers: {'x-access-token': userInfo.jwtToken}}).then((data)=>{
      //   // setRoleInfo(data.data.role)
      //   roleId = data.data.user.role
      //   localStorage.setItem('authUser', JSON.stringify(data.data.user));
      //   dispatch(setAuthUser(data.data.user));
      // }).catch((error)=>{
      //   console.log('error', error.response.data.message);
      //   setIsFetched(false)
      //   if(error.response.data.message == 'Json Web Token is Expired, Try again '){
      //     router.push('/auth/login');
      //   }
      // });

      axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/single/role/${userInfo.role}`, {headers: {'x-access-token': userInfo.jwtToken}}).then((data)=>{
        setRoleInfo(data.data.role)
        setIsFetched(false)
      }).catch((error)=>{
        console.log('error', error.response.data.message);
        setIsFetched(false)
        if(error.response.data.message == 'Json Web Token is Expired, Try again '){
          router.push('/auth/login');
        }
      });
    }
  }, [isFetched])

  return (
    <>
      {roleInfo.role == 'admin' && <AdminSidebarMenu userData={userInfo}/>}
      {roleInfo.role == 'artist' && <ArtistSidebarMenu userData={userInfo}/>}
      {roleInfo.role == 'user' && <UserSidebarMenu userData={userInfo}/>}
    </>
  );
}

export default SidebarMenu;
