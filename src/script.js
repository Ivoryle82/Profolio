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
        // Define endpoint URL
        const url = 'https://accounts.spotify.com/api/token';

        // Define payload for POST request
        const payload = new URLSearchParams();
        payload.append('client_id', clientId);
        payload.append('grant_type', 'authorization_code');
        payload.append('code', code);
        payload.append('redirect_uri', redirectUri);

        // Send POST request to token endpoint
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: payload,
        });

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

// Function to handle obtaining access token and fetching user profile
async function handleAccessToken() {
    try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const redirectUri = encodeURIComponent("https://ivoryle82.github.io"); // html
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
    } catch (error) {
        console.error('Error handling access token:', error);
    }
}

// On page load, handle obtaining access token and fetching user profile
window.addEventListener('load', () => {
    if (window.location.pathname === "/compatibility.html") {
        handleAccessToken();
    }
});
