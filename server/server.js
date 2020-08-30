const express = require('express');
const { connectToDb } = require('./db.js');

const { installHandler } = require('./api_handler.js');
const auth = require('./auth.js');

const app = express();
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use('/auth', auth.routes);

installHandler(app);

const port = process.env.API_SERVER_PORT || 3000;
(async function start() {
  try {
    await connectToDb();
    app.listen(port, () => {
      console.log(`🚀 App started on port ${port}`);
    });
  } catch (err) {
    console.log('ERROR: ', err);
  }
})();
