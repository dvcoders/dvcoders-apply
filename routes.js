module.exports = (app, logger) => {
  // The main page
  app.get('/', (req, res) => {
    res.render('index.html', {
      'title': 'Join',
      'css': ['css/normalize.css', 'css/skeleton.css', 'css/style.css']
    })
  })

  // The success page
  app.get('/success', (req, res) => {
    res.render('success.html', {
      'title': 'Success',
      'css': []
    })
  })

  // The form API call
  app.post('/join', (req, res) => {
    console.log(req.body)
    // logger.info(req.body);
    res.send('Nice forms bro')
  })
}
