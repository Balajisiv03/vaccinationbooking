import express from "express";
import mysql from "mysql2";
import bodyparser from "body-parser";
import cors from "cors";
import jwt from 'jsonwebtoken'
const app=express();

app.use(express.json({limit: "30mb",extended: true}))
app.use(express.urlencoded({limit: "30mb",extended: true}))
app.use(cors());

 app.use(bodyparser.urlencoded({extended: true}));
 const db=mysql.createConnection({
     host: "localhost",
     user: "root",
     port: 3306,
     password: "mysql@2023",
     database: "vbooking"
 })

 
db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL database: ' + err.stack);
      return;
    }
    console.log('Connected to MySQL database');
  });

//signup
 app.post("/signup",(req,res)=>{ 
    const name=req.body.name;
    const email=req.body.email;
    const password=req.body.password;

    
    const sqlinsert=
    "insert into user (name,email,password) values(?,?,?)";
    db.query(sqlinsert,[name,email,password],(err,result)=>{
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        console.log(result);
        res.status(200).send("Data inserted successfully");
    });
})

app.post("/login",(req,res)=>{ 
    
    const email=req.body.email;
    const password=req.body.password;
    const sqlinsert=
    "select * from user where email=?";
    db.query(sqlinsert,[email],(err,data)=>{
        if (err) {
            console.error('Error in database query:', err);
            return res.json({ Error: "Internal Email Error" });
        }

        if (email.trim() === '' || password.trim() === '') {
            return res.json({ Status: 'Error', Error: 'Please enter both email and password.' });
        }
        if (data.length > 0) {
           try{
                    const checkpass=req.body.password;
                    const password=data[0].password;
                    const compare=checkpass.localeCompare(password);
                    console.log(compare)
                    if(compare==0){
                        const token = jwt.sign({ email: req.body.email, password: data[0].password }, 'test', { expiresIn: '1h' });
                        return res.json({Status:"Success",token});
                    }else{
                        return res.json({ Error: "Password not matched" });
                    }
              }

            catch(error){
            return res.json({Error:`Internal Logging Error ${error}`});
            }
        }

        else {
            return res.json({Error:"Email Not Existed"});
            // return res.json({Error:"Password not matched"})
         }
    });
})



//adminpage
app.post("/data/insertdetails",(req,res)=>{ 
    const cityname=req.body.cityname;
    const slot=req.body.slot;
    const vcentres=req.body.vcentres;
  

    const sqlinsertdetails=
    "insert into admin (cityname,vcentres,slot) values(?,?,?)";
    db.query(sqlinsertdetails,[cityname,vcentres,slot],(err,result)=>{
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        console.log(result);
        res.status(200).send("Data inserted successfully");
    });
})

// app.get("/data/getinsertdetails",(req,res)=>{
//     const sqlgetinsertdetails="SELECT DISTINCT * FROM admin";
//     db.query(sqlgetinsertdetails,(err,result)=>{
//         if (err) {
//             res.status(500).json({ error: err.message });
//             return;
//         }
//        res.send(result);
//     });
// }   
// )

app.get("/data/getinsertdetails", (req, res) => {
    const sqlgetinsertdetails = "SELECT DISTINCT * FROM admin";
    db.query(sqlgetinsertdetails, (err, result) => {
      if (err) {
        console.error("Error in database query:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      console.log("Data sent to client:", result);
      res.send(result);
    });
  });
  
 

app.delete("/data/deletedetail/:vcentres", (req, res) => {
    const vcentres = req.params.vcentres;
    const sqldelete = "DELETE FROM admin WHERE vcentres=? ";
    db.query(sqldelete,vcentres, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        } else {
            console.log(result);
            res.status(200).send("Successfully deleted");
        }
    });
});



//booking slot

app.post('/bookslot', (req, res) => {
    const { cityname, vcentres, slot } = req.body;
  
    if (!cityname || !vcentres || !slot) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }
  
    const sqlSelect = 'SELECT * FROM admin WHERE cityname = ? AND vcentres = ?';
  
    db.query(sqlSelect, [cityname, vcentres], (err, results) => {
      if (err) {
        console.error('Error in database query:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'Vaccination center not found' });
      }
  
      const availableSlots = results[0].slot;
  
      if (slot > availableSlots) {
        return res.status(400).json({ error: 'Not enough slots available' });
      }
  
      // Update the slot count in the database
      const sqlUpdate = 'UPDATE admin SET slot = ? WHERE cityname = ? AND vcentres = ?';
  
      db.query(sqlUpdate, [availableSlots - slot, cityname, vcentres], (updateErr, updateResult) => {
        if (updateErr) {
          console.error('Error updating slot count:', updateErr);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
  
        return res.status(200).json({ message: 'Slot booked successfully' });
      });
    });
  });



app.listen(5001,()=>{
    console.log("app is running on 5001");
});








//  app.get("/",(req,res)=>{
//     res.send("hello world");
//  });





