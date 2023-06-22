const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/profile', async (req, res) => {
  const { username } = req.body;

  try {
    const response = await axios.get(`https://api.github.com/users/${username}`);
    const data = response.data;

    if (data.login) {
      const repositories = await axios.get(`https://api.github.com/users/${username}/repos`);
      const repoData = repositories.data;

      res.render('profile', { user: data, repos: repoData });
    } else {
      res.send('User not found');
    }
  } catch (error) {
    res.send('Error occurred');
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});