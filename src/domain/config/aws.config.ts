export interface InterfaceAwsConfig {
  getSecretAws(): string;
  getAccessKeyId(): string;
  getRegion(): string;
  getSendGridApiKey(): string;
}
