const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const Oauth2 = google.auth.OAuth2;
require("dotenv").config();

const OAuth2Client = new Oauth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET
);

OAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

function sendMail(recipient, link) {
  const accessToken = OAuth2Client.getAccessToken();

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.USER,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });

  const mailOptions = {
    from: `Saumya Som <${process.env.USER}>`,
    to: recipient,
    subject: "Password Reset Link",
    text: `Pleae Click the link to reset your login password ${link}`,
  };

  transport.sendMail(mailOptions, (error, result) => {
    if (error) {
      console.log("Error: ", error);
    } else {
      console.log("Success: ", result);
    }
    transport.close();
  });
}

sendMail();
