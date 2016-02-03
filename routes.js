module.exports = (app, logger) => {

  // The main page
  app.get('/', (req, res) => {
    res.render('index.html', {
      'title': 'Join'
    });
  });
};
