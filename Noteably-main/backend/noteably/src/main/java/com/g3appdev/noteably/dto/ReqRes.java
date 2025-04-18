package com.g3appdev.noteably.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import com.g3appdev.noteably.Entity.StudentEntity;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class ReqRes{

    private int statusCode;
    private String error;
    private String token;
    private String refreshToken;
    private String expireationTime;
    private String studentId;
    private String name;
    private String course;
    private String contactNumber;
    private String email;
    private String password;
    private String profilePicture;
    private StudentEntity studententity;
    private List<StudentEntity> studententityList;


}
