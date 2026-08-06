import nodemailer from "nodemailer";

const smtpConfig = {
  host: "mail.nigeriabusinessonline.com",
  port: 465,
  secure: true,
  user: "businessadmin@nigeriabusinessonline.com",
  pass: "@Grace2Takeitall",
};

const transporter = nodemailer.createTransport({
  host: smtpConfig.host,
  port: parseInt(String(smtpConfig.port) || "587"),
  secure: String(smtpConfig.port) === "465",
  tls: {
    rejectUnauthorized: false
  },
  auth: {
    user: smtpConfig.user,
    pass: smtpConfig.pass,
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
