export interface TokenPayload {
  sub: string;
  email: string;
  type: 'access' | 'refresh';
  jti?: string;
  iat?: number;
  exp?: number;
}
