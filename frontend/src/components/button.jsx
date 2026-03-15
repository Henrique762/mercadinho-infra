import React from 'react';
import styles from "./../css/components/button.module.css";

const Button = ({ texto, onClick = () => {} }) => {
    return (
      <button className={styles.button} onClick={onClick}>
        {texto}
      </button>
    );
  };
  
  export default Button;