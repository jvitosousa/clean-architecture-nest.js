export interface InterfaceAws {
  sendEmail(toAddress: string, subject: string, body: string): Promise<void>;
}
