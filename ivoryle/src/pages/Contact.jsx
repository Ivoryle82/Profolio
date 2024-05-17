import React from 'react';
import '../styles/contact.css'; // Assuming you have a CSS file for styling
import Header from '../components/Header'

function Contact() {
  return (
    <div>
      <main>
        <div className="contact-container">
          <h1>Contact Me</h1>
          <p>Feel free to reach out to me for any inquiries or feedback!</p>

          <form>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" required />

            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required />

            <label htmlFor="message">Message:</label>
            <textarea id="message" name="message" required></textarea>

            <button type="submit">Submit</button>
          </form>
        </div>
      </main>
      
    </div>
  );
}

export default Contact;
