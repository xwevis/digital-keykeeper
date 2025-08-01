import jwt from 'jsonwebtoken';

const JWT_SECRET = 'brankas-digital-secret-key-2024'; // In production, use env variable
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

export interface TokenPayload {
  userId: string;
  username: string;
  email: string;
  type: 'access' | 'refresh';
}

export const generateTokens = (userId: string, username: string, email: string) => {
  const accessToken = jwt.sign(
    { userId, username, email, type: 'access' },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

  const refreshToken = jwt.sign(
    { userId, username, email, type: 'refresh' },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

  return { accessToken, refreshToken };
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwt.decode(token) as any;
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};

export const refreshAccessToken = (refreshToken: string): string | null => {
  const payload = verifyToken(refreshToken);
  
  if (!payload || payload.type !== 'refresh') {
    return null;
  }

  const newAccessToken = jwt.sign(
    { 
      userId: payload.userId, 
      username: payload.username, 
      email: payload.email, 
      type: 'access' 
    },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

  return newAccessToken;
};