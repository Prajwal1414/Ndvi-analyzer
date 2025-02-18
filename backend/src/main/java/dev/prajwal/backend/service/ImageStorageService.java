package dev.prajwal.backend.service;

import dev.prajwal.backend.respository.NDVIResultRepo;
import lombok.extern.slf4j.Slf4j;
import org.bson.BsonBinarySubType;
import org.bson.types.Binary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@Slf4j
public class ImageStorageService {

    @Autowired
    private NDVIResultRepo repo;

    public Binary storeImage(MultipartFile file) throws IOException {
        return new Binary(BsonBinarySubType.BINARY, file.getBytes());
    }

    public ByteArrayResource getImage(Binary binary){
        byte[] imageData = binary.getData();
        return new ByteArrayResource(imageData);
    }

}
