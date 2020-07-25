package com.darkshadow.app.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.darkshadow.app.dto.NotificationDTO;

@Repository
public interface NotificationRepository extends JpaRepository<NotificationDTO, Long>{
	@Query(value = "SELECT * FROM notifications WHERE reciever_id = ?1" , nativeQuery = true)
	List<NotificationDTO> findByUserId(long userId);
}
