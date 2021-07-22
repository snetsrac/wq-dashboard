module.exports.log = (message) => {
  console.log(message);
};

module.exports.error = (error) => {
  if (typeof error === 'string') {
    console.error(error);
  } else if (process.env.NODE_ENV !== 'production' && error.stack) {
    console.error(error.stack);
  } else {
    console.error(error.message);
  }
};
