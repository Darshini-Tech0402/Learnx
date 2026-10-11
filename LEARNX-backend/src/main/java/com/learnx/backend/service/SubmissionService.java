package com.learnx.backend.service;

import com.learnx.backend.common.NotFoundException;
import com.learnx.backend.dto.ApiDtos.*;
import com.learnx.backend.model.Assignment;
import com.learnx.backend.model.Submission;
import com.learnx.backend.repository.AssignmentRepository;
import com.learnx.backend.repository.StudentRepository;
import com.learnx.backend.repository.SubmissionRepository;
import com.learnx.backend.storage.FileStorageService;
import com.learnx.backend.storage.FileStorageService.Download;
import com.learnx.backend.storage.FileStorageService.StoredFile;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.ZoneId;
import java.util.List;

@Service
@Transactional
public class SubmissionService {

    private static final String FOLDER = "submissions";
    private static final ZoneId ZONE = ZoneId.of("Asia/Kolkata");

    private final AssignmentRepository assignments;
    private final SubmissionRepository submissions;
    private final StudentRepository students;
    private final FileStorageService storage;

    public SubmissionService(AssignmentRepository assignments, SubmissionRepository submissions,
                             StudentRepository students, FileStorageService storage) {
        this.assignments = assignments;
        this.submissions = submissions;
        this.students = students;
        this.storage = storage;
    }

    @Transactional(readOnly = true)
    public List<AssignmentDto> assignments() {
        return assignments.findAllByOrderByDueAtAsc().stream()
                .map(a -> new AssignmentDto(a.getId(), a.getCourse().getCode(), a.getTitle(),
                        a.getTopic(), a.getDueAt()))
                .toList();
    }

    public SubmissionDto submit(Long assignmentId, String rollNo, MultipartFile file) {
        Assignment a = assignments.findById(assignmentId)
                .orElseThrow(() -> new NotFoundException("Assignment " + assignmentId + " not found"));
        students.findByRollNo(rollNo)
                .orElseThrow(() -> new NotFoundException("Student " + rollNo + " not found"));

        // Validate the file before saving the record, so a rejected upload leaves nothing behind
        StoredFile stored = storage.store(file, FOLDER);

        int version = submissions.findFirstByAssignmentIdAndRollNoOrderByVersionDesc(assignmentId, rollNo)
                .map(s -> s.getVersion() + 1)
                .orElse(1);

        return toDto(submissions.save(new Submission(a, rollNo, stored, version)));
    }

    @Transactional(readOnly = true)
    public List<SubmissionDto> list(Long assignmentId, String rollNo) {
        List<Submission> found;
        if (assignmentId != null) {
            found = submissions.findByAssignmentIdOrderByRollNoAscVersionDesc(assignmentId);
        } else if (rollNo != null) {
            found = submissions.findByRollNoOrderBySubmittedAtDesc(rollNo);
        } else {
            found = submissions.findAllByOrderBySubmittedAtDesc();
        }
        return found.stream().map(SubmissionService::toDto).toList();
    }

    @Transactional(readOnly = true)
    public Download download(Long id) {
        Submission s = find(id);
        return storage.open(FOLDER, s.getStoredName(), s.getOriginalName(), s.getContentType());
    }

    public void delete(Long id) {
        Submission s = find(id);
        String stored = s.getStoredName();
        submissions.delete(s);
        storage.delete(FOLDER, stored);
    }

    private Submission find(Long id) {
        return submissions.findById(id)
                .orElseThrow(() -> new NotFoundException("Submission " + id + " not found"));
    }

    private static SubmissionDto toDto(Submission s) {
        boolean late = s.getSubmittedAt()
                .isAfter(s.getAssignment().getDueAt().atZone(ZONE).toInstant());
        return new SubmissionDto(s.getId(), s.getAssignment().getId(), s.getRollNo(), s.getOriginalName(),
                s.getSizeBytes(), s.getVersion(), s.getSubmittedAt(), late);
    }
}