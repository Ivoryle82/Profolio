const express = require('express');
const fetch = require('node-fetch');
const queryString = require('querystring');

const app = express();
const PORT = process.env.PORT || 3000;

const CLIENT_ID = 'b4c01840ec424a1aa275703fc29b8fac';
const CLIENT_SECRET = '8f1660e2683942eda372a4aa0ec4d170';
const REDIRECT_URI = 'https://ivoryle82.github.io/myspotify.html'; 

// Function to exchange authorization code for access token
async function exchangeCodeForToken(code) {
    const data = {
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
    };

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: queryString.stringify(data)
    });

    const tokenData = await response.json();
    return tokenData.access_token;
}

// Function to fetch user's top tracks
async function fetchTopTracks(accessToken) {
    const response = await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=5', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    const data = await response.json();
    return data.items;
}

app.get('/callback', async (req, res) => {
    try {
        const { code } = req.query;

        // Exchange authorization code for access token
        const accessToken = await exchangeCodeForToken(code);

        // Fetch user's top tracks
        const topTracks = await fetchTopTracks(accessToken);

        // Handle further logic here, such as storing the access token and top tracks in a database or returning them to the client
        res.json({ accessToken, topTracks });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to exchange authorization code for token or fetch top tracks' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
