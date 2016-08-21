// Require HTTPS module
let http = require('https');
// Require node mailer for sending emails
let mailer = require('nodemailer');
// Import configurations
let CONFIG = require('./config.js');

// The URL that needs to be requested
let optionsGet = {
  method: CONFIG.request.method,
  host : CONFIG.request.host,
  path : CONFIG.request.path
};

// Configuration for the mailer
let smtpTransport = mailer.createTransport(CONFIG.mailConfig.type, {
  service: CONFIG.mailConfig.service,
  auth: {
    user: CONFIG.mailConfig.user,
    pass: CONFIG.mailConfig.passKey
  }
});

// Mail template
let mail= {
  from: CONFIG.mailDetails.from,
  to: CONFIG.mailDetails.to,
  subject: CONFIG.mailDetails.subject,
  html: CONFIG.mailDetails.html
}

// Function to send mail
let sendMail = function sendMail(mailTemplate, data) {
  mailTemplate.html = (data ? data : '');
  smtpTransport.sendMail(mailTemplate, function(error, response) {
    smtpTransport.close()
  })
}

// Function to send request and based on the response, send a mail
let requestSite = function requestSite() {
  // Initiate the HTTP request
  let request = http.request(optionsGet, function(response) {
    console.log('sending request');
    // Check the reponse code. If it is greater than 400, send mail
    if(parseInt(response.statusCode, 10) >= 400) {
      sendMail(mail, 'status code is ' + response.statusCode)
    }

  });
  
  // Send mail on error
  request.on('error', function(e) {
    sendMail(mail, 'Error while getting request, ' + e)
  });

  request.end();
}


setInterval(requestSite, CONFIG.checkInterval);
