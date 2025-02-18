export interface NDVIResultDTO {
    id: string,
    title: string,
    statistics: NDVIStatistics,
    createdAt: Date,
    redBandUrl: string,
    nirBandUrl: string,
    outputBandUrl: string,
}

export interface NDVIStatistics {
    minNdvi: number;
    maxNdvi: number;
    meanNdvi: number;
    medianNdvi: number;
    stdNdvi: number;
    vegetationCoverage: number;
    timestamp: number;
    pixelCount: number;
}