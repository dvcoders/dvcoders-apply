module.exports = (app, logger) => {
  var https = require('https')          // temporary fix, why won't it work when included in app.js?
  
  // The main page
  app.get('/', (req, res) => {
    res.render('index.html', {
      'title': 'Join',
      'css': ['css/normalize.css', 'css/skeleton.css', 'css/style.css'],
      'javascripts': ['javascripts/jquery-1.12.0.min.js', 'javascripts/index.js']
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
    var githubUsername = req.body.githubUsername;
    
    addToOrg(githubUsername, (err, statusCode) => {
      if (err) {
        console.log(err)
        res.status(500).end()
      }
      else {
        if (statusCode == 200)
          res.status(200).end()
        else if (statusCode === 404)
          res.status(404).end()
        else
          res.status(500).end() 
        // if api sends back anything other than 200 or 404, something
        // must be wrong with our server or github's api
      }
    })
  })
  
  function addToOrg(githubUsername, cb) {
    // sends and invite to the passed username to join the "developer" team
    // (error, statusCode) is passed to callback function
    var options = {
      hostname: 'api.github.com',
      // use environment variable to store api key as recommended by github
      // run `export githubApiKey=key` before running nodemon
      path: '/teams/1679886/memberships/' + githubUsername 
        + '?access_token=' + process.env.githubApiKey,
      method: 'PUT',
      headers: {
        'User-Agent': 'shankwiler'
      }
    }
    
    var req = https.request(options, (res) => {
      cb(null, res.statusCode)
    })
    
    console.log(options)
    
    req.end()
    
    req.on('error', (e) => {
      cb('error : ' + e)
    })
  }
}
