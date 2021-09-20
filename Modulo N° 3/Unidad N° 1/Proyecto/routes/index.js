var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', async (req, res, next) => {

  var Nombres = req.body.Nombres;
  var Apellido = req.body.Apellido;
  var Email = req.body.Email;
  var Telefono = req.body.Teléfono;
  var Mensaje = req.body.Mensaje;

  //console.log(req.body);

  var obj = {
    to: 'lucianoezequiel76@gmail.com',
    subject: 'Contacto desde Sabores',
    html: nombres + " " + apellido + " se contacto desde Sabores y necesita mas informacion a este correo: " + email + ". <br> Ademas, hizo el siguiente comentario: " + mensaje + ". <br> Su telefono es " + telefono
  }

  var transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    }
  })

  var info = await transporter.sendMail(obj);

  res.render('index', {
    message: 'Mensaje enviado',
  });

});

module.exports = router;
