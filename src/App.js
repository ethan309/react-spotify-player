import React, { useState, useEffect } from 'react';
import * as $ from 'jquery';
import { authEndpoint, clientId, clientSecret, redirectUri, scopes } from './config';
import hash from './hash';
import Player from './Player';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

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

  useEffect(async () => {
    let _token = localStorage.getItem('ACCESS_TOKEN');

    if (!_token) {
      const params = (new URL(document.location)).searchParams;
      let _code = params.get('code');
      // let _code = hash.code;
      console.log(`CODE: ${_code}`);
      if (_code) {
        await axios.post(
          'https://accounts.spotify.com/api/token',
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: {
              grant_type: 'authorization_code',
              code: _code,
              redirect_uri: redirectUri,
              client_id: clientId,
              client_secret: clientSecret,
            }
          }
        ).then((res) => {
          console.log(res);
        });
        // $.ajax({
        //   url: `https://accounts.spotify.com/api/token?grant_type=authorization_code&code=${_code}&redirect_uri=${redirectUri}&client_id=${clientId}&client_secret=${clientSecret}`,
        //   type: 'POST',
        //   // beforeSend: xhr => {
        //   //   xhr.setRequestHeader('Authorization', 'Basic ' + clientSecret);
        //   // },
        //   success: data => {
        //     console.log(data);
        //     // setToken(_token);
        //     // getCurrentlyPlaying(_token);
        //   }
        // });
      }
    } 
    
    // if (_token) {
    //   // Set token
    //   setToken(_token);
    //   getCurrentlyPlaying(_token);
    // }
  });

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
            )}&response_type=code&show_dialog=true`}
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
