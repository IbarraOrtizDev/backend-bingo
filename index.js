const express = require('express');
cors = require('cors');

const route = require('./controller/routes');
const app = express();

//app.enable('case sensitive routing');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(route);

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})