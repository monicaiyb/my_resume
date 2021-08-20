const express = require('express')
const app = express()
const PORT = process.env.PORT|| 3000

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/resume', function (req, res) {
    res.sendFile('index.html', { root: __dirname });
  })
  

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})