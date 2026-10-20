package com.pawpulse.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DashboardData {
    // KPI Cards
    private Long consultations30d;
    private Double consultationsChange; // % change vs previous period
    private Double avgReferralTatHours;
    private Double rxCompliancePct;
    private Double repeatVisitRate;
    private Double noShowRate;
    private BigDecimal revenue30d;
    private Double revenueChange;

    // Charts
    private List<DailyConsult> dailyConsultations;
    private List<ServiceTypeCount> byServiceType;
    private List<SpeciesMix> speciesMix;
    private List<ClinicTat> referralTatByClinic;
    private List<WeeklyCompliance> rxComplianceByWeek;

    // Extra KPIs requested
    private List<TopVet> topPerformingVets;
    private List<TopClinic> bestPerformingClinics;
    private List<LocationCount> petParentsByLocation;
    private List<ServiceTypeCount> mostSoldServices;
    private Map<String, Long> petCountBySpecies;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class DailyConsult {
        private String date;
        private Long count;
        private Double movingAvg;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ServiceTypeCount {
        private String serviceType;
        private Long count;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class SpeciesMix {
        private String species;
        private Long count;
        private Double percentage;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ClinicTat {
        private String clinicName;
        private Double avgTatHours;
        private boolean breached; // > 4 hours target
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class WeeklyCompliance {
        private String week;
        private Double compliancePct;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class TopVet {
        private String name;
        private String specialization;
        private Double rating;
        private Long consultCount;
        private String clinicName;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class TopClinic {
        private String name;
        private Long consultCount;
        private BigDecimal revenue;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class LocationCount {
        private String city;
        private Long count;
    }
}
