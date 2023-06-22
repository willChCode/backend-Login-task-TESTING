const handleErrors = {
  CastError: res => res.status(400).json({ error: 'el ID es incorrecto' }),

  //error 409 luego arreglar por el test va fallar
  ValidationError: (res, error) =>
    res.status(400).json({ error: 'Completa los campos son requeridos' }),

  JsonWebTokenError: (res, error) =>
    res.status(401).send({ error: error.message }),

  TokenExpirerError: res =>
    res.status(401).json({
      error: 'token expirado'
    }),

  defaultError: res => res.status(500).end() //error del sistema
};

module.exports = (error, req, res, next) => {
  console.log(error.name);
  const handle = handleErrors[error.name] || handleErrors.defaultError;

  handle(res, error);
};
