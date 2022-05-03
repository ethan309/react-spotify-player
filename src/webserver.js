const fetch = require("node-fetch");
const SpotifyWebApi = require("./spotify-web-api");

const clientId = "0fb731893a9249c1adec90077bfc4c91";
const clientSecret = "deaebcef359b413d85ca362d1d558ae3";
const redirectUri = "http://localhost:3000/callback";
// const getSpotifyToken = () => {
//   let _token = localStorage.getItem('ACCESS_TOKEN');

//   if (!_token) {
//     const params = (new URL(document.location)).searchParams;
//     let _code = params.get('code');
//     if (_code) {
//       $.ajax({
//         url: `https://accounts.spotify.com/api/token?grant_type=authorization_code&code=${_code}&redirect_uri=${redirectUri}`,
//         type: 'POST',
//         beforeSend: xhr => {
//           xhr.setRequestHeader('Authorization', 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64')));
//           xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//         },
//         success: data => {
//           localStorage.setItem('REFRESH_TOKEN', data.refresh_token);
//           localStorage.setItem('ACCESS_TOKEN', data.access_token);
//           return data.access_token;
//         }
//       });
//     }
//   } else {
//     return _token;
//   }
// };

const getSpotifyAuthCode = async() => {
  // const requestOptions = {
  //   method: 'POST',
  // }
  await fetch(`https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}`)
  .then(response => console.log(response));
}

const getSpotifyToken = async() => {
  const requestOptions = {
    method: 'POST',
    headers: {'Authorization': 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64')), 'Content-Type': 'application/x-www-form-urlencoded'},
  }
  await fetch(`https://accounts.spotify.com/api/token?grant_type=authorization_code&code=${_code}&redirect_uri=${redirectUri}`, requestOptions)
  .then(response => response.json());
}

let spotifyApi = new SpotifyWebApi();

let authCode = getSpotifyAuthCode();

console.log(authCode);

// let generatedToken = getSpotifyToken();

// spotifyApi.setAccessToken(generatedToken);

// spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE', function (err, data) {
//   if (err) console.error(err);
//   else console.log('Artist albums', data);
// });