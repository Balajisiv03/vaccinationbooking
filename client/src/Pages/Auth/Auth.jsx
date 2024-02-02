import React,{useState} from 'react'
import {useNavigate} from 'react-router-dom'
import './Auth.css';
import Axios from 'axios';

const Auth = () => {
  const[IsSignUp,setIsSignUp]=useState(false)
  const handleswitch=()=>{
    setIsSignUp(!IsSignUp)
  }
  const navigate=useNavigate();


 const gotohome=()=>{
  navigate('HomePage');
 }

 const gotoadmin=()=>{
  navigate('AdmPage');
 }

 const[name,setName]=useState("");
 const[email,setEmail]=useState("");
 const[password,setPassword]=useState("");


const Submitdata = (e) => {
e.preventDefault();
console.log("Form data:", { name, email, password });


  //forsignup
if(IsSignUp){
  
      if(!email && !password && !name){
        alert("enter the name and password , email");
      }
      else{
        Axios.post("http://localhost:5001/signup", {
          name, email, password
        })
          .then(response => {
            alert("data inserted successfully");
            console.log("Insert successful:", response.data);
              gotohome();
          })
          .catch(error => {
            console.error("Error inserting data:", error);
          });
        }
}



//forlogin
if(!IsSignUp){ 
        console.log(email,password ,1)
      //adminlogin

        if(email==="admin@gmail.com" && password==="admin"){
              gotoadmin();
        }

      //userlogin
        else{
        Axios.post("http://localhost:5001/login",{
          email,password
          })
            .then(response => {
              if (response.data && response.data.Status === 'Success') {
                alert('Login successful!');
                navigate('/HomePage');
            } else {
                alert(`Error: ${response.data.Error}`);
        }
            })
            .catch(error => {
              console.error("Error inserting data:", error);
            });
          };
        }
}

  return (
     <section className="auth-section">
        <div className="auth-container-2">
        <h1>Covid Vaccination Booking</h1>
         {IsSignUp ?<h3>Sign up</h3>:<h3>Log in</h3>}
          <form onSubmit={Submitdata}>
          {
              IsSignUp && (
              <label htmlFor="name">
                  <h4>Name</h4>
                  <input type="text" id="name" name="name" onChange={(e)=>{setName(e.target.value)}}/>
              </label>)
            }
            <label htmlFor="email">
              <h4>Email</h4>
              <input type="email" id="email" name="email" autoComplete="name" onChange={(e)=>{setEmail(e.target.value)}}/>
            </label>
            <label htmlFor="password">
              <h4>Password</h4>
              <input type="password" id="password" name="password" autoComplete="current-password" onChange={(e)=>{setPassword(e.target.value)}}/>  
            </label>  
              <button type="submit" className="auth-btn">{IsSignUp?"Sign Up":"Log in"}</button>
          </form>
          <p>
            {IsSignUp?"Already have an account?":"Don't have an account?"}
            <button type="submit" className="handle-switch-btn" onClick={handleswitch}>{IsSignUp?"User Login":"Sign Up"}</button>
          </p>
        </div>
     </section>
  )
}

export default Auth;


