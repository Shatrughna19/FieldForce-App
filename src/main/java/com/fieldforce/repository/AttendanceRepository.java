package com.fieldforce.repository;

import com.fieldforce.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByUser_UserIdAndCheckInTimeBetween(Long userId, LocalDateTime start, LocalDateTime end);
}
