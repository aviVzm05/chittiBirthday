const {Storage} = require('@google-cloud/storage');
const path = require('path');

const gc =  new Storage({
    keyFilename: path.join(__dirname,'../nodejstestingavinash-d04991471ef5.json'),
    projectId: 'nodejstestingavinash'
});

// gc.getBuckets().then(x => console.log(x));
const testBucket = gc.bucket('nodejstestingavinash');
var fileObject = testBucket.file('test.jpg');
fileObject.createWriteStream

async function uploadFileToGc(name1){
    await testBucket.upload(path.join(__dirname,'../upload',name1.name),{
        gzip:  true,
        resumable: false
    });
    console.log(`${name1.name} of size ${name1.size} is uploaded to GC`);
};

module.exports = uploadFileToGc