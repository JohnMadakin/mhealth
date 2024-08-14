interface ResponseObject<T = unknown> {
  success: boolean;
  message: string;
  data?: T | null | unknown;
  errors?: Error[];
}

abstract class BaseResponseObject implements ResponseObject {
  success: boolean;
  message: string;

  constructor(success: boolean, message: string) {
    this.success = success;
    this.message = message;
  }
}

export class SuccessResponse<T> extends BaseResponseObject {
  data: T;

  constructor(message: string, data: any) {
      super(true, message);
      this.data = data;
  }
}

export class ErrorResponse extends BaseResponseObject {
  errorCode: number;

  constructor(message: string, errorCode: number) {
      super(false, message); // success is always false for errors
      this.errorCode = errorCode;
  }
}
