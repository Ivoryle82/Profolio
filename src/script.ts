const clientId: string = "b4c01840ec424a1aa275703fc29b8fac";

const params: URLSearchParams = new URLSearchParams(window.location.search);
const code: string | null = params.get("code");

async function main(): Promise<void> {
    if (!code) {
        await redirectToAuthCodeFlow(clientId);
    } else {
        const accessToken: string = await getAccessToken(clientId, code);
        const profile: any = await fetchProfile(accessToken);
        const playlist: any = await fetchPlaylist(accessToken);
        populateUI(profile);
        populatePlaylist(playlist);
    }
}

main().catch(error => console.error(error));

export async function redirectToAuthCodeFlow(clientId: string): Promise<void> {
    const verifier: string = generateCodeVerifier(128);
    const challenge: string = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params: URLSearchParams = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "https://ivoryle82.github.io/compatibility.html");
    params.append("scope", "user-read-private user-read-email");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length: number): string {
    let text: string = '';
    const possible: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i: number = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier: string): Promise<string> {
    const data: Uint8Array = new TextEncoder().encode(codeVerifier);
    const digest: ArrayBuffer = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

export async function getAccessToken(clientId: string, code: string): Promise<string> {
    const verifier: string | null = localStorage.getItem("verifier");

    const params: URLSearchParams = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://localhost:5173/compatibility.html");
    params.append("code_verifier", verifier || ''); // Handle possible null or undefined value

    const result: Response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    const { access_token }: { access_token: string } = await result.json();
    return access_token;
}

async function fetchProfile(token: string): Promise<any> {
    const result: Response = await fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
    });

    const profile: any = await result.json();
    console.log(profile); // Profile data logs to console

    return profile;
}

async function fetchPlaylist(token: string): Promise<any> {
    const result: Response = await fetch("https://api.spotify.com/v1/me/playlists", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
    });

    const playlist: any = await result.json();
    console.log(playlist); // Playlist data logs to console

    return playlist;
}

function populateUI(profile: any): void {
    const displayNameElement: HTMLElement | null = document.getElementById("displayName");
    if (displayNameElement) {
        displayNameElement.innerText = profile.display_name || '';
    }

    // Populate other UI elements similarly
}

function populatePlaylist(playlistData: any): void {
    const playlistContainer: HTMLElement | null = document.getElementById("playlistContainer");
    if (playlistContainer && playlistData && playlistData.items && playlistData.items.length > 0) {
        const playlist: any = playlistData.items[0];
        const playlistName: string = playlist.name;
        const playlistDescription: string = playlist.description || '';

        // Create elements to display playlist information
        const playlistNameElement: HTMLElement = document.createElement("div");
        playlistNameElement.innerText = `Playlist Name: ${playlistName}`;
        
        const playlistDescriptionElement: HTMLElement = document.createElement("div");
        playlistDescriptionElement.innerText = `Playlist Description: ${playlistDescription}`;

        // Append elements to playlist container
        playlistContainer.appendChild(playlistNameElement);
        playlistContainer.appendChild(playlistDescriptionElement);
    }
}
