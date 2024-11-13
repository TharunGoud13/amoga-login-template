import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';

const transporter = nodemailer.createTransport({
  host: 'mail.morr.biz',
  port: 465,
  auth: {
    user: process.env.MAIL_USERNAME, 
    pass: process.env.MAIL_PASSWORD,
  },
});

export async function POST(req: NextRequest) {
  const { user_email, user_catalog_id, user_name } = await req.json(); 
  console.log("user-----",user_email,user_catalog_id);

  const verificationToken = generateVerificationToken(user_catalog_id);

  const verificationLink = `${process.env.NEXT_PUBLIC_API_URL}/api/verify-email?token=${verificationToken}`;

  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: user_email,
    subject: 'Email Verification',
    html: `
    <p>Hello ${user_name}</p>
    <p>Thank you for signing up. To complete your registration please verify your email address.</p>
    <p>Click <a href="${verificationLink}">here</a> to verify your email address.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'Verification email sent successfully.' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 });
  }
}

function generateVerificationToken(userId:any) {
  return `${userId}-${Date.now()}`;
}
