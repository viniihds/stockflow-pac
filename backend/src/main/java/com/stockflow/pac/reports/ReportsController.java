package com.stockflow.pac.reports;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import static com.stockflow.pac.reports.ReportsDTOs.*;

@RestController
@RequestMapping("/api/reports")
public class ReportsController {

    private final ReportsService service;

    public ReportsController(ReportsService service) {
        this.service = service;
    }

    @GetMapping
    public List<Response> list() {
        return service.list().stream().map(Response::fromEntity).collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<Response> create(@RequestBody Create body) {
        var saved = service.create(body);
        return ResponseEntity.status(HttpStatus.CREATED).body(Response.fromEntity(saved));
    }
}
