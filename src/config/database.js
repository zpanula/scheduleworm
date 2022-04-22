import { Sequelize } from 'sequelize';

export default new Sequelize('sqlite::memory:', { logging: false });
