package com.fieldforce.repository;

import com.fieldforce.entity.GpsLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GpsLogRepository extends JpaRepository<GpsLog, Long> {
}
