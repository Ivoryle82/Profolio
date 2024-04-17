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
        populatePlaylistEmbed(playlist);
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
    params.append("redirect_uri", "https://ivoryle82.github.io/compatibility.html");
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
        const ownerName: string = playlist.owner.display_name || 'Unknown';
        const isPublic: boolean = playlist.public;
        const followersCount: number = (playlist.owner.followers && playlist.owner.followers.total) || 0;

        // Create elements to display playlist information
        const playlistNameElement: HTMLElement = document.createElement("div");
        playlistNameElement.innerText = `Playlist Name: ${playlistName}`;

        const playlistDescriptionElement: HTMLElement = document.createElement("div");
        playlistDescriptionElement.innerText = `Playlist Description: ${playlistDescription}`;

        const ownerElement: HTMLElement = document.createElement("div");
        ownerElement.innerText = `Owner: ${ownerName}`;

        const publicStatusElement: HTMLElement = document.createElement("div");
        publicStatusElement.innerText = `Public: ${isPublic ? 'Yes' : 'No'}`;

        const followersElement: HTMLElement = document.createElement("div");
        followersElement.innerText = `Followers: ${followersCount}`;

        // Append elements to playlist container
        playlistContainer.appendChild(playlistNameElement);
        playlistContainer.appendChild(playlistDescriptionElement);
        playlistContainer.appendChild(ownerElement);
        playlistContainer.appendChild(publicStatusElement);
        playlistContainer.appendChild(followersElement);

        // Display tracks
        if (playlist.tracks && playlist.tracks.items) {
            const tracksList: HTMLElement = document.createElement("ul");
            playlist.tracks.items.forEach((trackItem: any) => {
                const trackName: string = trackItem.track.name;
                const trackElement: HTMLElement = document.createElement("li");
                trackElement.innerText = trackName;
                tracksList.appendChild(trackElement);
            });
            playlistContainer.appendChild(tracksList);
        }
    }
}

async function populatePlaylistEmbed(playlistData: any): Promise<void> {
    const playlistEmbedContainer: HTMLElement | null = document.getElementById("playlistEmbed");
    if (playlistEmbedContainer && playlistData && playlistData.items && playlistData.items.length > 0) {
        const playlist: any = playlistData.items[0];
        const playlistId: string = playlist.id; // Assuming playlist ID is available in the playlist data

        // Create the Spotify playlist embed iframe
        const iframe: HTMLIFrameElement = document.createElement("iframe");
        iframe.title = "My Spotify Playlist";
        iframe.src = `https://open.spotify.com/embed/playlist/${playlistId}`;
        iframe.width = "100%";
        iframe.height = "380";
        iframe.frameBorder = "0";
        iframe.allow = "encrypted-media";

        // Append the iframe to the playlist embed container
        playlistEmbedContainer.appendChild(iframe);
    }
}

// Usage: Call populatePlaylistEmbed function passing the playlist data
// populatePlaylistEmbed(playlistData);

