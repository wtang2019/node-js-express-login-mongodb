//var nr = require('newrelic');
const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    //nr.startWebTransaction('/module/exports', function transactionHandler(){
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  //});
});

//nr.startWebTransaction('/api/auth/signup', function transactionHandler(){
//var transaction = nr.getTransaction();
//nr.setTransactionName('/api/auth/signup')
  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );
//transaction.end();
//});
//  nr.startWebTransaction('/api/auth/signin', function transactionHandler(){
//  var transaction = nr.getTransaction();
//  nr.setTransactionName('/api/auth/signin')
  app.post("/api/auth/signin", controller.signin);
//});

  app.post("/api/auth/signout", controller.signout);
};
