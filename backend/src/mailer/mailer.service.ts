import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Booking } from '../booking/entities/booking.entity';

@Injectable()
export class MailerService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_SERVER,
      port: parseInt(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendBookingConfirmation(booking: Booking, manageLink: string) {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: booking.email,
      subject: 'Booking Confirmation and Management Link',
      text: `Hello ${booking.name}, your booking for ${booking.service} on ${booking.date} at ${booking.time} has been confirmed! You can manage your booking using the following link: ${manageLink}`,
    };
    await this.transporter.sendMail(mailOptions);
    console.log(
      `Booking confirmation email sent successfully to ${booking.email}`,
    );
  }
}
