import prisma from "../prisma";

interface CreateCommentData {
  content: string;
  postId: number;
  userId: number;
  parentId?: number; // 대댓글인 경우 부모 댓글 ID
}

const createComment = async (comment: CreateCommentData) => {
  const { content, postId, userId, parentId } = comment;

  // 게시글이 존재하는지 먼저 확인
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  // 부모 댓글이 존재하는지 확인 (대댓글인 경우)
  if (parentId) {
    const parentComment = await prisma.comment.findUnique({
      where: { id: parentId },
    });

    if (!parentComment) {
      throw new Error("Parent comment not found");
    }

    // 부모 댓글과 같은 postId인지 확인
    if (parentComment.postId !== postId) {
      throw new Error("Parent comment belongs to different post");
    }
  }

  // parentId가 없으면 일반 댓글, 있으면 대댓글로 생성
  const newComment = await prisma.comment.create({
    data: {
      content,
      postId,
      userId,
      parentId, // undefined면 일반 댓글, 값이 있으면 대댓글
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      replies: true, // 대댓글 목록도 함께 반환
    },
  });

  return newComment;
};

export default createComment;
