import log4js from "log4js";

log4js.configure({
  appenders: {
    console: { type: "console" },
    file: { type: "file", filename: "logs/app.log" },
  },
  categories: {
    default: { appenders: ["console"], level: "info" },
    http: { appenders: ["console"], level: "info" },
  },
});

export const logger = log4js.getLogger();
export const httpLogger = log4js.getLogger("http");
