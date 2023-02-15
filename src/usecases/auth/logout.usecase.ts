export class LogoutUseCases {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  async execute(): Promise<string[]> {
    return ['auth-cookie=; Path=/; HttpOnly'];
  }
}
