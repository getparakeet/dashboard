const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('parakeetdb', 'oCraf', 'o)MeU$^TYaoCZ?<B', {
    host: 'parakeetdb.database.windows.net',
    dialect: 'mssql'
});
const sql = sequelize;
export default sql;