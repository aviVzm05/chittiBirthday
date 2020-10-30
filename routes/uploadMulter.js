var express = require('express');
var path = require('path');
var fs   = require('fs');

const {Storage} = require('@google-cloud/storage');
const Firestore = require('@google-cloud/firestore');
const { v4: uuidv4 } = require('uuid');
const os = require('os');
require('dotenv').config();
const multer = require('multer')

var router = express.Router();
// create new storage instance
const gc =  new Storage({
    keyFilename: path.join(__dirname,'..',process.env.GOOGLE_APPLICATION_CREDENTIALS),
    projectId: 'nodejstestingavinash' // storage owner....
});

const testBucket = gc.bucket(process.env.GCLOUD_STORAGE_BUCKET);

// Create an instance to our firestore db ... 

const db = new Firestore({
    projectId: 'nodejstestingavinash',
    keyFilename: path.join(__dirname,'..',process.env.GOOGLE_APPLICATION_CREDENTIALS)
  });

const multerMid = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 50 * 1024 * 1024,
    },
  })

router.use(multerMid.single('upload'))

//get the current OS temporary file.
const tempPath = os.tmpdir();

function uploadImage(file) {
    const uploadfile = new Promise((resolve,reject) => {
        const { originalname, buffer} = file;
        var filename1 = uuidv4() + '_' +  originalname.replace(/ /g,"_");
        const blob = testBucket.file(filename1)
        const blobstream = blob.createWriteStream({
            gzip: true,
            resumable: false
        })
        blobstream.on('finish',(status) => {
            resolve(blob.name)
            console.log('status from inert to Storage: ' + status);
        }).on('error', (err) => {
            reject(err)
        }).end(buffer)
    });
    return uploadfile;
}


router.post('/',function(req, res, next) {
    uploadImage(req.file).then((file1) => {
        const publicUrl = `https://storage.googleapis.com/${testBucket.name}/${file1}`
        var data = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            publicurl: publicUrl
        };
        const docRef = db.collection('Videos').doc(file1);
        docRef.set(data);
        res.status(201);
        res.send();
    }).catch((err) => {
        console.log(err);
        res.status(500);
        res.send();
    });
});

module.exports = router;