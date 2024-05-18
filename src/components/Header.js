import React from 'react';
import '../styles/header.css'

function Header() {
  return (
    <header>
        <div class="logo">
            <a href="/Profolio">quamatbong</a>
        </div>  
        <nav>
          <ul>
            <li><a href="/Profolio/about">About Me</a></li>
            <li><a href="/Profolio/myphotos">My Photos</a></li>
            <li><a href="/Profolio/myspotify">My Spotify</a></li>
            <li><a href="/Profolio/contact">Contact</a></li>
          </ul>
        </nav>
    </header>
  );
}

export default Header;
