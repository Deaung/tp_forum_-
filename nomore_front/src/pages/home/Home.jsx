import React, { useEffect } from 'react';
import useCategoryQuery from '../../queries/useCategoryQuery';
import usePrincipalQuery from '../../queries/usePrincipalQuery';
import Loading from '../../Loading/Loading';
import useMoimQuery from '../../queries/useMoimQuery';
import { useNavigate } from 'react-router-dom';
import { baseURL } from '../../api/axios';
/** @jsxImportSource @emotion/react */
import * as s from './styles';

function Home(props) {

    const navigate = useNavigate();
    const categoryQuery = useCategoryQuery();
    const categoryList = categoryQuery?.data?.data;
    const moimQuery = useMoimQuery();
    const moimList = moimQuery?.data?.data;

    const handleMoimOnClick = (moimId) => {
        navigate(`/suggest/description?moimId=${moimId}`);
    }

    return (
            <div css={s.containerStyle}>
                {categoryList?.map((category) => {
                    const filteredMoims = moimList?.filter(moim => moim.categoryId === category.categoryId) || [];

                    return (
                        <div key={category.categoryId} css={s.categoryContainerStyle}>
                            <div css={s.categoryHeaderStyle}>
                                {category.categoryEmoji} {category.categoryName}
                            </div>
                            <div>
                                {filteredMoims.length === 0 ? (
                                    <div css={s.noMoimStyle}>
                                        <div className="icon">📭</div>
                                        <h3>해당 카테고리에 맞는 모임이 없습니다.</h3>
                                        <p>새로운 모임이 곧 추가될 예정입니다.</p>
                                    </div>
                                ) : (
                                    <ul css={s.gridContainerStyle}>
                                        {filteredMoims.map((moim) => {
                                            // 필드명 수정
                                            const isAvailable = moim.memberCount < moim.maxMember;
                                            const hasImage = moim.moimImgPath && moim.moimImgPath !== '';
                                            const imageUrl = hasImage ? `${baseURL}/image${moim.moimImgPath}` : null;
                                            const moimCategory = categoryList.find(category => category.categoryId === moim.categoryId);

                                            return (
                                                <li key={moim.moimId} css={s.moimCardStyle} onClick={() => handleMoimOnClick(moim.moimId)}>
                                                    {hasImage ? (
                                                        <div css={s.imageStyle}>
                                                            <img
                                                                src={imageUrl}
                                                                alt={moim.title}
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                    e.target.parentElement.innerHTML = `
                                                                        <div style="
                                                                            width: 100%;
                                                                            height: 100%;
                                                                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                                                            display: flex;
                                                                            align-items: center;
                                                                            justify-content: center;
                                                                            color: white;
                                                                            font-size: 18px;
                                                                            font-weight: bold;
                                                                        ">
                                                                            ${moim.title}
                                                                        </div>
                                                                    `;
                                                                }}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div css={s.defaultImageStyle}>
                                                            {moim.title}
                                                        </div>
                                                    )}

                                                    <div css={s.contentStyle}>
                                                        <h3 css={s.titleStyle}>{moim.title}</h3>

                                                        <p css={s.descriptionStyle}>
                                                            {moim.discription || '모임에 대한 자세한 설명이 곧 업데이트됩니다.'}
                                                        </p>

                                                        <div css={s.tagsStyle}>
                                                            <span css={s.locationTagStyle}>{moim.districtName}</span>
                                                            <span css={s.categoryTagStyle}>{moimCategory.categoryEmoji} {moimCategory.categoryName}</span>
                                                        </div>

                                                        <div css={s.memberInfoStyle}>
                                                            <div css={s.memberCountStyle}>
                                                                👥 <span className="current">{moim.memberCount}</span>
                                                                <span> / </span>
                                                                <span className="total">{moim.maxMember}명</span>
                                                            </div>

                                                            <div css={s.statusBadgeStyle} className={isAvailable ? 'available' : 'full'}>
                                                                {isAvailable ? '모집중' : '모집완료'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

export default Home;