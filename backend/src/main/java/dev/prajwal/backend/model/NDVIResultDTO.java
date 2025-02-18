package dev.prajwal.backend.model;

import org.bson.types.Binary;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Transient;

import java.util.Date;

public class NDVIResultDTO {
    private String id;
    private String title;
    private NDVIStatistics statistics;
    private Date createdAt;
    private String redBandUrl;
    private String nirBandUrl;
    private String outputBandUrl;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
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
