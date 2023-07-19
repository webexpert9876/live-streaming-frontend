import React, { useEffect, useState, useRef } from 'react';
// import style from './style.css'
// import {
//   StackedCarousel,
//   ResponsiveContainer,
//   StackedCarouselSlideProps
// } from 'react-stacked-center-carousel';

import {StackedCarousel,
ResponsiveContainer,
StackedCarouselSlideProps} from 'react-stacked-center-carousel'
import {Fab} from '@mui/material';
import {KeyboardArrowLeft} from '@mui/icons-material';
import {KeyboardArrowRight} from '@mui/icons-material';
import {CardHeader} from '@mui/material';
import {Avatar} from '@mui/material';
import { Typography } from '@mui/material';
import VideoJS from './VideoJS';
import videojs from 'video.js';

const data = new Array(10).fill({ coverImage: 'https://images6.alphacoders.com/679/thumb-1920-679459.jpg', video: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8' });

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

  const { coverImage, video } = data[dataIndex];

  return (
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
            <VideoJS options={{
              autoplay: true,
              controls: true,
              responsive: true,
              fluid: true,
              sources: [{
                src: 'https://5b44cf20b0388.streamlock.net:8443/vod/smil:bbb.smil/playlist.m3u8',
                type:'application/x-mpegURL'
              }]
            }} onReady={handlePlayerReady} />
          </div>
          <div className='discription'>
            <CardHeader
              avatar={<Avatar className='avatar'>D</Avatar>}
              title='Bot Danny'
              subheader='September 14, 2016'
            />
            <Typography variant='body2' color='textSecondary' component='p'>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. He done a
              great job!
            </Typography>
          </div>
        </div>
      )}
    </div>
  );
});