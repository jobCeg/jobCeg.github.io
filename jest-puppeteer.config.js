require("dotenv").config();

module.exports = {
  launch: {
    dumpio: true,
    headless: process.env.PUPPETEER_HEADLESS == "true"
  },
  server: {
    command: "yarn start"
  },
  port: process.env.APP_PORT,
  browserContext: "default"
};
