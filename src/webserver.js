const fetch = require("node-fetch");
// const SpotifyWebApi = require("./spotify-web-api");

const clientId = "0fb731893a9249c1adec90077bfc4c91";
// const clientSecret = "deaebcef359b413d85ca362d1d558ae3";
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
  return fetch(`https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}`);
  // return fetch(`https://archive.org/metadata/TheAdventuresOfTomSawyer_201303`).then(response => response.json());
//   const prom = new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve('foo');
//     }, 300);
//   });
//   return prom;
}

// const getSpotifyToken = async() => {
//   const requestOptions = {
//     method: 'POST',
//     headers: {'Authorization': 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64')), 'Content-Type': 'application/x-www-form-urlencoded'},
//   }
//   await fetch(`https://accounts.spotify.com/api/token?grant_type=authorization_code&code=${_code}&redirect_uri=${redirectUri}`, requestOptions)
//   .then(response => response.json());
// }

// let spotifyApi = new SpotifyWebApi();

// let authCode = getSpotifyAuthCode();

// console.log(authCode);

// let generatedToken = getSpotifyToken();

// spotifyApi.setAccessToken(generatedToken);

// spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE', function (err, data) {
//   if (err) console.error(err);
//   else console.log('Artist albums', data);
// });


const http = require('http');

console.log('Starting server...');

http.createServer(async (request, response) => {
  const { headers, method, url } = request;
  let body = [];
  request.on('error', (err) => {
    console.error(err);
  }).on('data', (chunk) => {
    body.push(chunk);
  }).on('end', async () => {

    response.on('error', (err) => {
      console.error(err);
    });
    // Implicit header definition
    // response.statusCode = 200;
    // response.setHeader('Content-Type', 'application/json');
    // response.setHeader('Type-Spotify-Request', 'Auth');
    // Explicit header definition
    await getSpotifyAuthCode();
    response.writeHead(200, {
      'Content-Type': 'application/json',
      'Type-Spotify-Request': 'Auth'
    })
    const responseBody = {headers, method, url, body };
    response.write(JSON.stringify(responseBody));
    response.end();
    // At this point, we have the headers, method, url and body, and can now
    // do whatever we need to in order to respond to this request.
  });
}).listen(5000); // Activates this server, listening on port 8080.