import prisma from "../prisma";
import { LoginType } from "@prisma/client";

export const getUsers = async () => {
  return await prisma.user.findMany();
};

interface OAuthUserData {
  name: string;
  email?: string; // 이메일은 선택적
  provider: LoginType;
  socialId: string; // OAuth 제공자의 고유 ID
}

export const findUserBySocialId = async (
  provider: LoginType,
  socialId: string
) => {
  return await prisma.user.findFirst({
    where: {
      loginProvider: {
        loginType: provider,
        socialId: socialId,
      },
    },
    include: {
      loginProvider: true,
    },
  });
};

export const createUser = async (userData: OAuthUserData) => {
  return await prisma.user.create({
    data: {
      name: userData.name,
      loginProvider: {
        create: {
          email: userData.email, // 이메일이 없을 수 있음
          loginType: userData.provider,
          socialId: userData.socialId, // OAuth 제공자의 고유 ID 저장
        },
      },
    },
    include: {
      loginProvider: true,
    },
  });
};

// OAuth 로그인/회원가입 처리
export async function handleOAuthLogin(userData: OAuthUserData) {
  // socialId로 기존 사용자 확인
  const existingUser = await findUserBySocialId(
    userData.provider,
    userData.socialId
  );
  if (existingUser) {
    return existingUser;
  }

  // 새 사용자 생성
  return await createUser(userData);
}

// OAuth 콜백 처리 함수
export const handleGoogleCallback = async (authCode: string) => {
  // 1. 인증 코드로 액세스 토큰 받기
  const tokenResponse = await getGoogleAccessToken(authCode);

  // 2. 액세스 토큰으로 유저 정보 받기
  const googleUser = await getGoogleUserInfo(tokenResponse.access_token);

  // 3. 받아온 정보로 로그인/회원가입 처리
  const user = await handleOAuthLogin({
    name: googleUser.name,
    email: googleUser.email,
    provider: "GOOGLE",
    socialId: googleUser.id,
  });

  return user;
};

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

const getGoogleAccessToken = async (
  code: string
): Promise<GoogleTokenResponse> => {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
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

const getGoogleUserInfo = async (
  accessToken: string
): Promise<GoogleUserInfo> => {
  const response = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.json();
};
