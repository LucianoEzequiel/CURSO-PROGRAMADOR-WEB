var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//router.post('/', async (req, res, next) => {

//var nombre = req.body.Nombre;
//var apellido = req.body.Apellido;
//var email = req.body.Email;
//var telefono = req.body.Teléfono;
//var mensaje = req.body.Mensaje;

//console.log(req.body);



module.exports = router;
