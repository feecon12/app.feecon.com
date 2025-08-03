import dotenv from "dotenv";
import nodemailer, { SendMailOptions } from "nodemailer";

dotenv.config();

if (!process.env.EMAIL || !process.env.PASSWORD) {
  throw new Error("EMAIL and PASSWORD environment variables must be set.");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});
export const HTML_TEMPLATE = (text: string): string => {
  return `
        <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>NodeMailer Email Template</title>
          <style>
            .container {
              width: 100%;
              height: 100%;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .email {
              width: 80%;
              margin: 0 auto;
              background-color: #fff;
              padding: 20px;
            }
            .email-header {
              background-color: #333;
              color: #fff;
              padding: 20px;
              text-align: center;
            }
            .email-body {
              padding: 20px;
            }
            .email-footer {
              background-color: #333;
              color: #fff;
              padding: 20px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="email">
              <div class="email-header">
                <h1>OTP for reset</h1>
              </div>
              <div class="email-body">
                <p>${text}</p>
              </div>
              <div class="email-footer">
                <p>EMAIL FOOTER</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
};

export async function emailBuilder(
  to: string,
  subject: string,
  message: string
): Promise<void> {
  try {
    const options: SendMailOptions = {
      from: process.env.EMAIL,
      to,
      subject,
      text: message,
      html: HTML_TEMPLATE(message),
    };

    const info = await transporter.sendMail(options);
    console.log("Email sent successfully!");
    console.log("Message Id", info.messageId);
  } catch (error) {
    console.log("Error sending email:", error);
  }
}
