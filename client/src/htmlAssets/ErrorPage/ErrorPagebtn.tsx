import React from 'react';
import styles from './ErrorPagebtn.module.css';

interface Props {}

const Button: React.FC<Props> = () => {
  return (
    <a 
      href={'/'}
      className={styles.btn}
    >
      Return to Home  
    </a >
  );
};

export default Button;
