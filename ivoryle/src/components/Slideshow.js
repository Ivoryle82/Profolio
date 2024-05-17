import React from 'react';

function Slideshow({ images, slideIndex }) {
  const slideshowStyles = {
    maxWidth: '800px',
    margin: 'auto',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: '20px',
    marginTop: '100px'
  };

  const slideStyles = {
    display: 'none',
  };

  const visibleSlideStyles = {
    display: 'block',
  };

  const imageStyles = {
    width: '100%',
    display: 'block',
  };

  const swipeNoteStyles = {
    textAlign: 'center',
    marginBottom: '10px',
  };

  return (
    <div className="slideshow-container" style={slideshowStyles}>
      {images.map((image, index) => (
        <div key={index} className={index === slideIndex ? "mySlides" : "mySlides hidden"} style={index === slideIndex ? visibleSlideStyles : slideStyles}>
          <img src={image} alt={`Slide ${index + 1}`} style={imageStyles} />
        </div>
      ))}
    </div>
  );
}

export default Slideshow;
