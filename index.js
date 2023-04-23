import express from "express";
import mongoose from "mongoose";
import multer from "multer";

import * as Validations from "./validations/validations.js";
import { UserController, PostController } from "./controllers/index.js";
import { handleValidatorErrors, checkAuth } from "./utils/index.js";

mongoose
.connect('mongodb+srv://Admin:Admin@cluster0.zzdzpkw.mongodb.net/blog')
.then(()=>console.log('DB mongoose OK'))
.catch((err) => console.log('DB errror', err));

const app = express();
const PORT = 4000;

const storage = multer.diskStorage({
    destination: (_, __, cb)=>{
        cb(null, 'uploads');
    },
    filename: (_, file, cb)=>{
        cb(null, file.originalname);
    },
});
const upload = multer({storage});

app.use(express.json());
app.use('/uploads', express.static('uploads'));
//Auth
app.post('/auth/login',Validations.loginValidation, handleValidatorErrors, UserController.login);
app.post('/auth/register', Validations.registerValidation, handleValidatorErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.auth);

app.post('/upload', checkAuth, upload.single('image'), (req, res)=>{
    res.json({
        url: `/uploads/${req.file.originalname}`
    });
});

//Posts
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, Validations.postCreateValidation, handleValidatorErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, Validations.postCreateValidation, handleValidatorErrors, PostController.update);

app.listen(PORT, (err)=>{
    if(err){
        return console.log(err);
    };
    console.log(`Server start at PORT ${PORT}`);
});