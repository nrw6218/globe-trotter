const models = require('../models');
const Trip = models.Trip;

const makerPage = (req, res) => {
  Trip.TripModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), trips: docs });
  });
};

const makeTrip = (req, res) => {
  if (!req.body.title || !req.body.location || !req.body.startDate) {
    return res.status(400).json({ error: 'Trips need a title, location and date to be created.' });
  }

  const tripData = {
    title: req.body.title,
    details: req.body.details,
    location: req.body.location,
    startDate: req.body.startDate,
    owner: req.session.account._id,
    _id: req.body._id,
  };

  const newTrip = new Trip.TripModel(tripData);

  const tripPromise = newTrip.save();

  tripPromise.then(() => res.json({ redirect: '/maker' }));

  tripPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Trip already exists' });
    }

    return res.status(400).json({ error: 'An error occured' });
  });

  return tripPromise;
};

const deleteTrip = (request, response) => {
  const req = request;
  const res = response;

  return Trip.TripModel.deleteTrip(req.body._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ trips: docs });
  });
};

const getTrips = (request, response) => {
  const req = request;
  const res = response;

  return Trip.TripModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ trips: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.getTrips = getTrips;
module.exports.deleteTrip = deleteTrip;
module.exports.make = makeTrip;
