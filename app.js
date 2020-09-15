const express = require("express");
const app = express();


const SERVER_PORT = process.env.SERVER_PORT || 3000;
app.listen(SERVER_PORT, () => console.log(`Server running in ${SERVER_PORT}`));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/',(req,res) =>{
res.send('Hello World!');
});