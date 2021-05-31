'use strict';

const { Kinesis } = require('aws-sdk')

const uuid = require('uuid')
const kinesis = new Kinesis({apiVersion: '2013-12-02'})

const streamName = 'eventStream';

module.exports.producer = async (event) => {
  await kinesis.putRecord({
    StreamName: streamName,
    PartitionKey: uuid.v4(),
    Data: event.body
  }).promise();
  
  return({
    statusCode: 200,
    body: JSON.stringify({message: 'Success'})
  });
};


module.exports.consumer = async (event) => {
  for(const record of event.Records) {
    const payload = record.kinesis;
    const message = Buffer.from(payload.data, 'base64').toString();

    console.log({
      partitionKey: payload.partitionKey,
      sequenceNumber: payload.sequenceNumber,
      data: message
    })
  }
};