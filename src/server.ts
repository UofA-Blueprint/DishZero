import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';


// import routes here
import auth from './routes/auth';





// config and init
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({
    extended : true
}));
app.use(express.json())


const PORT = 3000;


app.listen(PORT, () => {
    console.log(`Server running successfully on port ${PORT}`);
})

// test route
app.get('/', (req, res) => {
    res.send({ message: "you are on /" })
})




// replies to a GET request to '/api/auth/login'
app.use('/api/auth', auth);




export {};