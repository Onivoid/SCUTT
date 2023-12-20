import React from 'react';
import Style from '../styles/modules/progressBar.module.css';

const ProgressBar = ({ progress }) => {
  const fillerStyles = {
    height: '100%',
    width: `${progress}%`,
    borderRadius: 'inherit',
    transition: 'width 0.5s ease-in-out',
  };

  const containerStyles = {
    borderRadius: 50,
  };

  return (
    <div style={containerStyles} className={Style.container}>
      <div style={fillerStyles} className={Style.progress}>
      </div>
    </div>
  );
};

export default ProgressBar;
