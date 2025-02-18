import rasterio
from rasterio import plot
import matplotlib.pyplot as plt
import numpy as np
import os
import cv2
from datetime import datetime
import json
import sys

class NDVIProcessor:
    def __init__(self, output_dir):
        self.output_dir = output_dir
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

    def process_ndvi(self, red_band_path, nir_band_path):
        """
        Process NDVI from red and NIR bands and return statistics
        """
        # Import bands
        with rasterio.open(red_band_path) as band4, rasterio.open(nir_band_path) as band5:
            red = band4.read(1).astype('float64')
            nir = band5.read(1).astype('float64')

            # Calculate NDVI
            ndvi = np.where((nir + red) == 0., 0, (nir - red) / (nir + red))

            # Calculate statistics
            stats = self.calculate_statistics(ndvi)

            # Generate visualizations
            self.generate_outputs(ndvi, band4, stats)

            return stats

    def calculate_statistics(self, ndvi_array):
        """
        Calculate various statistics from NDVI array
        """
        valid_pixels = ndvi_array[ndvi_array != 0]  # Exclude nodata values

        stats = {
            "minNdvi": float(np.min(valid_pixels)),
            "maxNdvi": float(np.max(valid_pixels)),
            "meanNdvi": float(np.mean(valid_pixels)),
            "medianNdvi": float(np.median(valid_pixels)),
            "stdNdvi": float(np.std(valid_pixels)),
            "vegetationCoverage": float(np.sum(valid_pixels > 0.2) / valid_pixels.size * 100),  # % of pixels with NDVI > 0.2
            "timestamp": datetime.now().isoformat(),
            "pixelCount": int(valid_pixels.size)
        }

        # Save statistics to JSON - Changed filename to match Java expectation
        stats_path = os.path.join(self.output_dir, 'ndvi_stats.json')
        with open(stats_path, 'w') as f:
            json.dump(stats, f, indent=4)

        return stats

    def generate_outputs(self, ndvi, reference_band, stats):
        """
        Generate various visualization outputs
        """
        # Save raw NDVI
        ndvi_path = os.path.join(self.output_dir, 'ndviImage.tiff')
        with rasterio.open(
                ndvi_path, 'w',
                driver='GTiff',
                width=reference_band.width,
                height=reference_band.height,
                count=1,
                crs=reference_band.crs,
                transform=reference_band.transform,
                dtype='float64'
        ) as ndvi_dataset:
            ndvi_dataset.write(ndvi, 1)

        # Generate colormap visualization
        ndvi_normalized = cv2.normalize(ndvi, None, 0, 255, cv2.NORM_MINMAX, cv2.CV_8UC1)
        ndvi_colormap = cv2.applyColorMap(ndvi_normalized, cv2.COLORMAP_JET)

        # Add statistics overlay to the image
        self.add_stats_overlay(ndvi_colormap, stats)

        # Save colormap visualization
        cv2.imwrite(os.path.join(self.output_dir, 'ndvi_colormap.png'), ndvi_colormap)

        # Generate edge detection
        edges = cv2.Canny(ndvi_normalized, 100, 200)
        edges_mask = cv2.cvtColor(edges, cv2.COLOR_GRAY2BGR)

        # Create overlay with edges
        overlay = cv2.addWeighted(ndvi_colormap, 0.7, edges_mask, 0.3, 0)
        cv2.imwrite(os.path.join(self.output_dir, 'ndvi_with_edges.png'), overlay)

        # Generate vegetation zones map
        self.generate_vegetation_zones(ndvi, reference_band)

    def add_stats_overlay(self, image, stats):
        """
        Add statistics overlay to the image
        """
        stats_text = [
            f"Min NDVI: {stats['minNdvi']:.3f}",
            f"Max NDVI: {stats['maxNdvi']:.3f}",
            f"Mean NDVI: {stats['meanNdvi']:.3f}",
            f"Vegetation Coverage: {stats['vegetationCoverage']:.1f}%"
        ]

        y_position = 30
        for text in stats_text:
            cv2.putText(image, text, (10, y_position),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            y_position += 30

    def generate_vegetation_zones(self, ndvi, reference_band):
        """
        Generate vegetation zones classification
        """
        zones = np.zeros_like(ndvi, dtype=np.uint8)

        # Define vegetation zones
        zones[ndvi < 0] = 1       # Water or non-vegetation
        zones[(ndvi >= 0) & (ndvi < 0.2)] = 2    # Bare soil
        zones[(ndvi >= 0.2) & (ndvi < 0.4)] = 3  # Sparse vegetation
        zones[(ndvi >= 0.4) & (ndvi < 0.6)] = 4  # Moderate vegetation
        zones[ndvi >= 0.6] = 5    # Dense vegetation

        # Create custom colormap for zones
        zone_colors = np.array([
            [0, 0, 0],        # Background (0)
            [28, 77, 161],    # Water/Non-veg (1)
            [198, 163, 138],  # Bare soil (2)
            [172, 205, 138],  # Sparse vegetation (3)
            [76, 153, 0],     # Moderate vegetation (4)
            [0, 102, 0]       # Dense vegetation (5)
        ], dtype=np.uint8)

        # Apply colormap
        zones_colored = zone_colors[zones]

        # Save zones map
        cv2.imwrite(os.path.join(self.output_dir, 'vegetation_zones.png'),
                    cv2.cvtColor(zones_colored, cv2.COLOR_RGB2BGR))

def main():
    # Get command line arguments
    if len(sys.argv) != 4:
        print("Usage: python script.py red_band_path nir_band_path output_dir")
        sys.exit(1)

    red_band_path = sys.argv[1]
    nir_band_path = sys.argv[2]
    output_dir = sys.argv[3]

    processor = NDVIProcessor(output_dir)
    stats = processor.process_ndvi(red_band_path, nir_band_path)
    print("NDVI Processing completed. Statistics:", json.dumps(stats, indent=2))

    # Save using matplotlib (this is what the Java code expects)
    with rasterio.open(os.path.join(output_dir, 'ndviImage.tiff')) as ndvi:
        fig = plt.figure(figsize=(18, 12))
        plot.show(ndvi, title="NDVI Image")
        # Save the matplotlib figure with the name expected by Java
        fig.savefig(os.path.join(output_dir, 'ndvi_matplotlib.png'),
                    dpi=300, bbox_inches='tight')
        plt.close(fig)  # Close the figure to free memory

if __name__ == "__main__":
    main()