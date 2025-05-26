export class ErrorWithClientMessage extends Error {
  code;
  constructor(message: string) {
    super(message);
    this.name = "ErrorWithClientMessage";
    this.code = "CLIENT_MESSAGE_ERROR";
  }
}
