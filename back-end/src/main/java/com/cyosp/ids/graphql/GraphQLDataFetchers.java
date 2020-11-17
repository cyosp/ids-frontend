package com.cyosp.ids.graphql;

import com.cyosp.ids.configuration.IdsConfiguration;
import com.cyosp.ids.model.Directory;
import com.cyosp.ids.model.FileSystemElement;
import com.cyosp.ids.model.Image;
import com.cyosp.ids.model.User;
import com.cyosp.ids.repository.UserRepository;
import com.cyosp.ids.service.ModelService;
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

import static com.cyosp.ids.model.Role.ADMINISTRATOR;
import static java.awt.Image.SCALE_DEFAULT;
import static java.awt.image.BufferedImage.TYPE_INT_RGB;
import static java.io.File.separator;
import static java.lang.String.format;
import static java.nio.file.Files.createDirectories;
import static java.nio.file.Files.newDirectoryStream;
import static java.nio.file.Paths.get;
import static java.util.Comparator.comparing;
import static java.util.Optional.ofNullable;
import static java.util.stream.Collectors.toList;
import static javax.imageio.ImageIO.*;
import static javax.imageio.ImageWriteParam.MODE_EXPLICIT;
import static org.imgscalr.Scalr.resize;
import static org.springframework.security.core.context.SecurityContextHolder.getContext;

@Slf4j
@Component
public class GraphQLDataFetchers {
    public static final String DIRECTORY = "directory";

    private final IdsConfiguration idsConfiguration;

    private final UserRepository userRepository;

    private final ModelService modelService;

    public GraphQLDataFetchers(IdsConfiguration idsConfiguration,
                               UserRepository userRepository,
                               ModelService modelService) {
        this.idsConfiguration = idsConfiguration;
        this.userRepository = userRepository;
        this.modelService = modelService;
    }

    List<Image> listImagesInAllDirectories(String directory) {
        List<Image> images = new ArrayList<>();
        for (FileSystemElement fileSystemElement : list(directory)) {
            if (fileSystemElement instanceof Image)
                images.add((Image) fileSystemElement);
            else {
                images.addAll(
                        listRecursively(fileSystemElement.getId()).stream()
                                .filter(fse -> fse instanceof Image)
                                .map(image -> (Image) image)
                                .collect(toList()));
            }
        }
        return images;
    }

    List<FileSystemElement> listRecursively(String directory) {
        return list(directory, true);
    }

    List<FileSystemElement> list(String directory) {
        return list(directory, false);
    }

    private List<FileSystemElement> list(String directory, boolean recursive) {
        final List<FileSystemElement> fileSystemElements = new ArrayList<>();

        final StringBuilder absoluteDirectoryPath = new StringBuilder(idsConfiguration.getAbsoluteImagesDirectory());
        if (ofNullable(directory).isPresent())
            absoluteDirectoryPath.append(separator).append(directory);

        List<Path> unorderedPaths = new ArrayList<>();
        try (DirectoryStream<Path> paths = newDirectoryStream(get(absoluteDirectoryPath.toString()),
                path -> modelService.isImage(path) || modelService.isDirectory(path))) {
            paths.forEach(unorderedPaths::add);
        } catch (IOException e) {
            log.warn("Fail to list file system elements: " + e.getMessage());
        }
        unorderedPaths.stream()
                .filter(modelService::isDirectory)
                .sorted(comparing(path -> path.getFileName().toString()))
                .forEach(path -> {
                    if(recursive) {
                        String relativeDirectory = path.toString().replaceFirst( "^" + idsConfiguration.getAbsoluteImagesDirectory() + separator, "");
                        fileSystemElements.addAll(listRecursively(relativeDirectory));
                    }
                    fileSystemElements.add(modelService.directoryFrom(path));
                });
        unorderedPaths.stream()
                .filter(modelService::isImage)
                .sorted(comparing(path -> path.getFileName().toString()))
                .forEach(path -> fileSystemElements.add(modelService.imageFrom(path)));

        return fileSystemElements;
    }

    public DataFetcher<List<FileSystemElement>> getFileSystemElementsDataFetcher() {
        return dataFetchingEnvironment -> {
            String directory = dataFetchingEnvironment.getArgument(DIRECTORY);
            return new ArrayList<>(list(directory));
        };
    }

    public DataFetcher<List<FileSystemElement>> getDirectoryElementsDataFetcher() {
        return dataFetchingEnvironment -> {
            Directory directory = dataFetchingEnvironment.getSource();
            return new ArrayList<>(list(directory.getId()));
        };
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
        if (!jpgFormat.equalsIgnoreCase(extension))
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
            String directory = dataFetchingEnvironment.getArgument(DIRECTORY);
            for (Image image : listImagesInAllDirectories(directory)) {
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
}
