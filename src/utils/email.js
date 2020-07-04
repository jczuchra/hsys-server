import nodemailer from 'nodemailer';

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

export const contactEmail = (name, email, phone, message) => {
  const mailOptions = {
    from: 'hsyscompany@gmail.com',
    to: 'hsyscompany@gmail.com',
    subject: `Message from ${name}`,
    text: `Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Message: ${message}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return {
        message: `Something wen wrong, try again later! Error: ${error}`,
      };
    } else {
      return {
        message: 'We will contact you soon. Thanks!',
      };
    }
  });
};
