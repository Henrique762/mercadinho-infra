import React from 'react';
import API_URL from "../../config";
import Input from '../../components/input';
import Button from '../../components/button';
import styles from '../../css/pages/CadastroVendedor.module.css';
import { Link, useNavigate } from 'react-router-dom';
import Imagem from '../../assets/cadastro.png';
import validateVendedor from './validateForm.js';

const CadastroVendedor = () => {
  const [form, setForm] = React.useState({
    nome: '',
    email: '',
    celular: '',
    senha: '',
    cnpj: '',
  });
  const [errors, setErrors] = React.useState({});
  const [isModal, setIsModal] = React.useState('');
  const [formCodigo, setFormCodigo] = React.useState({ codigo: '' });
  const [errorModal, setErrorModal] = React.useState('');
  const [sucessModal, setSucessModal] = React.useState('');

  const navigate = useNavigate();

  const handleChange = ({ target }) => {
    const { id, value } = target;
    setForm({ ...form, [id]: value });
  };

  const login = () => {
    navigate('/');
  };

  const handleSubmit = async (e) => {
    setErrorModal('');
    setSucessModal('');
    setIsModal(false);
    e.preventDefault();

    const validationErrors = validateVendedor(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      const response = await fetch(`${API_URL}/api/sellers`,
        {
          method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (data.status_code != 200) {
        window.alert(`Erro: ${data.message}`);
        console.error('Erro na resposta:', data.message);
        return;
      }

      setErrors({});
      setIsModal(true);
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };

  const handleCode = async (e) => {
    setErrorModal('');
    setSucessModal('');
    e.preventDefault();
    try {
      const dadosForms = {
        codigo: String(formCodigo.codigo),
        celular: form.celular,
      };

      const response = await fetch(
        `${API_URL}/api/sellers/activate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dadosForms),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorModal(data.message);
        return;
      } else {
        setSucessModal(data.message);
        setTimeout(() => {
          setIsModal(false);
          navigate('/');
        }, 1000);
      }
    } catch (e) {
      console.log('error', e);
      setErrorModal('Erro ao fazer requisição');
    }
  };

  return (
    <>
      <div className={styles.containerCadastro}>
        <div
          className={styles.side_1}
          style={{
            backgroundImage: `url(${Imagem})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
        <div className={styles.side_2}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <Input
              id="nome"
              label="Nome"
              required
              type="text"
              onChange={handleChange}
            />
            {errors.nome && <p className={styles.error}>{errors.nome}</p>}
            <Input
              id="email"
              label="Email"
              required
              type="email"
              onChange={handleChange}
            />
            {errors.email && <p className={styles.error}>{errors.email}</p>}
            <Input
              id="celular"
              label="Celular"
              required
              type="tel"
              onChange={handleChange}
            />
            {errors.celular && <p className={styles.error}>{errors.celular}</p>}
            <Input
              id="cnpj"
              label="Cnpj"
              required
              type="num"
              onChange={handleChange}
            />
            {errors.cnpj && <p className={styles.error}>{errors.cnpj}</p>}
            <Input
              id="senha"
              label="Senha"
              required
              type="password"
              onChange={handleChange}
            />
            {errors.senha && <p className={styles.error}>{errors.senha}</p>}

            <Button texto="Cadastrar" />
            <p>
              Já possui uma conta?{' '}
              <a
                onClick={login}
                style={{ cursor: 'pointer', color: '#b51f21' }}
              >
                Logar
              </a>
            </p>
          </form>
        </div>
      </div>
      {isModal ? (
        <section className={styles.containerModal}>
          <div className={styles.contentModal}>
            <button className={styles.closed} onClick={() => setIsModal(false)}>
              X
            </button>
            <form className={styles.form} onSubmit={handleCode}>
              <h1>Insira o código que recebeu no celular</h1>
              <Input
                id="codigo"
                label="Código"
                type="number"
                onChange={(e) => setFormCodigo({ codigo: e.target.value })}
                value={formCodigo.codigo}
                required
              />
              <div className={styles.buttonModal}>
                <Button texto="Enviar" />
              </div>
              {errorModal ? (
                <p className={styles.errorModal}>{errorModal}</p>
              ) : null}
              {sucessModal ? (
                <p className={styles.sucessModal}>{sucessModal}</p>
              ) : null}
            </form>
          </div>
        </section>
      ) : null}
    </>
  );
};

export default CadastroVendedor;
