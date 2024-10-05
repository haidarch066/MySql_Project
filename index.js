const express = require('express');
const app = express();
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');
const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const port = 3000;
 
app.use(methodOverride('_method'));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true}));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password: '@mysql123'
});

app.listen(port, ()=>{
    console.log("app listining port 3000");
});

let getRandomUser = ()=> {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

// let q = "INSERT INTO user (id, username, email, password) VALUES ?";
// let data =[];                            //Add Random User
// for(let i=1; i<=10; i++){
  
//   data.push(getRandomUser());
// };

// try {
//      connection.query(q, [data], (err, result) =>{
//         if(err) throw err;
//         console.log(result); 
//       }); 
//   } catch (err) {
//     console.log(err);
//   };

app.get("/", (req, res)=>{       //home route
   let q = `SELECT COUNT(*) FROM user`;
   try {
     connection.query(q, (err, result) =>{
        if(err) throw err;
        let count = result[0]["COUNT(*)"];
        res.render("home.ejs", {count}); 
      }); 
  } catch (err) {
    console.log(err);
    res.send("Some error Occured in DB!");
  };    
});

app.get("/users", (req, res)=>{   //show route
  let q = `SELECT * FROM user`;
  try {
    connection.query(q, (err, users) =>{
       if(err) throw err;
       res.render("show.ejs", {users}); 
     }); 
 } catch (err) {
   console.log(err);
   res.send("Some error Occured in DB!");
  }; 
});

app.get("/users/:id/edit", (req, res)=>{   //Edit route
  let {id} = req.params;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try {
    connection.query(q, (err, result) =>{
       if(err) throw err;
       let user = result[0];
       res.render("edit.ejs", {user}); 
     }); 
 } catch (err) {
   console.log(err);
   res.send("Some error Occured in DB!");
   }; 
});

app.patch("/users/:id", (req, res)=>{   //Update route
  let {id} = req.params;
  let {username : newUser, password : userPass} = req.body;

  let q = `SELECT * FROM user WHERE id='${id}'`;
  try {
    connection.query(q, (err, user) =>{
       if(err) throw err;
       let password = user[0].password;
      if(userPass != password){
        res.send("Wrong Password Try again!"); 
      } else{
        let q2 = `UPDATE user SET username='${newUser}' WHERE password='${password}'`;
        connection.query(q2, (err, result)=>{
           if(err) throw err;
            res.redirect("/users");
         });        
       };  
     }); 
 } catch (err) {
   console.log(err);
   res.send("Some error Occured in DB!");
   }; 
});

app.get("/users/add", (req, res)=>{   //add route
     res.render("add.ejs");  
});

app.post("/users/add", (req, res)=>{   //add route
  let {id, username, email, password} = req.body;
let q = `INSERT INTO user (id, username, email, password) VALUES ('${id}', '${username}', '${email}', '${password}')`;
try {
  connection.query(q, (err, result) =>{
     if(err) throw err;
     console.log(result);
     res.redirect("/users"); 
   }); 
} catch (err) {
 console.log(err);
 res.send("Some error Occured in DB!");
  };  
});

app.get("/users/:id/delete", (req, res)=>{   //delete route
  let {id} = req.params;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try {
    connection.query(q, (err, result) =>{
       if(err) throw err;
       let user = result[0];
       res.render("delete.ejs", {user}); 
     }); 
 } catch (err) {
   console.log(err);
   res.send("Some error Occured in DB!");
   };  
});

app.delete("/users/:id", (req, res)=>{   //delete route
  let {id} = req.params;
  let {password : usrPass} = req.body;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try {
    connection.query(q, (err, result) =>{
       if(err) throw err;
       let password = result[0].password;
        if(usrPass != password){
          res.send("Wrong Password Try again!"); 
        } else {
          let q2 = `DELETE FROM user WHERE password='${password}'`;
            connection.query(q2, (err, result)=>{
                if(err) throw err;
               res.redirect("/users");
       });   
     };      
  }); 
 } catch (err) {
   console.log(err);
   res.send("Some error Occured in DB!");
   };     
});

  // connection.close();

  // cd "C:\Program Files\MYSQL\MYSQL Server 8.0"
  // &.\bin\mysql.exe -h localhost -u root -p
  