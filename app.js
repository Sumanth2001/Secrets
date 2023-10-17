//jshint esversion:6

import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import mongoose, { Schema } from "mongoose";
import encrypt from "mongoose-encryption";

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb+srv://admin-atchi:atchimongo@cluster0.0j9e1xp.mongodb.net/userDB");

const userSchema = new Schema({
    email: String,
    password: String
});

const secret = "Thisisourlittlesecret";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);


app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/logout", (req, res) => {
    res.redirect("/");
});

app.post("/register", (req, res) => {
    const userName = req.body.username;
    const password = req.body.password;

    const newUser = new User({
        email: userName,
        password: password
    });
    newUser.save()
        .then(() => {
            res.render("secrets");
        })
        .catch((err) => {
            console.log(err);
        });
});

app.post("/login", (req, res) => {
    const userName = req.body.username;
    const password = req.body.password;

    User.findOne({ email: userName })
        .then((user) => {
            if (user.length != 0) {
                if (user.password === password) {
                    res.render("secrets");
                }
            }
        })
        .catch((err) => {
            console.log(err);
        });
});

app.listen(3000, () => {
    console.log("Server started on port 3000.");
});


