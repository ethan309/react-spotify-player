import React, { useState, useEffect } from 'react';
import { authEndpoint, clientId, redirectUri, scopes } from './config';
import logo from './logo.svg';
import './App.css';
import { generateCode } from './rand';
import express from 'express';
import qs from 'query-string';

const App = () => {
  const [token, setToken] = useState(null);
  const [playlists, setPlaylists] = useState([]);

  var app = express();

  useEffect(() => {
    let _token = localStorage.getItem('ACCESS_TOKEN');

    if (!_token) {
      const params = (new URL(document.location)).searchParams;
      const _code = params.get('code');
      if (_code) {
        app.get('/login', function(_req, res) {

          var state = generateCode(16);
          var scope = 'user-read-private user-read-email';

          res.redirect('https://accounts.spotify.com/authorize?' +
            qs.stringify({
              response_type: 'code',
              client_id: clientId,
              scope: scope,
              redirect_uri: redirectUri,
              state: state
            }));
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
    // $.ajax({
    //   url: `https://api.spotify.com/v1/me/playlists`,
    //   type: 'GET',
    //   beforeSend: xhr => {
    //     xhr.setRequestHeader('Authorization', 'Bearer ' + authToken);
    //   },
    //   success: data => {
    //     console.log(data.items);
    //     setPlaylists(data.items);
    //   },
    //   error: (xhr) => {
    //     console.log(`${xhr.status}: ${xhr.statusText}`);
    //     setPlaylists([]);
    //   },
    // });
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
