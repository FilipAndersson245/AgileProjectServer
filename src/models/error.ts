type GantDoesNotExistMessage = "Gantry doesn't exist.";
type UnauthorizationMessage = "You are unauthorized to make this request.";

export type ErrorMessage = GantDoesNotExistMessage | UnauthorizationMessage;

export interface IErrorResponse {
  readonly error: ErrorMessage;
}

export const unauthorizationMessage: UnauthorizationMessage =
  "You are unauthorized to make this request.";

export const unauthorizationResponse: IErrorResponse = {
  error: unauthorizationMessage
};

export const gantryDoesNotExistMessage: GantDoesNotExistMessage =
  "Gantry doesn't exist.";

export const gantryDoesNotExistResponse: IErrorResponse = {
  error: gantryDoesNotExistMessage
};
