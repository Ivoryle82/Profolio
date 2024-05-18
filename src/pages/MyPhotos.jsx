import React, { useState, useEffect } from 'react';
import Slideshow from '../components/Slideshow';
import PhotoGallery from '../components/PhotoGallery';
import '../styles/style.css';
import '../styles/myphotos.css';
import japan from '../assets/images/japan.jpeg';
import japan1 from '../assets/images/japan1.jpeg';
import japan2 from '../assets/images/japan2.jpeg';
import japan3 from '../assets/images/japan3.jpeg';
import japan4 from '../assets/images/japan4.jpeg';
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
import sfo from '../assets/images/sfo.jpeg';
import sfo1 from '../assets/images/sfo1.jpeg';
import sfo2 from '../assets/images/sfo2.jpeg';
import sfo3 from '../assets/images/sfo3.jpeg';
import sfo4 from '../assets/images/sfo4.jpeg';
import sfo5 from '../assets/images/sfo5.jpeg';
import sfo6 from '../assets/images/sfo6.jpeg';
import sfo7 from '../assets/images/sfo7.jpeg';
import sfo8 from '../assets/images/sfo8.jpeg';
import sfo9 from '../assets/images/sfo9.jpeg';
import lehigh from '../assets/images/lehigh.jpeg';
import lehigh1 from '../assets/images/lehigh1.jpeg'
import lehigh2 from '../assets/images/lehigh2.jpeg'
import lehigh3 from '../assets/images/lehigh3.jpeg'
import lehigh4 from '../assets/images/lehigh4.jpeg'
import hanoi from '../assets/images/hanoi.jpeg'
import starbuck from '../assets/images/starbuck.jpeg'

function Photos() {
    const hoiAnImages = [hoian1, hoian2, hoian3, hoian4]; 
   
    const photos = [
        {
            thumbnail: japan,
            urls: [japan, japan1, japan2, japan3, japan4],
            note: 'Tokyo summer 2023 - Ginza'
        },

        {
            thumbnail: newyork,
            urls: [newyork1, newyork2, newyork3, newyork4, newyork5],
            note: 'NYC fall 2023 - West Village'
        },
        
        {
            thumbnail: sfo,
            urls: [sfo1,sfo2,sfo3,sfo4,sfo5,sfo6,sfo7,sfo8,sfo9],
            note: 'SanFrancisco 2024 - Golden Bridge'
        },

        {
            thumbnail: lehigh,
            urls: [lehigh,lehigh1,lehigh2,lehigh3,lehigh4],
            note: 'Lehigh People'
        },


        {
            thumbnail: hanoi,
            urls:[hanoi],
            note: ''
        },

        {
            thumbnail: starbuck,
            urls:[starbuck],
            note: ''
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
