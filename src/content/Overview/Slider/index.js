import React, { useState, useEffect, useRef } from 'react';
import Skeleton from 'react-loading-skeleton';
import {
  StackedCarousel,
  ResponsiveContainer,
  StackedCarouselSlideProps
} from 'react-stacked-center-carousel'
import { Fab } from '@mui/material';
import { KeyboardArrowLeft } from '@mui/icons-material';
import { KeyboardArrowRight } from '@mui/icons-material';
import { CardHeader } from '@mui/material';
import { Avatar } from '@mui/material';
import { Typography, ListItemText } from '@mui/material';
import VideoJS from './VideoJS';
import videojs from 'video.js';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

const data = new Array(10).fill({ coverImage: 'https://images6.alphacoders.com/679/thumb-1920-679459.jpg', video: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8' });

const recommendedStyle = {
  display: 'grid',
  gridTemplateColumns: 'auto auto auto auto auto',
  gap: '15px',
};

const SliderItemSkeletonItem = () => {
  return (
    <Grid
      container
      className="tooltip tesssssst"
      direction="row"
      alignItems="center"
      mt={"0px"}      
      pb={"15px"}
      style={{ display: "flex", alignItems: "flex-start" }}

    >
      <Skeleton
        className='br100 listChannelIconSize'
        style={{ width: "535px", margin: "0, auto" }}
        height={"310px"}
      />     
      {/* <Grid item ml={"15px"} style={{ width: "150px", position: "absolute", right:"-170px"  }}>
        <ListItemText sx={{ display: 'block' }} style={{ position: "relative" }}>
          <div className='channelListChannelName'>
            <Skeleton height={16} width={100} />
          </div>
          <Skeleton height={16} width={100} />
          <span className="tooltiptext" style={{ textAlign: "left", padding: "10px" }}>
            <Skeleton height={16} width={100} />
          </span>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Skeleton height={16} width={50} />
          </div>
        </ListItemText>
      </Grid> */}
    </Grid>
  );
};

export default function SimpleSlider() {
  const ref = useRef();

  return (
    <div className='twitch twitch-width'>
      <div style={{ width: '100%', position: 'relative' }}>
        <ResponsiveContainer
          carouselRef={ref}
          render={(width, carouselRef) => {
            return (
              <StackedCarousel
                ref={carouselRef}
                slideComponent={Slide}
                slideWidth={750}
                carouselWidth={width}
                data={data}
                maxVisibleSlide={5}
                disableSwipe
                customScales={[1, 0.85, 0.7, 0.55]}
                transitionTime={450}
              />
            );
          }}
        />
        <Fab
          className='twitch-button left'
          size='small'
          onClick={() => ref.current?.goBack()}
        >
          <KeyboardArrowLeft style={{ fontSize: 30 }} />
        </Fab>
        <Fab
          className='twitch-button right'
          size='small'
          onClick={() => ref.current?.goNext()}
        >
          <KeyboardArrowRight style={{ fontSize: 30 }} />
        </Fab>
      </div>
    </div>
  );
};

const Slide = React.memo(function (StackedCarouselSlideProps) {
  const { data, dataIndex, isCenterSlide, swipeTo, slideIndex } = StackedCarouselSlideProps;
  const [loadDelay, setLoadDelay] = useState();
  const [removeDelay, setRemoveDelay] = useState();
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true)

  const playerRef = React.useRef(null);

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on('waiting', () => {
      videojs.log('player is waiting');
    });

    player.on('dispose', () => {
      videojs.log('player will dispose');
    });
  };

  useEffect(() => {
    if (isCenterSlide) {
      clearTimeout(removeDelay);
      setLoadDelay(setTimeout(() => setLoaded(true), 1000));
    } else {
      clearTimeout(loadDelay);
      if (loaded) setRemoveDelay(setTimeout(() => setLoaded(false), 1000));
    }
  }, [isCenterSlide]);

  useEffect(() => () => {
    clearTimeout(removeDelay);
    clearTimeout(loadDelay);
  });

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const { coverImage, video } = data[dataIndex];

  const liveVideo = {
    title: "Bot Danny",
    channelName: "The Sims 4",
    liveViewers: "793 viewers",
    videoTags: ["TwitchOG", "Marathon"]
  }

  return (
    <>
      {isLoading ? (
        <Grid sx={recommendedStyle} className='desktop5'>
          {/* Skeleton loading animation */}
          
            <SliderItemSkeletonItem  />
          
        </Grid>
      ) : (
        
        <div className='twitch-card' draggable={false}>
          <div className={`cover fill ${isCenterSlide && loaded ? 'off' : 'on'}`}>
            <div
              className='card-overlay fill'
              onClick={() => {
                if (!isCenterSlide) swipeTo(slideIndex);
              }}
            />
            <img className='cover-image fill' src={coverImage} />
          </div>
          {loaded && (
            <div className='detail fill'>
              <div className='video-player'>
                <Link href="#">
                  <VideoJS options={{
                    autoplay: true,
                    controls: true,
                    responsive: true,
                    fluid: true,
                    sources: [{
                      src: 'https://5b44cf20b0388.streamlock.net:8443/vod/smil:bbb.smil/playlist.m3u8',
                      type: 'application/x-mpegURL'
                    }]
                  }} onReady={handlePlayerReady} />
                </Link>
              </div>
              <div className='discription'>
                <Grid container direction="row" alignItems="center" mt={"15px"} ml={"15px"} pb={"15px"} style={{ display: "flex", alignItems: "flex-start" }} >
                  <Grid item>
                    <img src="https://static-cdn.jtvnw.net/jtv_user_pictures/fd9521c0-018f-4d93-ab0d-44d2a00a00ef-profile_image-50x50.png" className='br100 listChannelIconSize' />
                  </Grid>
                  <Grid item ml={"15px"} style={{ width: "74%" }}>
                    <Typography className='sliveVideoTitle'>
                      <Link href="#" color={'black'}>{liveVideo.title}</Link>
                    </Typography>
                    <Typography className='sliveVideoChannelName'>
                      <Link href="#" color={"black"}>{liveVideo.channelName}</Link>
                    </Typography>
                    <Typography className='sliveVideoLiveViewers'>
                      <Link href="#" color={"black"}><i>{liveVideo.liveViewers}</i></Link>
                    </Typography>
                  </Grid>
                </Grid>
                {liveVideo.videoTags && liveVideo.videoTags ? (
                  <Stack direction="row" ml={"12px"} spacing={1} className='sliveVideoTags'>
                    {liveVideo.videoTags.map((tag) => (
                      <Link href='#' key={tag}>
                        <Chip label={tag} style={{ background: "#ddd", color: "#000", fontSize: "12px", height: "25px" }} />
                      </Link>
                    ))}
                  </Stack>
                ) : null}
                <Typography className='sLiveVideoShortDesc' component='p' color={"black"} mt={"15px"}>Check out this stream from chess!</Typography>
              </div>              
            </div>
            
          )}
        </div>
      )}
      {/* <SliderItemSkeletonItem  /> */}
    </>
  );
});
