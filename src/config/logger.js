/* istanbul ignore file */
import pino from 'pino';

const streams = [
  { stream: process.stdout },
  { stream: pino.destination(`${process.cwd()}/combined.log`) },
];

export default pino(
  {
    level: process.env.LOG_LEVEL || 'info',
  },
  pino.multistream(streams)
);
