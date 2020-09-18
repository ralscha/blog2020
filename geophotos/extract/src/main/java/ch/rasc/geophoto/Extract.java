package ch.rasc.geophoto;

import java.io.IOException;
import java.io.InputStream;
import java.io.Writer;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;

import com.drew.imaging.ImageMetadataReader;
import com.drew.imaging.ImageProcessingException;
import com.drew.lang.GeoLocation;
import com.drew.metadata.Metadata;
import com.drew.metadata.exif.ExifDirectoryBase;
import com.drew.metadata.exif.ExifIFD0Directory;
import com.drew.metadata.exif.GpsDirectory;

import jakarta.json.Json;
import jakarta.json.stream.JsonGenerator;
import net.coobird.thumbnailator.Thumbnails;
import net.coobird.thumbnailator.name.Rename;

public class Extract {

	public static void main(String[] args) throws IOException {
		Path photoDir = Paths.get(args[0]);

		Path thumbnailDir = Paths.get(args[1]);
		Files.createDirectories(thumbnailDir);

		Path photosJsonFile = Paths.get("photos.json");
		try (Writer writer = Files.newBufferedWriter(photosJsonFile);
				JsonGenerator jg = Json.createGenerator(writer)) {
			jg.writeStartArray();
			extractMetadata(jg, photoDir, thumbnailDir);
			jg.writeEnd();
		}
	}

	private static void extractMetadata(JsonGenerator jg, Path photoDir,
			Path thumbnailDir) throws IOException {
		Files.list(photoDir).forEach(photo -> {
			try (InputStream is = Files.newInputStream(photo)) {
				Metadata metadata = ImageMetadataReader.readMetadata(is);

				GpsDirectory gpsDirectory = metadata
						.getFirstDirectoryOfType(GpsDirectory.class);

				ExifIFD0Directory directory = metadata
						.getFirstDirectoryOfType(ExifIFD0Directory.class);
				Date date = directory.getDate(ExifDirectoryBase.TAG_DATETIME);

				if (gpsDirectory != null) {
					GeoLocation geoLocation = gpsDirectory.getGeoLocation();
					if (geoLocation != null && !geoLocation.isZero()) {
						if (!Files.exists(thumbnailDir.resolve(photo.getFileName()))) {
							Thumbnails.of(photo.toFile()).size(36, 36)
									.toFiles(thumbnailDir.toFile(), Rename.NO_CHANGE);
						}

						jg.writeStartObject();
						jg.write("lat", geoLocation.getLatitude());
						jg.write("lng", geoLocation.getLongitude());
						jg.write("img", photo.getFileName().toString());
						if (date != null) {
							jg.write("ts", (int) (date.getTime() / 1000));
						}
						jg.writeEnd();
						jg.flush();
					}
				}
			}
			catch (IOException | ImageProcessingException e) {
				e.printStackTrace();
			}

		});

	}

}
