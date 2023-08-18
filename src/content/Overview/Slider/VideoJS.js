import React from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
// import './videoPlayer.css';

export const VideoJS = (props) => {
  const [isOffline, setIsOffline] = React.useState(props.options.className == 'offline-video'? true: false)
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const {options, onReady} = props;

  React.useEffect(() => {

    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode. 
      const videoElement = document.createElement("video-js");

      videoElement.classList.add('vjs-big-play-centered');
      // videoElement.classList.add('vjs-big-play-centered');
      console.log('options', options)
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

    // You could update an existing player in the `else` block here
    // on prop change, for example:
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

  return (
    // <div data-vjs-player>
    <>
      {isOffline ? <div className='offline-player-main-div' ref={videoRef}> </div> :<div ref={videoRef} />}
    </>
    // </div>
  );
}

export default VideoJS;