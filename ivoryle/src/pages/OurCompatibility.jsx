import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import '../styles/ourcompatibility.css';
import { getAccessToken, redirectToAuthCodeFlow, fetchProfile, fetchPlaylist, generateCodeVerifier,displayRecommendations, createPlaylist, displayRecommendationsAndAskCreatePlaylist} from '../services/spotifyApi';

function OurCompatibility() {
  // Define your client ID here
  const clientId = "b4c01840ec424a1aa275703fc29b8fac";
  const [profile, setProfile] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [userID, setUserID] = useState(null);
  const [token, setToken] = useState(null);
  

  useEffect(() => {
    async function fetchData() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        await redirectToAuthCodeFlow(clientId);
      } else {
        let verifier = localStorage.getItem("verifier");
        if (!verifier) {
          verifier = generateCodeVerifier(128);
          localStorage.setItem("verifier", verifier);
          console.log("Generated new code verifier:", verifier);
        }
        // if verifier on js doesnt work add it here
        const accessToken = await getAccessToken(clientId, code);
        const { profile, userID } = await fetchProfile(accessToken);
        const fetchedPlaylists = await fetchPlaylist(accessToken, userID);
        const fetchedRecommendations = await displayRecommendations(accessToken, userID);
        setProfile(profile);
        setPlaylists(fetchedPlaylists);
        setRecommendations(fetchedRecommendations);
        setToken(accessToken)
        setUserID(userID)
      }
    }

    fetchData().catch(error => console.error(error));
  }, [clientId]);

  // Function to shuffle array
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleCreatePlaylist = async (token, userID, track) => {
    try {
      const playlistName = `Ivory's Recommendation`; // You can customize the playlist name here
      const playlist = await createPlaylist(token,userID, playlistName, [track.uri]);
      console.log('Playlist created:', playlist);
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };  

  return (
    <>
      <div>
        <main className="main-content">
          <h1 className="ivory-le">Your Spotify</h1>
          <section id="user-profile">
            {/* This section will be populated by populateUI */}
            {profile && profile.images && profile.images.length > 0 && (
              <div className="profile-container">
                <h2 className="username">{profile.display_name}</h2>
                <img className="profile-pic" src={profile.images[0].url} alt="User Profile" />
              </div>
            )}
          </section>

          <section id="user-playlists">
          <div className="playlists-container" >
            <p>Your 3 Playlist</p>
            {/* Shuffle the playlists array and display the first three */}
            {playlists && shuffleArray(playlists).slice(0, 3).map((playlist, index) => (
              <div key={index} className='playlist-container'>
                  <iframe
                    title={playlist.name}
                    src={`https://open.spotify.com/embed/playlist/${playlist.id}`}
                    width="100%"
                    height="380"
                    allowtransparency="true"
                    allow="encrypted-media"
                  ></iframe>  
            </div>
            ))}
          </div>
          </section>
          <section id="recommendations">
            <div className="recommendations-container">
              <p>My recommendations for you</p>
              {recommendations && recommendations.map((track, index) => (
                <div key={index} className='recommendation-container'>
                  <iframe
                    title={track.name}
                    src={`https://open.spotify.com/embed/track/${track.id}`}
                    width="300"
                    height="80"
                    frameborder="0"
                    allowtransparency="true"
                    allow="encrypted-media"
                  ></iframe>
                  <button 
                      className="addplaylist-button"
                      onClick={() => handleCreatePlaylist(token, userID, track)}
                    >
                      Do you want to add this playlist
                    </button>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}

export default OurCompatibility;
