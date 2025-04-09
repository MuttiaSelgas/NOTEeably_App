package com.g3appdev.noteably.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.g3appdev.noteably.Entity.FolderEntity;


public interface FolderRepository extends JpaRepository<FolderEntity, Integer> {
     List<FolderEntity> findByStudentId(int studentId);
}
