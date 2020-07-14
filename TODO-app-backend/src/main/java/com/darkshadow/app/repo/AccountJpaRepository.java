package com.darkshadow.app.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.darkshadow.app.dto.AccountDTO;

@Repository
public interface AccountJpaRepository extends JpaRepository<AccountDTO, Long>{
	@Query(value = "SELECT * FROM accounts WHERE acc_user_id = ?1" , nativeQuery = true)
	List<AccountDTO> findByUserId(long userId);
}
