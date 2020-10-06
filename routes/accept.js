var express = require('express');
var path = require('path');
var fs   = require('fs');
const {Storage} = require('@google-cloud/storage');

const gc =  new Storage({
    keyFilename: path.join(__dirname,'../nodejstestingavinash-d04991471ef5.json'),
    projectId: 'nodejstestingavinash'
});

const testBucket = gc.bucket('nodejstestingavinash');

var router = express.Router();
var upload = require('express-fileupload');

router.use(upload());

router.post('/', function(req, res, next) {
    // console.log(req.fields); // contains non-file fields
    // console.log(req.files) // contains files
    let name1 = req.files.upload;
    var fileObject = testBucket.file(req.files.upload.name);
    // name1.mv(path.join(__dirname,'../upload',name1.name),function(err){
    //     if (err){
    //         console.log(err);
    //     }else{
    //         console.log("i've done uploading");
    //         uploadFileToGc(name1);
    //     }
    // });

    req.pipe(fileObject.createWriteStream({
        gzip: true,
        resumable:  false
    })).on('error',function(err){
        console.log('error occured')
        res.send('error can not upload');
    }).on('finish',()=>{
        res.send('ok');
    })
    
    // req.pipe(fs.createWriteStream(path.join(__dirname,'../upload',name1.name)))
    // .on('finish',()=>{
    //     console.log('am done writing');
    //     res.send('ok');
    // })
    // .on('error',(err)=>{
    //     console.log(err);
    //     res.send('failed');
    // });
    console.log('nw am here.');
});

module.exports = router;
