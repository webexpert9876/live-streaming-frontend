import { Typography } from '@mui/material';

function PageHeader() {

  return (
    <>
      <Typography variant="h3" component="h3" gutterBottom>
        Settings
      </Typography>
      {/* <Typography variant="subtitle2">
        {user.name}, this could be your user settings panel.
      </Typography> */}
    </>
  );
}

export default PageHeader;
