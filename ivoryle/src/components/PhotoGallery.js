import React, { useState } from 'react';
import '../styles/photogallery.css';

const PhotoGallery = ({ photos }) => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [popupMedia, setPopupMedia] = useState([]);
    const [popupNote, setPopupNote] = useState('');

    const showPhotoPopup = (mediaUrls, note) => {
        setPopupMedia(mediaUrls);
        setPopupNote(note);
        setIsPopupVisible(true);
    };

    const hidePhotoPopup = () => {
        setIsPopupVisible(false);
        setPopupMedia([]);
        setPopupNote('');
    };

    return (
        <div>
            <div className="gallery-container">
                {photos.map((photo, index) => (
                    <div
                        className="gallery-item"
                        key={index}
                        onClick={() => showPhotoPopup(photo.media, photo.note)}
                    >
                        {photo.type === 'image' ? (
                            <img src={photo.thumbnail} alt="Gallery Thumbnail" />
                        ) : (
                            <video width="100%" height="100%">
                                <source src={photo.thumbnail} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        )}
                    </div>
                ))}
            </div>

            {isPopupVisible && (
                <div className="background-container" onClick={hidePhotoPopup}>
                    <div className="photo-popup" onClick={(e) => e.stopPropagation()}>
                        <span className="close-btn" onClick={hidePhotoPopup}>X</span>
                        <div className="popup-note">{popupNote}</div>
                        {popupMedia.map((url, index) => (
                            <div key={index}>
                                {url.type === 'image' ? (
                                    <img src={url.url} alt="Popup" className="popup-image" />
                                ) : (
                                    <video width="100%" controls>
                                        <source src={url.url} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PhotoGallery;
