import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';
import styled from '@emotion/styled';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/styles';

const AuthorImg = styled.img`
  border-radius: 100px;
  background: #fff;
  padding: 5px;
  width: 40px;
  height: 40px;
`;

const PrimaryMainTheme = createTheme({
  palette: {
    primary: {
      main: '#fff',
    },
  },
});

function LeftMenu() {
  return (
    <div>
      <ThemeProvider theme={PrimaryMainTheme}>
        <React.Fragment>
          <ListItemButton>
            <ListItemIcon>
              <AuthorImg
                src="https://static-cdn.jtvnw.net/jtv_user_pictures/c71b60fc-4215-4c41-aaaa-17908502babf-profile_image-70x70.png"
                className="authorImg"
                width={60}
              />
            </ListItemIcon>
            <div>
              <strong>StreamerHouse</strong>
              <br />
              <span>New World</span>
              <div className='channelStatusAndView'><span className='channelStatus'></span><span className='ChanelViewLive'>1542</span></div>
            </div>
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <AuthorImg
                src="https://static-cdn.jtvnw.net/jtv_user_pictures/fd9521c0-018f-4d93-ab0d-44d2a00a00ef-profile_image-70x70.png"
                className="authorImg"
                width={60}
              />
            </ListItemIcon>
            <div>
              <strong>StreamerHouse</strong>
              <br />
              <span>New World</span>
            </div>
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <AuthorImg
                src="https://static-cdn.jtvnw.net/jtv_user_pictures/6eadc3b0-61dc-4d11-8e14-924bbfa35664-profile_image-70x70.png"
                className="authorImg"
                width={60}
              />
            </ListItemIcon>
            <div>
              <strong>StreamerHouse</strong>
              <br />
              <span>New World</span>
            </div>
          </ListItemButton>
        </React.Fragment>
      </ThemeProvider>
    </div>
  );
}

export default LeftMenu;
