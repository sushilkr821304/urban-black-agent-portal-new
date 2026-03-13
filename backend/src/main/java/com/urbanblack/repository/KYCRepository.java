package com.urbanblack.repository;

import com.urbanblack.entity.KYC;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface KYCRepository extends JpaRepository<KYC, Long> {
    List<KYC> findByKycStatus(String kycStatus);
}
