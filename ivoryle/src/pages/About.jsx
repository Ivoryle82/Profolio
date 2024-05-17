import React from 'react';
import '../styles/about.css'; // Assuming you have a CSS file for styling
import Header from '../components/Header'

function About() {
  return (
    <div>
      <main className="main-content">
        <div className="about-container">
          <h1>About Me</h1>
          <div className="about-content">
            <div className="about-image">
              <img src= {require("../assets/images/portrait.jpg")} alt="Ivory Le" />
            </div>
            <div className="about-text">
              <p>Hi there,
                I'm Ivory Le, or as my nickname goes - Bong. Welcome to QuaMatBong, which means "Through Ivory Eyes." This is more than just a platform—it's my canvas. It's where I get to share my story with you.
              </p>
              <p>
                Growing up in the heart of Hanoi, Vietnam, life was a vibrant tapestry of sights, sounds, and smells. Surrounded by the hustle and bustle of the city, I found solace in the simple things: the wagging tails of my two beloved puppies, the comforting aroma wafting from my family's coffee shop, and the fresh flowers my mom brought home every morning.
              </p>
              <p>
                In these moments, I learned the art of appreciation. I learned to see beauty in the everyday, to cherish the small joys that make life so precious. And from a young age, I knew I wanted to capture it all.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer>
        <p>&copy; 2024 quamatbong. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default About;
