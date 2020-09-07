package com.cyosp.ids.graphql;

import com.cyosp.ids.configuration.IdsConfiguration;
import com.cyosp.ids.model.Image;
import com.cyosp.ids.model.User;
import com.cyosp.ids.repository.UserRepository;
import graphql.schema.DataFetcher;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import javax.imageio.IIOImage;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.AccessDeniedException;
import java.nio.file.DirectoryStream;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

import static com.cyosp.ids.model.Image.from;
import static com.cyosp.ids.model.Role.ADMINISTRATOR;
import static java.awt.Image.SCALE_DEFAULT;
import static java.awt.image.BufferedImage.TYPE_INT_RGB;
import static java.lang.String.format;
import static java.nio.file.Files.createDirectories;
import static java.nio.file.Files.newDirectoryStream;
import static java.nio.file.Paths.get;
import static javax.imageio.ImageIO.*;
import static javax.imageio.ImageWriteParam.MODE_EXPLICIT;
import static org.imgscalr.Scalr.resize;
import static org.springframework.security.core.context.SecurityContextHolder.getContext;

@Slf4j
@Component
public class GraphQLDataFetchers {
    private final IdsConfiguration idsConfiguration;

    private final UserRepository userRepository;

    public GraphQLDataFetchers(IdsConfiguration idsConfiguration,
                               UserRepository userRepository) {
        this.idsConfiguration = idsConfiguration;
        this.userRepository = userRepository;
    }

    List<Image> listImages() {
        final List<Image> images = new ArrayList<>();
        try (DirectoryStream<Path> paths = newDirectoryStream(get(idsConfiguration.getImagesDirectory()),
                path -> lowerCaseExtension(path).endsWith(".jpg"))) {
            paths.forEach(path -> images.add(from(path.getFileName().toString())));
        } catch (IOException e) {
            log.warn("Fail to list images: " + e.getMessage());
        }
        return images;
    }

    public DataFetcher<List<Image>> getImagesDataFetcher() {
        return dataFetchingEnvironment -> new ArrayList<>(listImages());
    }

    void checkAdministratorUser() throws AccessDeniedException {
        if (getContext().getAuthentication().getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .noneMatch(authority -> ADMINISTRATOR.name().equals(authority)))
            throw new AccessDeniedException("Only administrator user is allowed");
    }

    public DataFetcher<List<User>> getUsersDataFetcher() {
        return dataFetchingEnvironment -> {
            checkAdministratorUser();
            return userRepository.findAll();
        };
    }

    BufferedImage createPreview(BufferedImage bufferedImage) {
        return resize(bufferedImage, bufferedImage.getHeight() > bufferedImage.getWidth() ? 1080 : 1280);
    }

    BufferedImage createThumbnail(BufferedImage bufferedImage) {
        int imageWidth = bufferedImage.getWidth();
        int imageHeight = bufferedImage.getHeight();

        boolean portrait = imageHeight > imageWidth;

        BufferedImage croppedImage;
        if (portrait) {
            int startCrop = (imageHeight - imageWidth) / 2;
            croppedImage = bufferedImage.getSubimage(0, startCrop, imageWidth, imageWidth);
        } else {
            int startCrop = (imageWidth - imageHeight) / 2;
            croppedImage = bufferedImage.getSubimage(startCrop, 0, imageHeight, imageHeight);
        }

        final int squareSize = 200;
        java.awt.Image squareImage = croppedImage.getScaledInstance(squareSize, squareSize, SCALE_DEFAULT);
        BufferedImage thumbnailImage = new BufferedImage(squareSize, squareSize, TYPE_INT_RGB);
        thumbnailImage.getGraphics().drawImage(squareImage, 0, 0, null);
        return thumbnailImage;
    }

    void save(BufferedImage bufferedImage, File file) throws IOException {
        createDirectories(get(file.getParent()));

        String filename = file.getName();

        int dotIndex = filename.lastIndexOf('.');
        String extension = dotIndex > 0 && dotIndex < filename.length() ? filename.substring(dotIndex + 1) : null;

        String jpgFormat = "jpg";
        if (!jpgFormat.equals(extension))
            throw new UnsupportedOperationException(format("Only %s format is managed", jpgFormat));

        ImageWriter imageWriter = getImageWritersByFormatName(jpgFormat).next();

        FileOutputStream fileOutputStream = new FileOutputStream(file);
        ImageOutputStream imageOutputStream = createImageOutputStream(fileOutputStream);
        imageWriter.setOutput(imageOutputStream);

        ImageWriteParam imageWriteParam = imageWriter.getDefaultWriteParam();
        imageWriteParam.setCompressionMode(MODE_EXPLICIT);
        imageWriteParam.setCompressionQuality(0.9f);

        imageWriter.write(null, new IIOImage(bufferedImage, null, null), imageWriteParam);

        imageOutputStream.close();
        fileOutputStream.close();
        imageWriter.dispose();
    }

    public DataFetcher<List<Image>> generateAlternativeFormats() {
        return dataFetchingEnvironment -> {
            checkAdministratorUser();
            final List<Image> images = new ArrayList<>();
            for (Image image : listImages()) {
                File previewFile = image.getPreviewFile();
                File thumbnailFile = image.getThumbnailFile();

                if (!previewFile.exists() || !thumbnailFile.exists()) {
                    BufferedImage bufferedImage = read(image.getFile());

                    if (!previewFile.exists())
                        save(createPreview(bufferedImage), previewFile);

                    if (!thumbnailFile.exists())
                        save(createThumbnail(bufferedImage), thumbnailFile);

                    images.add(image);
                }
            }
            return images;
        };
    }

    String lowerCaseExtension(Path path) {
        String fileName = path.getFileName().toString();
        String extension = "";
        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex > 0) {
            extension = fileName.substring(dotIndex).toLowerCase();
        }
        return extension;
    }
}
