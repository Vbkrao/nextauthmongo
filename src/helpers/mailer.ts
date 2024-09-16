import nodemailer from "nodemailer";

export const sendEmail=async({email, emailType, userId:any})=>{
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASS
            },
        });

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: emailType==='VERIFICATION' ? 'Email Verification' : 'Password Reset',
            text: `Your verification code is ${userId}`,
        };
         
        const mailResponse=await transporter.sendMail(mailOptions);
        return mailResponse

    }catch (error) {
        throw new Error(error.message)
     }

}