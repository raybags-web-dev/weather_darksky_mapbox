const path = require('path');
const hbs = require('hbs');
const express = require('express');
const geocode = require('../src/utils/geocode');
const forecast = require('../src/utils/forecast');

const app = express();

const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
   res.render('index', {
      title: 'Weather',
      name: 'Raymond_Baguma'
   })
});

app.get('/about', (req, res) => {
   res.render('about', {
      title: 'About Me',
      name: 'Raymond_Baguma'
   })
});

app.get('/help', (req, res) => {
   res.render('help', {
      helpText: 'This is some helpful text.',
      title: 'Help',
      name: 'Raymond_Baguma'
   })
});

app.get('/weather', (req, res) => {
   if (!req.query.address) {
      return res.send({
         error: 'You must provide an address!'
      })
   }

   geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
      if (error) {
         return res.send({ error: error })
      }

      forecast(latitude, longitude, (error, forecastData) => {
         if (error) {
            return res.send({ error: error })
         }

         res.send({
            forecast: forecastData,
            location,
            address: req.query.address
         })
      })
   })
})

app.get('/products', (req, res) => {
   if (!req.query.search) {
      return res.send({
         error: 'You must provide a search term'
      })
   }
   console.log(req.query.search);
   res.send({
      products: []
   })
});

app.get('/help/*', (req, res) => {
   res.render('404', {
      title: '[404]',
      name: 'Raymond_Baguma',
      errorMessage: 'Help article not found.'
   })
});



app.get('/*', (req, res) => {
   res.render('404', {
      title: '[404]',
      name: 'Raymond_Baguma',
      errorMessage: 'Page not found.'
   })
})

const port = process.env.PORT || 3000;
app.listen(port, () => { console.log(`Server listening on port: ${port}...`) })