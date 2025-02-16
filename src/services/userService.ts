import prisma from "../prisma";

export const getUsers = async () => {
  return await prisma.user.findMany();
};

export const createUser = async (name: string, email: string) => {
  return await prisma.user.create({
    data: { name, email },
  });
};
