const express = require("express")
const path = require("path")
const handlebars = require("hbs")
const YAML = require("yaml")
const fs = require("fs");

const app = express()
const port = 3000
const crToXPMapping = {
    "0": 10,
    "1/8": 25,
    "1/4": 50,
    "1/2": 100,
    "1": 200,
    "2": 450,
    "3": 700,
    "4": 1100,
    "5": 1800,
    "6": 2300,
    "7": 2900,
    "8": 3900,
    "9": 5000,
    "10": 5900,
    "11": 7200,
    "12": 8400,
    "13": 10000,
    "14": 11500,
    "15": 13000,
    "16": 15000,
    "17": 18000,
    "18": 20000,
    "19": 22000,
    "20": 25000,
    "21": 33000,
    "22": 41000,
    "23": 50000,
    "24": 62000,
    "30": 155000
}
app.set("views", path.join(__dirname, "views"));

handlebars.registerPartial("statblock", handlebars.compile(fs.readFileSync("./views/statblock.hbs").toString()));
handlebars.registerHelper("ifEquals", function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});
handlebars.registerHelper("ifNotEquals", function(arg1, arg2, options) {
    return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
});
handlebars.registerHelper("ifGreaterThan", function(arg1, arg2, options) {
    return (arg1 > arg2) ? options.fn(this) : options.inverse(this);
});
handlebars.registerHelper("eq", function(arg1, arg2) {
    return arg1 == arg2;
});
handlebars.registerHelper("capitalizeFirst", function(arg1) {
    let str = (""+arg1)
    if(str.length > 0) {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }
    return str;
});
handlebars.registerHelper("expByCr", function(arg1) {
    return crToXPMapping[arg1]
});
handlebars.registerHelper("breaklines", function(text) {
    text = handlebars.Utils.escapeExpression(text);
    text = text.replace(/(\r\n|\n|\r)/gm, "<br>");
    return new handlebars.SafeString(text);
});
app.set("view engine", "hbs");

app.use("/", express.static(__dirname + "/public"))
app.use("/src", express.static(__dirname + "/public/statblock5e/src"))

app.get("/", (req, res) => {
    fs.readdir(path.join(__dirname, "creatures"), (err, files) => {
            if (err) {
                res.status(500).send("Could'nt read creature files directory!")
            }
            res.render("index", {
                "creatures": files
                .map(file => {
                    let contents = fs.readFileSync(__dirname + "/creatures/" +file, 'utf8')
                    let file_parts = file.split(".")
                    switch (file_parts[file_parts.length - 1]) {
                        case "json": return JSON.parse(contents)
                        case "yaml": return YAML.parse(contents)
                    }
                })
                .filter(
                    //filtering out creatures that have been set as inactive
                    parsed => parsed.active
                )
        })
    })
})

app.listen(port, () => console.log(`The server is listening on port ${port}`))
