package com.cyosp.ids.model;

import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Setter;

import java.io.File;

import static java.io.File.separator;
import static lombok.AccessLevel.NONE;
import static lombok.AccessLevel.PRIVATE;

@Data
@Setter(value = NONE)
@Builder(access = PRIVATE)
@EqualsAndHashCode(callSuper = true)
public class Image extends FileSystemElement {
    public static final String IMAGES_URL_PATH = "/images";
    public static final String IDS_HIDDEN_DIRECTORY = ".ids";

    private File file;

    private String urlPath;

    private File previewFile;

    private String previewUrlPath;

    private File thumbnailFile;

    private String thumbnailUrlPath;

    public static Image from(File file) {
        final String urlPrefixPath = IMAGES_URL_PATH + "/";

        String name = file.getName();

        int dotIndex = name.lastIndexOf('.');
        String nameWithoutExtension = dotIndex > 0 ? name.substring(0, dotIndex) : name;

        String previewPath = IDS_HIDDEN_DIRECTORY + separator + nameWithoutExtension + ".preview.jpg";
        String thumbnailPath = IDS_HIDDEN_DIRECTORY + separator + nameWithoutExtension + ".thumbnail.jpg";

        Image image = Image.builder()
                .file(new File(name))
                .urlPath(urlPrefixPath + name)
                .previewFile(new File(previewPath))
                .previewUrlPath(urlPrefixPath + previewPath)
                .thumbnailFile(new File(thumbnailPath))
                .thumbnailUrlPath(urlPrefixPath + thumbnailPath)
                .build();
        image.setup(file, Image.class);

        return image;
    }
}
