import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GlobalContext } from './UserContext';
import './App.css';
import CadastroVendedor from './pages/Cadastro/Cadastro';
import Login from './pages/Login/Login';
import CadastroProduto from './pages/CadastroProduto/CadastroProduto';
import ListarProduto from './pages/ListarProduto/ListarProduto';
import DetalhesProduto from './pages/Produto/detalhes';
import EditarProduto from './pages/Produto/editarProduto';

function App() {
  return (
    <BrowserRouter>
      <GlobalContext>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/cadastrar" element={<CadastroVendedor />} />
          <Route path="/cadastrar-produto" element={<CadastroProduto />} />
          <Route path="/meus-produtos" element={<ListarProduto />} />
          <Route path="/produto/:produto_id" element={<DetalhesProduto />} />
          <Route
            path="/produto/editar/:produto_id"
            element={<EditarProduto />}
          />
        </Routes>
      </GlobalContext>
    </BrowserRouter>
  );
}

export default App;
