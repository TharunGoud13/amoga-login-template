import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "mail.morr.biz",
  port: 465,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

export const sendEmailNotification = async (
  recipients: string[],
  data: any
) => {
  const subject = `New Agent Created: ${data.form_name} by ${data.created_user_name}`;
  const message = `
  <p>Hello</p>
  <p>A new agent has been created: ${data.form_name}</p>
  <p>Created by: ${data.created_user_name}</p>
  <p>View the agent <a href="${process.env.NEXT_PUBLIC_APP_URL}/Chat/agents/${data.form_id}">here</a></p>
  `;

  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: recipients.join(", "),
    subject,
    html: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
