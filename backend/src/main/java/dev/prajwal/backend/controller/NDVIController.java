package dev.prajwal.backend.controller;

import dev.prajwal.backend.model.NDVIResult;
import dev.prajwal.backend.model.NDVIResultDTO;
import dev.prajwal.backend.respository.NDVIResultRepo;
import dev.prajwal.backend.service.ImageStorageService;
import dev.prajwal.backend.service.ProcessingService;
import org.bson.types.Binary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/ndvi")
public class NDVIController {

    @Autowired
    private ImageStorageService storageService;

    @Autowired
    private ProcessingService processingService;

    @Autowired
    private NDVIResultRepo repo;

    @Value("${app.baseUrl}")
    private String baseUrl;

    @PostMapping("/process")
    public ResponseEntity<NDVIResultDTO> processImages(
            @RequestParam("title") String title,
            @RequestParam("redBand") MultipartFile redBand,
            @RequestParam("nirBand") MultipartFile nirBand
            )  throws IOException {

        NDVIResult result = processingService.processImages(redBand, nirBand, title);
        populateImageUrls(result);

        NDVIResultDTO resultDTO = convertToDTO(result);
        return ResponseEntity.ok(resultDTO);

    }

    @GetMapping("/results")
    public ResponseEntity<List<NDVIResultDTO>> getAllResults(){
        List<NDVIResult> results = repo.findAllByOrderByCreatedAtDesc();

        results.forEach(this::populateImageUrls);


        List<NDVIResultDTO> resultDTOS = results.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(resultDTOS);
    }

    @GetMapping("/results/{resultId}")
    public ResponseEntity<NDVIResultDTO> getResult(@PathVariable String resultId){
        NDVIResult result = repo.findById(new ObjectId(resultId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        populateImageUrls(result);

        NDVIResultDTO resultDTO = convertToDTO(result);
        return ResponseEntity.ok(resultDTO);
    }

    @GetMapping("/image/{resultId}/{type}")
    public ResponseEntity<Resource> displayImage(
            @PathVariable String resultId,
            @PathVariable String type
    ){
        NDVIResult result = repo.findById(new ObjectId(resultId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        Binary imageData = switch (type){
            case "red" -> result.getRedBandImage();
            case "nir" -> result.getNirBandImage();
            case "output" -> result.getOutputImage();
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        };

        Resource resource = (Resource) storageService.getImage(imageData);

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(resource);
    }

    private void populateImageUrls(NDVIResult result){
        if(result.getId() != null){
            String baseUriPath = baseUrl.isEmpty()
                    ? ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString()
                    : baseUrl;

            result.setRedBandUrl(baseUriPath + "/api/ndvi/image/" + result.getId() + "/red");
            result.setNirBandUrl(baseUriPath + "/api/ndvi/image/" + result.getId() + "/nir");
            result.setOutputBandUrl(baseUriPath + "/api/ndvi/image/" + result.getId() + "/output");
        }


    }

    private NDVIResultDTO convertToDTO(NDVIResult result){
        NDVIResultDTO resultDTO = new NDVIResultDTO();

        resultDTO.setId(result.getId());
        resultDTO.setTitle(result.getTitle());
        resultDTO.setStatistics(result.getStatistics());
        resultDTO.setCreatedAt(result.getCreatedAt());
        resultDTO.setRedBandUrl(result.getRedBandUrl());
        resultDTO.setNirBandUrl(result.getNirBandUrl());
        resultDTO.setOutputBandUrl(result.getOutputBandUrl());

        return resultDTO;

    }


}
