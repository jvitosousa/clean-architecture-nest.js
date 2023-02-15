export interface InterfaceJwtServicePayload {
  username: string;
}

export interface InterfaceJwtService {
  checkToken(token: string): Promise<any>;
  createToken(payload: InterfaceJwtServicePayload): Promise<string>;
}
