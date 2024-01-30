const { GoogleGenerativeAI } = require("@google/generative-ai");
const pdfParse = require('pdf-parse');
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors')
const app = express();
const port = 3000;
const corsOptions = {
  origin: '*', // Allow requests from all origins (replace with specific origin if needed)
  methods: 'GET, POST, PUT, DELETE', // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization', '*'], // Allowed headers
};
app.use(cors(corsOptions));

// Set up Multer to handle file uploads
const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI("AIzaSyCQrTwz_0-Zk0QJIYWXz1FE4CmDoUq9CgM");

async function run(fileData) {

  // extracting pdf code starts
 
  const data = await pdfParse(fileData);
  const textData = data.text;
  // pdf code ends

  // calling gen ai 
  string1 = { "name":"kushal","job":"SDE"}
  
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});
  const prompt = `Extract landlord name , tenant name , property name , rent , starting date , ending date from the following text :${textData};and present the data in key value pairs seperated by comma in a single line and each key and value should be encapsulated in double inverted commas and the whole reponse inside curly brackets like this ${string1}; just give the relevant data no additional comments needed`
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return(text) 
}




//creating end point

app.post('/upload', upload.single('pdf'), async(req, res) => {
  // Access the uploaded PDF file using req.file.buffer
  try {
    const pdfBuffer = req.file.buffer;
    const text = await run(pdfBuffer); 
    console.log(text)
    response_data = JSON.parse(text)
    res.send(text); // Send the text response
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing PDF'); // Handle errors gracefully
  }
  
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

