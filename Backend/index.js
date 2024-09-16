import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
//import { Pool } from 'pg';
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;
const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tempStore = {};

// Serve static files from the Frontend directory
app.use(express.static(path.join(__dirname, '../Frontend')));

//mount the body-parser module:
app.use(bodyParser.urlencoded({ extended: true }));
// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Set the directory where your EJS files are located
app.set('views', path.join(__dirname, '../Frontend','views'));

//Connect database with server:
const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// // Test the database connection
// db.query('SELECT NOW()', (err, res) => {
//   if (err) {
//     console.error('Database connection error:', err.stack);
//   } else {
//     console.log('Database connected successfully:', res.rows[0]);
//   }
// });

// Route for the home page
app.get('/', (req, res) => {
    res.render('index',{error:""});
  });

//User registration
app.post("/sign-up", async (req,res)=>{
  console.log(req.body);
  //Add the user registration details to the database after verification and password hashing
  //...
  const { username, email, password, confirmation } = req.body;
  tempStore['username']=username;
  tempStore['email']=email;
  //if email is not unique send error(search in db)
  const result2 = await db.query("SELECT EXISTS(SELECT 1 FROM faculty WHERE email = $1) ",[email]);
  //if username is not unique, then send error(search in db)
  const result1 = await db.query("SELECT EXISTS(SELECT 1 FROM faculty WHERE username = $1) ",[username]);
  let errorMsg = '';

  if (result2.rows[0].exists) {
    errorMsg = 'This email is already registered.';
  } else if (result1.rows[0].exists) {
    errorMsg = 'This username is already registered.';
  }
  
  if (errorMsg) {
    // Render the registration page with the error message
    res.render('index', { error: errorMsg });
  } else {
    //check if passwords match:
    if(password != confirmation)
    {
      return res.sendFile(path.join(__dirname,'../Frontend','passwords_no_match.html'))
    }
    //send email confimation of account and some verification to determine if he's legit:
    //...
    //identify faculty/admin: if faculty then:
    //do password hashing
    tempStore['hashed_password']=password;
    return res.sendFile(path.join(__dirname,'../Frontend','faculty_registr.html'));

    //else send registration page of admin
    }
 
  
  
});

app.post('/submit-faculty', async (req, res) => {
  //get faculty's registration details:
  const { name, institute, department } = req.body;
  console.log(name,institute,department);
  await db.query("INSERT INTO faculty(username,email,hashed_password,name,department) VALUES($1,$2,$3,$4,$5)",[tempStore['username'],tempStore['email'],tempStore['hashed_password'],name,department]);
  res.send('Faculty registered successfully!');//send a "registered successfully" page
});

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
