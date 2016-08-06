module.exports = {
  request: {
    host: 'medium.com',
    path: '/til-js',
    method: 'GET'
  },
  mailConfig: {
    type: 'SMTP',
    service: 'Gmail',
    user: '',
    passKey: ''
  },
  mailDetails: {
    from: '',
    to: '',
    subject: 'Medium Page Health Alert',
    html: ''
  },
  checkInterval: 5000
}