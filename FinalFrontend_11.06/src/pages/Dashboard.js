import React, { useState, useEffect } from 'react';
import './css/Dashboard.css';
import FloatingMenu from '../components/FloatingMenu';

const flipImages = [
  'https://cdn.dribbble.com/users/3726898/screenshots/15561676/media/7c253c514be1fcaccb10f510ddea7dcd.gif',
  'https://uploads-ssl.webflow.com/5ee4114f92b8ebde151416b5/5eeacb0806c26f86baf68b5a_ezgif-6-064babf95d80.gif',
  'https://healthrevpartners.com/wp-content/uploads/2024/02/Palliative-Care.png',
  'https://hospitalinternists.com/wp-content/uploads/2015/10/HIA_Slider_1.jpg',
  'https://img.freepik.com/premium-photo/friendly-doctor-gives-thumbs-up-hospital_932138-32794.jpg',
];

const slides = [
  {
    title: 'Why Choose Us?',
    description:
      'Our hospital is equipped with state-of-the-art facilities and a team of highly skilled professionals. We are committed to providing compassionate care and advanced medical services to all our patients.',
    image:
      'https://purepng.com/public/uploads/large/purepng.com-doctorsdoctorsdoctors-and-nursesa-qualified-practitioner-of-medicine-aclinicianmedical-practitionermale-doctornotepad-1421526856940m4nhi.png',
    imagePosition: 'left',
  },
  {
    title: 'Advanced Technology',
    description:
      'We utilize the latest medical technologies and diagnostic tools to ensure accurate and timely treatment for all our patients.',
    image: 'https://img.freepik.com/premium-photo/future-hospital-with-advanced-technology_861875-6310.jpg',
    imagePosition: 'right',
  },
  {
    title: '24/7 Emergency Care',
    description:
      'Our emergency department is open around the clock, staffed with experienced professionals ready to handle any medical crisis.',
    image: 'https://tse2.mm.bing.net/th/id/OIP.px8RspM5My6v6WPB8f1C_QHaEJ?rs=1&pid=ImgDetMain',
    imagePosition: 'left',
  },
];

const Dashboard = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentFlip, setCurrentFlip] = useState(0);
  const [animateText, setAnimateText] = useState(true);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    const flipInterval = setInterval(() => {
      setCurrentFlip((prev) => (prev + 1) % flipImages.length);
    }, 2000);

    const animationCycle = setInterval(() => {
      setAnimateText(false);
      setTimeout(() => setAnimateText(true), 100);
    }, 10000);

    return () => {
      clearInterval(slideInterval);
      clearInterval(flipInterval);
      clearInterval(animationCycle);
    };
  }, []);

  const { title, description, image, imagePosition } = slides[currentSlide];

  return (
    <div className="dashboard">
      <div className="hero-section">
        <div className="flip-image">
          <img src={flipImages[currentFlip]} alt="Flipping Visual" />
        </div>
        <div className="hero-text">
        <h2 className={animateText ? 'slide-text' : ''}>
          Hello
          {localStorage.role=='DOCTOR' ? ` Dr. ${localStorage.username}` :` ${localStorage.username}`}
          👋
          </h2>
          <h1 className={animateText ? 'slide-text' : ''}>Welcome to Our Hospital </h1>
          <p className={animateText ? 'slide-text' : ''}>Your health is our priority.</p>
        </div>
      </div>
 
      <div
        className="info-section"
        style={{ flexDirection: imagePosition === 'right' ? 'row-reverse' : 'row' }}
      >
        <div className="info-image">
          <img src={image} alt="Slide Visual" />
        </div>
        <div className="info-text">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>

      <div className="dots-container">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
          ></span>
        ))}
      </div>

      <FloatingMenu />
    </div>
  );
};

export default Dashboard;
