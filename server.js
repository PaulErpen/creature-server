const express = require("express")
const path = require("path")
const handlebars = require("hbs")
const YAML = require("yaml")

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
    "4": 1_100,
    "5": 1_800,
    "6": 2_300,
    "7": 2_900,
    "8": 3_900,
    "9": 5_000,
    "10": 5_900,
    "11": 7_200,
    "12": 8_400,
    "13": 10_000,
    "14": 11_500,
    "15": 13_000,
    "16": 15_000,
    "17": 18_000,
    "18": 20_000,
    "19": 22_000,
    "20": 25_000,
    "21": 33_000,
    "22": 41_000,
    "23": 50_000,
    "24": 62_000,
    "30": 155_000
}
app.set("views", path.join(__dirname, "views"));
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
    var fs = require("fs");
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
        })
    })
})

app.listen(port, () => console.log(`The server is listening on port ${port}`))
