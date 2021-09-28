const express = require("express")

const app = express()
const port = 3000
app.use("/", express.static(__dirname + '/public'))
app.use("/src", express.static(__dirname + '/public/statblock5e/src'))

app.listen(port, () => console.log(`The server is listening on port ${port}`))
