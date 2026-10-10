package com.digitalgaon.dto;

public class AdminStatsDto {
    private long totalCitizens;
    private long totalComplaints;
    private long pendingComplaints;
    private long totalBusinesses;
    private long totalJobs;
    private long totalAnnouncements;
    private long totalMarketplaceListings;

    public AdminStatsDto() {}

    public AdminStatsDto(long totalCitizens, long totalComplaints, long pendingComplaints,
                         long totalBusinesses, long totalJobs, long totalAnnouncements, long totalMarketplaceListings) {
        this.totalCitizens = totalCitizens;
        this.totalComplaints = totalComplaints;
        this.pendingComplaints = pendingComplaints;
        this.totalBusinesses = totalBusinesses;
        this.totalJobs = totalJobs;
        this.totalAnnouncements = totalAnnouncements;
        this.totalMarketplaceListings = totalMarketplaceListings;
    }

    public long getTotalCitizens() { return totalCitizens; }
    public void setTotalCitizens(long totalCitizens) { this.totalCitizens = totalCitizens; }

    public long getTotalComplaints() { return totalComplaints; }
    public void setTotalComplaints(long totalComplaints) { this.totalComplaints = totalComplaints; }

    public long getPendingComplaints() { return pendingComplaints; }
    public void setPendingComplaints(long pendingComplaints) { this.pendingComplaints = pendingComplaints; }

    public long getTotalBusinesses() { return totalBusinesses; }
    public void setTotalBusinesses(long totalBusinesses) { this.totalBusinesses = totalBusinesses; }

    public long getTotalJobs() { return totalJobs; }
    public void setTotalJobs(long totalJobs) { this.totalJobs = totalJobs; }

    public long getTotalAnnouncements() { return totalAnnouncements; }
    public void setTotalAnnouncements(long totalAnnouncements) { this.totalAnnouncements = totalAnnouncements; }

    public long getTotalMarketplaceListings() { return totalMarketplaceListings; }
    public void setTotalMarketplaceListings(long totalMarketplaceListings) { this.totalMarketplaceListings = totalMarketplaceListings; }
}
