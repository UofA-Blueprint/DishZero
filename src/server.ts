const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// config and init
const app = express();
app.use(cors());
app.use(express.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running successfully on port ${PORT}`);
});





export {};