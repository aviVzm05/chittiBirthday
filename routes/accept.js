var express = require('express');
var path = require('path');
var fs   = require('fs');
var upload = require('express-fileupload');
var {body,validationResult} = require('express-validator');
const {Storage} = require('@google-cloud/storage');
const Firestore = require('@google-cloud/firestore');
const { v4: uuidv4 } = require('uuid');
const { resolve } = require('path');
const { rejects } = require('assert');
const { type } = require('os');
const { json } = require('express');
const { Readable } = require('stream');
const os = require('os');
require('dotenv').config();

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

router.use(upload({
    useTempFiles: false,
    debug: false
}));

//get the current OS temporary file.
const tempPath = os.tmpdir();

//create new function to copy the video to temp location. 
function uploadVideoToTemp(file,filename1) {
    const uploadVideo = new Promise((resolve,reject) => {
        file.mv(path.join(tempPath,filename1),(err)=> {
            if (!err) {
                resolve();
            }else {
                reject(err);
            }
        })
    });
    return uploadVideo;
}

router.post('/',function(req, res, next) {
    var filename1 = uuidv4() + '_' +  req.files.upload.name;
    var fileObject = testBucket.file(filename1);

// streams to load directly doesn't seem to be working. first save the vedio to temp location
// and them load to GCP and then delete it from temp
//code to move the vedio to temp location
    uploadVideoToTemp(req.files.upload,filename1)
    .then(() => {
        fs.createReadStream(path.join(tempPath,filename1))
        .pipe(fileObject.createWriteStream({
            gzip: true,
            resumable:  false
        })).on('error',(err) =>{
            console.log('error occured while writting to Google cloud');
            res.status(500);
            res.send();
        }).on('finish',()=>{
            var data = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            publicurl: `https://storage.googleapis.com/${testBucket.name}/${filename1}`
            };
            const docRef = db.collection('Videos').doc(filename1);
            docRef.set(data); // process update to firestore asynchronusly.
            //     async function setDocument(data) {
            //         var output = await docRef.set(data);
            //     };
            // setDocument(data);
            // console.log(`Record successfully updloaded for ${data.firstname},${data.lastname}`)
            fs.unlink(path.join(tempPath,filename1),(err)=> {
                if (err) {
                    console.log('Error while deleting temp file ' + err);
                }
            });
            //send responde message to the user.
            res.status(201);
            res.send();
        })
    }).catch((err) => {
        console.log('error from upload file promise, uploading to temp file failed.. '+ err);
        res.status(500);
        res.send();
    });
});

module.exports = router;