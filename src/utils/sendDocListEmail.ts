import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "mail.morr.biz",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

export const sendEmailDocListNotification = async (
  recipients: string[],
  data: any
) => {
  console.log("Sending email notification with data:", data);

  if (!recipients || recipients.length === 0) {
    console.log("No recipients provided, skipping email");
    return;
  }

  // Ensure we have the necessary data
  const docName = data.doc_name || "Document";
  const createdBy = data.created_user_name || "A user";
  const docId = data.mydoc_list_id || "";
  const appUrl = "https://amoga-login-template.vercel.app";

  const subject = `Document Shared: ${docName} by ${createdBy}`;
  const message = `
  <p>Hello,</p>
  <p>A document has been shared with you: <strong>${docName}</strong></p>
  <p>Shared by: ${createdBy}</p>
  <p>You can view the document <a href="https://amoga-login-template.vercel.app/myDocs/view/${docId}">here</a>.</p>
  <p>Thank you!</p>
  `;

  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: recipients.join(", "),
    subject,
    html: message,
  };

  try {
    console.log("Sending email to:", recipients);
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
