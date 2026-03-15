import React, { useState, useEffect } from "react";
import API_URL from "../../config";
import { useParams, useNavigate } from "react-router-dom";
import Input from "../../components/input";
import Button from "../../components/button";
import Header from "../../layout/Header";
import { UserContext } from "../../UserContext";
import "../../css/pages/detalhesProduto.css";

const EditarProduto = () => {
  const [form, setForm] = useState({
    nome: "",
    preco: "",
    quantidade: "",
    status: "",
    imagem: "",
  });

  const { produto_id } = useParams();
  const { user } = React.useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProduto() {
      try {
        const response = await fetch(
          `${API_URL}/api/produtos/${produto_id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setForm({
            nome: data.nome,
            preco: data.preco,
            quantidade: data.quantidade,
            status: data.status,
            imagem: data.imagem,
          });
        } else {
          console.log("Erro ao buscar produto:", data.message);
        }
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
      }
    }

    fetchProduto();
  }, [produto_id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/api/produtos/${produto_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(form),
        }
      );

      if (response.ok) {
        navigate(`/produto/${produto_id}`);
      } else {
        const erro = await response.json();
        console.log("Erro ao editar:", erro.message);
      }
    } catch (error) {
      console.error("Erro ao editar produto:", error);
    }
  };

  const partes = form.imagem.replace(/\\/g, "/").split("/");
  const nomeArquivo = partes[partes.length - 1];

  return (
    <>
      <Header />
      <div className="product-container" style={{ marginTop: "24px" }}>
        <div className="product-content">
          <div className="product-image-area">
            <img
              src={`${API_URL}/api/produtos/uploads/${nomeArquivo}`}
              alt={form.nome}
              className="product-image"
            />
          </div>

          <div className="product-info-area">
            <form onSubmit={handleSubmit}>
              <Input
                label="Nome"
                name="nome"
                value={form.nome}
                onChange={handleChange}
              />
              <Input
                label="Preço"
                name="preco"
                type="number"
                value={form.preco}
                onChange={handleChange}
              />
              <Input
                label="Quantidade"
                name="quantidade"
                type="number"
                value={form.quantidade}
                onChange={handleChange}
              />
              <div style={{ marginBottom: "1rem" }}>
                <label>Status:</label>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="status"
                      value="Ativo"
                      checked={form.status === "Ativo"}
                      onChange={handleChange}
                    />
                    Ativo
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="status"
                      value="Inativo"
                      checked={form.status === "Inativo"}
                      onChange={handleChange}
                    />
                    Inativo
                  </label>
                </div>
              </div>

              <Button texto="Salvar" />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditarProduto;
