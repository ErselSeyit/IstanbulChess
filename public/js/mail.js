var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'metinseyit@gmail.com',
        pass: 'diamondchair52'
    }
});
transporter.sendMail({
    from: 'metinseyit@gmail.com',
    to: 'metin.seyit@ntv.com.tr',
    subject: 'deneme',
    html:'<br><b>deneme kalın</b> <br>deneme ince'
});