import prisma from "../prisma";

interface CreatePostData {
  title: string;
  content: string;
  userId: number;
}

export const createPost = async ({
  title,
  content,
  userId,
}: CreatePostData) => {
  return await prisma.post.create({
    data: {
      title,
      content,
      userId,
    },
  });
};
