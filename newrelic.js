'use strict'
/**
 * New Relic agent configuration.
 *
 * See lib/config/default.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  /**
   * Array of application names.
   */
  app_name: ['expressjs/mongoose'],
  /**
   * Your New Relic license key.
   */
  license_key: 'eu01xx583bf1a918b4e10097119064003cdbNRAL',
  logging: {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    level: 'info'
  },
  /**
   * When true, all request headers except for those listed in attributes.exclude
   * will be captured for all traces, unless otherwise specified in a destination's
   * attributes include/exclude lists.
   */
  allow_all_headers: true,
  application_logging: {
    forwarding: {
      /**
       * Toggles whether the agent gathers log records for sending to New Relic.
       */
      enabled: true
    }
  },
  code_level_metrics: {enabled: true},

  attributes: {
    /**
     * Prefix of attributes to exclude from all destinations. Allows * as wildcard
     * at end.
     *
     * NOTE: If excluding headers, they must be in camelCase form to be filtered.
     *
     * @env NEW_RELIC_ATTRIBUTES_EXCLUDE
     */
    exclude: [
      'request.headers.cookie',
      'request.headers.authorization',
      'request.headers.proxyAuthorization',
      'request.headers.setCookie*',
      'request.headers.x*',
      'response.headers.cookie',
      'response.headers.authorization',
      'response.headers.proxyAuthorization',
      'response.headers.setCookie*',
      'response.headers.x*'
    ]
  },

  rules : {
  name : [
    { pattern: '/api/v1/contests/participations/[A-Za-z0-9]+', name: '/api/v1/contests/participations/:id' },
    { pattern: '/api/v1/contests/participations', name: '/api/v1/contests/participations' },
    { pattern: '/api/v1/contests/[A-Za-z0-9]+', name: '/api/v1/contests/:id' },
    { pattern: '/api/v1/contests', name: '/api/v1/contests' },
    { pattern: '/api/v1/contests/[A-Za-z0-9]+/(draw|status|participations|prizes-configuration)', name: 'api/v1/contests/:id/\\1'},
    { pattern: '/api/v1/contests/[A-Za-z0-9]+/draw-outcome/export', name: 'api/v1/contests/:id/draw-outcome/export'},
    { pattern: '/api/v1/contests/[A-Za-z0-9]+/winners/response', name: 'api/v1/contests/:id/winners/response'},

  ]
}

}
