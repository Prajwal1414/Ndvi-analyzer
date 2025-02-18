package dev.prajwal.backend.respository;

import dev.prajwal.backend.model.NDVIResult;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NDVIResultRepo extends MongoRepository<NDVIResult, ObjectId> {
    List<NDVIResult> findAllByOrderByCreatedAtDesc();

}


