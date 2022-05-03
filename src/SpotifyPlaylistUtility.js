import * as $ from 'jquery';
import { authEndpoint, clientId, clientSecret, redirectUri, scopes } from './config';

const getSpotifyToken = () => {
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
          return data.access_token;
        }
      });
    }
  } else {
    return _token;
  }
};

const getSpotifyUserPlaylists = (authToken) => {
  // Make a call using the token
  $.ajax({
    url: `https://api.spotify.com/v1/me/playlists`,
    type: 'GET',
    beforeSend: xhr => {
      xhr.setRequestHeader('Authorization', 'Bearer ' + authToken);
    },
    success: data => {
      return data.items;
    }
  });
  return [];
};

const spotifyLoginLink = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=code&show_dialog=true`;

export { getSpotifyToken, getSpotifyUserPlaylists, spotifyLoginLink };