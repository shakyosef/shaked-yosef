const sql = require('./db');


 // Create a new user
const createNewuser = function(req,res)
{   
    // Validate request
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
  
    const newuser = {
        "Firstname": req.body.Firstname,
        "LastName": req.body.LastName,
        "ID": req.body.ID,
        "Hometown": req.body.Hometown,
        "lon" : req.body.lon,
        "lat" : req.body.lat,
        "PhoneNumber": req.body.PhoneNumber,
        "Password": req.body.Password,
        "mail": req.body.mail
    };
   
// If the user has not consented to see their location
   if (newuser.lon =='' || newuser.lat == '' )
   {
    res.render('newaccount', {var1:    "  נדרש לאשר לאתר לראות את מיקומך הנוכחי "  });
    return;
    
   }
   // Checking that there is no existing user in the system with an email or password in this ID
   // If all the details are correct, saving a new user in the users table
    sql.query("SELECT  *  FROM users  where ID = ?", newuser.ID , (err,mysqlres )=>{
        if (err) {
            console.log("error in getting all user " + err);
            res.status(400).send({message:"error in getting all user " + err})
            return;
        }
      
        if( mysqlres.length != 0){
            res.render('newaccount', {var1:  " תעודת זהות זו כבר רשום במערכת" });
            return;
        }
        else{
            sql.query("SELECT  *  FROM users  where mail like ?",newuser.mail + "%", (err,mysqlres )=>{
                if (err) {
                    console.log("error in getting all user " + err);
                    res.status(400).send({message:"error in getting all user " + err})
                    return;
                }
             
                if( mysqlres.length != 0){
                    res.render('newaccount', {var1:  "ממיל זה כבר רשום במערכת " });
                    return;
                }
                else{
                    sql.query("SELECT *  FROM users  where Password like ?", newuser.Password + "%", (err,mysqlres )=>{
                        if (err) {
                            console.log("error in getting all user " + err);
                            res.status(400).send({message:"error in getting all user " + err})
                            return;
                        }
                     
                        if( mysqlres.length != 0){
                            res.render('newaccount', {var1:  "סיסמה זו כבר רשומה במערכת " });
                            return;
                        }
                        else{
                            sql.query("INSERT INTO users SET ?", newuser, (err, mysqlres) => {
                                if (err) {
                                    console.log("error: ", err);
                                    res.status(400).send({message: "error in creating user: " + err});
                                    return;
                                }
                                console.log("created new user succesfully "+ mysqlres);
                                res.render('Loginscreen', {var1:  "נרשמת בהצלחה לאתר" }); 
                                return;       
                            });   
                        }
                    });
                }
            });    
        }
    });
};

const user ={
    "Firstname":'',
    "LastName": '',
    "ID": '',
    "Hometown":'',
    "lon" :"",
    "lat" : "",
    "PhoneNumber": '',
    "Password": '',
     "mail": ''
};

// Finding the user on the login site, if the user has not confirmed to see his location an error message will be displayed.
// If the details are incorrect, an error message will be displayed. Otherwise, the user will enter his personal profile
//Updating the user's position in the users table.
// Updating the distance between the two users in the mymach table

const Finduserlogin = (req, res)=>{
    if (!req.body) {
        console.log("error in getting all user " + err);
        res.status(400).send({message:"error in getting all user " + err})
        return;      
    }
    const flog ={
        "notgood" : '0'
    };
     user.Password = req.query.Password;
     user.mail=req.query.Email;
     user.lat=req.query.lat;
     user.lon= req.query.lon;
     if (user.lon =='' || user.lat == '' )
     {
        res.render('Loginscreen', {
            var1:  "נדרש לאשר לאתר לראות את מקומך הנוכחי"});
            return; 
       }
     
    sql.query("SELECT  *   FROM users  where  mail like ? and Password  like ?",[user.mail + "%", user.Password + "%"] , (err,mysqlres )=>
    {   
            if (err) {
                console.log("error in getting  customers " + err);
                res.status(400).send({message:"error in getting  customers " + err})
                return;
            }
            if (mysqlres.length != 0)
            {       flog.notgood='1'
                    const name = mysqlres[0].Firstname
                    user.Firstname= mysqlres[0].Firstname
                    user.LastName= mysqlres[0].LastName
                    user.ID= mysqlres[0].ID
                    user.Hometown= mysqlres[0].Hometown
                    user.PhoneNumber= mysqlres[0].PhoneNumber 
                    let updateQuery = "UPDATE users SET lon = ?, lat = ? where ID = ?"
                    let data = [ user.lon, user.lat, user.ID]
                    sql.query(updateQuery, data,(err, results,fields)=>
                    {        if (err) {
                                    console.log("error is: " + err);
                                    res.status(400).send({message: "error in updating customer " + err});
                                    return;
                            }
                        console.log("row affected lat and lon " + results.affectedRows);
                        });
                        sql.query("SELECT  *   FROM mymach join users on mymach.userid2 = users.ID where  userid1 = ? ", user.ID , (err,mysqlresw )=>
                        {   if (err) {
                            console.log("error in getting  customers " + err);
                            res.status(400).send({message:"error in getting  customers " + err})
                            return;
                            }
                           console.log(mysqlresw)
                           for ( i in mysqlresw )
                            {   
                               var idi = mysqlresw[i].idi;
                               var lat1 = user.lat;
                               var lat2= mysqlresw[i].lat;
                               var lon1 = user.lon;
                               var lon2 =  mysqlresw[i].lon
                               var R = 6371; // Radius of the earth in km
                               var dLat = (lat2-lat1) * (Math.PI/180) ;  // deg2rad below
                               var dLon = (lon2-lon1) * (Math.PI/180); 
                               var a = 
                                 Math.sin(dLat/2) * Math.sin(dLat/2) +
                                 Math.cos((lat1)* (Math.PI/180)) * Math.cos((lat2)* (Math.PI/180)) * 
                                 Math.sin(dLon/2) * Math.sin(dLon/2) ; 
                               var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
                               var d = { 
                                   "dist":Math.floor(R * c )
                               } // Distance in km
                               console.log(mysqlresw[i].idi)
                            sql.query("UPDATE mymach SET dist = ? where idi = ?",[d.dist ,idi] , (err, results,fields)=>
                            {
                                 if (err) {
                                    console.log("error is: " + err);
                                    res.status(400).send({message: "error in updating customer " + err});
                                   return;
                                }
                                 console.log("row affected " + results.affectedRows);
                            })
                            }
                        });
                            sql.query("SELECT  *   FROM mymach join users on mymach.userid1 = users.ID where userid2 = ? ", user.ID  , (err,mysqlresw )=>
                            {   if (err) {
                                console.log("error in getting  customers " + err);
                                res.status(400).send({message:"error in getting  customers " + err})
                                return;
                                }
                               
                               for ( i in mysqlresw )
                                {   
                                   var idi = mysqlresw[i].idi;
                                   var lat1 = user.lat;
                                   var lat2= mysqlresw[i].lat;
                                   var lon1 = user.lon;
                                   var lon2 =  mysqlresw[i].lon
                                   var R = 6371; // Radius of the earth in km
                                   var dLat = (lat2-lat1) * (Math.PI/180) ;  // deg2rad below
                                   var dLon = (lon2-lon1) * (Math.PI/180); 
                                   var a = 
                                     Math.sin(dLat/2) * Math.sin(dLat/2) +
                                     Math.cos((lat1)* (Math.PI/180)) * Math.cos((lat2)* (Math.PI/180)) * 
                                     Math.sin(dLon/2) * Math.sin(dLon/2) ; 
                                   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
                                   var d = {
                                       "dist":Math.floor(R * c )
                                   } // Distance in km
                                   console.log(mysqlresw[i].idi)
                                sql.query("UPDATE mymach SET dist = ? where idi = ?",[d.dist ,idi] , (err, results,fields)=>
                                {
                                     if (err) {
                                        console.log("error is: " + err);
                                        res.status(400).send({message: "error in updating customer " + err});
                                       return;
                                    }
                                     console.log("row affected " + results.affectedRows);
                                });
                            }
                                });
                          
                          res.render('Privateprofile',{
                                            variable1: '  שלום ' + name ,
                                            variable2: 'אנחנו נרגשים להיות חלק מתהליך הלימוד שלך. בשביל למצוא עבורך את ההתאמה הטובה ביותר נצטרך למספר פרטים נוספים. אז קדימה למה אתה מחכה?',
                                            variable3: ' חפש/י התאמה'
                                         });
                                    return;
                              
                     
            }
            if (flog.notgood.match('0')!= null)
             {
                res.render('Loginscreen', {
                    var1:  "אחד הפרטים שהכנסת לא תקינים בבקשה תנסה שוב" });
                    return; 
               }
         
       })
 };


// Displaying the user's personal details page
const look = (req, res)=>{
        res.render('personaldetails',{
            Firstname: user.Firstname ,
            LastName: user.LastName ,
            ID: user.ID,
            Hometown: user.Hometown,
            PhoneNumber: user.PhoneNumber ,
            Password: user.Password ,
            mail: user.mail, 
            variable1: ' פרטים אישיים',
            variable2: 'שם פרטי',
            variable3: 'שם משפחה',
            variable4: 'תעודת זהות ',
            variable5: 'עיר מגורים',
            variable6: 'טלפון',
            variable7: 'סיסמה',
            variable8: 'דוא"ל',
            variable9: ''
        });
        return;     
  
   };


// Displaying the user's personal profile page
const mypropyle= (req, res)=>{
    res.render('Privateprofile',{
        variable1: '  שלום ' + user.Firstname ,
        variable2: 'אנחנו נרגשים להיות חלק מתהליך הלימוד שלך. בשביל למצוא עבורך את ההתאמה הטובה ביותר נצטרך למספר פרטים נוספים. אז קדימה למה אתה מחכה?',
        variable3: ' חפש/י התאמה'
     });
return;
};
// Updating the user's personal details in the users table
const Update = (req, res)=>{
    if (!req.body) {
        console.log("body was empty");
        res.status(400).send("input cannot be empty");
        return;
    }
    const flog ={
        "notgood" : '1'
    };
    console.log(flog.notgood); 
    const Updateuser = {
        "Firstname": req.body.Firstname,
        "LastName": req.body.LastName,
        "ID":user.ID,
        "Hometown": req.body.Hometown,
        "PhoneNumber": req.body.PhoneNumber,
        "Password": req.body.Password,
        "mail": req.body.mail
    };
    sql.query("SELECT  mail , Password   FROM users  where  ID not like ?",user.ID + "%", (err,mysqlres )=>
    {  
        if (mysqlres.length != 0)
        {
            mysqlres.forEach( (row) =>
                {
                        if (row.Password == Updateuser.Password )
                            {
                                flog.notgood='0'
                                return;
                            }
                        else{
                            if (row.mail == Updateuser.mail )
                            {
                                flog.notgood='0'
                                return;
                            }    
                        }
                 });  
        }
            console.log(flog.notgood.match('1')); 
            if (flog.notgood.match('1')!= null)
            {
                console.log(Updateuser.LastName); 
                if(Updateuser.Firstname!= '' ) {user.Firstname=Updateuser.Firstname}
                if(Updateuser.LastName!= '' ) { user.LastName=Updateuser.LastName}
                if(Updateuser.Hometown!= '' ){user.Hometown=Updateuser.Hometown}
                if(Updateuser.PhoneNumber!= '' ){user.PhoneNumber=Updateuser.PhoneNumber}
                if(Updateuser.Password!= '' ){user.Password=Updateuser.Password}
                if(Updateuser.mail!= '' ) {user.mail=Updateuser.mail }
                let updateQuery = "UPDATE users SET mail = ?, Firstname = ?, LastName = ?,Hometown = ?,PhoneNumber= ? ,Password = ?  where ID = ?"
                let data = [user.mail,user.Firstname,user.LastName,user.Hometown,user.PhoneNumber, user.Password,user.ID]
                sql.query(updateQuery, data,(err, results,fields)=>{
                        if (err) {
                            console.log("error is: " + err);
                            res.status(400).send({message: "error in updating customer " + err});
                            return;
                         }
                        console.log("row affected " + results.affectedRows);
                        res.render('personaldetails',{
                                    Firstname: user.Firstname ,
                                    LastName: user.LastName ,
                                    ID: user.ID,
                                    Hometown: user.Hometown,
                                    PhoneNumber: user.PhoneNumber ,
                                    Password: user.Password ,
                                    mail: user.mail, 
                                    variable1: ' פרטים אישיים',
                                    variable2: 'שם פרטי',
                                    variable3: 'שם משפחה',
                                    variable4: 'תעודת זהות ',
                                    variable5: 'עיר מגורים',
                                    variable6: 'טלפון',
                                    variable7: 'סיסמה',
                                    variable8: 'דוא"ל',
                                    variable9: 'הפרטים עודכנו בהצלחה'   });
                        return;                                  
                    });
            }
            else{
                res.render('personaldetails',{
                    Firstname: user.Firstname ,
                    LastName: user.LastName ,
                    ID: user.ID,
                    Hometown: user.Hometown,
                    PhoneNumber: user.PhoneNumber ,
                    Password: user.Password ,
                    mail: user.mail, 
                    variable1: ' פרטים אישיים',
                    variable2: 'שם פרטי',
                    variable3: 'שם משפחה',
                    variable4: 'תעודת זהות ',
                    variable5: 'עיר מגורים',
                    variable6: 'טלפון',
                    variable7: 'סיסמה',
                    variable8: 'דוא"ל',
                    variable9: '  הסיסמה או המייל כבר רשומים במערכת'   });
        return;                                  

             
        }
    });
};


// Finding a match for a user, entering a match request table.
// If we find income adjustments to the mymach table and calculate the distance between 2 users
const match = function(req,res)
    {
        if (!req.body) {
            res.status(400).send({ message: "Content can not be empty!" });
            return;
        }
        
        if (req.body.profession == 0 || req.body.levelofstudy == 0)
        {   
                res.render('Lookforamatch', {
                    variable1: 'חיפוש התאמה',
                    variable0:'נא למלא את כל השדות',
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
                   
            return;    
        
        }
        else{
            const myselects ={
                "userid" : user.ID, 
                "code": req.body.profession, 
                "lavelofstudy": req.body.levelofstudy, 
                "Give": req.body.Give,
                "Online": req.body.Online
                };
                sql.query("INSERT INTO userandprofession SET ?", myselects, (err, mysqlres) =>
                {
                    if (err) {
                        console.log("error: ", err);
                        res.render('Lookforamatch', {
                            variable1: 'חיפוש התאמה',
                            variable0:'קיימת במאגר בקשה זהה, כאשר נמצא התאמה נעדכן אותך!',
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
                        return;                   
                    }
                    else{
                        const qsql={
                            "myq": "SELECT * FROM userandprofession join users on userandprofession.userid = users.ID  where  Give not like ? and ID not like ? and code like ? and Online like ?"
                          } 
                        sql.query(qsql.myq,[myselects.Give + "%", user.ID + "%",myselects.code + "%",myselects.Online + "%"], (err,mysqlresw)=>
                        {
                            if (err) {
                                console.log("error: ", err);
                                res.status(400).send({message: "error in creating user: " + err});
                                return;
                             } 
                             if (mysqlresw.length != 0 )
                             { 
                                for ( i in mysqlresw )
                                {   var lat1 = user.lat;
                                    var lat2= mysqlresw[i].lat;
                                    var lon1 = user.lon;
                                    var lon2 =  mysqlresw[i].lon
                                    var R = 6371; // Radius of the earth in km
                                    var dLat = (lat2-lat1) * (Math.PI/180) ;  // deg2rad below
                                    var dLon = (lon2-lon1) * (Math.PI/180); 
                                    var a = 
                                      Math.sin(dLat/2) * Math.sin(dLat/2) +
                                      Math.cos((lat1)* (Math.PI/180)) * Math.cos((lat2)* (Math.PI/180)) * 
                                      Math.sin(dLon/2) * Math.sin(dLon/2) ; 
                                    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
                                    var d = {
                                        "dist":Math.floor(R * c )
                                    } // Distance in km
                                    console.log(d.dist)
                                    
                                    
                                    if (myselects.Give == 0)
                                    {
                                        if ( mysqlresw[i].lavelofstudy > myselects.lavelofstudy ||  mysqlresw[i].lavelofstudy == myselects.lavelofstudy)
                                        {
                                            const allmac ={
                                                "userid1" : user.ID,
                                                "userid2" : mysqlresw[i].userid,
                                                "Firstname1" : user.Firstname + "  "+ user.LastName, 
                                                "Firstname2" : mysqlresw[i].Firstname +"  "+ mysqlresw[i].LastName,
                                                "PhoneNumber1":user.PhoneNumber,
                                                "PhoneNumber2": mysqlresw[i].PhoneNumber,
                                                "mail1" :user.mail,
                                                "mail2" : mysqlresw[i].mail,
                                                "code": mysqlresw[i].code,
                                                "status1": 0,
                                                "status2": 0,
                                                "Give1" : myselects.Give,
                                                "Give2" :  mysqlresw[i].Give,
                                                "dist": d.dist
                                                }
                                               sql.query("INSERT INTO mymach SET ?", allmac, (err, mysqlres) =>
                                               {
                                                  if (err) {
                                                       console.log("error: ", err);
                                                   }
                                                   console.log("machfund save");
                                                });
                                        }
                                        
                                    }
                                    else{
                                        if ( mysqlresw[i].lavelofstudy < myselects.lavelofstudy ||  mysqlresw[i].lavelofstudy == myselects.lavelofstudy)
                                        {
                                            const allmac ={
                                                "userid1" : user.ID,
                                                "userid2" : mysqlresw[i].userid,
                                                "Firstname1" : user.Firstname + "  "+ user.LastName, 
                                                "Firstname2" : mysqlresw[i].Firstname +"  "+ mysqlresw[i].LastName,
                                                "PhoneNumber1":user.PhoneNumber,
                                                "PhoneNumber2": mysqlresw[i].PhoneNumber,
                                                "mail1" :user.mail,
                                                "mail2" : mysqlresw[i].mail,
                                                "code": mysqlresw[i].code,
                                                "status1": 0,
                                                "status2": 0,
                                                "Give1" : myselects.Give,
                                                "Give2" :  mysqlresw[i].Give,
                                                "dist": d.dist
                                                }
                                               sql.query("INSERT INTO mymach SET ?", allmac, (err, mysqlres) =>
                                               {
                                                  if (err) {
                                                       console.log("error: ", err);
                                                   }
                                                   console.log("machfund save");
                                                });
                                        }

                                    }
                                
                                }
                                sql.query("SELECT * FROM mymach join profession on mymach.code = profession.id  where  userid1  like ? and status1 like ? and status2 like ? order by dist", [user.ID, 0 , 0], (err, mysqlresq) =>
                                {
                                    console.log(  mysqlresq)
                                    const aser = new Array();
                                    for ( i in mysqlresq )
                                    {  
                                        
                                        if(myselects.Give == 0)
                                        {
                                            aser[i ]={
                                                "Firstname2": mysqlresq[i].Firstname2,
                                                "mail2": mysqlresq[i].mail2,
                                                "code":  mysqlresq[i].name +" "+ "נותן עזרה",
                                                "PhoneNumber2": mysqlresq[i].PhoneNumber2,
                                               "dist":mysqlresq[i].dist + " "+ "קילומטר" ,
                                                "id": mysqlresq[i].idi
                                            }
                                           
                                        }
        
                                        else{
                                            aser[i ]={
                                                "Firstname2": mysqlresq[i].Firstname2,
                                                "PhoneNumber2": mysqlresq[i].PhoneNumber2,
                                                "mail2": mysqlresq[i].mail2,
                                                "code":  mysqlresq[i].name +" "+ "מחפש עזרה",
                                               "dist":mysqlresq[i].dist  + " "+ "קילומטר" ,  
                                                "id": mysqlresq[i].idi
                                            }
                                        }      
                                    
                                       }
                                    res.render('Thematchesfound',{
                                        variable1: ' ההתאמות שנמצאו',
                                        variable2: 'שם מלא',
                                        variable3: 'טלפון',
                                        variable4: 'דוא"ל',
                                        variable5: 'מקצוע',
                                        variable6: 'צור/י בקשה להתאמה?',
                                        variable7: 'בחר',
                                        variable8:  'ביטול',
                                        variable9:  'מרחק ממך',
                                        mache : aser
                                                                    
                                         });  
                                    return;
                                });
                              
                             }
                            else{
                                if (myselects.Give == 1)
                                {
                                    res.render('Nomatchfound',{
                                        variable1: 'לצערנו לא נמצאו התאמות. אנחנו מצרפים לך קישור לאתר אינטרנט בו תוכל להצטרף כמורה למאגר המורים הפרטיים',
                                        variable2: 'מעבר למאגר מורים פרטיים ' });
                                        return;
        
                                }
                                else{
                                    res.render('Nomatchfound',{
                                        variable1: ' לצערנו לא נמצאו התאמות. אנחנו מצרפים לך מאגר מורים פרטיים באינטרנט',
                                        variable2: 'מעבר למאגר מורים פרטיים ' });
                                        return;
    
                                }

                             }
                               
                         })
                        }
                 });


        }
    }
        







//If the user approves the match, he submits a request to the other user. and its status value is updated to 1. 
//If he does not approve the match, the match is deleted from the mymach table

const savematch = function(req,res)
{ 
   
    if (!req.body) {
        res.status(400).send({
            message: "content cannot be empty"
        });
        return;
    }
    sql.query("SELECT * FROM mymach  where  userid1  like ? and status1 like ? and status2 like ? order by dist", [user.ID, 0 , 0], (err, mysqlresw) =>
    {
        
       if (err) {
           console.log("error: ", err);
           res.status(400).send({ message: "Content can not be empty!" });
           return;
       }
   
       for ( i in mysqlresw )
       {
        const id = mysqlresw[i].idi
         const anser = req.body[id];
         console.log(anser)
         if (anser == 1)
         {
           
            sql.query("UPDATE mymach SET status1 = ? where idi = ?",[1 , id] , (err, results,fields)=>
            {
                if (err) {
                    console.log("error is: " + err);
                    res.status(400).send({message: "error in updating customer " + err});
                    return;
                 }
                console.log("row affected " + results.affectedRows);
            })
         }
         if(anser == 0)
         {
            sql.query("delete  FROM mymach  where idi = ?", id, (err, mysqlres) =>
            {
                if (err) {
                    console.log("error: ", err);
                    res.status(400).send({ message: "Content can not be empty!" });
                    return;
                }
                console.log("deletee! "); 
            })
        }
       }
       res.render('savemach',{
        variable1: '  שלום ' + user.Firstname ,
        variable2: 'השינויים נשמרו במערכת',
        variable3: ' חזרה לפרופיל שלי '
     })
     return;
    })
}

//View all user match requests

const myrequests = function(req,res)
{
    sql.query("SELECT * FROM mymach  join profession on mymach.code = profession.id where  userid2  like ? and status2 like ? order by dist", [user.ID, 0], (err, mysqlresw) =>
    {
       console.log(mysqlresw)
       if (err) {
           console.log("error: ", err);
           res.status(400).send({ message: "Content can not be empty!" });
           return;
       }
       const aser = new Array();
       for ( i in mysqlresw )
       {  
         if(  mysqlresw[i].Give1 == 1)
           {
            aser[i]={
                "Firstname1":  mysqlresw[i].Firstname1,
                "mail1":  mysqlresw[i].mail1,
                "code":   mysqlresw[i].name +" "+ "נותן עזרה",
                "PhoneNumber1":  mysqlresw[i].PhoneNumber1,
                "id" : mysqlresw[i].idi,
                "dist": mysqlresw[i].dist+ " "+ "קילומטר"
               }
           }
           else{
            aser[i]={
                "Firstname1":  mysqlresw[i].Firstname1,
                "mail1":  mysqlresw[i].mail1,
                "code":   mysqlresw[i].name +" "+ "מחפש עזרה",
                "PhoneNumber1":  mysqlresw[i].PhoneNumber1,
                "id" : mysqlresw[i].idi,
                "dist": mysqlresw[i].dist + " "+ "קילומטר"
               }
 
           }
              
            }
       res.render('myrequests', {
        variable1: 'הבקשות שלי',
        variable2: 'שם מלא',
        variable3: 'דוא"ל',
        variable4: 'מקצוע ונושא',
        variable5: 'טלפון',
        variable6: 'האם מאשר/ת?',
        variable7: 'אישור',
        variable8: 'דחייה',
        variable9: 'מרחק ממך',
        mache: aser      
        });
     return;

    });

}
  
  //If the user approves the match request, the status of the match will be 1.
  // Otherwise, the match will be deleted from the mymach table
const matchconfirmation = function(req,res)
{
    if (!req.body) {
        res.status(400).send({
            message: "content cannot be empty"
        });
        return;
    }
    sql.query("SELECT * FROM mymach  where  userid2  like ? and status2 like ? order by dist", [user.ID, 0], (err, mysqlresw) =>
    {
        
       if (err) {
           console.log("error: ", err);
           res.status(400).send({ message: "Content can not be empty!" });
           return;
       }
   
       for ( i in mysqlresw )
       {
        const id = mysqlresw[i].idi
         const anser = req.body[id];
         console.log( id) 
         console.log( anser) 
         if (anser == 1)
         {
           
            sql.query("UPDATE mymach SET status2 = ? where idi = ?",[1 , id] , (err, results,fields)=>
            {
                if (err) {
                    console.log("error is: " + err);
                    res.status(400).send({message: "error in updating customer " + err});
                    return;
                 }
                console.log("row affected " + results.affectedRows);
            })
         }
         if(anser == 0)
         {
            sql.query("delete  FROM mymach  where idi = ?", id, (err, mysqlres) =>
            {
                if (err) {
                    console.log("error: ", err);
                    res.status(400).send({ message: "Content can not be empty!" });
                    return;
                }
                console.log("deletee! "); 
            })
        }
       }
       res.render('savemach',{
        variable1: '  שלום ' + user.Firstname ,
        variable2: 'השינויים נשמרו במערכת',
        variable3: ' חזרה לפרופיל שלי '
     })
     return;
    })

}


//Showing all of the user's matches approved by the 2 users
const mymatch= function(req,res){
    sql.query("SELECT * FROM mymach join profession on mymach.code = profession.id where status2 like ? and  status1 like ? order by dist", [ 1, 1], (err, mysqlresw) =>
    {
        const aser = new Array();
        const index ={
            "ind": 0
        } 
        for ( i in mysqlresw )
        {
         const id1 = mysqlresw[i].userid1;
         const id2 = mysqlresw[i].userid2;
         const type ={
            "type": "מחפש עזרה"
         }
         if (id1 == user.ID)
         {
            if ( mysqlresw[i].Give1 == 0)
            {
               type.type = "נותן עזרה"
            } 
            aser[index.ind]={
                "Firstname1": mysqlresw[i].Firstname2,
                "mail1": mysqlresw[i].mail2,
                "code":  mysqlresw[i].name +" "+  type.type,
                "PhoneNumber1": mysqlresw[i].PhoneNumber2,
                "dist": mysqlresw[i].dist+ " "+ "קילומטר"
            }
            index.ind = index.ind +1;
         }
         else if (id2 == user.ID)
         { 
            if ( mysqlresw[i].Give2 == 0)
            {
               type.type = "נותן עזרה"
            } 
            aser[index.ind]={
                "Firstname1": mysqlresw[i].Firstname1,
                "mail1": mysqlresw[i].mail1,
                "code":   mysqlresw[i].name +" "+ type.type ,
                "PhoneNumber1": mysqlresw[i].PhoneNumber1,
                "dist": mysqlresw[i].dist+ " "+ "קילומטר"
            }
            index.ind = index.ind +1;
         }
        }
        console.log(aser)
        res.render('mymatch', {
            variable1: 'ההתאמות שלי',
            variable2: 'שם מלא',
            variable3: 'דוא"ל',
            variable4: 'מקצוע ונושא',
            variable5: 'טלפון',
            variable6: 'מרחק ממך',
            mache: aser   
         });
    });
}


module.exports = {createNewuser,Finduserlogin,look,mypropyle,Update,match,savematch,matchconfirmation,myrequests, mymatch};