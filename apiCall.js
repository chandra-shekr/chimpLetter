//jshint esversion:6

"use strict"

import fetch from "node-fetch";
import path from "path";

function mailChimpAPI({ method, body = {}, listID = "", apiPath = "lists", section = "", memberID = "", actions = "" }) {

    const Authorization = `Basic ${process.env.APIKEY}`;
    const urlPath = path.join(apiPath, listID, section, memberID, actions)
    let options, methodType;
    switch (true) {
        case method.toLowerCase() === "get":
            methodType = method.toUpperCase();
            options = {
                "method": methodType,
                redirect: "follow",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization
                },
            }
            break;
        case method.toLowerCase() === "post" || method.toLowerCase() === "patch" || method.toLowerCase() === "delete" || method.toLowerCase() === "put":
            methodType = method.toUpperCase();
            options = {
                "method": methodType,
                redirect: "follow",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization
                },
                body: JSON.stringify(body)

            }
            break;
        default:
            options = {}

    }
    const res = fetch(`https://us21.api.mailchimp.com/3.0/${urlPath}`, options)
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                return new Promise((resolve, reject) => {
                    response.json().then(val => {
                        reject(new Error(JSON.stringify(val)));
                    });
                });
            }

        })
        .then(result => {
            return result;
        })
        .catch(err => {
            return new Promise((resolve, reject) => {

                reject(new Error(err.message));
            })
        });

    return res;
}

let someData = {
    status: "subscribed"
}





/*
let createList = {
    name: "name",
    permission_reminder: "permission_reminder",
    email_type_option: true,
    contact: {
        company: "company",
        address1: "address1",
        city: "city",
        country: "country",
        state: "New York",
        zip: "10001"
    },
    campaign_defaults: {
        from_name: "from_name",
        from_email: "Beulah_Ryan@hotmail.com",
        subject: "subject",
        language: "language",
    },
}
*/
export { mailChimpAPI };