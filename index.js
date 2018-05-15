const  express = require('express');
const	multer = require('multer');
const 	app = express(),
    	server = require('http').createServer(app),
    	io = require('socket.io').listen(server);
    	mongo = require('mongodb').MongoClient;

app.get('/',function(req,res){
  res.sendFile(__dirname+'/public/index.html');
});

app.use(express.static('public/source'));
app.use(express.static(__dirname + '/public'));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
});

var upload = multer({ storage: storage }).single('photo')

app.post('/upload', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      
      return console.log("NIE");
    }
	console.log("TAK");
    res.end("TAK");
  });
});

server.listen(3000);



const nodemailer = require('nodemailer');
// create reusable transporter object using the default SMTP transport

// setup email data with unicode symbols
app.get('/send',function(req,res){
    
let smtpConfig = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '*******',
        pass: '*********'
    }
});

//    var ff =req.body.from;
//    console.log(ff);
let mailOptions = {
    from: req.query.from, // sender address
    to: '******', // list of receivers
    subject: req.query.from, // Subject line
    text: req.query.text, // plain text body

};

// send mail with defined transport object
smtpConfig.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }else{
 //   console.log('Message %s sent: %s', info.messageId, info.response);
     res.end("sent");
    }
});
});



mongo.connect('mongodb://127.0.0.1/test', function(err, db){
  if(err) throw err;

io.sockets.on('connection', function (socket) {
 
  var database = db.collection('messages');

  database.find().toArray(function(err, res){
    if(err) throw err;
    socket.emit('output', res);
  });

  socket.on('message', function(mess){

      database.insert( { username: mess.username, message: mess.message} )
      io.emit('message', {
        message: mess.message,
        username: mess.username
      });

 });
});
});


