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
import BallotTwoToneIcon from '@mui/icons-material/BallotTwoTone';
import DisplaySettingsTwoToneIcon from '@mui/icons-material/DisplaySettingsTwoTone';
import PersonalVideoIcon from '@mui/icons-material/PersonalVideo';

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

    useEffect(()=>{
      if(userData){
          setUserInfo(userData)
      }
    }, [])

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
                    <ListItem component="div">
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
                            startIcon={<DisplaySettingsTwoToneIcon />}
                        >
                            Account Settings
                        </Button>
                        </NextLink>
                    </ListItem>

                    {userInfo?
                      !userInfo.channelId && <ListItem component="div">
                        <NextLink href="/channel/request" passHref>
                          <Button
                              className={
                              currentRoute === '/channel/request'
                                  ? 'active'
                                  : ''
                              }
                              disableRipple
                              component="a"
                              onClick={closeSidebar}
                              startIcon={<PersonalVideoIcon />}
                          >
                              Apply for channel
                          </Button>
                        </NextLink>
                      </ListItem>
                      :
                      null
                    }
                  </List>
                </SubMenuWrapper>
                </List>
                {/* <List
                component="div"
                subheader={
                    <ListSubheader component="div" disableSticky>
                    Components
                    </ListSubheader>
                }
                >
                <SubMenuWrapper>
                    <List component="div">
                    <ListItem component="div">
                        <NextLink href="/components/videos" passHref>
                        <Button
                            className={
                            currentRoute === '/components/videos' ? 'active' : ''
                            }
                            disableRipple
                            component="a"
                            onClick={closeSidebar}
                            startIcon={<BallotTwoToneIcon />}
                        >
                            Videos
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
                                startIcon={<BallotTwoToneIcon />}
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
                                startIcon={<BallotTwoToneIcon />}
                            >
                                Subscribe channels
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
                                startIcon={<BallotTwoToneIcon />}
                            >
                              Watch history
                            </Button>
                          </NextLink>
                      </ListItem>
                    </List>
                </SubMenuWrapper>
                </List>
            
            </MenuWrapper>
        </>
    );
}

export default UserSidebarMenu;