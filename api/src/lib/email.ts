import mailjet from 'node-mailjet'

let maijetClient = mailjet.connect(process.env['MAILJET_API_KEY'] as string, process.env['MAILJET_API_SECRET'] as string )



export async function sendEmail(data: {subject: string, to: {email:string, name: string}, from: {name:string, email: string}, body: string, html: string}){

    let response = await maijetClient.post("send", {'version':'v3.1'}).request({
        "Messages":[
            {
                "From":{
                    "Email": data.from.email,
                    "Name": data.from.name
                },
                "To":[{
                    "Email":data.to.email,
                    "Name":data.to.name
                }],
                "Subject": data.subject,
                "TextPart":data.body,
                "HTMLPart": data.html
            }
        ]
    })
    return response

}


export const validateEmail = (email: string) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

export let sendPasswordResetEmail = async (user:any, resetLink:string) => {

    try {
        let response = await sendEmail({
            subject: "Reset Password: Kabarak MHIS",
            to:{
                email:user.email as string,
                name: user.names as string
            },
            from:{
                name: "Kabarak MHIS",
                email: "railamolo@gmail.com"
            },
            body: `Dear ${user.username},\n\n\nUse the link below to reset your password \n\n${resetLink}`,
            html: `
            <a href=${"https://devmhis.netlify.app"}><button style="background-color: #8A5EB5;border: none;padding: 15px 32px;color: white;width: 400px;font-weight: bold;">Kabarak MHIS</button></a>
            
            <br/>
            <p>Dear ${user.username},<p>
            <h3>Click on the button or link below to reset your password<h3/>
            <a href=${resetLink}><button style="background-color:#8A5EB5;border: none;padding: 15px 32px;">Click Here</button></a>
            <br/><br/>
            <a href=${resetLink}>Reset Link</a>
            <br/><br/>
            <a href=${"https://devmhis.netlify.app"}>MHIS Website</a>
            `
        })
        return response
    } catch (error) {
        console.error(error)
        return error
    }
}