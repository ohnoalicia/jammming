// don't share API info publically (GitHub)
const clientId = "x";
const redirectUri = "http://localhost:3000";
let accessToken;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
        // console.log(accessToken) not appearing
      return accessToken;
    }

    // check for access token match
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);

      // This clears the parameters, allowing us to grab a new access token when it expires.

      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
      window.history.pushState("Access Token", null, "/");
      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = accessUrl;
    }
  },

  //fetch() method allows you to send or get data across networks / starts a request and returns a Promise // takes one argument - the url to the resource you want to fetch and an optional parameter otherwise GET is the default
  search(term) {
    const accessToken = Spotify.getAccessToken;
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, { // Spotify.js:35 Uncaught (in promise) TYPE ERROR: Failed to execute 'fetch' on 'Window': Invalid value
      // does not return the JSON response body(contains the requested information in the format specified by the Accept field in the request header) but returns a Promise that resolves to a Response object
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((jsonResponse) => {
        if (!jsonResponse.tracks) {
          return [];
        }
        return jsonResponse.tracks.items.map((track) => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
        }));
      });
  },

  savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) {
      return;
    }

    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    let userId;

    return fetch("https://api.spotify.com/v1/me", { headers: headers })
      .then((response) => response.json())
      .then((jsonResponse) => {
        userId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          headers: headers,
          method: "POST",
          body: JSON.stringify({ name: name }),
        }).then(response => response.json()
        ).then(jsonResponse => {
            const playlistId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ uris: trackUris})
            })
        })
      });
  },
};

export default Spotify;
