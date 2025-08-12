const AWS = require('aws-sdk');

const ssm = new AWS.SSM({ region: process.env.AWS_REGION || 'us-east-1' });

async function getParameter(name) {
  const params = { Name: name, WithDecryption: true };
  const result = await ssm.getParameter(params).promise();
  return result.Parameter.Value;
}

async function getParameters(names) {
  const params = { Names: names, WithDecryption: true };
  const result = await ssm.getParameters(params).promise();
  const out = {};
  for (const p of result.Parameters) out[p.Name] = p.Value;
  return out;
}

module.exports = { getParameter, getParameters };


