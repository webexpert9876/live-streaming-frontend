import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BlockIcon from '@mui/icons-material/Block';
import DeleteIcon from '@mui/icons-material/Delete';
import PushPinIcon from '@mui/icons-material/PushPin';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import {socket} from '../../../socket';

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

export default function MessageMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [messageAllDetails, setMessageAllDetails] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  React.useEffect(()=>{
    if(props.messageData){
      setMessageAllDetails(props.messageData);
    }
  },[props.messageData])

  const handlePinMessage = ()=>{
    props.handlePinFunc(messageAllDetails);
    handleClose();
  }
  
  const handleUnpinMessage = ()=>{
    props.handleUnpinFunc(messageAllDetails);
    handleClose();
  }

  return (
    <>
        {messageAllDetails && <>
          <MoreVertIcon sx={{minWidth: '15px', padding: 0, textAlign: 'center'}}
            id="demo-customized-button"
            aria-controls={open ? 'demo-customized-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            disableElevation
          onClick={handleClick}/>
        <StyledMenu
          id="demo-customized-menu"
          MenuListProps={{
            'aria-labelledby': 'demo-customized-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          {`${messageAllDetails.isPinned}` === `true` ?<MenuItem onClick={handleUnpinMessage} disableRipple>
            <PushPinIcon />
              Unpin message
            </MenuItem>
          :
            <MenuItem sx={{m:'5px'}} onClick={handlePinMessage} disableRipple>
              <PushPinIcon />
              Pin message
            </MenuItem>
          }
          {/* <Divider sx={{ my: 0.5 }} /> */}
          {/* <MenuItem onClick={handle} disableRipple>
            <DeleteIcon />
            Delete message
          </MenuItem>
          <MenuItem onClick={handleClose} disableRipple>
            <DeleteSweepIcon fontSize='large' />
            Clear Chat
          </MenuItem> */}
          {/* <MenuItem onClick={handleClose} disableRipple>
            <BlockIcon />
            Block
          </MenuItem> */}
          {/* <MenuItem onClick={handleClose} disableRipple>
            <MoreHorizIcon />
            More
          </MenuItem> */}
        </StyledMenu>
        </>}
    </>
  );
}