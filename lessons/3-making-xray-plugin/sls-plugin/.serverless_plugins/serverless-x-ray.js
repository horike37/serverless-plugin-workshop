'use strict';

class ServerlessXRay {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.commands = {};
    this.hooks = {};

  }
}

module.exports = ServerlessXRay;
