const express = require('express');
const router = express.Router();
var Jimp = require('jimp');
const app = require('../app');
const path = require('path');
const admin = require('firebase-admin');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const crypto = require('crypto');
var images = []

router.use(methodOverride('_method'));

//MongoDb 
const mongoURI = 'mongodb://admin:kharoll123@ds061701.mlab.com:61701/heroku_ln7t1jlc';
const conn = mongoose.createConnection(mongoURI);

let gfs;

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('images');
})

const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = file.originalname;
                const fileInfo = {
                    filename: filename,
                    bucketName: 'images'
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });



var serviceAccount = require("../../serviceAccountKey.json");

//Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://mygalery-74523.firebaseio.com"
});
const ref = admin.database().ref('images');

ref.on("child_added", function(snapchot) {

    const el = snapchot.val();
    images.push(snapchot.val())
})

/*/quality
Jimp.read('https://firebasestorage.googleapis.com/v0/b/mygalery-74523.appspot.com/o/images%2Fblack-wooden-dining-table-3046404.jpg?alt=media&token=e05632c1-2dab-436c-a992-4b589a7c92bc', (err, lenna) => {
    if (err) throw err;
    lenna
        .quality(70) // set JPEG quality
        .write('img_1.jpg'); // save
});*/



//rutas
router.get('/images', async(req, res) => {
    res.json(images);
    images.map(img => {
        console.log("imaen")
        console.log(img)
        console.log(img.name)
        Jimp.read(img.url, (err, lenna) => {

            if (err) throw err;
            lenna
                .quality(70) // set JPEG quality
                .write(img.name); // save
        });

    })


});

const array = [];
router.get('/lowerImages', async(req, res) => {

    gfs.files.find().toArray((err, files) => {
        files.map(file => {
            /*   const readstream = gfs.createReadStream(file.filename);
          array.push({ 'name': file.filename, 'url': readstream.pipe(file) })*/
        })

        res.json(files);
    })

    console.log(files)


});

const vec = [];
router.get('/lowerImage/:filename', (req, res) => {

    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);


    });

    console.log(vec)
});

//imagenes comprimidas

router.post('/getimages', upload.single('file'), (req, res) => {
    console.log(req.file)
    res.json({ file: req.file })
})


module.exports = router;