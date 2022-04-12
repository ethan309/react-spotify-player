import React, { useState, useEffect } from 'react';
import * as $ from 'jquery';
import { authEndpoint, clientId, clientSecret, redirectUri, scopes } from './config';
import logo from './logo.svg';
import './App.css';
import { generateCode } from './rand';
import sjcl from 'sjcl';

const App = () => {
  const [token, setToken] = useState(null);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
      const params = (new URL(document.location)).searchParams;
      const _code = params.get('code');
      const rState = generateCode(16);
      const rCode = generateCode(127);
      const challengeCodeBitArray = sjcl.hash.sha256.hash(rCode);
      console.log('Random code: ', rCode);
      const challengeCode = (new Buffer(sjcl.codec.hex.fromBits(challengeCodeBitArray)).toString('base64'));
      if (_code) {
        $.ajax({
          url: `https://accounts.spotify.com/api/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&code_challenge_method=S256&state=${rState}&code_challenge=${challengeCode}`,
          type: 'POST',
          beforeSend: (xhr) => {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
          },
          success: (data) => {
            console.log('-- RES', data);
          },
          error: (xhr) => {
            console.log(`-- ${xhr.status}: ${xhr.statusText}`);
          },
        });
      }
    },
  []
  );

  // useEffect(() => {
  //   let _token = localStorage.getItem('ACCESS_TOKEN');

  //   if (!_token) {
  //     const params = (new URL(document.location)).searchParams;
  //     const _code = params.get('code');
  //     const rState = generateCode(16);
  //     const rCode = generateCode(127);
  //     const challengeCodeBitArray = sjcl.hash.sha256.hash(rCode);
  //     console.log('Random code: ', rCode);
  //     const challengeCode = (new Buffer(sjcl.codec.hex.fromBits(challengeCodeBitArray)).toString('base64'));
  //     if (_code) {
  //       $.ajax({ // &grant_type=authorization_code &state=${rState}
  //         url: `https://accounts.spotify.com/api/token?
  //         code=${_code}&
  //         grant_type=authorization_code&
  //         redirect_uri=${redirectUri}&
  //         code_challenge_method=S256&
  //         code_challenge=${challengeCode}`,
  //         type: 'POST',
  //         beforeSend: (xhr) => {
  //           xhr.setRequestHeader('Authorization', 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64')));
  //           xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  //         },
  //         success: (data) => {
  //           console.log('RES', data);
  //           const { access_token, refresh_token } = data;
  //           localStorage.setItem('REFRESH_TOKEN', refresh_token);
  //           localStorage.setItem('ACCESS_TOKEN', access_token);
  //           setToken(access_token);
  //           getUserPlaylists(access_token);
  //         },
  //         error: (xhr) => {
  //           console.log(xhr.status === 400 ? 'Not logged in with Spotify' : `${xhr.status}: ${xhr.statusText}`);
  //           setToken(null);
  //         },
  //       });
  //     }
  //   } else {
  //     setToken(_token);
  //     getUserPlaylists(_token);
  //   }
  // },
  // []
  // );

  const getUserPlaylists = (authToken) => {
    // Make a call using the token
    $.ajax({
      url: `https://api.spotify.com/v1/me/playlists`,
      type: 'GET',
      beforeSend: (xhr) => {
        xhr.setRequestHeader('Authorization', 'Bearer ' + authToken);
      },
      success: (data) => {
        console.log(data.items);
        setPlaylists(data.items);
      },
      error: (xhr) => {
        console.log(`${xhr.status}: ${xhr.statusText}`);
        setPlaylists([]);
      },
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
            Log In to Spotify
          </a>
        )}
        {token && (
          playlists.map((playlist) => (
            <div key={playlist.id}>
              <h2>{playlist.name}</h2>
              <p>{playlist.external_urls.spotify}</p>
              <p>{playlist.tracks.total}</p>
            </div>
          ))
        )}
      </header>
    </div>
  );
}

export default App;
