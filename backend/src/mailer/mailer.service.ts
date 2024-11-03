import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Booking } from '../booking/entities/booking.entity';

@Injectable()
export class MailerService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_SERVER, // Здесь используем сервер SMTP Brevo
      port: parseInt(process.env.SMTP_PORT), // Порт SMTP
      secure: false, // Порт 587 — это незащищённое соединение (TLS)
      auth: {
        user: process.env.SMTP_USER, // SMTP логин
        pass: process.env.SMTP_PASSWORD, // SMTP пароль
      },
    });
  }

  async sendBookingConfirmation(booking: Booking) {
    try {
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: booking.email,
        subject: 'Booking Confirmation',
        text: `Hello ${booking.name}, your booking for ${booking.service} on ${booking.date} at ${booking.time} has been confirmed!`,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(
        `Booking confirmation email sent successfully to ${booking.email}`,
      );
    } catch (error) {
      console.error('Error while sending booking confirmation email:', error);
      throw new Error('Unable to send booking confirmation email');
    }
  }
}
