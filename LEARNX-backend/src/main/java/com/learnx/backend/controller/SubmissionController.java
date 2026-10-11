package com.learnx.backend.controller;

import com.learnx.backend.dto.ApiDtos.*;
import com.learnx.backend.service.SubmissionService;
import com.learnx.backend.storage.FileStorageService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SubmissionController {

    private final SubmissionService submissions;

    public SubmissionController(SubmissionService submissions) {
        this.submissions = submissions;
    }

    @GetMapping("/assignments")
    public List<AssignmentDto> assignments() {
        return submissions.assignments();
    }

    @PostMapping(value = "/assignments/{id}/submissions", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public SubmissionDto submit(@PathVariable Long id,
                                @RequestParam String rollNo,
                                @RequestParam("file") MultipartFile file) {
        return submissions.submit(id, rollNo, file);
    }

    // Faculty: by assignment (tracker) or by student; no filter returns everything
    @GetMapping("/submissions")
    public List<SubmissionDto> list(@RequestParam(required = false) Long assignmentId,
                                    @RequestParam(required = false) String rollNo) {
        return submissions.list(assignmentId, rollNo);
    }

    @GetMapping("/submissions/{id}/file")
    public ResponseEntity<Resource> file(@PathVariable Long id,
                                         @RequestParam(defaultValue = "false") boolean inline) {
        return FileStorageService.respond(submissions.download(id), inline);
    }

    @DeleteMapping("/submissions/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        submissions.delete(id);
    }
}