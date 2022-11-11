import React from "react";


function Login() {
    return (
      <div style={{ paddingBottom: 100, paddingTop: 100 }}><div style={{ textAlign: "center" ,}}>
        <img src="https://image.shutterstock.com/image-vector/plate-vector-illustrationisolated-on-white-260nw-1815162875.jpg" ></img>
        <h1>
          DishZero
        </h1>
        <h2> Insert Catch Phrase
          </h2></div>
        <div style={{textAlign:"left", paddingLeft: 250}}>
          <form>
          <h2>Email</h2>
          <input type="text" value ="@ualberta.ca">
          </input>
          <h2>
            Password
          </h2>
          <input type="text">
          </input></form>
          <br></br></div>
          <div style={{ textAlign: "center" }}>
            <br></br>
          <button>
            Login
          </button>
          <h2>---- OR ----</h2>
          
          <button>
            Login with Google
          </button>
          </div>
        </div>
    );
  }
  
  export default Login;
  