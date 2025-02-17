import prisma from "../prisma";

export const getUsers = async () => {
  return await prisma.user.findMany();
};

type OAuthProvider = "GOOGLE" | "KAKAO";

interface OAuthUserData {
  name: string;
  email?: string; // 이메일은 선택적
  provider: OAuthProvider;
  socialId: string; // OAuth 제공자의 고유 ID
}

export const findUserBySocialId = async (
  provider: OAuthProvider,
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
          email: userData.email || "", // 이메일이 없을 수 있음
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
async function handleOAuthLogin(userData: OAuthUserData) {
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
