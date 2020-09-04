const Router = require('express');
const bodyParser = require('body-parser');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');
const cors = require('cors');
const axios = require('axios');

const routes = new Router();
routes.use(bodyParser.json());

const origin = process.env.UI_SERVER_ORIGIN || 'http://localhost:8000';

routes.use(cors({ origin, credentials: true }));

let { JWT_SECRET } = process.env;
if (!JWT_SECRET) {
  if (process.env.NODE_ENV !== 'production') {
    JWT_SECRET = 'TEMP_JSON_WEB_TOKEN_SECRET';
    console.log('Missing env var JWT_SECRET. using unsafe dev secret');
  } else {
    console.log('Missing env var JWT_SECRET. Disable authentication');
  }
}

routes.post('/user', (req, res) => {
  res.send(getUser(req));
});

routes.post('/signin', async (req, res) => {
  if (!JWT_SECRET) {
    res.status(500).send('Missing JWT_SECRET. Refusing to authenticate');
  }
  let payload;
  switch (req.body.type) {
    case 'gg':
      const googleToken = req.body.google_token;
      if (!googleToken) {
        res.status(400).send({ code: 400, message: 'Missing Token' });
        return;
      }

      const client = new OAuth2Client();
      try {
        const ticket = await client.verifyIdToken({ idToken: googleToken });
        payload = ticket.getPayload();
      } catch (error) {
        res.status(403).send('Invalid credentials');
        return;
      }
      break;
    case 'fb':
      const facebookToken = req.body.facebook_token;
      const userId = req.body.user_id;
      if (!facebookToken) {
        res.status(400).send({ code: 400, message: 'Missing Token' });
        return;
      }
      if (!userId) {
        res.status(400).send({ code: 400, message: 'Missing user_id' });
        return;
      }
      const response = await axios.get(`https://graph.facebook.com/${userId}`, {
        params: {
          fields: 'id,name,picture,email',
          access_token: facebookToken,
        },
      });
      const { data } = response;
      try {
        payload = {
          given_name: data.name,
          picture: data.picture.data.url,
          email: data.email,
        };
      } catch (error) {
        res.status(403).send({ code: 403, message: 'Invalid credentials' });
        return;
      }
      break;
    default:
      res
        .status(403)
        .send({ code: 403, message: 'Invalid type oAuthenticate' });
      return;
  }
  const { given_name: givenName, email, picture } = payload;
  const credentials = {
    signedIn: true,
    givenName,
    email,
    picture,
    type: req.body.type,
  };
  const token = jwt.sign(credentials, JWT_SECRET);
  res.cookie('jwt', token, {
    httpOnly: true,
    domain: process.env.COOKIE_DOMAIN,
  });

  res.json(credentials);
});

routes.post('/signout', (req, res) => {
  res.clearCookie('jwt', { domain: process.env.COOKIE_DOMAIN });
  res.json({ status: 'ok' });
});

function getUser(req) {
  const token = req.cookies.jwt;
  if (!token) return { signedIn: false };
  try {
    const credentials = jwt.verify(token, JWT_SECRET);
    return credentials;
  } catch (error) {
    return { signedIn: false };
  }
}

function mustBeSingedIn(resolver) {
  return (root, args, { user }) => {
    if (!user || !user.signedIn) {
      throw new AuthenticationError('You must be signed in');
    }
    return resolver(root, args, { user });
  };
}

function resolveUser(_, args, { user }) {
  return user;
}

module.exports = { routes, getUser, mustBeSingedIn, resolveUser };
