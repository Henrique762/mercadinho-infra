import React from 'react';
import API_URL from "../../config";
import styles from '../../css/pages/CadastroProduto.module.css';
import Header from '../../layout/Header';
import Input from '../../components/input';
import { UserContext } from '../../UserContext';
import Button from '../../components/button';

const CadastroProduto = () => {
  const { user } = React.useContext(UserContext);
  const [error, setError] = React.useState('');
  const [sucess, setSucess] = React.useState('');

  const [forms, setForms] = React.useState({
    nome: '',
    preco: '',
    quantidade: '',
    status: 'Ativo',
    imagem: null,
    id_vendedor: user.id,
  });

  const handleChange = ({ target }) => {
    const { id, value } = target;
    setForms({ ...forms, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('nome', forms.nome);
      formData.append('preco', forms.preco);
      formData.append('quantidade', forms.quantidade);
      formData.append('status', forms.status);
      formData.append('imagem', forms.imagem);
      formData.append('id_vendedor', forms.id_vendedor);

      const response = await fetch(`${API_URL}//api/produtos`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      } else {
        setSucess(data.message);
      }
    } catch (e) {
      console.log('error', e.error);
    }
  };

  return (
    <>
      <Header />
      <section className={styles.cadastro}>
        <h1 className={styles.titulo}>Cadastrar Produtos</h1>
        <form className={styles.forms} onSubmit={handleSubmit}>
          <Input
            id="nome"
            label="Nome"
            type="text"
            onChange={handleChange}
            value={forms.nome}
            required
            className={styles.input}
          />
          <Input
            id="preco"
            label="Preço"
            type="number"
            onChange={handleChange}
            value={forms.preco}
            required
            className={styles.input}
          />
          <Input
            id="quantidade"
            label="Quantidade"
            type="number"
            onChange={handleChange}
            value={forms.quantidade}
            required
            className={styles.input}
          />
          <div className={styles.status}>
            <h2>Status</h2>
            <select
              name="status"
              id="status"
              onChange={(e) => setForms({ ...forms, status: e.target.value })}
              value={forms.status}
            >
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>

          <div className={styles.imagem}>
            <label htmlFor="imagem">Imagem</label>
            <input
              type="file"
              name="imagem"
              onChange={(e) =>
                setForms((prev) => ({ ...prev, imagem: e.target.files[0] }))
              }
              required
            />
          </div>

          <div className={styles.button}>
            <Button texto="Cadastrar" />
          </div>
          {error ? <p className={styles.error}>{error}</p> : null}
          {sucess ? <p className={styles.sucess}>{sucess}</p> : null}
        </form>
      </section>
    </>
  );
};

export default CadastroProduto;
