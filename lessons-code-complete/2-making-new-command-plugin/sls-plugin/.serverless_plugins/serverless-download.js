'use strict';

class ServerlessDownload {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.provider = this.serverless.getProvider('aws');
    this.region = this.provider.getRegion();
    this.stage = this.provider.getStage();

    this.commands = {
      'download': {
        lifecycleEvents: [
          'downloadData',
        ],
        usage: 'Download data from one database',
        options: {
          resource: {
            usage: 'Specify name of resource for your table',
            required: true
          },
          'target-stage': {
            usage: 'Stage you want to upload data to',
            required: true,
            shortcut: 't'
          }
        }
      },
    };

    this.hooks = {
      'download:downloadData': this.downloadData.bind(this)
    };
  }

  downloadData() {
    const tableName = this.serverless.service.resources.Resources[this.options.resource].Properties.TableName;
    return this.provider.request('DynamoDB',
      'scan',
      { TableName: tableName },
      this.options.stage,
      this.options.region
    ).then(result => {
      this.serverless.cli.log(`Downloaded ${JSON.stringify(result.Items)}`);
    })
  }
}

module.exports = ServerlessDownload;
