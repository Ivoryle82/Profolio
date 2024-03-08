// Define global variable for the token
let spotifyToken = null;

// Add an event listener to the login button
const spotifyLoginButton = document.getElementById("spotify-login-button");
if (spotifyLoginButton) {
    spotifyLoginButton.addEventListener("click", redirectToAuthCodeFlow);
}

// Function to handle the Spotify authorization flow
function redirectToAuthCodeFlow() {
    const clientId = "b4c01840ec424a1aa275703fc29b8fac"; // Replace with your client id
    const redirectUri = encodeURIComponent("https://ivoryle82.github.io/compatibility.html");
    const scope = encodeURIComponent("user-read-private user-read-email");
    const state = encodeURIComponent("some-random-state-value"); // Optional: Include a state parameter for security
    const codeChallenge = generateCodeChallenge(128);

    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}&state=${state}&code_challenge_method=S256&code_challenge=${codeChallenge}`;

    window.location.href = authUrl; // Redirect the user to the authorization URL
}

// Function to handle obtaining access token and fetching user profile
async function handleAccessToken() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
        // If an authorization code is found, proceed with obtaining the access token
        const clientId = "b4c01840ec424a1aa275703fc29b8fac"; // Replace with your client id
        const accessToken = await getAccessToken(clientId, code);
        spotifyToken = accessToken; // Assign the token to the global variable
        const profile = await fetchProfile(accessToken);
        populateUI(profile);
        // Create a playlist
        await createPlaylist();
    }
}

// On page load, handle obtaining access token and fetching user profile
window.addEventListener('load', () => {
    if (window.location.pathname === "/compatibility.html") {
        handleAccessToken();
    }
});

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

// Create a playlist with user's top tracks
async function createPlaylist() {
    try {
        // Create playlist with the name and description
        const playlist = await fetchWebApi(
            `v1/me/playlists`, 'POST', {
                "name": "Your Top Tracks Playlist",
                "description": "Playlist created for you by me",
                "public": false,
                "collaborative": false
            }
        );
        console.log("Playlist created:", playlist);
    } catch (error) {
        console.error("Error creating playlist:", error);
    }
}

// Function to populate user profile information
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
