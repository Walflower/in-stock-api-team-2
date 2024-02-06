require("dotenv").config();



/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
	client: "mysql2",
	connection: {
		port: process.env.DB_PORT,
		host: process.env.DB_HOST,
		database: process.env.DB_NAME,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		basePath: process.env.BASE_PATH,
	},
};
