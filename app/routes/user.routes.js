var newrelic = require('newrelic');
const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const crypto = require('crypto');
const winston = require('winston');

revision = require('child_process')
  .execSync('git rev-parse HEAD')
  .toString().trim()
console.log("sha commit "+ revision)

const customFormat = winston.format.printf((info) => {
  return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.label({ label: 'Wilmers App' }),
    winston.format.timestamp(),
    customFormat
  ),
  transports: [new winston.transports.Console()]
});

function generateId() {
  return crypto.randomBytes(10).toString('hex');
}

const id = generateId();
console.log(id);

module.exports = function(app) {
  app.use(function(req, res, next) {
//    var requestURL = req.originalUrl.toString();
//    console.log(`${req.originalUrl}`);
//   nr.startWebTransaction('/api/abc123/all', function transactionHandler(){
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
//  });
});
  function allParticipations(req, res) {
    controller.allAccess(req, res);
  }
  app.get("/api/v1/contests/620bd780d0f449050c3be5e0/participations", allParticipations);

  app.get("/api/v1/contests/error", function ErrorContest (req, res) {
    newrelic.addCustomAttributes({
      "Custom Attribute": "Value defined by You",
      "tags.commit": revision,
      "userId": id
    });
    logger.log({
      level: 'error',
      message: '500 error in /api/v1/contests/error',
      commit: revision,
      team: "Node Team",
      Owner: "Wilmer"
    });
    try {
      throw new Error(err.stack);
    } catch (error) {
      res.status(500).send(console.error(err.stack));
    }
  });
  

  function userBoard(req, res) {
    controller.userBoard(req, res);
  }
  app.get("/api/v1/contests", [authJwt.verifyToken], userBoard);
  

  function moderatorBoard(req, res) {
    controller.moderatorBoard(req, res);
  }
  app.get("/api/v1/contests/620bd780d0f449050c3be5e0/status", [authJwt.verifyToken, authJwt.isModerator], moderatorBoard);
  

  function adminBoard(req, res) {
    controller.adminBoard(req, res);
  }
  app.get("/api/test/admin", [authJwt.verifyToken, authJwt.isAdmin], adminBoard);
}
