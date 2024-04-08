import nodemailer from 'nodemailer'

const sendEmailService = async(
    {
        to = '',
        subject = 'no-reply',
        message = `<h1>no-message</h1>`,
        attachments = []
    }
) => {
    // email configuration 
    const transporter = nodemailer.createTransport({
        host: 'SMTP.gmail.com', // or local host 
        service: 'gmail',
        port: 465, // secure true
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    const info = await transporter.sendMail({
        from: `"fred foo" <${process.env.EMAIL}>`,
        to,
        subject,
        // text: "hello bro how are you", 
        html: message,
        attachments // send file 
    })
    return info.accepted.length ? true : false;

}

export default sendEmailService