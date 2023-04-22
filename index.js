import express from "express";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";

import { registerValidation } from "./validations/auth.js";
import UserModel from "./models/User.js"

const app = express();
const PORT = 4000;

mongoose
.connect('mongodb+srv://Admin:Admin@cluster0.zzdzpkw.mongodb.net/blog')
.then(()=>console.log('DB mongoose OK'))
.catch((err) => console.log('DB errror', err));

app.use(express.json());

app.post('/auth/login', registerValidation, async (req, res)=>{
    try{
        const user = await UserModel.findOne({email: req.body.email})

        if(!user) {
            return res.status(404).json({
                message: "Пользователь не найден"
            });
        }
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if(!isValidPass) {
            return res.status(400).json({
                message: "Логин или пароль не верны"
            });
        }

        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret123',
            {
                expiresIn: '30d',
            },
        );

        const {passwordHash, ...userData} = user._doc;

        res.json({
            ...userData,
            token,
        }); 

    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message: "Не удалось авторизоваться",
        });
    }
})

app.post('/auth/register', registerValidation, async (req, res)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json(errors.array());
        };

        const password = req.body.password;

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const doc  = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        });
        
        const user = await doc.save();
        
        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret123',
            {
                expiresIn: '30d',
            },
        );

        const {passwordHash, ...userData} = user._doc;

        res.json({
            ...userData,
            token,
        }); 
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message: "Не удалось зарегистрироваться",
        });
    }

})



app.listen(PORT, (err)=>{
    if(err){
        return console.log(err);
    }
    console.log(`Server start at PORT ${PORT}`);
});