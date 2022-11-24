import React from 'react';
import logo from './logo.svg';
import {
    Stage,
    Layer,
    Rect,
    Text,
    Circle,
    Line
} from 'react-konva';
import { Sidebar } from '../widgets/sidebar';
function Login() {

    return (
        <div
            className='App'
            id='outer-container'
            style={{
            paddingBottom: 50,
            paddingTop: 10,
            textAlign: "center"
        }}>
         <Sidebar pageWrapId={"page-wrap"} outerContainerId={"outer-container"} />
            <div id='page-wrap'>
                <img
                    width={100}
                    height={100}
                    src="https://image.shutterstock.com/image-vector/plate-vector-illustrationisolated-on-white-260nw-1815162875.jpg"></img>
                <h1 style={{
                    fontWeight: "bolder"
                }}>
                    DishZero
                </h1>
                <h3 >
                    Helping the planet one dish<br></br>
                    at a time
                </h3>
                <Stage width={window.innerWidth} height={200}>
                    <Layer>
                        <Rect x={125} y={0} width={150} height={150} fill="#D6D6D6"/>
                    </Layer>
                </Stage>
                <br></br>
                <button>Login with Google</button>
            </div>
        </div>
    );
}
export default Login;
