import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomeComercial from './HomeComercial';
import ListaProcessos from './Processos/ListaProcessos';
import DetalhesProcesso from './Processos/DetalhesProcesso';

// Importe aqui outros componentes do módulo comercial
import Abertura from './Processos/Abertura';
import AberturaDeProcesso from './Processos/AberturaDeProcesso';
import ConfirmaProcesso from './Processos/ConfirmaProcesso';
import PropostaAbertura from './Propostas/PropostaAbertura';
import Consulta from './Propostas/Consulta';

const ComercialRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeComercial />} />
      <Route path="/Processos" element={<ListaProcessos />} />
      <Route path="/Processos/Detalhes/:id" element={<DetalhesProcesso />} />
      <Route path="/Abertura" element={<Abertura />} />
      <Route path="/AberturaDeProcesso" element={<AberturaDeProcesso />} />
      <Route path="/ConfirmaProcesso" element={<ConfirmaProcesso />} />
      <Route path="/PropostaAbertura" element={<PropostaAbertura />} />
      <Route path="/Consulta" element={<Consulta />} />
    </Routes>
  );
};

export default ComercialRoutes; 