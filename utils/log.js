"use strict"
const { createLogger, format, transports } = require("winston")
require("winston-daily-rotate-file")
const fs = require("fs")

const systemJson = fs.readFileSync('./system.json');
const system = JSON.parse(systemJson);

const env = process.env.NODE_ENV || "development"
const logDir = `${system.logRoot}`

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir, { recursive: true })
}

const dailyRotateFileTransport = new transports.DailyRotateFile({
  level: "debug",
  filename: `${logDir}/%DATE%-fsms.log`,
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d"
})

const logger = createLogger({
  level: env === "development" ? "debug" : "info",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    format.json()
  ),
  transports: [
    new transports.Console({
      level: "info",
      format: format.combine(
        format.colorize(),
        format.printf(
          info => `${info.timestamp} ${info.level}: ${info.message}`
        )
      )
    }),
    dailyRotateFileTransport
  ]
})

module.exports = {
  logger: logger
}