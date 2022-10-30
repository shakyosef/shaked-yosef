var SQL = require('./db');
const path = require('path');
const csv=require('csvtojson');


// users table
const CreateTableusers = (req,res)=> {
    var Q1 = "CREATE TABLE users ( ID int(11) NOT NULL PRIMARY KEY, Firstname varchar(255) NOT NULL , LastName varchar(255) NOT NULL, Hometown varchar(255) NOT NULL, lat DOUBLE NOT NULL, lon DOUBLE NOT NULL, PhoneNumber varchar(255) NOT NULL, Password varchar(255) NOT NULL, mail varchar(255) NOT NULL)";
    SQL.query(Q1,(err,mySQLres)=>{
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating table"});
            return;
        }
        console.log('created table');
        res.send("table created");
        return;
    })      
}
const InsertDatausers = (req,res)=>{
    var Q2 = "INSERT INTO users SET ?";
    const csvFilePath= path.join(__dirname, "DATAusers.csv");
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
    console.log(jsonObj);
    jsonObj.forEach(element => {
        var NewEntry = {
            "ID": element.ID,
            "Firstname": element.Firstname,
            "LastName": element.LastName,
            "Hometown": element.Hometown,
            "lat": element.lat,
            "lon": element.lon,
            "PhoneNumber": element.PhoneNumber,
            "Password": element.Password ,
            "mail": element.mail    
        }
        SQL.query(Q2, NewEntry, (err,mysqlres)=>{
            if (err) {
                console.log("error in inserting data", err);
            }
            console.log("created row sucssefuly ");
        });
    });
    })
    res.send("data read");
};

const ShowTableusers = (req,res)=>{
    var Q3 = "SELECT * FROM users";
    SQL.query(Q3, (err, mySQLres)=>{
        if (err) {
            console.log("error in showing table ", err);
            res.send("error in showing table ");
            return;
        }
        console.log("showing table");
        res.send(mySQLres);
        return;
    })};

const DropTableusers = (req, res)=>{
    var Q4 = "DROP TABLE users";
    SQL.query(Q4, (err, mySQLres)=>{
        if (err) {
            console.log("error in droping table ", err);
            res.status(400).send({message: "error om dropping table" + err});
            return;
        }
        console.log("table drpped");
        res.send("table drpped");
        return;
    })
}




// users profession
const CreateTableprofession = (req,res)=> {
    var Q1 = "CREATE TABLE profession (id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, name varchar(255) NOT NULL)";
    SQL.query(Q1,(err,mySQLres)=>{
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating table"});
            return;
        }
        console.log('created table');
        res.send("table created");
        return;
    })      
}
const InsertDataprofession = (req,res)=>{
    var Q2 = "INSERT INTO profession SET ?";
    const csvFilePath= path.join(__dirname, "DATAprofession1.csv");
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj )=>{
    console.log(jsonObj);
    jsonObj.forEach(element => {
        var NewEntry = {
            "id": element.id,
            "name": element.name         
        }
        SQL.query(Q2, NewEntry, (err,mysqlres)=>{
            if (err) {
                console.log("error in inserting data", err);
            }
            console.log("created row sucssefuly ");
        });
    });
    })
    res.send("data read");
};

const ShowTableprofession = (req,res)=>{
    var Q3 = "SELECT * FROM profession";
    SQL.query(Q3, (err, mySQLres)=>{
        if (err) {
            console.log("error in showing table ", err);
            res.send("error in showing table ");
            return;
        }
        console.log("showing table");
        res.send(mySQLres);
        return;
    })};

const DropTableprofession = (req, res)=>{
    var Q4 = "DROP TABLE profession";
    SQL.query(Q4, (err, mySQLres)=>{
        if (err) {
            console.log("error in droping table ", err);
            res.status(400).send({message: "error om dropping table" + err});
            return;
        }
        console.log("table drpped");
        res.send("table drpped");
        return;
    })
}


// userandprofession table
const CreateTableuserandprofession = (req,res)=> {
    var Q1 = "CREATE TABLE userandprofession ( userid int(11) NOT NULL , code int(11) NOT NULL, lavelofstudy  varchar(255) NOT NULL, Give boolean NOT NULL, Online boolean NOT NULL, PRIMARY KEY (userid, code) ,foreign key (userid) references users (ID), foreign key (code) references profession (id))";
    SQL.query(Q1,(err,mySQLres)=>{
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating table"});
            return;
        }
        console.log('created table');
        res.send("table created");
        return;
    })      
}
const InsertDatauserandprofession = (req,res)=>{
    var Q2 = "INSERT INTO userandprofession SET ?";
    const csvFilePath= path.join(__dirname, "DATAuserandprofession.csv");
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
    console.log(jsonObj);
    jsonObj.forEach(element => {
        var NewEntry = {
            "userid": element.userid,
            "code": element.code,
            "lavelofstudy": element.lavelofstudy,
            "Give": element.Give,
            "Online": element.Online   
        }
        SQL.query(Q2, NewEntry, (err,mysqlres)=>{
            if (err) {
                console.log("error in inserting data", err);
            }
            console.log("created row sucssefuly ");
        });
    });
    })
    res.send("data read");
};

const ShowTableuserandprofession = (req,res)=>{
    var Q3 = "SELECT * FROM userandprofession";
    SQL.query(Q3, (err, mySQLres)=>{
        if (err) {
            console.log("error in showing table ", err);
            res.send("error in showing table ");
            return;
        }
        console.log("showing table");
        res.send(mySQLres);
        return;
    })};

const DropTableuserandprofession = (req, res)=>{
    var Q4 = "DROP TABLE userandprofession";
    SQL.query(Q4, (err, mySQLres)=>{
        if (err) {
            console.log("error in droping table ", err);
            res.status(400).send({message: "error om dropping table" + err});
            return;
        }
        console.log("table drpped");
        res.send("table drpped");
        return;
    })
}

// mymach table
const CreateTablemymach = (req,res)=> {
    var Q1 = "CREATE TABLE mymach ( idi int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT ,userid1 int(11) NOT NULL , userid2 int(11) NOT NULL , Firstname1 varchar(255) NOT NULL, Firstname2 varchar(255) NOT NULL, PhoneNumber1 varchar(255) NOT NULL, PhoneNumber2 varchar(255) NOT NULL ,mail1 varchar(255) NOT NULL, mail2 varchar(255) NOT NULL, code int(11) NOT NULL, status1 boolean NOT NULL, status2 boolean NOT NULL,  Give1 boolean NOT NULL,  Give2 boolean NOT NULL, dist DOUBLE NOT NULL, foreign key (userid1) references users (ID), foreign key (userid2) references users (ID), foreign key (code) references profession (id))";
    SQL.query(Q1,(err,mySQLres)=>{
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating table"});
            return;
        }
        console.log('created table');
        res.send("table created");
        return;
    })      
}
const InsertDatamymach = (req,res)=>{
    var Q2 = "INSERT INTO mymach SET ?";
    const csvFilePath= path.join(__dirname, "DATAmymach.csv");
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
    console.log(jsonObj);
    jsonObj.forEach(element => {
        var NewEntry = {
            "idi": element.idi,
            "userid1": element.userid1,
            "userid2": element.userid2,
            "Firstname1": element.Firstname1,
            "Firstname2": element.Firstname2,
            "PhoneNumber1": element.PhoneNumber1 ,
            "PhoneNumber2": element.PhoneNumber2,
            "mail1": element.mail1,
            "mail2": element.mail2,
            "code": element.code,
            "status1": element.status1,
            "status2": element.status2,
            "Give1": element.Give1,
            "Give2": element.Give2,
            "dist": element.dist
        }
        SQL.query(Q2, NewEntry, (err,mysqlres)=>{
            if (err) {
                console.log("error in inserting data", err);
            }
            console.log("created row sucssefuly ");
        });
    });
    })
    res.send("data read");
};

const ShowTablemymach = (req,res)=>{
    var Q3 = "SELECT * FROM mymach";
    SQL.query(Q3, (err, mySQLres)=>{
        if (err) {
            console.log("error in showing table ", err);
            res.send("error in showing table ");
            return;
        }
        console.log("showing table");
        res.send(mySQLres);
        return;
    })};

const DropTablemymach = (req, res)=>{
    var Q4 = "DROP TABLE mymach";
    SQL.query(Q4, (err, mySQLres)=>{
        if (err) {
            console.log("error in droping table ", err);
            res.status(400).send({message: "error om dropping table" + err});
            return;
        }
        console.log("table drpped");
        res.send("table drpped");
        return;
    })
}





module.exports = {CreateTableusers, InsertDatausers, ShowTableusers, DropTableusers, 
                  CreateTableprofession, InsertDataprofession, ShowTableprofession, DropTableprofession,
                  CreateTableuserandprofession, InsertDatauserandprofession, ShowTableuserandprofession, DropTableuserandprofession,
                  CreateTablemymach, InsertDatamymach, ShowTablemymach, DropTablemymach };