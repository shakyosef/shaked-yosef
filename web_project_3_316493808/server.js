//import modules
const express = require('express');
const bodyParser = require("body-parser");
const path = require ('path');
const sql = require('./db/db');
const CreateDB = require('./db/CreateDB');
const fs = require('fs');
const stringify = require('csv-stringify').stringify;
const { parse } = require("csv-parse");
const CSVToJSON = require('csvtojson');
const CRUD_operations = require("./db/crud_functions.js");
const port = 3030;


// init the app
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static('public'));

// Creating the DATA base
app.get('/CreateTableprofession',CreateDB.CreateTableprofession);
app.get("/InsertDataprofession", CreateDB.InsertDataprofession);
app.get('/ShowTableprofession', CreateDB.ShowTableprofession);
app.get('/DropTableprofession', CreateDB.DropTableprofession);

app.get('/CreateTableusers',CreateDB.CreateTableusers);
app.get("/InsertDatausers", CreateDB.InsertDatausers);
app.get('/ShowTableusers', CreateDB.ShowTableusers);
app.get('/DropTableusers', CreateDB.DropTableusers);

app.get('/CreateTableuserandprofession',CreateDB.CreateTableuserandprofession);
app.get("/InsertDatauserandprofession", CreateDB.InsertDatauserandprofession);
app.get('/ShowTableuserandprofession', CreateDB.ShowTableuserandprofession);
app.get('/DropTableuserandprofession', CreateDB.DropTableuserandprofession);

app.get('/CreateTablemymach',CreateDB.CreateTablemymach);
app.get("/InsertDatamymach", CreateDB.InsertDatamymach);
app.get('/ShowTablemymach', CreateDB.ShowTablemymach);
app.get('/DropTablemymach', CreateDB.DropTablemymach);


 
// root folder
app.get('/', (req,res)=>{
   res.render('Loginscreen')
   });

app.get('/newaccount', (req,res)=>{
    res.render('newaccount', {var1:  "     " })
    });
    app.get('/Lookforamatch', (req,res)=>{
        res.render('Lookforamatch', {
            variable1: 'חיפוש התאמה',
            variable0: '',
            variable2: 'מקצוע:',
            variable3: 'בחר...',
            variable4: 'מתמטיקה',
            variable5: 'אנגלית',
            variable18:'ספרות',
            variable6: 'רמת לימוד:',
                    variable7: 'בחר...',
                    variable8: 'יסודי',
                    variable9: 'חיטבה',
                    variable10: '3 יחידות',
                    variable11: '4 יחידות',
                    variable12: '5 יחידות',
                    variable13: 'פסיכומטרי',
                    variable14: 'סטודנט להנדסה',
                    variable15: 'סטודנט לכלכלה',
                    variable16: 'סטודנט למדעי המחשב',
                    variable17: 'סטודנט למדעי הטבע',
                    variable19: 'מטרת ההתאמה: ',
                    variable20: 'לתת עזרה',
                    variable21: ' לקבל עזרה ',
                    variable22: '  אופן המפגש',
                    variable23: ' מקוון ',
                    variable24: 'פרונטלי'      
        });
        });
        
    
app.get('/find', CRUD_operations.Finduserlogin);
app.get('/Privateprofile', CRUD_operations.mypropyle);
app.get('/personaldetails', CRUD_operations.look);
app.get('/myrequests', CRUD_operations.myrequests );
app.get('/mymatch',CRUD_operations.mymatch);

app.post("/insertuser", CRUD_operations.createNewuser);
app.post("/update", CRUD_operations.Update);
app.post('/lookmacth', CRUD_operations.match);
app.post('/savemymatch', CRUD_operations.savematch);
app.post('/matchconfirmation', CRUD_operations.matchconfirmation);








// set server to listen at port
app.listen(port, ()=>{
console.log('Server is renning at port 3000...')
});