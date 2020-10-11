var express = require('express');
var path = require('path');
var fs   = require('fs');
var upload = require('express-fileupload');
var validator = require('express-validator');
const {Storage} = require('@google-cloud/storage');
const Firestore = require('@google-cloud/firestore');
const { v4: uuidv4 } = require('uuid');
const { resolve } = require('path');
const { rejects } = require('assert');
const { type } = require('os');
const { json } = require('express');
const { Readable } = require('stream');

var router = express.Router();

// create new storage instance
const gc =  new Storage({
    keyFilename: path.join(__dirname,'../nodejstestingavinash-d04991471ef5.json'),
    projectId: 'nodejstestingavinash' // storage owner....
});

// Create an instance to our firestore db ... 

const db = new Firestore({
    projectId: 'nodejstestingavinash',
    keyFilename: path.join(__dirname,'../nodejstestingavinash-2812be094e14_pojectowner.json')
  });

const testBucket = gc.bucket(process.env.GCLOUD_STORAGE_BUCKET);

router.use(upload({
    useTempFiles: false,
    // tempFileDir: '../tmp/',
    debug: false
}));

//new  promise to read control file and write the data back. ensure the function awaits for completion.

function writeDataToFile(data) {
    var writePromise = new Promise((resolve,reject) => {
        var writeData = [];
        var fileData = fs.readFileSync(path.join(__dirname,'..','test.txt'),'utf-8');     
        var testdata;
        if (fileData.length == 0){
            writeData.push(data);
            testdata = JSON.stringify(writeData,null,2);
        }else {
            var objectData = JSON.parse(fileData);
            objectData.push(data);
            testdata = JSON.stringify(objectData,null,2);
        }
        fs.writeFile(path.join(__dirname,'..','test.txt'),testdata,(err) =>{
            if (!err){
                resolve();
            } else {
                console.log(err);
                reject('err');
            }
        });
    });
    return writePromise;
}

//create new function to copy the video to temp location. 

function uploadVideoToTemp(file,filename1) {
    const uploadVideo = new Promise((resolve,reject) => {
        file.mv(path.join(__dirname,'../tmp',filename1),(err)=> {
            if (!err) {
                resolve();
            }else {
                reject(err);
            }
        })
    });
    return uploadVideo;
}

router.post('/', function(req, res, next) {
    var filename1 = uuidv4() + '_' +  req.files.upload.name;
    var fileObject = testBucket.file(filename1);

// streams to load directly doesn't seem to be working. first save the vedio to temp location
// and them load to GCP and then delete it from temp

    if (!(req.files.upload.mimetype == 'video/mp4' || 
          req.files.upload.mimetype == 'video/avi' ||
          req.files.upload.mimetype == 'video/quicktime' ||
          req.files.upload.mimetype == 'video/x-ms-wmv' ||
          req.files.upload.size > 10083627
        )) {
        console.log('not a valid entry with mimetype ' + req.files.upload.mimetype + ' or size ' + req.files.upload.size);
          // render the error page
        res.status(500);
        res.render('error', {
            reason: "can't upload the file...not in valid format or too huge",
            message: "Sorry.. please try again"
        });
    }else {
        //code to move the vedio to temp location
        uploadVideoToTemp(req.files.upload,filename1)
        .then(() => {
            fs.createReadStream(path.join(__dirname,'../tmp',filename1),{
                highWaterMark: 2 * 1024 * 1024
            })
            .pipe(fileObject.createWriteStream({
                gzip: true,
                resumable:  false
            })).on('error',(err) =>{
                console.log('error occured while writting to Google cloud')
                res.send('error can not upload');
            }).on('finish',()=>{
                var data = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                filename: filename1
                };
                writeDataToFile(data).then(() => {
                    console.log(`data written successfully for ${data.firstname},${data.lastname}`);
                    fs.unlink(path.join(__dirname,'../tmp',filename1),(err)=> {
                        if (!err) {
                            console.log('temp file deleted');
                        }else{
                            console.log('well this failed ' + err);
                        }
                    })
                    res.status(201);
                    res.send('ok');
                }).catch((err) => {
                    console.log('Error while writting to data file ' + err);
                    res.send('error writting log file');
                })
            })
        }).catch((err) => {
            console.log('error from upload file promise '+ err);
        });
    }
});

module.exports = router;