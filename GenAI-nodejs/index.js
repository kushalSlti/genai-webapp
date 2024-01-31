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
  string1 = {
    "landlord_name": 'Mr James Hans',
    "tenant_name": 'Mr Kapoor',
    "property_name": 'Shop 1-2 , Navi mumbai',
    "rent": '10000',
    "starting_date": 'January 1, 2024',
    "ending_date": 'July 31, 2024'
  }


  wrongformat = true
  tries = 0
  while ( tries < 10){

    tries += 1;
    console.log("try no." + tries)
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    const prompt = `Extract landlord name , tenant name , property name , rent , starting date , ending date from the following text :${textData};and present the data in key value pairs seperated by comma in a single line and encapsulate each key and value in double inverted commas only; and the response should look like this : ${string1}; all keys should be in smallcase and key names should not have space in between but underscores like this :${string1}; just give the relevant data no additional comments needed`
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text)

    try{
      r_data = JSON.parse(text)
      if(r_data["landlord_name"]){
        return(r_data)
      }
      
    }catch(error){

    }
    
     

  }
  return([`false`])
  
}




//creating end point

app.post('/upload', upload.single('pdf'), async(req, res) => {
  // Access the uploaded PDF file using req.file.buffer
  try {
    const pdfBuffer = req.file.buffer;
    const text = await run(pdfBuffer); 
    console.log(text)
    
    res.send(text); // Send the text response
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing PDF'); // Handle errors gracefully
  }
  
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

