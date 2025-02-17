import { handleOAuthLogin } from "./userService";

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
