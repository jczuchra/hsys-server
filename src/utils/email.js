import nodemailer from 'nodemailer';
import axios from 'axios';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hsyscompany@gmail.com',
    pass: 'hsys2020',
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const contactEmail = async (name, email, phone, message, token) => {
  const mailOptions = {
    from: 'hsyscompany@gmail.com',
    to: 'hsyscompany@gmail.com',
    subject: `Message from ${name}`,
    text: `Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Message: ${message}`,
  };
  const secret = process.env.PRODUCTION
    ? '6Lej07IZAAAAAP84E_2xeepYPgWRjJYqUc2qZlWD'
    : '6LcZ17IZAAAAAK58ZTg80TktDf5LeR0YTPt1ISY6';
  const googleResponse = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`
  );
  console.log('Google', googleResponse.data);
  if (googleResponse.data.success) {
    const emailResponse = await transporter.sendMail(mailOptions);
    if (emailResponse.accepted && emailResponse.accepted.length) {
      return {
        ...emailResponse,
        message: 'We will contact you soon. Thanks!',
        success: googleResponse.data.success,
      };
    }
    return {
      ...emailResponse,
      message: `Something went wrong, try again later!`,
      success: googleResponse.data.success,
    };
  }
  console.log(googleResponse.data['error-codes']);
  if (googleResponse.data['error-codes'].includes('timeout-or-duplicate')) {
    return {
      message: 'You have already sent an e-mail!',
      errors: googleResponse.data['error-codes'],
      success: googleResponse.data.success,
    };
  }
  return {
    message: 'Something went wrong, try again later!',
    errors: googleResponse.data['error-codes'],
    success: googleResponse.data.success,
  };
};
