import api from "./axios";

// 게시판 리스트 조회
export const reqGetForumList = async (moimId) => {
  return await api.get(`/api/moims/${moimId}/forums`);
};

// 게시판 글 작성
export const reqRegisterForum = (moimId, formData) => {
  return api.post(`/api/moims/${moimId}/register`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};