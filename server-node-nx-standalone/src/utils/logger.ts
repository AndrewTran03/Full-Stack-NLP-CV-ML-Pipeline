import pino, { Logger } from "pino";
import dayjs from "dayjs";
import path from "path";
import fs from "fs";
import SonicBoom from "sonic-boom";

const level = "trace"; // Or through "config" # TODO: Later

const CURRENT_TIMESTAMP = dayjs().format("YYYY-MM-DD_HH-mm-ss");
const LOG_DIR = `logs`;
const CURR_LOG_FILE = path.join(
  process.cwd(),
  `${LOG_DIR}/server-${CURRENT_TIMESTAMP}.log`
);

// Define the log directory and ensure it exists
const LOG_DIRECTORY = path.join(process.cwd(), LOG_DIR);
if (!fs.existsSync(LOG_DIRECTORY)) {
  fs.mkdirSync(LOG_DIRECTORY);
}

/*
From Chat-GPT: 
For the logging library for Node.js called Pino, it has different log levels that 
represent the severity or importance of log messages. The log levels in Pino, in 
increasing order of severity, are:

- trace: Used for very detailed and fine-grained debugging information.
- debug: More detailed information than trace, typically used for debugging.
- info: General information about the application's state.
- warn: Indicates potential issues or situations that may need attention.
- error: Indicates errors that the application can recover from.
- fatal: Represents critical errors that lead to the termination of the application.
*/
const pinoFileStream = pino.transport({
  target: "pino/file",
  options: {
    destination: CURR_LOG_FILE
  }
});
const pinoConsoleStream = pino.transport({
  target: "pino-pretty",
  options: {
    colorize: true,
    translateTime: "yyyy-mm-dd HH:MM:ss",
    ignore: "pid,hostname"
  }
});

const LEVEL_STRINGS = {
  10: "TRACE",
  20: "DEBUG",
  30: "INFO",
  40: "WARN",
  50: "ERROR",
  60: "FATAL"
} as const;

type LoggerStream = {
  stream: SonicBoom;
};

const PINO_LOGGER_STREAMS: LoggerStream[] = [
  { stream: pinoFileStream },
  { stream: pinoConsoleStream }
];

// Function to extract line number from the stack trace
function getLineNumber(): string {
  const stackLine = new Error().stack?.split("\n")[3] ?? ""; // Adjust index if needed
  const match = stackLine.match(/:(\d+):\d+\)$/);
  return match ? match[1] : "<UNKNOWN>";
}

type LevelKey = keyof typeof LEVEL_STRINGS;

const LOGGER: Logger = pino(
  {
    level: level, // Minimum level to log
    base: null, // Remove default fields like pid and hostname
    timestamp: false, // Disable timestamp (as it is already included below)
    formatters: {
      level(_, number) {
        return { level: LEVEL_STRINGS[number as LevelKey] };
      }
    },
    hooks: {
      logMethod(inputArgs, method, level) {
        const [msg, ...args] = inputArgs;
        const lineNumber = getLineNumber();
        const levelString = LEVEL_STRINGS[level as LevelKey];
        const enhancedMessage = `[${dayjs().format(
          "YYYY-MM-DD HH:mm:ss"
        )}] LN#${lineNumber}: ${levelString} - ${msg}`;
        return method.apply(this, [enhancedMessage, ...args]);
      }
    }
  },
  pino.multistream(PINO_LOGGER_STREAMS) // Use multiple streams: Console and File
);

export default LOGGER;
