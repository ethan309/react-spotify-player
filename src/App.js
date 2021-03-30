import React, { useState, useEffect } from 'react';
import * as $ from 'jquery';
import { authEndpoint, clientId, clientSecret, redirectUri, scopes } from './config';
import logo from './logo.svg';
import './App.css';

const App = () => {
  const [token, setToken] = useState(null);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    let _token = localStorage.getItem('ACCESS_TOKEN');

    if (!_token) {
      const params = (new URL(document.location)).searchParams;
      let _code = params.get('code');
      if (_code) {
        $.ajax({
          url: `https://accounts.spotify.com/api/token?grant_type=authorization_code&code=${_code}&redirect_uri=${redirectUri}`,
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

          }
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
