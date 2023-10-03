const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.ready = false;
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_USER_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    this.transporter
      .verify()
      .then(() => {
        this.ready = true;
        console.log('EmailService ready to send emails');
      })
      .catch((error) => {
        console.log(`EmailService failed`, error);
        process.exit(1);
      });
  }

  async sendEmail(destinatario, asunto, mensajeHtml) {
    if (!this.ready) {
      throw new Error('EmailService not ready yet to send emails');
    }
    const opcionesCorreo = {
      from: process.env.EMAIL_USER,
      to: destinatario,
      subject: asunto,
      html: mensajeHtml,
    };

    try {
      const results = await this.transporter.sendMail(opcionesCorreo);
      console.log(`Email sent successfully to ${destinatario}`);
      console.log('Email details: ', results);
    } catch (error) {
      console.log(`Failed to send email to ${destinatario}`);
      console.log('EmailError:', error);
    }
  }
}

module.exports = new EmailService();
