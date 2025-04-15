// src\components\layout\GlobalLoader.js
import { useEffect, useState } from 'react';

const GlobalLoader = ({ show }) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) setVisible(true);
    else setTimeout(() => setVisible(false), 300); // match transition time
  }, [show]);

  if (!visible) return null;
    return (
        <div className={`loader-container ${show ? 'fade-in' : 'fade-out'}`}>
      <div className="logo-wrapper">
          <svg viewBox="0 0 800 200" className="logo-svg">
            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="logo-text">
              Avida
            </text>
          </svg>
          <div className="loader-text">Loading<span className="dot">.</span><span className="dot">.</span><span className="dot">.</span></div>
        </div>
  
        <style jsx>{`
        .fade-in {
          opacity: 1;
          transform: scale(1);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .fade-out {
          opacity: 0;
          transform: scale(0.98);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .loader-container {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 9999;
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(240, 240, 240, 0.6);
          backdrop-filter: blur(15px);
        }
  
          .logo-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
  
          .logo-svg {
            width: 80vw;
            height: auto;
          }
  
          .logo-text {
            font-family: 'Arial Black', sans-serif;
            font-size: 120px;
            fill: none;
            stroke: #990e15;
            stroke-width: 3px;
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
            animation: flowOutline 2.5s linear infinite;
          }
  
          .loader-text {
            margin-top: 30px;
            font-size: 20px;
            color: #990e15;
            font-weight: 600;
            letter-spacing: 1px;
          }
  
          .dot {
            animation: blink 1.4s infinite both;
          }
  
          .dot:nth-of-type(2) {
            animation-delay: 0.2s;
          }
  
          .dot:nth-of-type(3) {
            animation-delay: 0.4s;
          }
  
          @keyframes flowOutline {
            0% {
              stroke-dashoffset: 1000;
            }
            100% {
              stroke-dashoffset: 0;
            }
          }
  
          @keyframes blink {
            0% {
              opacity: 0.2;
            }
            20% {
              opacity: 1;
            }
            100% {
              opacity: 0.2;
            }
          }
        `}</style>
      </div>
    );
  };
  
  export default GlobalLoader;
  