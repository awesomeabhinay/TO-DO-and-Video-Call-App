package com.darkshadow.app.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.darkshadow.app.dto.TodoDTO;

@Repository
public interface TodoJpaRepository extends JpaRepository<TodoDTO, Long> {
	
	@Query(value = "SELECT * FROM todo WHERE user_id = ?1" , nativeQuery = true)
	List<TodoDTO> findByUserId(long userId);
}
