import * as nodemailer from 'nodemailer';

export const sendEmail = async options => {
    // 1) Create a transporter
    const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 465,
        secure: false, // use SSL
        auth: {
            user: '0f8c6d3818f545',
            pass: 'a356c542c1d166'
        }
    });

    // 2) Define the email options
    const mailOptions = {
        from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
        to: options.email,
        subject: options.subject,
        html: options.message
    };
    await transporter.sendMail(mailOptions);
}