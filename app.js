const express = require("express");
const http = require("http");
const cors = require("cors");
const bodyparser = require("body-parser");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

app.use(bodyparser.json());
app.use(cors());

//node server
app.get("/", (req, res) => {
  res.status(200).json({ success: "server is running" });
});

// sent mail
app.post("/sentMail", async (request, response) => {
  try {
    const { name, email, message, subject } = request.body;
    console.log("name: ", name);

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN,
        pass: process.env.PASS,
      },
    });

    var mailOptions = {
      from: email,
      to: process.env.ADMIN,
      subject: subject ? subject : "",
      html: ` from ${email} <br>.<br> <p> ${message} </p>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        response.status(500).json({ message: "somehting went wrong!", error });
      } else {
        console.log("Email sent: " + info.response);
        response.json({ status: 200, success: "message was sent" });
      }
    });
  } catch (error) {
    console.log("error: ", error);
  }
});

const server = http.createServer(app);

const port = 5500;

server.listen(port, () => {
  console.log("-------------------------------------");
  console.log(`server is running on port : ${port}`);
});
