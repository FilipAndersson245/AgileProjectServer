type GantDoesNotExistMessage = "Gantry doesn't exist.";
type UnauthorizationMessage = "You are unauthorized to make this request.";
type BadRequestMessage = "Some parameter(s) were wrong or not provided.";

export type ErrorMessage =
  | GantDoesNotExistMessage
  | UnauthorizationMessage
  | BadRequestMessage;

export interface IErrorResponse {
  readonly error: ErrorMessage;
}

export const unauthorizationMessage: UnauthorizationMessage =
  "You are unauthorized to make this request.";

export const gantryDoesNotExistMessage: GantDoesNotExistMessage =
  "Gantry doesn't exist.";

export const badRequestMessage: BadRequestMessage =
  "Some parameter(s) were wrong or not provided.";

export const unauthorizationResponse: IErrorResponse = {
  error: unauthorizationMessage
};

export const gantryDoesNotExistResponse: IErrorResponse = {
  error: gantryDoesNotExistMessage
};

export const badRequestResponse: IErrorResponse = {
  error: badRequestMessage
};
