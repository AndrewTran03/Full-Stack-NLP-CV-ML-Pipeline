import { AppConfig, parseBool } from "./types";

console.log(process.env["NODE_ENV"]);
console.log(process.env["BACKEND_PORT"]);
console.log(process.env["FRONTEND_PORT"]);

// Necessary Back-End Configuration Properties (using NPM "config")
const config: AppConfig = {
  backendServerPort: parseInt(`${process.env.BACKEND_PORT}`),
  backendServerUrl: `http://localhost:${process.env.BACKEND_PORT}`,
  frontendClientPort: parseInt(`${process.env.FRONTEND_PORT}`),
  frontendClientUrl: `http://localhost:${process.env.FRONTEND_PORT}`,
  loglevel: "trace"
};

console.log(parseBool("true"));

export default config;
