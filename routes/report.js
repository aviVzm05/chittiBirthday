// route to access the entries made in firestore and report the details.
// create a email message and send the details over with combined video message....

const express = require('express');
const path    = require('path');
const Firestore = require('@google-cloud/firestore');
const { json } = require('express');
require('dotenv').config();

const router = express.Router();

// Create an instance to our firestore db ... 

const db = new Firestore({
    projectId: process.env.PROJECT_ID,
    keyFilename: path.join(__dirname,'..',process.env.GOOGLE_APPLICATION_CREDENTIALS)
});

// get all the documents in the videos collection, loop through the entries and make an array of 
// javascript objects for all...
// get emails into an array seperately and we can use nodemailer package to send to all at once.

router.get('/',(req,res,next) => {
    var array =  [];
    async function test(){
        const docref = await db.collection('Videos').get();
        if (docref.empty) {
            console.log ('no data in given collection')
        }else {
            docref.forEach((doc) => {
                if (Object.keys(doc.data()).length != 0) {
                    array.push(doc.data());
                }
            });
            res.render('report', {
                data: array
            });
        }
    }
    try{
        test();
    }
    catch(e){
        console.log('error: ' + e);
    }

})
module.exports = router;