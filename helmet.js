const helmet = require('helmet');

const scriptSrc = ["'self'", "blob:"];

if (process.env.NODE_ENV !== 'production') {
  scriptSrc.push("'unsafe-eval'");
}

module.exports = helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'connect-src': [
        "'self'",
        "https://api.mapbox.com",
        "https://events.mapbox.com"
      ],
      'img-src': [
        "'self'",
        "data:"
      ],
      'script-src': scriptSrc
    }
  }
})