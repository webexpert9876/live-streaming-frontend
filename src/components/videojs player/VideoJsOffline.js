import React from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-contrib-quality-levels';
import vjsqs from "@silvermine/videojs-quality-selector";
import '@silvermine/videojs-quality-selector/dist/css/quality-selector.css';

export const VideoJS = (props) => {
  const [isOffline, setIsOffline] = React.useState(props.options.className == 'offline-video'? true: false)
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const {options, onReady} = props;

  
  React.useEffect(() => {
    
    if (!playerRef.current) {
      vjsqs(videojs);
      
      const videoElement = document.createElement("video-js");

      videoElement.classList.add('vjs-big-play-centered');
      
      if(options.className == 'offline-video'){
        
        videoElement.classList.add('offline-video-player');

      } else if(options.className == 'online-video'){
        
        videoElement.classList.add('online-video-player');
      }
      // videoElement.classList.add('dummy-class');
      
      videoRef.current.appendChild(videoElement);

      const player = playerRef.current = videojs(videoElement, options, () => {
        videojs.log('player is ready');
        onReady && onReady(player);
      });
      // player.resolutionSwitcher();
      player.qualityLevels();
      // player.httpSourceSelector();
      
      
    } else {
      const player = playerRef.current;
      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [options, videoRef]);

  // Dispose the Video.js player when the functional component unmounts
  React.useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  React.useEffect(() => {
    vjsqs(videojs);
    
  }, []);

  return (
    // <div data-vjs-player>
    <>
      {isOffline ? <div className='offline-player-main-div' ref={videoRef}> </div> :<div ref={videoRef} />}
    </>
    // </div>
  );
}

export default VideoJS;