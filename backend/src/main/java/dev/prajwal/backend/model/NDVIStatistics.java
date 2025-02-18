package dev.prajwal.backend.model;

import java.util.Date;

public class NDVIStatistics {
    private double minNdvi;
    private double maxNdvi;
    private double meanNdvi;
    private double medianNdvi;
    private double stdNdvi;
    private double vegetationCoverage;
    private Date timestamp;
    private double pixelCount;

    public double getMedianNdvi() {
        return medianNdvi;
    }

    public void setMedianNdvi(double medianNdvi) {
        this.medianNdvi = medianNdvi;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    public double getStdNdvi() {
        return stdNdvi;
    }

    public void setStdNdvi(double stdNdvi) {
        this.stdNdvi = stdNdvi;
    }



    public double getPixelCount() {
        return pixelCount;
    }

    public void setPixelCount(double pixelCount) {
        this.pixelCount = pixelCount;
    }

    public double getMinNdvi() {
        return minNdvi;
    }

    public void setMinNdvi(double minNdvi) {
        this.minNdvi = minNdvi;
    }

    public double getMaxNdvi() {
        return maxNdvi;
    }

    public void setMaxNdvi(double maxNdvi) {
        this.maxNdvi = maxNdvi;
    }

    public double getMeanNdvi() {
        return meanNdvi;
    }

    public void setMeanNdvi(double meanNdvi) {
        this.meanNdvi = meanNdvi;
    }

    public double getVegetationCoverage() {
        return vegetationCoverage;
    }

    public void setVegetationCoverage(double vegetationCoverage) {
        this.vegetationCoverage = vegetationCoverage;
    }

}
