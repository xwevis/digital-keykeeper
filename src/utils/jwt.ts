import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode('brankas-digital-secret-key-2024');
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

export interface TokenPayload {
  userId: string;
  username: string;
  email: string;
  type: 'access' | 'refresh';
}

export const generateTokens = async (userId: string, username: string, email: string) => {
  const accessToken = await new SignJWT({ userId, username, email, type: 'access' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(JWT_SECRET);

  const refreshToken = await new SignJWT({ userId, username, email, type: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .sign(JWT_SECRET);

  return { accessToken, refreshToken };
};

export const verifyToken = async (token: string): Promise<TokenPayload | null> => {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as string,
      username: payload.username as string,
      email: payload.email as string,
      type: payload.type as 'access' | 'refresh'
    };
  } catch (error) {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    
    const payload = JSON.parse(atob(parts[1]));
    if (!payload.exp) return true;
    
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch {
    return true;
  }
};

export const refreshAccessToken = async (refreshToken: string): Promise<string | null> => {
  const payload = await verifyToken(refreshToken);
  
  if (!payload || payload.type !== 'refresh') {
    return null;
  }

  const newAccessToken = await new SignJWT({ 
    userId: payload.userId, 
    username: payload.username, 
    email: payload.email, 
    type: 'access' 
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(JWT_SECRET);

  return newAccessToken;
};