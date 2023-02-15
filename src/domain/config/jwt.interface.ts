export interface JWTConfig {
  getSecret(): string;
  getExpirationTime(): string;
}
