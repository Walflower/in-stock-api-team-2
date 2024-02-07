require("dotenv").config();

module.exports = {
	client: "mysql2",
	connection: {
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		database: process.env.DB_NAME,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		path: process.env.DB_PATH,
	},
	migrations: {
		directory: "./database/migrations",
	},
	seeds: {
		directory: "./database/seeds",
	},
};
