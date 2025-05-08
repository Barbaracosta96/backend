const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Servidor de teste está funcionando!');
});

const PORT = 3003;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor de teste rodando em http://localhost:${PORT}`);
}); 