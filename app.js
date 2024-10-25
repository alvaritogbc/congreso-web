const express = require('express');
const path = require('path');
const multer = require('multer');
const session = require('express-session');
const nodemailer = require('nodemailer');
const fs = require('fs');
const mime = require('mime-types');  // Para controlar el MIME type

const app = express();
const PORT = 3000;  // El puerto en el que correrá tu app

// Middleware para servir archivos estáticos (CSS, JavaScript, imágenes) y asegurarse del tipo MIME correcto
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, filePath) => {
        const mimeType = mime.lookup(filePath);
        res.setHeader('Content-Type', mimeType || 'application/octet-stream');
    }
}));

// Verificar si la ruta del archivo CSS es correcta
console.log('Ruta absoluta del CSS:', path.join(__dirname, 'public/style.css'));

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para parsear formularios
app.use(express.urlencoded({ extended: true }));

// Configuración de sesiones
app.use(session({
  secret: 'secreto-seguro',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Configuración de Multer para la subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para cada archivo
  }
});

const upload = multer({ storage: storage });

// Ruta principal
app.get('/', (req, res) => {
  res.render('index');  // Renderiza la vista index.ejs
});

// Ruta para la página de subida de proyectos
app.get('/upload', (req, res) => {
  res.render('upload');
});

// Ruta para manejar la subida de archivos y enviar un correo
app.post('/upload', upload.single('proyecto'), (req, res) => {
  const { nombre, email } = req.body;
  const proyecto = req.file.path;

  // Configurar Nodemailer para enviar el correo
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'tu-email@gmail.com',  // Reemplaza con tu email
      pass: 'tu-contraseña'        // Reemplaza con tu contraseña
    }
  });

  const mailOptions = {
    from: 'tu-email@gmail.com',
    to: 'destinatario@gmail.com',  // El email que recibirá los proyectos
    subject: 'Nuevo proyecto subido',
    text: `Nombre: ${nombre}\nCorreo: ${email}\nProyecto: ${proyecto}`,
    attachments: [{ path: proyecto }]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Correo enviado: ' + info.response);
    res.send('Proyecto subido y correo enviado.');
  });
});

// Ruta de login
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'admin123') {
    req.session.loggedIn = true;
    res.redirect('/admin');
  } else {
    res.send('Credenciales incorrectas');
  }
});

// Ruta para la página del administrador
app.get('/admin', (req, res) => {
  if (req.session.loggedIn) {
    fs.readdir('./uploads', (err, files) => {
      if (err) {
        return console.log(err);
      }
      res.render('admin', { files: files });
    });
  } else {
    res.redirect('/login');
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
