export const handleE11000 = (error, res, next) => {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new Error("There was a duplicate key error"));
  } else {
    next();
  }
};
