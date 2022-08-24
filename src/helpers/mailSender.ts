const nodemailer = require("nodemailer");

export const SendMail = (email: any) => {
    let returnData: any = {}

    var transporter = nodemailer.createTransport({
        service: "outlook",
        auth: { 
            user: "safiulm123@outlook.com",
            pass: "G6seconds!",
        },
        from: "safiulm123@outlook.com",
    });

    let mailOptions = {
        from: "Alagzoo Support <safiulm123@outlook.com>", // sender address
        to: email, // list of receivers
        subject: `Alagzoo Support`, // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hi Human!</b><br /><p>Welcome to alagzoo</p>", // html body    
    };

    transporter.sendMail(mailOptions, async function (error: any, info: any) {
        if (error) {
            console.log(error);
            returnData = await {
                "Message": "Failure"
            }
        }
        console.log(info);
        returnData = await {
            "Message": "Success"
        }
    });
    
    return returnData;
}