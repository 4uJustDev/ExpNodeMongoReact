import express from "express";
import mongoose from "mongoose";


import checkAuth from "./utils/checkAuth.js";

import * as Validations from "./validations/validations.js";
import * as UserController from "./controllers/UserController.js"
import * as PostController from "./controllers/PostController.js"

const app = express();
const PORT = 4000;

mongoose
.connect('mongodb+srv://Admin:Admin@cluster0.zzdzpkw.mongodb.net/blog')
.then(()=>console.log('DB mongoose OK'))
.catch((err) => console.log('DB errror', err));

app.use(express.json());
//Auth
app.post('/auth/login', Validations.loginValidation, UserController.login);
app.post('/auth/register', Validations.registerValidation, UserController.register);
app.get('/auth/me', checkAuth, UserController.auth);
//Posts
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, Validations.postCreateValidation, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, PostController.update);

app.listen(PORT, (err)=>{
    if(err){
        return console.log(err);
    }
    console.log(`Server start at PORT ${PORT}`);
});