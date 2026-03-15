import React from "react";
import styles from "./../css/components/input.module.css";

const Input = ({ id, label, onChange,type, ...props }) => {
    return (
      <div className={styles.input}>
        <label htmlFor={id}>{label}</label>
        <input id={id} name={id} onChange={onChange} type={type}{...props} />
      </div>
    );
  };
  
  export default Input;