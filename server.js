var newrelic = require("newrelic");
const express = require("express");
//const Sentry = require('@sentry/node');
const Tracing = require("@sentry/tracing");
const cors = require("cors");
const cookieSession = require("cookie-session");
const dbConfig = require("./app/config/db.config");
const app = express();
const winston = require('winston');


const customFormat = winston.format.printf((info) => {
  return `${info.timestamp} [${info.label}] ${info.level}: ${info.message} ${info.commit}`;
});

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.label({ label: 'Wilmers App' }),
    winston.format.timestamp(),
    customFormat
  ),
  transports: [new winston.transports.Console()]
});

/*
Sentry.init({
  dsn: "https://9b190512e7c84ec5a7f8fcca96129e68@o4504284008939520.ingest.sentry.io/4504284012871680",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());
*/
newrelic.instrumentLoadedModule(
  "express",    // the module's name, as a string
  express // the module instance
);

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "bezkoder-session",
    secret: "COOKIE_SECRET", // should use as secret environment variable
    httpOnly: true
  })
);

const db = require("./app/models");
const Role = db.role;

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    logger.log({
      level: 'info',
      message: 'Successfully connect to MongoDB.'
    });
    initial();
  })
  .catch(err => {
    logger.log({
      level: 'error',
      message: 'Connection Error, please check if MongoDb is installed',
      err: err
    });
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

/*
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});
*/

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  newrelic.addCustomAttributes({
    "tags.commit": revision
  });
  logger.log({
    level: 'info',
    message: `Server is running on port ${PORT}.`,
  });
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}
