import React, { useState, useEffect } from 'react';
import { authEndpoint, clientId, clientSecret, redirectUri, scopes } from './config';
import logo from './logo.svg';
import './App.css';
import { generateCode } from './rand';
import sjcl from 'sjcl';
import express from 'express';

const App = () => {
  const [token, setToken] = useState(null);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    let _token = localStorage.getItem('ACCESS_TOKEN');

    if (!_token) {
      const params = (new URL(document.location)).searchParams;
      const _code = params.get('code');
      const rCode = generateCode(127);
      const challengeCodeBitArray = sjcl.hash.sha256.hash(rCode);
      console.log('Random code: ', rCode);
      const challengeCode = (new Buffer(sjcl.codec.hex.fromBits(challengeCodeBitArray)).toString('base64'));
      if (_code) {
        var client_id = 'CLIENT_ID';

        var app = express();

        app.get('/login', function(req, res) {

          var state = generateCode(16);
          var scope = 'user-read-private user-read-email';

          res.redirect('https://accounts.spotify.com/authorize?' +
            querystring.stringify({
              response_type: 'code',
              client_id: client_id,
              scope: scope,
              redirect_uri: redirectUri,
              state: state
            }));
        });
        $.ajax({ // grant_type=authorization_code&
          url: `https://accounts.spotify.com/api/token?code=${_code}&redirect_uri=${redirectUri}&code_challenge_method=S256&code_challenge=${challengeCode}`,
          type: 'POST',
          beforeSend: xhr => {
            xhr.setRequestHeader('Authorization', 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64')));
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
          },
          success: data => {
            localStorage.setItem('REFRESH_TOKEN', data.refresh_token);
            localStorage.setItem('ACCESS_TOKEN', data.access_token);
            setToken(data.access_token);
            getUserPlaylists(_token);

          },
          error: (xhr) => {
            console.log(`${xhr.status}: ${xhr.statusText}`);
            setToken(null);
          },
        });
      }
    } else {
      setToken(_token);
      getUserPlaylists(_token);
    }
  },
  []
  );

  const getUserPlaylists = (authToken) => {
    // Make a call using the token
    $.ajax({
      url: `https://api.spotify.com/v1/me/playlists`,
      type: 'GET',
      beforeSend: xhr => {
        xhr.setRequestHeader('Authorization', 'Bearer ' + authToken);
      },
      success: data => {
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
            Login to Spotify
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
