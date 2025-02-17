import { handleOAuthLogin } from "./userService";
import jwt from "jsonwebtoken";

interface GoogleTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

interface TokenPayload {
  userId: number;
  email?: string; // optional field (string | undefined)
}

export const getGoogleAccessToken = async (
  code: string
): Promise<GoogleTokenResponse> => {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      grant_type: "authorization_code",
    }),
  });

  return response.json();
};

export const getGoogleUserInfo = async (
  accessToken: string
): Promise<GoogleUserInfo> => {
  const response = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  return response.json();
};

export const handleGoogleCallback = async (authCode: string) => {
  const tokenResponse = await getGoogleAccessToken(authCode);
  const googleUser = await getGoogleUserInfo(tokenResponse.access_token);

  return await handleOAuthLogin({
    name: googleUser.name,
    email: googleUser.email,
    provider: "GOOGLE",
    socialId: googleUser.id,
  });
};

// 토큰 생성
export const generateToken = (payload: TokenPayload) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "1d", // 토큰 만료 시간
  });
};

// 토큰 검증
export const verifyToken = async (token: string): Promise<TokenPayload> => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
};
