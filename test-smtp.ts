import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "mail.nigeriabusinessonline.com",
  port: 465,
  secure: true,
  tls: { rejectUnauthorized: false },
  auth: {
    user: "businessadmin@nigeriabusinessonline.com",
    pass: "@Grace2Takeitall",
  },
  debug: true,
  logger: true
});

transporter.verify(function (error, success) {
  if (error) {
    console.log("Error:", error);
  } else {
    console.log("Server is ready to take our messages");
  }
});
