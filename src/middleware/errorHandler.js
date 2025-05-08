// Middleware centralizado de tratamento de erros
module.exports = (err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({
    status: 'fail',
    message: err.message || 'Erro interno no servidor',
    errors: err.errors || undefined
  });
};
