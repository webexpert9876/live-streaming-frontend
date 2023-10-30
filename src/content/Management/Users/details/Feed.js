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

let followerShowLimit = 8;

function Feed({channelFollower}) {
  const [channelFollowerDetails, setChannelFollowerDetails] = useState(channelFollower? channelFollower: []);
  const [showFollowerCount, setShowFollowerCount] = useState(followerShowLimit);

  const handleFollowerCountAdd = ()=>{
    let count = showFollowerCount + 4
    if(channelFollowerDetails.length < count){
      count = channelFollowerDetails.length
    }
    setShowFollowerCount(count)
  }
  
  const handleFollowerCountMinus = ()=>{
    let count = showFollowerCount - 4
    if(followerShowLimit > count){
      count = followerShowLimit
    }
    setShowFollowerCount(count)
  }

  return (
    <Card>
      <CardHeader title="Your Followers" />
      <Divider />
      <Box p={2}>
        <Grid container spacing={0}>
          {channelFollowerDetails.length > 0 ?
            <>
              {channelFollowerDetails.slice(0, showFollowerCount).map((follower, index) => (
                <Grid key={index} item xs={12} sm={6} lg={3}>
                  <Box p={3} display="flex" alignItems="center">
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
              <Box sx={{ width: '100%', textAlign: 'center'}}>
                {showFollowerCount === channelFollowerDetails.length ? null : channelFollowerDetails.length > followerShowLimit && <Button sx={{mr: '10px'}} variant='contained' onClick={handleFollowerCountAdd}>Show More</Button>}
                {showFollowerCount === followerShowLimit ? null: <Button variant='contained' onClick={()=>setShowFollowerCount(followerShowLimit)}>Show Less</Button>}
              </Box>
            </>
          :
            <Box sx={{width: '100%', textAlign: 'center'}}>
              <Typography variant="h4" component='h4' gutterBottom>
                Followers not found...
              </Typography>
            </Box>
          }
        </Grid>
      </Box>
    </Card>
  );
}

export default Feed;
