import React, { useState, useEffect } from 'react';
import * as $ from 'jquery';
import { authEndpoint, clientId, redirectUri, scopes } from './config';
import hash from './hash';
import Player from './Player';
import logo from './logo.svg';
import './App.css';

const App = () => {
  const [token, setToken] = useState(null);
  const [item, setItem] = useState({
    album: {
      images: [{ url: '' }]
    },
    name: '',
    artists: [{ name: '' }],
    duration_ms: 0
  });
  const [isPlaying, setIsPlaying] = useState('Paused');
  const [progressInMS, setProgressInMS] = useState(0);
  const [noData, setNoData] = useState(false);

  // getCurrentlyPlaying = getCurrentlyPlaying.bind(this);
  // tick = tick.bind(this);


  // componentDidMount
  useEffect(() => {
    // Set token
    let _token = hash.access_token;

    if (_token) {
      // Set token
      setToken(_token);
      getCurrentlyPlaying(_token);
    }

    // set interval for polling every 5 seconds
    // interval = setInterval(() => tick(), 5000);
  });

  // componentWillUnmount
  // const unload = () => {
  //   // clear the interval to save resources
  //   clearInterval(interval);
  // }

  // const tick = () => {
  //   if(token) {
  //     getCurrentlyPlaying(token);
  //   }
  // }


  const getCurrentlyPlaying = (authToken) => {
    // Make a call using the token
    $.ajax({
      url: 'https://api.spotify.com/v1/me/player',
      type: 'GET',
      beforeSend: xhr => {
        xhr.setRequestHeader('Authorization', 'Bearer ' + authToken);
      },
      success: data => {
        // Checks if the data is not empty
        if(!data) {
          setNoData(true);
          return;
        }

        setItem(data.item);
        setIsPlaying(data.is_playing);
        setProgressInMS(data.progress_ms);
        setNoData(false); // We need to 'reset' the boolean, in case the user does not give F5 and has opened his Spotify.
      }
    });
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        {!token && (
          <a
            className='btn btn--loginApp-link'
            href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
              '%20'
            )}&response_type=token&show_dialog=true`}
          >
            Login to Spotify
          </a>
        )}
        {token && !noData && (
          <Player
            item={item}
            isPlaying={isPlaying}
            progressInMS={progressInMS}
          />
        )}
        {noData && (
          <p>
            You need to be playing a song on Spotify, for something to appear here.
          </p>
        )}
      </header>
    </div>
  );
}

export default App;
