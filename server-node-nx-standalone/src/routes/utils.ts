type SuccessMessage = {
  message: string;
};

/**
 *  Returns a standarized JSON object for a successful message.
 */
export function onSuccessMsg(msg: string): SuccessMessage {
  return { message: msg };
}

type ErrMessage = {
  error: string;
};

/**
 *  Returns a standarized JSON object for a error message.
 */
export function onErrorMsg(err: Error): ErrMessage {
  return { error: err.message };
}

/* HTTP Status Codes */
export const HTTP_STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  IM_A_TEAPOT: 418,
  INTERNAL_SERVER_ERROR: 500
} as const;
