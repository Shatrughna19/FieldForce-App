package com.fieldforce.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance")
@Data
@NoArgsConstructor
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long attendanceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDateTime checkInTime;

    private LocalDateTime checkOutTime;

    @Column(precision = 10, scale = 7)
    private Double checkInLat;

    @Column(precision = 10, scale = 7)
    private Double checkInLng;

    @Column(precision = 10, scale = 7)
    private Double checkOutLat;

    @Column(precision = 10, scale = 7)
    private Double checkOutLng;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private AttendanceStatus status = AttendanceStatus.PRESENT;

    @Column(length = 255)
    private String hashSignature;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum AttendanceStatus {
        PRESENT, ABSENT, HALF_DAY
    }
}
