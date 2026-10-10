package com.digitalgaon.service;

import com.digitalgaon.model.Job;
import com.digitalgaon.repository.JobRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class JobService {

    private final JobRepository jobRepository;

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    public List<Job> getActiveJobs() {
        return jobRepository.findByStatusOrderByCreatedAtDesc("ACTIVE");
    }

    public List<Job> getJobsByType(String employmentType) {
        return jobRepository.findByEmploymentTypeIgnoreCaseAndStatus(employmentType, "ACTIVE");
    }

    public Optional<Job> getJobById(UUID id) {
        return jobRepository.findById(id);
    }

    public Optional<Job> getJobBySlug(String slug) {
        return jobRepository.findBySlug(slug);
    }

    @Transactional
    public Job createJob(com.digitalgaon.dto.JobRequest req) {
        Job job = new Job();
        job.setTitle(req.getTitle());
        String slug = req.getTitle().toLowerCase().replaceAll("[^a-z0-9]+", "-") + "-" + System.currentTimeMillis() % 10000;
        job.setSlug(slug);
        job.setEmployerName(req.getEmployerName());
        job.setEmploymentType(req.getEmploymentType());
        job.setSalaryRange(req.getSalaryRange() != null ? req.getSalaryRange() : "Daily / Weekly");
        job.setLocation(req.getLocation() != null ? req.getLocation() : "Asgaon");
        job.setDescription(req.getDescription());
        job.setRequirements(req.getRequirements());
        job.setContactPhone(req.getContactPhone());
        job.setStatus("ACTIVE");
        job.setExpiresAt(req.getExpiresAt());
        job.setCreatedAt(java.time.OffsetDateTime.now());

        return jobRepository.save(job);
    }

    @Transactional
    public Job saveJob(Job job) {
        return jobRepository.save(job);
    }
}
