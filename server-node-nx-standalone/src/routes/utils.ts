import QueryString from "qs";
import LOGGER from "../utils/logger";

/* HTTP Status Codes */
export const HTTP_STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  IM_A_TEAPOT: 418,
  UNPROCESSABLE_CONTENT: 422,
  INTERNAL_SERVER_ERROR: 500
} as const;

type SuccessMessage<T> = {
  response: T;
};

/**
 *  Returns a standarized JSON object for a successful message.
 */
export function onSuccessMsg<T = string>(msg: T): SuccessMessage<T> {
  return { response: msg };
}

type ErrMessage = {
  error: string;
};

/**
 *  Returns a standarized JSON object for a error message.
 */
export function onErrorMsg(errMsg: string): ErrMessage {
  return { error: new Error(errMsg).message };
}

export type QUERY_PARAM_STATE =
  | "NO QUERYING"
  | "INVALID QUERY - INCORRECT NUMBER OF ARGUMENTS"
  | "INVALID QUERY - UNEXPECTED PARAMETER"
  | "VALID QUERY";

/**
 * Checks if the Express Request object has the expected number of query parameters.
 */
export function getQueryParamStatus(
  queryObj: QueryString.ParsedQs,
  expectedQueryParams = new Set<string>()
): QUERY_PARAM_STATE {
  const numQueryParams = Object.keys(queryObj).length;
  const expectedNumQueryParams = expectedQueryParams.size;

  if (numQueryParams === 0) {
    return "NO QUERYING";
  } else if (numQueryParams !== expectedNumQueryParams) {
    LOGGER.error(
      `Expected ${expectedNumQueryParams} query parameters, but received ${numQueryParams}`
    );
    return "INVALID QUERY - INCORRECT NUMBER OF ARGUMENTS";
  }

  for (const key of Object.keys(queryObj)) {
    if (!expectedQueryParams.has(key)) {
      LOGGER.error(`Unexpected query parameter: ${key}`);
      return "INVALID QUERY - UNEXPECTED PARAMETER";
    }
  }
  return "VALID QUERY";
}
