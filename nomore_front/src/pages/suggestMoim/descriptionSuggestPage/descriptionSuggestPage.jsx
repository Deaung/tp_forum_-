/** @jsxImportSource @emotion/react */
import * as s from './styles.js';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { reqJoinMoim, reqSelectMoim ,reqRegisterForum } from '../../../api/moimApi'; // reqRegisterForum 추가
import useCategoryQuery from '../../../queries/useCategoryQuery.jsx';
import { IoChatbubbleEllipsesOutline, IoClipboard } from 'react-icons/io5';
import { RiHome7Fill } from 'react-icons/ri';

function DescriptionSuggestPage(props) {
  const [searchParam] = useSearchParams();
  const moimId = searchParam.get("moimId");
  const navigate = useNavigate();

  const [moim, setMoim] = useState("");
  const categoryQuery = useCategoryQuery();
  const categories = categoryQuery?.data?.data || [];
  const getCategory = categories.find(category => category.categoryId === moim.categoryId);

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

// 미리 고정된 카테고리 목록 (DB에서 받아오면 더 좋음)
const fixedCategories = [
  { categoryId: 1, categoryName: "공지" },
  { categoryId: 2, categoryName: "모임후기" },
  { categoryId: 3, categoryName: "가입인사" },
  { categoryId: 4, categoryName: "자유" },
  { categoryId: 5, categoryName: "투표" },
];

  reqRegisterForum
  // 게시판 등록용 상태들
  const [forumTitle, setForumTitle] = useState("");
  const [forumContent, setForumContent] = useState("");
  const [forumImgFile, setForumImgFile] = useState(null);

  useEffect(() => {
    const fetchMoim = async () => {
      try {
        const response = await reqSelectMoim(moimId);
        setMoim(response.data);
      } catch (err) {
        console.error("모임 정보를 불러오는 데 실패했습니다.", err);
      }
    };

    if (moimId) {
      fetchMoim();
    }
  }, [moimId]);

  const handleGoToForum = () => {
    navigate(`/forums/${moimId}`);
    console.log("📌 게시판 페이지 이동");
  };

  const handleJoinMoimOnClick = () => {
    reqJoinMoim(moimId)
      .then(() => alert("모임 가입 성공!"))
      .catch(() => alert("모임 가입 실패!"));
  };

  // 게시판 등록 버튼 클릭 핸들러
  const handleRegisterForum = () => {
  if (!forumTitle || !forumContent) {
    alert("제목과 내용을 모두 입력해주세요.");
    return;
  }

  if (!selectedCategoryId) {
    alert("카테고리를 선택해주세요.");
    return;
  }

  const formData = new FormData();
  formData.append("forumTitle", forumTitle);
  formData.append("forumContent", forumContent);
  if (forumImgFile) {
    formData.append("forumImgPath", forumImgFile);
  }
  formData.append("moimId", moimId);
  formData.append("categoryId", selectedCategoryId);  // categoryId 꼭 추가

  reqRegisterForum(moimId, formData)
    .then(() => {
      alert("게시판 등록 성공!");
      navigate(`/forums/${moimId}`);
    })
    .catch(err => {
      console.error("게시판 등록 실패", err);
      alert("게시판 등록에 실패했습니다.");
    });
};

  return (
    <div css={s.container}>
      <div css={s.header}>
        <button css={s.homeButton}><RiHome7Fill />Home</button>
        <button css={s.headerButton} onClick={handleGoToForum}><IoClipboard />게시판</button>
        <button css={s.headerButton}><IoChatbubbleEllipsesOutline />채팅</button>
      </div>

      <div css={s.mainContent}>
        <div css={s.moimInfo}>
          <img src={`http://localhost:8080/image${moim.moimImgPath}`} alt="모임 썸네일" />
          <div css={s.moimTextInfo}>
            <h1 css={s.moimTitle}>{moim.title}</h1>
            <div css={s.moimMeta}>
              <span>{getCategory?.categoryEmoji}{getCategory?.categoryName}</span> · <span>{moim.districtName}</span> · <span>{moim.memberCount}/{moim.maxMember}</span>
            </div>
          </div>
        </div>

        <div css={s.section}>
          <h2 css={s.sectionTitle}>모임 소개</h2>
          <div css={s.description}>
            <p>{moim.discription}</p>
          </div>
        </div>

        <div css={s.section}>
          <h2 css={s.sectionTitle}>모임 멤버</h2>
          <div css={s.memberSection}>
            <div css={s.memberCard}>
              <div css={s.memberAvatar}>👑</div>
              <div css={s.memberInfo}>
                <span css={s.memberRole}>운영진</span>
                <span css={s.memberName}>모임장</span>
              </div>
            </div>
          </div>
        </div>

        {/* 게시판 등록 폼 추가 */}
        <div css={s.section}>
  <h2 css={s.sectionTitle}>게시판 등록</h2>

  <input
    type="text"
    placeholder="게시판 제목"
    value={forumTitle}
    onChange={e => setForumTitle(e.target.value)}
    css={s.inputField}
  />

  <textarea
    placeholder="내용을 입력하세요"
    value={forumContent}
    onChange={e => setForumContent(e.target.value)}
    css={s.textAreaField}
  />

  {/* 카테고리 선택 */}
  <select
    value={selectedCategoryId ?? ""}
    onChange={e => setSelectedCategoryId(Number(e.target.value))}
    css={s.selectField}
  >
    <option value="" disabled>카테고리를 선택하세요</option>
    {fixedCategories.map(category => (
      <option key={category.categoryId} value={category.categoryId}>
        {category.categoryName}
      </option>
    ))}
  </select>

  <input
    type="file"
    accept="image/*"
    onChange={e => setForumImgFile(e.target.files[0])}
    css={s.fileInput}
  />

  <button css={s.registerButton} onClick={handleRegisterForum}>게시판 등록</button>
</div>
      </div>

      <div css={s.bottomActions}>
        <button css={s.joinButton} onClick={handleJoinMoimOnClick}>
          모임 가입하기
        </button>
      </div>
    </div>
  );
}

export default DescriptionSuggestPage;
