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
    });

    this.transporter.verify().then(() => {
      this.ready = true;
      console.log('EmailService ready to send emails');
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

    await this.transporter.sendMail(opcionesCorreo);
  }
}

module.exports = new EmailService();
