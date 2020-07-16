package com.darkshadow.app.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.darkshadow.app.dto.UsersDTO;

@Repository
public interface UserJpaRepository extends JpaRepository<UsersDTO, Long>{

	UsersDTO findByEmail(String email);
	@Query(value = "SELECT * from users where email = ?1 and password = ?2", nativeQuery = true)
	UsersDTO findByEmailPassword(String email, String password);
}
