/* istanbul ignore file */
const pino = require('pino');

const streams = [
  { stream: process.stdout },
  { stream: pino.destination(`${process.cwd()}/combined.log`) },
];

module.exports = pino(
  {
    level: process.env.LOG_LEVEL || 'info',
  },
  pino.multistream(streams)
);
