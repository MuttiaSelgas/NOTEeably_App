package com.g3appdev.noteably.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.g3appdev.noteably.Entity.NoteEntity;

@Repository
public interface NoteRepository extends JpaRepository<NoteEntity, Integer> {
    public NoteEntity findByTitle(String title);
    
    @Query("SELECT n FROM NoteEntity n WHERE n.folder.folderId = :folderId")
    List<NoteEntity> findByFolder_FolderId(@Param("folderId") Integer folderId);
}
