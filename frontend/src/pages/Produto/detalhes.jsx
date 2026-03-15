import React, { useState, useEffect } from 'react';
import API_URL from "../../config";
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../../css/pages/detalhesProduto.css';
import Button from '../../components/button';
import Header from '../../layout/Header';
import { UserContext } from '../../UserContext';
import styles from "../../css/components/button.module.css";

const DetalhesProduto = () => {
  const [dados, setDados] = useState(null);
  const { produto_id } = useParams();
  const { user } = React.useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProduto() {
      try {
        const response = await fetch(
          `${API_URL}/api/produtos/${produto_id}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          console.log(data.message);
        } else {
          console.log(data);
          setDados(data);
        }
      } catch (error) {
        console.error('Erro ao buscar produto:', error);
      }
    }

    fetchProduto();
  }, [produto_id]);

  const handleDelete = async () => {
  try {
    const response = await fetch(`${API_URL}/api/produtos/${produto_id}`, {
      method: 'DELETE',
      headers: {
              Authorization: `Bearer ${user.token}`,
            },
    });

    if (response.ok) {
      window.alert("Item excluído com sucesso");
      navigate('/meus-produtos');
    } else {
      console.error("Erro ao excluir:", response.status);
    }
  } catch (error) {
    console.error("Erro ao excluir:", error);
  }
  };

  if (!dados) {
    return (
      <>
        <Header />
        <p style={{ padding: '2rem' }}>Produto não encontrado!</p>
      </>
    );
  }

  const partes = dados.imagem.replace(/\\/g, '/').split('/');
  const nomeArquivo = partes[partes.length - 1];

  return (
    <>
      <Header />
      <div className="product-container" style={{ marginTop: '24px' }}>
        <div className="product-content">
          <div className="product-image-area">
            <img
              src={`${API_URL}/api/produtos/uploads/${nomeArquivo}`}
              alt={dados.nome}
              className="product-image"
            />
          </div>
          <div className="product-info-area">
            <h2 className="product-title">{dados.nome}</h2>
            <p className="product-description">
              Qtd disponíveis: {dados.quantidade}
            </p>
            <p className="product-description">Status: {dados.status}</p>
            <p className="product-price">
              R$ {dados.preco ? dados.preco.toFixed(2) : '0.00'}
            </p>

            <div style={{ display: 'flex' }}>

            <Link to={`/produto/editar/${dados.id}`}>
              <Button texto="Editar" />
            </Link>

            <button style={{ backgroundColor: '#b5303b', marginLeft:'15px'}} className={styles.button}  onClick={handleDelete}>
                   Excluir
                  </button>
            </div>

            <Link to="/meus-produtos" className="back-link">
              ← Voltar
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetalhesProduto;
