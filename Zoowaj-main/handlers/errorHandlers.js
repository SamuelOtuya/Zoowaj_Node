/*
  Catch Errors Handler
*/
export const catchErrors = (fn) => {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => {
      // Validation Errors
      if (typeof err === "string") {
        res.status(400).json({
          message: err,
        });
      } else {
        next(err);
      }
    });
  };
};

/*
  MongoDB Validation Error Handler

  Detect if there are MongoDB validation errors and send them back nicely.
*/
export const mongoseErrors = (err, req, res, next) => {
  if (!err.errors) return next(err);
  const errorKeys = Object.keys(err.errors);
  let message = "";
  errorKeys.forEach((key) => (message += err.errors[key].message + ", "));

  message = message.substr(0, message.length - 2);

  res.status(400).json({
    message,
  });
};

/*
  Development Error Handler

  In development we show good error messages so if we hit a syntax error or any other previously unhandled error, we can show good info on what happened.
*/
export const developmentErrors = (err, req, res, next) => {
  err.stack = err.stack || "";
  const errorDetails = {
    message: err.message,
    status: err.status,
    stack: err.stack,
  };

  res.status(err.status || 500).json(errorDetails); // send JSON back
};

/*
  Production Error Handler

  No stack traces and error details are leaked to the user.
*/
export const productionErrors = (err, req, res, next) => {
  res.status(err.status || 500).json({
    error: "Internal Server Error",
  }); // send JSON back
};

/*
  404 Page Error
*/
export const notFound = (req, res, next) => {
  res.status(404).json({
    message: "Route not found",
  });
};
