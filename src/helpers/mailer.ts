import nodemailer from 'nodemailer';
import User from "@/models/userModel";
import bcryptjs from 'bcryptjs';

export const sendEmail=async({email, emailType, userId}:any)=>{
    try {
         const hashedToken=await bcryptjs.hash(userId.toString(), 10);
         if(emailType==='VERIFY'){
          await User.findByIdAndUpdate(userId, 
            {verifyToken:hashedToken, verifyTokenExpiry: Date.now() + 60 * 60 * 1000});
         }
         else if(emailType==='RESET'){
            await User.findByIdAndUpdate(userId, 
                {forgotPasswordToken:hashedToken, forgotPasswordExpiry: Date.now() + 60 * 60 * 1000});
         }

         var transport = nodemailer.createTransport({
            host: "live.smtp.mailtrap.io",
            port: 587,
            auth: {
              user: "api",
              pass: "7a3c5520669b9cd7676c167de31aed5a"
            }
          });

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: emailType==='VERIFICATION' ? 'Email Verification' : 'Password Reset',
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`
        };
         
        const mailResponse=await transport.sendMail(mailOptions);
        return mailResponse;

    }catch (error:any) {
        throw new Error(error.message)
     }

}