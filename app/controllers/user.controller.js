
exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

/*
exports.error = (req, res) => {
  throw new Error('An unhandled 500 error occurred');
  //res.status(500).send(console.error(err.stack));
  //res.status(500, { 'Content-Type': 'text/plain' });
};
*/