import { HANDOFF_ERROR_CODES, type HandoffErrorCode } from "../constants/handoffErrorCodes";
import { HANDOFF_ERROR_MESSAGES } from "../constants/handoffErrorMessages";

// service 层异常：携带错误码，由调用方（controller/页面）再次包装展示
export class HandoffServiceError extends Error {
  readonly code: HandoffErrorCode;
  constructor(code: HandoffErrorCode) {
    super(HANDOFF_ERROR_MESSAGES[code]);
    this.name = "HandoffServiceError";
    this.code = code;
  }
}

export function toServiceError(code: HandoffErrorCode): HandoffServiceError {
  return new HandoffServiceError(code);
}

export { HANDOFF_ERROR_CODES, HANDOFF_ERROR_MESSAGES };
