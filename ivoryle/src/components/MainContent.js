// components/MainContent.js
import React from 'react';

function MainContent() {
  return (
    <main className="main-content" style={{ paddingBottom: '50px' }}>
      <h1 style={{ marginBottom: '10px' }}>My Spotify Playlist</h1>
      <iframe
        title="Hibiki 30s"
        src="https://open.spotify.com/embed/playlist/0mmtcM3w5OiGMCQFnvk9Wf?utm_source=generator"
        width="100%"
        height="380"
        frameBorder="0"
        allowTransparency="true"
        allow="encrypted-media"
      ></iframe>

      <div className="spotify-connect">
        <a href="https://accounts.spotify.com/authorize?client_id=b4c01840ec424a1aa275703fc29b8fac&response_type=code&redirect_uri=http://localhost:5173/compatibility.html&scope=user-read-private%20user-read-email" className="spotify-button" id="spotify-login-button">
          <img src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_CMYK_Black.png" alt="Spotify Logo" className="spotify-logo" /> Let's connect on Spotify
        </a>
      </div>
    </main>
  );
}

export default MainContent;
