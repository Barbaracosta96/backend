import React from 'react';
import { Switch, Route } from 'react-router-dom';

// Componentes
import HomeComercial from './HomeComercial';

// Componentes de Propostas
import AberturaProposta from './Propostas/AberturaProposta';
import ConsultaProposta from './Propostas/ConsultaProposta';
import DetalhesProposta from './Propostas/DetalhesProposta';
import EditarProposta from './Propostas/EditarProposta';
import TrabalhoRealizado from './Propostas/TrabalhoRealizado';
import NumeroDiasUteis from './Propostas/NumeroDiasUteis';

// Componentes de Processos
import Abertura from './Processos/Abertura';
import ConfirmaProcesso from './Processos/ConfirmaProcesso';
import DetalhesProcesso from './Processos/DetalhesProcesso';
import ListaProcessos from './Processos/ListaProcessos';

const ComercialRoutes = () => {
    return (
        <Switch>
            {/* Rota principal */}
            <Route exact path="/app/Comercial" component={HomeComercial} />

            {/* Rotas de Propostas */}
            <Route exact path="/app/Propostas/Abertura" component={AberturaProposta} />
            <Route exact path="/app/Propostas/Consulta" component={ConsultaProposta} />
            <Route exact path="/app/Propostas/Detalhes/:id" component={DetalhesProposta} />
            <Route exact path="/app/Propostas/Editar/:id" component={EditarProposta} />
            <Route exact path="/app/Propostas/Trabalho/:id" component={TrabalhoRealizado} />
            <Route exact path="/app/Propostas/DiasUteis" component={NumeroDiasUteis} />
            <Route exact path="/app/Propostas/Consultaealteracao" component={Consultaealteracao} />
            <Route exact path="/app/Propostas/Fechamento/:id" component={Fechamento} />

            {/* Rotas de Processos */}
            <Route exact path="/app/Processos/Abertura" component={Abertura} />
            <Route exact path="/app/Processos/Confirma/:id" component={ConfirmaProcesso} />
            <Route exact path="/app/Processos/Detalhes/:id" component={DetalhesProcesso} />
            <Route exact path="/app/Processos/Lista" component={ListaProcessos} />
        </Switch>
    );
};

export default ComercialRoutes;
