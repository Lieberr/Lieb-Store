// lib/email.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendPasswordResetEmail(to: string, code: string) {
  await transporter.sendMail({
    from: `"Prostore" <${process.env.GMAIL_USER}>`,
    to,
    subject: 'Código de recuperação de senha',
    html: `
      <div style="font-family: sans-serif;">
        <h2>Recuperação de senha</h2>
        <p>Seu código é:</p>
        <h1 style="letter-spacing: 4px;">${code}</h1>
        <p>Se você não solicitou isso, ignore este email.</p>
      </div>
    `,
  });
}