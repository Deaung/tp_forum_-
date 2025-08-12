import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { reqGetForumList, reqRegisterForum } from "../../../api/forumApi";

function ForumListPage() {
  const { moimId } = useParams();
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

useEffect(() => {
  console.log("📌 게시판 생성 페이지 렌더링됨");
}, []);

  useEffect(() => {
    fetchForums();
  }, [moimId]);

  const fetchForums = async () => {
    setLoading(true);
    try {
      const response = await reqGetForumList(moimId);
      setForums(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("게시판 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("forumComment", content);
    if (file) {
      formData.append("forumImgPath", file);
    }

    try {
      await reqRegisterForum(moimId, formData);
      alert("게시글이 등록되었습니다.");
      setTitle("");
      setContent("");
      setFile(null);
      fetchForums();  // 목록 다시 불러오기
    } catch (err) {
      console.error(err);
      alert("게시글 등록에 실패했습니다.");
    }
  };

  if (loading) return <div>게시판을 불러오는 중입니다...</div>;

  return (
    <div>
      <h1>모임 게시판 목록</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <ul>
        {forums.length === 0 && <li>등록된 게시물이 없습니다.</li>}
        {forums.map((forum) => (
          <li key={forum.forumId}>{forum.title}</li>
        ))}
      </ul>

      <h2>게시글 작성</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>제목: </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>내용: </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div>
          <label>이미지: </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <button type="submit">글 등록</button>
      </form>
    </div>
  );
}

export default ForumListPage;
