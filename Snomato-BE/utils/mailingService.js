const nodemailer = require("nodemailer");


async function sendEmail(email, username, password) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Gmail app password
    },
  });

  await transporter.sendMail({
    from: `"Admin" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Account Credentials",
    html: `
      <h3>Hello ${username},</h3>
      <p>Your account has been created.</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Password:</strong> ${password}</p>
      <br/>
      <p>Login here: <a href="http://localhost:3000">Login Page</a></p>
      <p>Login here: <a href="https://snomato-fe-git-main-rajasekhars-projects.vercel.app">Login Page</a></p>
    `,
  });
}

module.exports = {
    sendEmail
}