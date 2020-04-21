const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'pokharelsujan134@gmail.com',
        subject: 'Welcome to the Note-taking App',
        text: `Welcome, ${name}. How do you feel about being in the app!.`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'pokharelsujan134@gmail.com',
        subject: 'Sorry to see you go!',
        text: `Take care, ${name}. Hope to see You again.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}