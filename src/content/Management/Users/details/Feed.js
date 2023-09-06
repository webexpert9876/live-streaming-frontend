import {
  Box,
  Typography,
  Card,
  CardHeader,
  Divider,
  Avatar,
  Grid,
  Button
} from '@mui/material';

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { useState } from 'react';

function Feed(props) {
  console.log('channelFollowerDetails', props);
  const [channelFollowerDetails, setChannelFollowerDetails] = useState(props.channelFollower? props.channelFollower: []);
  const feed = [
    {
      name: 'Munroe Dacks',
      jobtitle: 'Senior Accountant',
      company: 'Trudoo',
      avatar: '/static/images/avatars/1.jpg'
    },
    {
      name: 'Gunilla Canario',
      jobtitle: 'Associate Professor',
      company: 'Buzzdog',
      avatar: '/static/images/avatars/2.jpg'
    },
    {
      name: 'Rowena Geistmann',
      jobtitle: 'Pharmacist',
      company: 'Yozio',
      avatar: '/static/images/avatars/3.jpg'
    },
    {
      name: 'Ede Stoving',
      jobtitle: 'VP Operations',
      company: 'Cogibox',
      avatar: '/static/images/avatars/4.jpg'
    },
    {
      name: 'Crissy Spere',
      jobtitle: 'Social Worker',
      company: 'Babbleblab',
      avatar: '/static/images/avatars/5.jpg'
    },
    {
      name: 'Michel Greatbanks',
      jobtitle: 'Research Assistant III',
      company: 'Aimbu',
      avatar: '/static/images/avatars/6.jpg'
    }
  ];

  return (
    <Card>
      <CardHeader title="Your Followers" />
      <Divider />
      <Box p={2}>
        <Grid container spacing={0}>
          {channelFollowerDetails.map((follower, index) => (
            <Grid key={index} item xs={12} sm={6} lg={4}>
              <Box p={3} display="flex" alignItems="flex-start">
                {follower.userDetails[0].profilePicture?<Avatar src={`${process.env.NEXT_PUBLIC_S3_URL}/${follower.userDetails[0].profilePicture}`} />: <Avatar></Avatar>}
                <Box pl={1}>
                  {/* <Typography gutterBottom variant="subtitle2">
                    {_feed.company}
                  </Typography> */}
                  <Typography variant="h4" gutterBottom>
                    {`${follower.userDetails[0].firstName} ${follower.userDetails[0].lastName}`}
                  </Typography>
                  {/* <Typography color="text.primary" sx={{ pb: 2 }}>
                    {_feed.jobtitle}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddTwoToneIcon />}
                  >
                    Follow
                  </Button> */}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Card>
  );
}

export default Feed;
