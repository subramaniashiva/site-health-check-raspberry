// Require HTTPS module
let http = require('https');
// Require node mailer for sending emails
let mailer = require('nodemailer');
// Import configurations
let CONFIG = require('./config.js');

let optionsGet = {
  method: CONFIG.request.method,
  host : CONFIG.request.host,
  path : CONFIG.request.path
};

let smtpTransport = mailer.createTransport(CONFIG.mailConfig.type, {
  service: CONFIG.mailConfig.service,
  auth: {
    user: CONFIG.mailConfig.user,
    pass: CONFIG.mailConfig.passKey
  }
});

let mail= {
  from: CONFIG.mailDetails.from,
  to: CONFIG.mailDetails.to,
  subject: CONFIG.mailDetails.subject,
  html: CONFIG.mailDetails.html
}

let requestSite = function requestSite() {
  setInterval(function() {
    // Initiate the HTTP request
    let request = http.request(optionsGet, function(response) {
      // Check the reponse code. If it is greater than 400, send mail
      if(parseInt(response.statusCode, 10) > 100) {
        // Send the status code in the mail body
        mail.html = 'status code is ' + response.statusCode;

        // Send the mail
        smtpTransport.sendMail(mail, function(error, response) {
          // Useful for finding the error
          console.log('error is ', error);
          smtpTransport.close();
        });

      }

    });
    
    // Send mail on error
    request.on('error', function(e) {
      mail.html = 'Error while getting request, ' + e;
      smtpTransport.sendMail(mail, function() {
        smtpTransport.close();
      })
    });

    request.end();

  }, CONFIG.checkInterval)
}

requestSite();