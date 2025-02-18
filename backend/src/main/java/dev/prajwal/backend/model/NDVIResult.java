package dev.prajwal.backend.model;

import org.bson.types.Binary;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "processingResults")
public class NDVIResult {
    @Id
    private ObjectId id;
    private String title;
    private Binary redBandImage;
    private Binary nirBandImage;
    private Binary outputImage;
    private NDVIStatistics statistics;
    private Date createdAt;

    @Transient
    private String redBandUrl;

    @Transient
    private String nirBandUrl;

    @Transient
    private String outputBandUrl;

    public NDVIResult() {
        this.createdAt = new Date();
    }

    public String getId() {
        return id != null ? id.toHexString() : null;
    }

    public void setId(String id) {
        this.id = (id != null && !id.isEmpty()) ? new ObjectId(id) : null;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Binary getRedBandImage() {
        return redBandImage;
    }

    public void setRedBandImage(Binary redBandImage) {
        this.redBandImage = redBandImage;
    }

    public Binary getNirBandImage() {
        return nirBandImage;
    }

    public void setNirBandImage(Binary nirBandImage) {
        this.nirBandImage = nirBandImage;
    }

    public Binary getOutputImage() {
        return outputImage;
    }

    public void setOutputImage(Binary outputImage) {
        this.outputImage = outputImage;
    }

    public NDVIStatistics getStatistics() {
        return statistics;
    }

    public void setStatistics(NDVIStatistics statistics) {
        this.statistics = statistics;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public String getRedBandUrl() {
        return redBandUrl;
    }

    public void setRedBandUrl(String redBandUrl) {
        this.redBandUrl = redBandUrl;
    }

    public String getNirBandUrl() {
        return nirBandUrl;
    }

    public void setNirBandUrl(String nirBandUrl) {
        this.nirBandUrl = nirBandUrl;
    }

    public String getOutputBandUrl() {
        return outputBandUrl;
    }

    public void setOutputBandUrl(String outputBandUrl) {
        this.outputBandUrl = outputBandUrl;
    }
}
