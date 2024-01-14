const express = require('express')

const app = express()
const PORT = process.env.PORT || 3000

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.use("/api/interactions", require("./api/interactions"))

app.listen(PORT, () => {
   console.log(`Example app listening on port ${PORT}`)
})