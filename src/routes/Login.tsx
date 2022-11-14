import React from "react";
import { Link } from 'react-router-dom'


function Login() {
  return (
    <div style={{ paddingBottom: 100, paddingTop: 100 }}>
      <div style = {{textAlign:"center"}}>
      <img src="https://image.shutterstock.com/image-vector/plate-vector-illustrationisolated-on-white-260nw-1815162875.jpg" ></img>
      <h1>DishZero</h1>
      <h2>Catch Phrase</h2>
      <Link to ="/Login"><button>Login</button></Link>
      <h3>Don't have account? <a href="/SignUp">Sign up</a></h3>
      </div></div>
  );
}
  
  export default Login;
  