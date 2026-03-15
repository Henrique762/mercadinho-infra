import React from 'react';
import styles from '../css/layout/Header.module.css';
import { UserContext } from '../UserContext';
import { NavLink, useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, setUser } = React.useContext(UserContext);
  const navigate = useNavigate();

  const loggout = () => {
    localStorage.removeItem('user');
    setUser({ isLogin: false, nome: '', id: '0', token: '' });
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.titulo}>Market management</h1>
      <div className={styles.content}>
        <NavLink to="/meus-produtos" end>
          Meus Produtos
        </NavLink>
        <NavLink to="/cadastrar-produto">Cadastrar produto</NavLink>
        <div className={styles.user}>
          {user.nome}
          <nav className={styles.nav}>
            <div className={styles.arrow}></div>
            <ul>
              <li onClick={loggout}>
                Sair <span>→</span>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};
export default Header;
