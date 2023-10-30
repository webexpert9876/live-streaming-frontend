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

import { useState } from 'react';

const subscriberShowLimit = 8;

function SubscriberList(props) {
  const [channelSubscribersDetails, setChannelSubscribersDetails] = useState(props.channelSubscribers? props.channelSubscribers : []);
  const [showSubscriptionCount, setShowSubscriptionCount] = useState(subscriberShowLimit);

  const handleSubscriptionCountAdd = ()=>{
    let count = showSubscriptionCount + 4
    if(channelSubscribersDetails.length < count){
      count = channelSubscribersDetails.length
    }
    setShowSubscriptionCount(count)
  }
  
  const handleSubscriptionCountMinus = ()=>{
    let count = showSubscriptionCount - 4
    if(subscriberShowLimit > count){
      count = subscriberShowLimit
    }
    setShowSubscriptionCount(count)
  }
  

  return (
    <Card>
      <CardHeader title="Your Subscribers" />
      <Divider />
      <Box p={2}>
        <Grid container spacing={0}>
          {channelSubscribersDetails.length > 0 ?
            <>
              {channelSubscribersDetails.slice(0, showSubscriptionCount).map((subscriber, index) => (
                <Grid key={index} item xs={12} sm={6} lg={3}>
                  <Box p={3} display="flex" alignItems="flex-start">
                    {subscriber.userDetail[0].profilePicture?<Avatar  src={`${process.env.NEXT_PUBLIC_S3_URL}/${subscriber.userDetail[0].profilePicture}`} />: <Avatar></Avatar>}
                    <Box pl={1}>
                      <Typography variant="h4" gutterBottom>
                        {`${subscriber.userDetail[0].firstName} ${subscriber.userDetail[0].lastName}`}
                      </Typography>
                      <Typography variant="h5" sx={{fontSize: '13px'}} gutterBottom>
                        Duration: {`${subscriber.planDuration} ${subscriber.planDurationUnit}`}
                      </Typography>
                      <Typography variant="h5" sx={{fontSize: '13px'}} gutterBottom>
                        Status: {`${subscriber.isActive}` == 'true'? 'Active': 'Inactive'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
              <Box sx={{ width: '100%', textAlign: 'center'}}>
                {showSubscriptionCount === channelSubscribersDetails.length ? null : channelSubscribersDetails.length > subscriberShowLimit && <Button sx={{mr: '10px'}} variant='contained' onClick={handleSubscriptionCountAdd}>Show More</Button>}
                {/* {showSubscriptionCount === subscriberShowLimit ? null: <Button variant='contained' onClick={handleSubscriptionCountMinus}>Show Less</Button>} */}
                {showSubscriptionCount === subscriberShowLimit ? null: <Button variant='contained' onClick={()=>setShowSubscriptionCount(subscriberShowLimit)}>Show Less</Button>}
              </Box>
            </>
          :
            <Box sx={{width: '100%', textAlign: 'center'}}>
              <Typography variant="h4" component='h4' gutterBottom>
                Subscribers not found...
              </Typography>
            </Box>
          }
        </Grid>
      </Box>
    </Card>
  );
}

export default SubscriberList;
