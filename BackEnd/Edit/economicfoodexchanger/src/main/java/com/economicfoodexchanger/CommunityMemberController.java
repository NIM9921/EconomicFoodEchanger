package com.economicfoodexchanger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/communityMember")
public class CommunityMemberController {

    @Autowired
    CommunityMemberDao communityMemberDao;

    @GetMapping
    public List<CommunityMember> getAllCommunityMembers() {
        return communityMemberDao.findAll();
    }
}
