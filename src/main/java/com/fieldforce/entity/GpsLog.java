package com.fieldforce.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "gps_logs")
@Data
@NoArgsConstructor
public class GpsLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long gpsId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(precision = 10, scale = 7)
    private Double latitude;

    @Column(precision = 10, scale = 7)
    private Double longitude;

    private Float accuracy;

    private LocalDateTime recordedAt = LocalDateTime.now();
}
