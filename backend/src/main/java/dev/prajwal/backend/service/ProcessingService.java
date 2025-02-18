package dev.prajwal.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.prajwal.backend.model.NDVIResult;
import dev.prajwal.backend.model.NDVIStatistics;
import dev.prajwal.backend.respository.NDVIResultRepo;
import lombok.extern.slf4j.Slf4j;
import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.bson.BsonBinarySubType;
import org.bson.types.Binary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Date;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class ProcessingService {

    @Autowired
    private NDVIResultRepo repo;

    @Autowired
    private ImageStorageService storageService;

    @Autowired
    private ObjectMapper objectMapper;


    @Value("${python.script.path}")
    private String pythonScriptPathConfig;


    private String resolvePythonScriptPath() throws IOException {
        if (pythonScriptPathConfig.startsWith("classpath:")) {
            String resourcePath = pythonScriptPathConfig.substring("classpath:".length());
            Path tempDir = Files.createTempDirectory("ndvi_scripts_");
            Path scriptTempPath = tempDir.resolve("Claude.py");

            try (InputStream scriptInputStream = getClass().getResourceAsStream("/" + resourcePath)) {
                if (scriptInputStream == null) {
                    throw new IOException("Could not find Python script at: " + resourcePath);
                }
                Files.copy(scriptInputStream, scriptTempPath);
            }
            return scriptTempPath.toString();
        } else {
            Path path = Path.of(pythonScriptPathConfig);
            if (!Files.exists(path)) {
                throw new IOException("Python script not found at configured path: " + pythonScriptPathConfig);
            }
            return pythonScriptPathConfig;
        }
    }

    public NDVIResult processImages(MultipartFile redBand, MultipartFile nirBand, String title) throws IOException {

        Path tempDir = Files.createTempDirectory("ndvi_");

        try {

            Path redPath = tempDir.resolve("red_band.tif");
            Path nirPath = tempDir.resolve("nir_band.tif");
            Files.write(redPath, redBand.getBytes());
            Files.write(nirPath, nirBand.getBytes());
            String scriptPath = resolvePythonScriptPath();

            ProcessBuilder pb =  new ProcessBuilder("python", scriptPath, redPath.toString(), nirPath.toString(), tempDir.toString());
            Process process = pb.start();

            // Read and log output
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    log.info("Python script output: {}", line);
                }
            }

            // Add timeout to prevent hanging
            boolean completed = process.waitFor(5, TimeUnit.MINUTES);
            if (!completed) {
                process.destroy();
                throw new IOException("Python processing timed out after 5 minutes");
            }

            int exitCode = process.waitFor();
            if(exitCode != 0){
                String errorOutput = new String(process.getErrorStream().readAllBytes());
                log.error("Python processing failed: {}", errorOutput);
                throw new IOException("Image processing failed with error: " + errorOutput);
            }

            NDVIResult result = new NDVIResult();
            result.setTitle(title);
            result.setRedBandImage(storageService.storeImage(redBand));
            result.setNirBandImage(storageService.storeImage(nirBand));

            Path outputPath = tempDir.resolve("ndvi_matplotlib.png");
            if(Files.exists(outputPath)){
                result.setOutputImage(new Binary(BsonBinarySubType.BINARY, Files.readAllBytes(outputPath)));
            }
            else {
                log.warn("Output image not found at expected path: {}", outputPath);
                throw new IOException("Output image not found after processing");
            }

            Path statsPath = tempDir.resolve("ndvi_stats.json");
            if(Files.exists(statsPath)){

                String statsString = Files.readString(statsPath);

                NDVIStatistics stats = objectMapper.readValue(statsString, NDVIStatistics.class);

                result.setStatistics(stats);

            }

            result.setCreatedAt(new Date());

            return repo.save(result);

        } catch (InterruptedException  e) {

            Thread.currentThread().interrupt();
            throw new IOException("Processing was interrupted", e);

        } finally {

            FileUtils.deleteDirectory(tempDir.toFile());

        }

    }




}
