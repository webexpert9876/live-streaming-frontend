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

import DesignServicesTwoToneIcon from '@mui/icons-material/DesignServicesTwoTone';
import BrightnessLowTwoToneIcon from '@mui/icons-material/BrightnessLowTwoTone';
import MmsTwoToneIcon from '@mui/icons-material/MmsTwoTone';
import TableChartTwoToneIcon from '@mui/icons-material/TableChartTwoTone';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import VideoSettingsIcon from '@mui/icons-material/VideoSettings';
import HistoryIcon from '@mui/icons-material/History';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StreamIcon from '@mui/icons-material/Stream';
import GroupIcon from '@mui/icons-material/Group';
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser, setAuthState, selectAuthState, selectAuthUser } from '../../../../../store/slices/authSlice';
import axios from 'axios';

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

function UserSidebarMenu({userData}){
    const [userInfo, setUserInfo] = useState({});
    const { closeSidebar } = useContext(SidebarContext);
    const router = useRouter();
    const currentRoute = router.pathname;

    return (
        <>
            <MenuWrapper>
                <List component="div">
                    <SubMenuWrapper>
                        <List component="div">
                            <ListItem component="div">
                                <NextLink href="/" passHref>
                                    <Button
                                        className={currentRoute === '="/' ? 'active' : ''}
                                        disableRipple
                                        component="a"
                                        onClick={closeSidebar}
                                        startIcon={<DesignServicesTwoToneIcon />}
                                    >
                                        Overview
                                    </Button>
                                </NextLink>
                            </ListItem>
                        </List>
                    </SubMenuWrapper>
                </List>
                {/* <List
                    component="div"
                    subheader={
                        <ListSubheader component="div" disableSticky>
                            Dashboards
                        </ListSubheader>
                    }
                >
                    <SubMenuWrapper>
                        <List component="div">
                            <ListItem component="div">
                                <NextLink href="/dashboards/tasks" passHref>
                                    <Button
                                        className={
                                            currentRoute === '/dashboards/tasks' ? 'active' : ''
                                        }
                                        disableRipple
                                        component="a"
                                        onClick={closeSidebar}
                                        startIcon={<BrightnessLowTwoToneIcon />}
                                    >
                                        Manage Tasks
                                    </Button>
                                </NextLink>
                            </ListItem>
                            <ListItem component="div">
                                <NextLink href="/applications/messenger" passHref>
                                    <Button
                                        className={
                                            currentRoute === '/applications/messenger' ? 'active' : ''
                                        }
                                        disableRipple
                                        component="a"
                                        onClick={closeSidebar}
                                        startIcon={<MmsTwoToneIcon />}
                                    >
                                        Messenger
                                    </Button>
                                </NextLink>
                            </ListItem>
                        </List>
                    </SubMenuWrapper>
                </List> */}
                <List
                    component="div"
                    subheader={
                        <ListSubheader component="div" disableSticky>
                            Management
                        </ListSubheader>
                    }
                >
                    <SubMenuWrapper>
                        <List component="div">
                            <ListItem component="div">
                                <NextLink href="/management/admin/category/list" passHref>
                                    <Button
                                        className={
                                            currentRoute === '/management/admin/category/list'
                                                ? 'active'
                                                : ''
                                        }
                                        disableRipple
                                        component="a"
                                        onClick={closeSidebar}
                                        startIcon={<ListAltIcon />}
                                    >
                                        Manage tattoo categories
                                    </Button>
                                </NextLink>
                            </ListItem>
                            <ListItem component="div">
                                <NextLink href="/management/admin/channel/list" passHref>
                                    <Button
                                        className={
                                            currentRoute === '/management/admin/channel/list'
                                                ? 'active'
                                                : ''
                                        }
                                        disableRipple
                                        component="a"
                                        onClick={closeSidebar}
                                        startIcon={<TableChartTwoToneIcon />}
                                    >
                                        Manage channels list
                                    </Button>
                                </NextLink>
                            </ListItem>
                            <ListItem component="div">
                                <NextLink href="/management/admin/user/list" passHref>
                                    <Button
                                        className={
                                            currentRoute === '/management/admin/user/list'
                                                ? 'active'
                                                : ''
                                        }
                                        disableRipple
                                        component="a"
                                        onClick={closeSidebar}
                                        startIcon={<GroupIcon />}
                                    >
                                        Manage users list
                                    </Button>
                                </NextLink>
                            </ListItem>
                            <ListItem component="div">
                                <NextLink href="/dashboards/channel/stream" passHref>
                                    <Button
                                        className={
                                            currentRoute === '/dashboards/channel/stream'
                                                ? 'active'
                                                : ''
                                        }
                                        disableRipple
                                        component="a"
                                        onClick={closeSidebar}
                                        startIcon={<StreamIcon />}
                                    >
                                        Stream Management
                                    </Button>
                                </NextLink>
                            </ListItem>
                            <ListItem component="div">
                                <NextLink href="/management/admin/connectAccount/list" passHref>
                                    <Button
                                        className={
                                            currentRoute === '/management/admin/connectAccount/list'
                                                ? 'active'
                                                : ''
                                        }
                                        disableRipple
                                        component="a"
                                        onClick={closeSidebar}
                                        startIcon={<ManageAccountsIcon />}
                                    >
                                        Manage Connect Account
                                    </Button>
                                </NextLink>
                            </ListItem>
                            <ListItem component="div">
                                <NextLink href="/management/admin/transaction/list" passHref>
                                    <Button
                                        className={
                                            currentRoute === '/management/admin/transaction/list'
                                                ? 'active'
                                                : ''
                                        }
                                        disableRipple
                                        component="a"
                                        onClick={closeSidebar}
                                        startIcon={<ListAltIcon />}
                                    >
                                        Transactions List
                                    </Button>
                                </NextLink>
                            </ListItem>
                            <ListItem component="div">
                                <NextLink href="/streaming/tools" passHref>
                                    <Button
                                        className={
                                            currentRoute === '/streaming/tools'
                                                ? 'active'
                                                : ''
                                        }
                                        disableRipple
                                        component="a"
                                        onClick={closeSidebar}
                                        startIcon={<SettingsInputAntennaIcon />}
                                    >
                                        Streaming Tools
                                    </Button>
                                </NextLink>
                            </ListItem>
                        </List>
                    </SubMenuWrapper>
                </List>
                <List
                    component="div"
                    subheader={
                        <ListSubheader component="div" disableSticky>
                            Accounts
                        </ListSubheader>
                    }
                >
                    <SubMenuWrapper>
                        <List component="div">
                            <ListItem component="div">
                                <NextLink href="/management/channel" passHref>
                                    <Button
                                        className={
                                            currentRoute === '/management/channel' ? 'active' : ''
                                        }
                                        disableRipple
                                        component="a"
                                        onClick={closeSidebar}
                                        startIcon={<AccountCircleTwoToneIcon />}
                                    >
                                        Channel Details
                                    </Button>
                                </NextLink>
                            </ListItem>
                            {/* <ListItem component="div">
                                <NextLink href="/management/profile" passHref>
                                    <Button
                                        className={
                                            currentRoute === '/management/profile' ? 'active' : ''
                                        }
                                        disableRipple
                                        component="a"
                                        onClick={closeSidebar}
                                        startIcon={<AccountCircleTwoToneIcon />}
                                    >
                                        User Profile
                                    </Button>
                                </NextLink>
                            </ListItem> */}
                            {/* <ListItem component="div">
                                <NextLink href="/management/profile/settings" passHref>
                                    <Button
                                        className={
                                            currentRoute === '/management/profile/settings'
                                                ? 'active'
                                                : ''
                                        }
                                        disableRipple
                                        component="a"
                                        onClick={closeSidebar}
                                        startIcon={<SettingsIcon />}
                                    >
                                        Account Settings
                                    </Button>
                                </NextLink>
                            </ListItem> */}
                            <ListItem component="div">
                                <NextLink href="/management/channel/settings" passHref>
                                    <Button
                                        className={
                                            currentRoute === '/management/channel/settings'
                                                ? 'active'
                                                : ''
                                        }
                                        disableRipple
                                        component="a"
                                        onClick={closeSidebar}
                                        startIcon={<SettingsIcon />}
                                    >
                                        Account Settings
                                    </Button>
                                </NextLink>
                            </ListItem>
                            <ListItem component="div">
                                <NextLink href="/management/channel/subscription/list" passHref>
                                    <Button
                                        className={
                                            currentRoute === '/management/channel/subscription/list'
                                                ? 'active'
                                                : ''
                                        }
                                        disableRipple
                                        component="a"
                                        onClick={closeSidebar}
                                        startIcon={<PriceChangeIcon />}
                                    >
                                        Manage Subscription plans
                                    </Button>
                                </NextLink>
                            </ListItem>
                        </List>
                    </SubMenuWrapper>
                </List>
                <List
                    component="div"
                    subheader={
                        <ListSubheader component="div" disableSticky>
                            Content
                        </ListSubheader>
                    }
                >
                    <SubMenuWrapper>
                        <List component="div">
                            <ListItem component="div">
                                <NextLink href="/videos" passHref>
                                    <Button
                                        className={
                                            currentRoute === '/videos' ? 'active' : ''
                                        }
                                        disableRipple
                                        component="a"
                                        onClick={closeSidebar}
                                        startIcon={<VideoSettingsIcon />}
                                    >
                                        Videos
                                    </Button>
                                </NextLink>
                            </ListItem>
                        </List>
                    </SubMenuWrapper>
                </List>
                <List
                  component="div"
                  subheader={
                      <ListSubheader component="div" disableSticky>
                      {/* Followings & Subscriptions */}
                        Others
                      </ListSubheader>
                  }
                >
                    <SubMenuWrapper>
                        <List component="div">
                        <ListItem component="div">
                            <NextLink href="/user/following" passHref>
                                <Button
                                    className={
                                    currentRoute === '/user/following' ? 'active' : ''
                                    }
                                    disableRipple
                                    component="a"
                                    onClick={closeSidebar}
                                    startIcon={<FavoriteBorderIcon />}
                                >
                                    Following channels
                                </Button>
                            </NextLink>
                        </ListItem>
                        <ListItem component="div">
                            <NextLink href="/user/subscribe" passHref>
                                <Button
                                    className={
                                    currentRoute === '/user/subscribe' ? 'active' : ''
                                    }
                                    disableRipple
                                    component="a"
                                    onClick={closeSidebar}
                                    startIcon={<SubscriptionsIcon />}
                                >
                                    Subscribed channels
                                </Button>
                            </NextLink>
                        </ListItem>
                        <ListItem component="div">
                            <NextLink href="/watch/history" passHref>
                                <Button
                                    className={
                                    currentRoute === '/watch/history' ? 'active' : ''
                                    }
                                    disableRipple
                                    component="a"
                                    onClick={closeSidebar}
                                    startIcon={<HistoryIcon />}
                                >
                                Watch history
                                </Button>
                            </NextLink>
                        </ListItem>
                        </List>
                    </SubMenuWrapper>
                </List>
                {/* <List
                    component="div"
                    subheader={
                        <ListSubheader component="div" disableSticky>
                            Extra Pages
                        </ListSubheader>
                    }
                >
                    <SubMenuWrapper>
                        <List component="div">
                            <ListItem component="div">
                                <NextLink href="/status/404" passHref>
                                    <Button
                                        className={currentRoute === '/status/404' ? 'active' : ''}
                                        disableRipple
                                        component="a"
                                        onClick={closeSidebar}
                                        startIcon={<CheckBoxTwoToneIcon />}
                                    >
                                        Error 404
                                    </Button>
                                </NextLink>
                            </ListItem>
                            <ListItem component="div">
                                <NextLink href="/status/500" passHref>
                                    <Button
                                        className={currentRoute === '/status/500' ? 'active' : ''}
                                        disableRipple
                                        component="a"
                                        onClick={closeSidebar}
                                        startIcon={<CameraFrontTwoToneIcon />}
                                    >
                                        Error 500
                                    </Button>
                                </NextLink>
                            </ListItem>
                            <ListItem component="div">
                                <NextLink href="/status/coming-soon" passHref>
                                    <Button
                                        className={
                                            currentRoute === '/status/coming-soon' ? 'active' : ''
                                        }
                                        disableRipple
                                        component="a"
                                        onClick={closeSidebar}
                                        startIcon={<ChromeReaderModeTwoToneIcon />}
                                    >
                                        Coming Soon
                                    </Button>
                                </NextLink>
                            </ListItem>
                            <ListItem component="div">
                                <NextLink href="/status/maintenance" passHref>
                                    <Button
                                        className={
                                            currentRoute === '/status/maintenance' ? 'active' : ''
                                        }
                                        disableRipple
                                        component="a"
                                        onClick={closeSidebar}
                                        startIcon={<WorkspacePremiumTwoToneIcon />}
                                    >
                                        Maintenance
                                    </Button>
                                </NextLink>
                            </ListItem>
                        </List>
                    </SubMenuWrapper>
                </List> */}
            </MenuWrapper>
        </>
    );
}

export default UserSidebarMenu;