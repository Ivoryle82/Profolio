// Define global variable for the token
let spotifyToken = null;

// Function to get the access token
async function getAccessToken(code) {
    try {
        // Retrieve code verifier from local storage
        let codeVerifier = localStorage.getItem('code_verifier');
        
        // Log code verifier to ensure it's retrieved correctly
        console.log('Code verifier:', codeVerifier);
    
        // Define endpoint URL
        const url = 'https://accounts.spotify.com/api/token';
    
        // Define payload for POST request
        const payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: clientId, // Replace with your client ID
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri, // Replace with your redirect URI
                code_verifier: codeVerifier,
            }),
        };
        
        // Log payload before sending request
        console.log('Request payload:', payload);

        // Send POST request to token endpoint
        const response = await fetch(url, payload);
        
        // Log response status to ensure request was successful
        console.log('Response status:', response.status);

        // Check if response is successful
        if (!response.ok) {
            throw new Error('Failed to obtain access token');
        }

        // Parse response body as JSON
        const responseBody = await response.json();
        
        // Log response body to inspect token
        console.log('Response body:', responseBody);
        
        // Store access token in local storage
        localStorage.setItem('access_token', responseBody.access_token);
        
        // Optionally return the access token
        return responseBody.access_token;
    } catch (error) {
        console.error('Error obtaining access token:', error);
        throw error; // Rethrow error for handling by caller
    }
}

// Call the function with sample code to trigger the process
getAccessToken('sample_code');


// Function to handle obtaining access token and fetching user profile
async function handleAccessToken() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const redirectUri = encodeURIComponent("https://ivoryle82.github.io/compatibility.html");
    const clientId = "b4c01840ec424a1aa275703fc29b8fac"; // Replace with your client id

    if (code) {
        // If an authorization code is found, proceed with obtaining the access token
        const accessToken = await getAccessToken(clientId, code, redirectUri);
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
    const codeChallenge = generateCodeChallenge(128);
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}&state=${state}&code_challenge_method=S256&code_challenge=${codeChallenge}`;

    window.location.href = authUrl; // Redirect the user to the authorization URL
}

// Function to generate code challenge
function generateCodeChallenge() {
    // You can implement your code challenge generation logic here
    // For simplicity, I'm returning a dummy value
    return "dummy_code_challenge";
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
``