const bcrypt = require('bcrypt');
const loginR = require('express').Router();
const User = require('../models/usersModel'); //requerimos para traer informacion de la BD querys de mongoose
const jwt = require('jsonwebtoken');

loginR.post('/', async (req, res) => {
  const { username, password } = req.body;
  const userDatos = await User.findOne({ username });

  const passwordCorrect =
    userDatos === null
      ? false
      : //comparamos el password del req.body con el password hasheado de la Base deDAtos
        await bcrypt.compare(password, userDatos.passwordHash); //esto responde con un TRUE si es correcto

  if (!(userDatos && passwordCorrect)) {
    return res.status(401).json({
      error: 'usuario o password invalido'
    });
  }
  //una vez logueado guardaremos la informacion en el JSONWEBTOKEN
  const userForToken = {
    id: userDatos._id,
    username: userDatos.username
  };
  //guardamos la info en el JWT

  const token = jwt.sign(userForToken, process.env.JWT_SECRET, {
    expiresIn: 60 * 60 * 24 * 7 //expira en 7dias
  });
  // respondemos con los datos del name,username y el token que tiene
  res.send({
    name: userDatos.name,
    username: userDatos.username,
    token
  });
});

module.exports = loginR;
