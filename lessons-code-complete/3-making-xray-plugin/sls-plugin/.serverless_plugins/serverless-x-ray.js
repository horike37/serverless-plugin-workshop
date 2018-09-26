'use strict';

class ServerlessXRay {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.provider = this.serverless.getProvider('aws');
    this.region = this.provider.getRegion();
    this.stage = this.provider.getStage();

    this.commands = {};

    this.hooks = {
      'after:package:compileFunctions': this.traceConfig.bind(this)
    };
  }

  traceConfig() {
    this.serverless.service.getAllFunctions().forEach((functionName) => {
      const functionLogicalId = this.provider.naming.getLambdaLogicalId(functionName);
      this.serverless.service.provider.compiledCloudFormationTemplate
        .Resources[functionLogicalId].Properties.TracingConfig = {
          'Mode': 'Active'
      };
    });
    this.serverless.service.provider.compiledCloudFormationTemplate.Resources
      .IamRoleLambdaExecution.Properties.Policies[0].PolicyDocument.Statement.push({
        "Effect": "Allow",
        "Action": [
          "xray:PutTraceSegments",
          "xray:PutTelemetryRecords"
        ],
        "Resource": ["*"]
      });
  }
}

module.exports = ServerlessXRay;
