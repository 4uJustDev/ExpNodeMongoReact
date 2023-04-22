import express from "express";
import mongoose from "mongoose";


import { registerValidation } from "./validations/auth.js";
import checkAuth from "./utils/checkAuth.js";
import * as Controllers from "./controllers/UserController.js"

const app = express();
const PORT = 4000;

mongoose
.connect('mongodb+srv://Admin:Admin@cluster0.zzdzpkw.mongodb.net/blog')
.then(()=>console.log('DB mongoose OK'))
.catch((err) => console.log('DB errror', err));

app.use(express.json());

app.post('/auth/login', registerValidation, Controllers.login);
app.post('/auth/register', registerValidation, Controllers.register);
app.get('/auth/me', checkAuth, Controllers.auth);

app.listen(PORT, (err)=>{
    if(err){
        return console.log(err);
    }
    console.log(`Server start at PORT ${PORT}`);
});