// Define global variable for the token
let spotifyToken = null;

// Function to generate a random string
function generateRandomString(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

// Function to get the access token
async function getAccessToken(code, clientId, redirectUri) {
    try {
        // Generate a random code verifier
        const codeVerifier = generateRandomString(128);

        // Encode the code verifier to Base64 URL-safe format
        const codeChallenge = await sha256(codeVerifier);

        // Define endpoint URL
        const url = 'https://accounts.spotify.com/api/token';

        // Define payload for POST request
        const payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: clientId,
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri,
                code_verifier: codeVerifier,
            }),
        };

        // Send POST request to token endpoint
        const response = await fetch(url, payload);

        // Check if response is successful
        if (!response.ok) {
            throw new Error('Failed to obtain access token');
        }

        // Parse response body as JSON
        const responseBody = await response.json();

        // Store access token in local storage
        localStorage.setItem('access_token', responseBody.access_token);

        // Return the access token
        return responseBody.access_token;
    } catch (error) {
        console.error('Error obtaining access token:', error);
        throw error;
    }
}

// Function to calculate SHA-256 hash
async function sha256(plain) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => String.fromCharCode(b)).join('');
}

// Function to handle obtaining access token and fetching user profile
async function handleAccessToken() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const redirectUri = encodeURIComponent("https://ivoryle82.github.io/compatibility.html");
    const clientId = "b4c01840ec424a1aa275703fc29b8fac"; // Replace with your client id

    if (code) {
        // If an authorization code is found, proceed with obtaining the access token
        const accessToken = await getAccessToken(code, clientId, redirectUri);
        spotifyToken = accessToken; // Assign the token to the global variable
        const profile = await fetchProfile();
        populateUI(profile);
        // Create a playlist
        await createPlaylist();
    }
}

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
async function fetchProfile() {
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

// Function to handle the Spotify authorization flow
function redirectToAuthCodeFlow() {
    console.log("Redirecting to Spotify authorization flow...");
    const clientId = "b4c01840ec424a1aa275703fc29b8fac";
    const redirectUri = encodeURIComponent("https://ivoryle82.github.io/compatibility.html");
    const scope = encodeURIComponent("user-read-private user-read-email");
    const state = encodeURIComponent("some-random-state-value"); // Optional: Include a state parameter for security
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;

    window.location.href = authUrl; // Redirect the user to the authorization URL
}

// Add an event listener to the login button
function addEventListenerToLoginButton() {
    const spotifyLoginButton = document.getElementById("spotify-login-button");
    if (spotifyLoginButton) {
        console.log("Found Spotify login button:", spotifyLoginButton);
        spotifyLoginButton.addEventListener("click", redirectToAuthCodeFlow);
    } else {
        console.log("Spotify login button not found!");
    }
}

// Call the function to add event listener to the login button
addEventListenerToLoginButton();

// On page load, handle obtaining access token and fetching user profile
window.addEventListener('load', () => {
    if (window.location.pathname === "/compatibility.html") {
        handleAccessToken();
    }
});
