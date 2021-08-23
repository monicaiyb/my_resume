const express = require('express')
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2
require('dotenv').config()
const path=require('path')

const PORT = process.env.PORT||3000

const oauth2Client = new OAuth2(
  process.env.Client_ID,
  process.env.Client_Secret,
  "https://developers.google.com/oauthplayground"
)

oauth2Client.setCredentials({
  refresh_token: process.env.Refresh_Token
})
const accessToken = oauth2Client.getAccessToken()

const app = express()

app.set('public', path.join(__dirname, 'public'));

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(__dirname + 'public'))
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function (req, res) {
  res.sendFile(process.cwd() + "/public/views/index.html");
})
app.post("/", function (req, res) { // this will be used to send the emails
  const output = `
  <p>You have a new contact request</p>
  
  <h3>Contact details</h3>
  <ul>
  <li>Name: ${req.body.name}</li>
  <li>Email: ${req.body.email}</li>
  <li>TelNum: ${req.body.subject}</li>
  
  <li>Message: ${req.body.message}</li>
  </ul>`
  const smtpTrans = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      user: process.env.GMAIL_USER,
      clientId: process.env.Client_ID,
      clientSecret: process.env.Client_Secret,
      refreshToken: process.env.Refresh_Token,
      accessToken: accessToken
    }
  })
  const mailOpts = {
    from: process.env.GMAIL_USER,
    to: process.env.RECIPIENT,
    subject: 'New message from Monica-resume',
    html: output,
  }
  smtpTrans.sendMail(mailOpts, (error, res) => {
    if (error) {
      console.log(error);
    }
    else {
      console.log("Message sent ");
      response.status(200).send(200)
    }

  })


});

app.get('/resume', function (req, res) {
  res.sendFile(process.cwd() + "/public/views/landing.html");
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})