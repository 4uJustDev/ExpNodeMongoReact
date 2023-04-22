import express from "express";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const app = express();
const PORT = 4000;

mongoose
.connect('mongodb+srv://Admin:Admin@cluster0.zzdzpkw.mongodb.net/test')
.then(()=>console.log('DB mongoose OK'))
.catch((err) => console.log('DB errror', err));

app.use(express.json());

app.post('/auth/register', (req, res)=>{

})

app.listen(PORT, (err)=>{
    if(err){
        return console.log(err);
    }
    console.log(`Server start at PORT ${PORT}`);
});