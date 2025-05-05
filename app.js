const express = require('express')
const dotenv=require('dotenv')
const connectDB=require('./config/database')

const productRoutes = require('./routes/productRoutes'); // Importez les routes produits

dotenv.config()
const app= express()
const bodyParser=require("body-parser")
const PORT=process.env.PORT||3000

connectDB()
app.use(bodyParser.json())
app.use(express.json())

app.use('/api',productRoutes)

const { google } = require('googleapis');
//const path = require('path');

// Load the service account credentials
//const KEY_FILE_PATH = path.join(__dirname, 'service-account/node-backend-458115-4d45118620d0.json');

const KEY_FILE_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const SCOPES = ['https://www.googleapis.com/auth/drive'];

const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE_PATH,
    scopes: SCOPES,
});

const drive = google.drive({ version: 'v3', auth });

const fs = require('fs');

const uploadDir = 'uploads';

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
    console.log(`Created directory: ${uploadDir}`);
}

async function uploadToGoogleDrive(filePath, fileName) {
    const fileMetadata = {
        name: fileName,
        parents: ['1xBrNgL-FHyzYblhbhBkh9BU7RPkB-GCQ'], // Replace with your Google Drive folder ID
    };

    const media = {
        mimeType: 'application/octet-stream',
        body: fs.createReadStream(filePath),
    };

    const response = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id, webViewLink',
    });

    return response.data; // Returns file ID and link
}




app.listen(PORT,()=>{
    console.log(`server running : http://localhost:${PORT}`)
 })