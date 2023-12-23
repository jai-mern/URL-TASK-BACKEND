const express = require('express');
const shortid = require('shortid');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const urlDatabase = {};

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/shorten', (req, res) => {
  const longUrl = req.body.long_url;
  const shortUrl = shortid.generate();

  urlDatabase[shortUrl] = longUrl;

  const shortUrlWithHost = `${req.protocol}://${req.get('host')}/${shortUrl}`;
  res.sendFile(__dirname + '/views/index.html', { shortUrl: shortUrlWithHost });
});

app.get('/:shortUrl', (req, res) => {
  const longUrl = urlDatabase[req.params.shortUrl];
  if (longUrl) {
    res.redirect(longUrl);
  } else {
    res.sendFile(__dirname + '/views/index.html', { error: 'Short URL not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
