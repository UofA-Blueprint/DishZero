import React from 'react';
import logo from './logo.svg';

function Login() {

    return (
        <div
            style={{
            paddingBottom: 100,
            paddingTop: 10
        }}>
            <div style={{
                textAlign: "center"
            }}>
                <img
                    src="https://image.shutterstock.com/image-vector/plate-vector-illustrationisolated-on-white-260nw-1815162875.jpg"></img>
                <h1>
                    DishZero
                </h1>
                <h2>
                    Insert Catch Phrase
                </h2>
                <form>
                    <h2>Email</h2>
                    <input type="text" defaultValue="@ualberta.ca"></input>
                    <h2>
                        Password
                    </h2>
                    <input type="password"></input>
                </form>
                <br></br>
            </div>
            <div style={{
                textAlign: "center"
            }}>
                <br></br>
                <button>Login</button>
                <h2>---- OR ----</h2>
                <button>
                    Login with Google
                </button>
            </div>
        </div>
    );
}
export default Login;
