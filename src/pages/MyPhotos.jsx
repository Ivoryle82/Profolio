import React, { useState, useEffect } from 'react';
import Slideshow from '../components/Slideshow';
import PhotoGallery from '../components/PhotoGallery';
import '../styles/style.css';
import '../styles/myphotos.css';
import japan from '../assets/images/japan.jpeg';
import ramenGinza from '../assets/images/ramenginza.jpg';
import cokeJapan from '../assets/images/cokejapan.jpeg';
import coffeeJapan from '../assets/images/coffeejapan.jpeg';
import taxiJapan from '../assets/images/taxijapan.jpeg';
import smileJapan from '../assets/images/smilejapan.jpeg';
import hoian1 from '../assets/images/hoian1.jpg';
import hoian2 from '../assets/images/hoian2.jpg';
import hoian3 from '../assets/images/hoian3.jpg';
import hoian4 from '../assets/images/hoian4.jpg';
import newyork from '../assets/images/newyork.png';
import newyork1 from '../assets/images/newyork1.png';
import newyork2 from '../assets/images/newyork2.png';
import newyork3 from '../assets/images/newyork3.png';
import newyork4 from '../assets/images/newyork4.png';
import newyork5 from '../assets/images/newyork5.png';

function Photos() {
    const hoiAnImages = [hoian1, hoian2, hoian3, hoian4]; 
   
    const photos = [
        {
            thumbnail: japan,
            urls: [ramenGinza, cokeJapan, coffeeJapan, taxiJapan, smileJapan],
            note: 'Tokyo summer 2023 - Ginza'
        },

        {
            thumbnail: newyork,
            urls: [newyork1, newyork2, newyork3, newyork4, newyork5],
            note: 'NYC fall 2023 - West Village'
        }

    ];
    const [slideIndex, setSlideIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setSlideIndex((prevIndex) => (prevIndex + 1) % hoiAnImages.length);
        }, 3000); 

        return () => clearInterval(intervalId);
    }, [hoiAnImages.length]);

    const handlePrev = () => {
        const newIndex = (slideIndex - 1 + hoiAnImages.length) % hoiAnImages.length;
        setSlideIndex(newIndex);
    };

    const handleNext = () => {
        const newIndex = (slideIndex + 1) % hoiAnImages.length;
        setSlideIndex(newIndex);
    };

    return (
        <div>
            <div style={{ textAlign: 'center' }}>
                <div>
                    <Slideshow images={hoiAnImages} slideIndex={slideIndex} />
                    {/* Add buttons for previous and next slides */}
                    <p>My scrapbook</p>
                    <button onClick={handlePrev}>Previous</button>
                    <button onClick={handleNext}>Next</button>
                </div>
            </div>
            <div style ={{textAlign: 'center'}}>
                <h2>Photo Gallery</h2>
                <PhotoGallery photos={photos} />
            </div>
        </div>
    );
}

export default Photos;
