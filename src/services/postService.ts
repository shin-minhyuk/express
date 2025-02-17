import prisma from "../prisma";

interface CreatePostData {
  title: string;
  content: string;
  authorId: number;
}

export const createPost = async ({
  title,
  content,
  authorId,
}: CreatePostData) => {
  return await prisma.post.create({
    data: {
      title,
      content,
      authorId,
    },
  });
};
