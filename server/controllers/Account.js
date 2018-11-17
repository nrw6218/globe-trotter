const models = require('../models');

const Account = models.Account;

/*
  Renders a login page
*/
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

/*
  Logs the user out and redirects them to the login scren
*/
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

/*
  Renders the account settings page
*/
const settingsPage = (req, res) => {
  res.render('settings', { csrfToken: req.csrfToken() });
};

/*
  Authenticates the user profile and redirects them to the appropriate page
*/
const login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'RAWR! All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

/*
  Validates signup information and redirects the user
*/
const signup = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/maker' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occured' });
    });
  });
};

/*
  Validates the new password against the current and redirects them
  to sign back in
*/
const passwordChange = (request, response) => {
  const req = request;
  const res = response;

  const password = `${req.body.pass}`;
  const newPassword = `${req.body.newpass}`;
  const newPasswordCopy = `${req.body.newpass2}`;

  if (!password || !newPassword || !newPasswordCopy) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (newPassword !== newPasswordCopy) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  if (password === newPassword) {
    return res.status(400).json({ error: 'New password cannot match the old password' });
  }

  return Account.AccountModel.generateHash(req.body.newpass, (salt, hash) => {
    const accountData = {
      username: req.session.account.username,
      salt,
      password: hash,
    };

    return Account.AccountModel.updatePassword(accountData, (err, account) => {
      if (err || !account) {
        return res.status(401).json({ error: 'Wrong password' });
      }

      return res.json({ redirect: '/logout' });
    });
  });
};

/*
  Returns the csrf tokrn and user account
*/
const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
    user: req.session.account,
  };

  res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.settingsPage = settingsPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.passwordChange = passwordChange;
module.exports.getToken = getToken;
