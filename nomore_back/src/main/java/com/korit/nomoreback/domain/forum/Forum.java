package com.korit.nomoreback.domain.forum;

import com.korit.nomoreback.domain.moim.Moim;
import com.korit.nomoreback.domain.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Forum {
    private Integer forumId;
    private String forumTitle;
    private String forumContent;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;


    private Moim moim;
    private ForumCategory forumCategory;
    private User user;
    private List<ForumImg> forumImgList;

}
