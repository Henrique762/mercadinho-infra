import React from 'react';
import API_URL from "../../config";
import Header from '../../layout/Header';
import styles from '../../css/pages/ListarProduto.module.css';
import { UserContext } from '../../UserContext';
import { Link } from 'react-router-dom';
import Button from '../../components/button';
import Input from '../../components/input';

const ListarProduto = () => {
  const { user } = React.useContext(UserContext);
  const [dados, setDados] = React.useState(null);
  const [infoProduto, setInfoProduto] = React.useState({
    id: '',
    id_vendedor: '',
    nome: '',
    preco: 0,
    quantidade: 0,
    status: '',
  });
  const [formVendas, setFormVendas] = React.useState({
    quantidade: '',
  });
  const [isModal, setIsModal] = React.useState(false);
  const [error, setError] = React.useState('');
  const [sucess, setSucess] = React.useState('');
  const [valorTotal, setValorTotal] = React.useState(0);

  const handleChange = ({ target }) => {
    const { id, value } = target;
    setFormVendas({ ...formVendas, [id]: value });
  };

  React.useEffect(() => {
    setDados(null);
    const produtosFetch = async () => {
      try {
        const response = await fetch(`${API_URL}/api/produtos`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await response.json();

        if (response.ok) {
          setDados(data);
        } else {
          setDados(null);
        }
      } catch (e) {
        console.log('error', e);
        setDados(null);
      }
    };
    produtosFetch();
  }, [user.token, isModal]);

  const realizarVenda = (id, id_vendedor, nome, preco, quantidade, status) => {
    setError('');
    setSucess('');
    setFormVendas({ quantidade: '' });
    setIsModal(true);
    setInfoProduto({
      id,
      id_vendedor,
      nome,
      preco,
      quantidade,
      status,
    });
  };

  const handleSubmit = async (e) => {
    setError('');
    setSucess('');
    e.preventDefault();

    try {
      const form = {
        id_produto: infoProduto.id,
        quantidade: Number(formVendas.quantidade),
      };
      const response = await fetch(`${API_URL}/api/sellers/venda`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      } else {
        setSucess('Venda registrada!');
        console.log('bora', data);
        setValorTotal(
          data['Valor Total'].toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
        );
        setTimeout(() => {
          setIsModal(false);
        }, 2000);
      }
    } catch (e) {
      setError('Erro ao fazer requisição');
      console.log('error', e);
    }
  };

  return (
    <>
      <Header />
      <section className={styles.listarProduto}>
        <h1 className={styles.titulo}>Meus Produtos</h1>
        <div className={styles.content}>
          {dados && dados.length > 0 ? (
            dados.map((item) => {
              let nomeArquivo = '';

              if (item.imagem) {
                const partes = item.imagem.replace(/\\/g, '/').split('/');
                nomeArquivo = partes[partes.length - 1];
              }

              return (
                <div
                  key={`${item.id}${item.id_vendedor}`}
                  className={styles.produtos}
                >
                  <p>
                    Nome: <span>{item.nome}</span>
                  </p>

                  {nomeArquivo ? (
                    <img
                      src={`${API_URL}/api/produtos/uploads/${nomeArquivo}`}
                      alt={item.nome}
                    />
                  ) : null}

                  <Link to={`/produto/${item.id}`}>Ver detalhes</Link>
                  <button
                    className={styles.venda}
                    onClick={() =>
                      realizarVenda(
                        item.id,
                        item.id_vendedor,
                        item.nome,
                        item.preco,
                        item.quantidade,
                        item.status,
                      )
                    }
                  >
                    Realizar venda
                  </button>
                </div>
              );
            })
          ) : (
            <p className={styles.error}>Nenhum Produto Cadastrado</p>
          )}
        </div>
      </section>
      {isModal ? (
        <section className={styles.containerModal}>
          <div className={styles.contentModal}>
            <button className={styles.closed} onClick={() => setIsModal(false)}>
              X
            </button>
            <h1>
              Nome: <span>{infoProduto.nome}</span>
            </h1>
            <p>
              Preço:
              <span>
                {infoProduto.preco.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </span>
            </p>
            <p>
              Status: <span>{infoProduto.status}</span>
            </p>
            <p>
              Quantidade: <span>{infoProduto.quantidade}</span>
            </p>
            <div className={styles.divider}></div>
            <form className={styles.form} onSubmit={handleSubmit}>
              <Input
                id="quantidade"
                label="Quantidade"
                type="number"
                onChange={handleChange}
                value={formVendas.quantidade}
                required
                className={styles.input}
              />

              {infoProduto.status === 'Inativo' ? (
                <p className={styles.errorModal}>Produto Inativo!</p>
              ) : formVendas.quantidade > infoProduto.quantidade ||
                infoProduto.quantidade <= 0 ? (
                <p className={styles.errorModal}>
                  Sem estoque para essa quantidade!
                </p>
              ) : (
                <Button texto="Finalizar venda" />
              )}
              {error ? <p className={styles.errorModal}>{error}</p> : null}
              {sucess ? <p className={styles.sucessModal}>{sucess}</p> : null}
              {sucess ? (
                <p className={styles.valorTotal}>
                  Valor total: <span>{valorTotal}</span>
                </p>
              ) : null}
            </form>
          </div>
        </section>
      ) : null}
    </>
  );
};

export default ListarProduto;
