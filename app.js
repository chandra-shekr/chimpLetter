//jshint esversion:6

"use strict"

import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { mailChimpAPI } from "./apiCall.js";
import cookieParser from "cookie-parser";

const app = express();
const port = 3999;

// ############################ Middlewear <start>#####################################

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.join(dirname(__filename), "public");

// In order for our server to serve up static files like .css, image files etc, we need to use 'express.static'
app.use(express.static(__dirname));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json({ type: ['application/json', 'text/plain'] }));

// ############################# Middlewear <end>####################################

app.get("/home", (req, res) => {

    console.log(req.cookies);
    res.sendFile(path.join(__dirname, "signup.html"));
})

app.post("/home", (req, res) => {
    console.log(req.body.name, req.body.email);
    let name = req.body.name.split(" ");
    if (name.length > 1) {
        var [firstName, lastName] = [name[0], name[name.length - 1]];
    } else {
        var [firstName, lastName] = [name[0], null];
    }
    let userData = {
        members: [
            {
                email_address: req.body.email,
                status: "pending",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    }
    const mailResult = mailChimpAPI({ method: "post", body: userData, listID: "53df500519" })
        .then(result => {
            console.log(result);
            if (result.errors.length > 0) {
                res.status(400).redirect("/failed");
            } else {
                res.status(200).redirect("/success");
            }
        })
        .catch(err => {
            console.log(err.message);
            res.status(400).redirect("/failed");
        })
})

app.get("/success", (req, res) => {
    res.sendFile(path.join(__dirname, "success.html"));
})

app.get("/failed", (req, res) => {
    res.sendFile(path.join(__dirname, "failure.html"));
})

app.post("/loc", (req, res) => {

    console.log(req.body);
    res.status(200).send({ msg: "geo-tagged" });
})

app.listen(process.env.PORT || port, () => {
    console.log("Listening on port ", port);
})