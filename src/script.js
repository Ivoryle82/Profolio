async function handleSpotifyButtonClick() {
    const clientId = "b4c01840ec424a1aa275703fc29b8fac"; // Replace with your client id
    // Redirect the user to Spotify authorization flow
    redirectToAuthCodeFlow(clientId);
}

// Redirect to Spotify authentication flow
function redirectToAuthCodeFlow(clientId) {
    const redirectUri = encodeURIComponent("https://ivoryle82.github.io/compatibility.html");
    const scope = encodeURIComponent("user-read-private user-read-email");
    const state = encodeURIComponent("some-random-state-value"); // Optional: Include a state parameter for security
    const codeChallenge = generateCodeChallenge(128);

    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}&state=${state}&code_challenge_method=S256&code_challenge=${codeChallenge}`;

    window.location.href = authUrl; // Redirect the user to the authorization URL
}

// On page load, check if there is an authorization code in the URL
window.addEventListener('load', async () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
        // If an authorization code is found, proceed with obtaining the access token
        const clientId = "b4c01840ec424a1aa275703fc29b8fac"; // Replace with your client id
        const accessToken = await getAccessToken(clientId, code);
        spotifyToken = accessToken; // Assign the token to the global variable
        const profile = await fetchProfile(accessToken);
        populateUI(profile);
        // Fetch top tracks and create a playlist
        await displayTopTracks();
        await createPlaylist();
    }
});

// Define global variable for the token
let spotifyToken = null;

// Function to make API requests to Spotify
async function fetchWebApi(endpoint, method, body) {
    try {
        const res = await fetch(`https://api.spotify.com/${endpoint}`, {
            headers: {
                Authorization: `Bearer ${spotifyToken}`, // Use the global token
            },
            method,
            body: JSON.stringify(body)
        });
        return await res.json();
    } catch (error) {
        console.error("Error making API request:", error);
        throw error;
    }
}

// Fetch user profile data
async function fetchProfile(token) {
    try {
        const response = await fetchWebApi('v1/me', 'GET');
        return response;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
}

// Fetch user's top tracks
async function fetchTopTracks() {
    try {
        const response = await fetchWebApi(
            'v1/me/top/tracks?time_range=long_term&limit=5', 'GET'
        );
        return response.items;
    } catch (error) {
        console.error("Error fetching top tracks:", error);
        throw error;
    }
}

// Display user profile information
function populateUI(profile) {
    // Populate UI with profile data
    console.log("User Profile:", profile);
    // Example: Update HTML elements with profile data
}

// Display top tracks
async function displayTopTracks() {
    try {
        const topTracks = await fetchTopTracks();
        console.log("Top Tracks:", topTracks);
        // Example: Update HTML elements with top tracks data
    } catch (error) {
        console.error("Error displaying top tracks:", error);
    }
}

// Create a playlist with user's top tracks
async function createPlaylist() {
    try {
        // Fetch user's top tracks
        const topTracks = await fetchTopTracks();
        // Extract URIs of top tracks
        const tracksUri = topTracks.map(track => track.uri);
        // Create playlist with user's top tracks
        const playlist = await fetchWebApi(
            `v1/me/playlists`, 'POST', {
                "name": "Your Top Tracks Playlist",
                "description": "Playlist created for you by me",
                "public": false,
                "collaborative": false
            }
        );
        // Add top tracks to the playlist
        await fetchWebApi(
            `v1/playlists/${playlist.id}/tracks`, 'POST', {
                "uris": tracksUri
            }
        );
        console.log("Playlist created:", playlist);
    } catch (error) {
        console.error("Error creating playlist:", error);
    }
}

// Display user profile information
function populateUI(profile) {
    // Populate UI with profile data
    document.getElementById("displayName").innerText = profile.display_name;
    if (profile.images[0]) {
        const profileImage = new Image(200, 200);
        profileImage.src = profile.images[0].url;
        document.getElementById("avatar").appendChild(profileImage);
    }
    document.getElementById("id").innerText = profile.id;
    document.getElementById("email").innerText = profile.email;
    document.getElementById("uri").innerText = profile.uri;
    document.getElementById("uri").setAttribute("href", profile.external_urls.spotify);
    document.getElementById("url").innerText = profile.href;
    document.getElementById("url").setAttribute("href", profile.href);
    document.getElementById("imgUrl").innerText = profile.images[0]?.url ?? '(no profile image)';
}

// Display top tracks
async function displayTopTracks() {
    try {
        const topTracks = await fetchTopTracks();
        const topSongsContainer = document.getElementById("top-songs");
        topTracks.forEach(track => {
            const trackElement = document.createElement("p");
            trackElement.innerText = `${track.name} by ${track.artists.map(artist => artist.name).join(', ')}`;
            topSongsContainer.appendChild(trackElement);
        });
    } catch (error) {
        console.error("Error displaying top tracks:", error);
    }
}
