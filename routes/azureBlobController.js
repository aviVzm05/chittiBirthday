const { BlobServiceClient } = require('@azure/storage-blob');
const { v1: uuidv1} = require('uuid');
require('dotenv').config();

function loadFunc(file) {
    console.log('Azure Blob storage v12 - JavaScript quickstart sample');
    // Quick start code goes here
    const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
    // Create the BlobServiceClient object which will be used to create a container client
    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

    const container_name = 'chittibirthday';

    // Get a reference to a container
    const containerClient = blobServiceClient.getContainerClient(container_name);

    // Create a unique name for the blob
    const blobName = file;

    // Get a block blob client
    const blockBlobClient = containerClient.getBlobClient(blobName);
    console.log("am here: " + blockBlobClient);
}

//loadFunc().then(() => console.log('Done')).catch((ex) => console.log(ex.message));

module.exports = {
    "loadFunc": loadFunc
}