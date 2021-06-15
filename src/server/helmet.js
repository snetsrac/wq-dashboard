const helmet = require('helmet');

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
      'script-src': [
        "'self'",
        "blob:"
      ]
    }
  }
})