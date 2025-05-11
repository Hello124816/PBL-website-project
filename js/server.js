// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// MySQL connection
const connection = mysql.createConnection({
  host: "rare-disease-med-database.c7qai64ma8pc.ap-southeast-2.rds.amazonaws.com",
  user: "admin",
  password: "Babybaby0720",
  database: "RareDisease" // Connect directly to RareDisease
});

// Test database connection
connection.connect(error =>{
    if (error){console.log("There's an error")}
    
    else{
        console.log("There's no error")
    }
        
})
app.post('/search', (req, res) => {
 const {medications} = req.body
 const query = "SELECT * FROM diseases"
 connection.query(query, (error, results) => {
  if(error){
    console.log("Error")
  }

  const matchedDiseases = results.filter(disease => {
        if (!disease.Medications) {
          return false;
        }

        const meds = disease.Medications.split(',').map(m => m.trim().toLowerCase());
        return meds.some(med => medications.map(m => m.toLowerCase()).includes(med));
      }).map(disease => disease.Name);
      res.json({ diseases: matchedDiseases });
  });
});
// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });