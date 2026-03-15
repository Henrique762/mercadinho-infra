import React from 'react';
import API_URL from "../../config";
import styles from '../../css/pages/Login.module.css';
import Input from '../../components/input';
import Button from '../../components/button';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext';

const Login = () => {
  const [forms, setForms] = React.useState({
    email: '',
    senha: '',
  });
  const [error, setError] = React.useState('');
  const navigate = useNavigate();
  const { user, setUser } = React.useContext(UserContext);

  const handleChange = ({ target }) => {
    const { id, value } = target;
    setForms({ ...forms, [id]: value });
  };

  React.useEffect(() => {
    if (user.isLogin) {
      navigate('/cadastrar-produto');
    }
  }, [navigate, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/login/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(forms),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      } else {
        const loggedUser = {
          isLogin: true,
          nome: data.nome,
          id: data.id,
          token: data.access_token,
        };

        localStorage.setItem('user', JSON.stringify(loggedUser));
        setUser(loggedUser);
        navigate('/cadastrar-produto');
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <section className={styles.login}>
      <div className={styles.containerImage}></div>
      <div className={styles.containerLogin}>
        <h1 className={styles.title}>Login</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            id="email"
            label="Email"
            type="email"
            onChange={handleChange}
            value={forms.email}
            required
          />
          <Input
            id="senha"
            label="Senha"
            type="password"
            onChange={handleChange}
            value={forms.senha}
            required
          />
          <Button texto="Entrar" className={styles.button} />
        </form>
        <p className={styles.cadastro}>
          Não possui conta? <Link to="/cadastrar">Cadastre-se</Link>
        </p>
        {error ? <p className={styles.error}>{error}</p> : null}
      </div>
    </section>
  );
};

export default Login;
