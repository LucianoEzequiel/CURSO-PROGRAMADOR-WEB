var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', async (req, res, next) => {

var Nombres = req.body.Nombre;
var Apellido = req.body.Apellido;
var Email = req.body.Email;
var Telefono = req.body.Telefono;
var Mensaje = req.body.Mensaje;

console.log(req.body);

var obj = {
  to: 'lucianoezequiel76@gmail.com',
  subjet: 'contacto desde la web',
  html: Nombres+ ' ' + Apellido + ' se contacto a traves y necesita mas informacion al correo: ' + Email + '. <br> Ademas, hizo el siguiente comentario: ' + Mensaje + '.  <br> Su telefono es ' + Telefono
}

var transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
});

var info = await transporter.sendMail(obj);

res.render('index', { message: 'Mensaje enviado correctamente',});

});

module.exports = router;
