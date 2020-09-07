package com.cyosp.ids.model;

import lombok.Builder;
import lombok.Data;
import lombok.Setter;

import java.io.File;

import static java.io.File.separator;
import static lombok.AccessLevel.NONE;
import static lombok.AccessLevel.PRIVATE;

@Data
@Setter(value = NONE)
@Builder(access = PRIVATE)
public class Image {
    public static final String IMAGES_URL_PATH = "/images";
    public static final String IDS_HIDDEN_DIRECTORY = ".ids";

    private String id;

    private String name;

    private File file;

    private String urlPath;

    private File previewFile;

    private String previewUrlPath;

    private File thumbnailFile;

    private String thumbnailUrlPath;

    public static Image from(String name) {
        final String urlPrefixPath = IMAGES_URL_PATH + "/";

        int dotIndex = name.lastIndexOf('.');
        String nameWithoutExtension = dotIndex > 0 ? name.substring(0, dotIndex) : name;

        String previewPath = IDS_HIDDEN_DIRECTORY + separator + nameWithoutExtension + ".preview.jpg";
        String thumbnailPath = IDS_HIDDEN_DIRECTORY + separator + nameWithoutExtension + ".thumbnail.jpg";

        return Image.builder()
                .id(name)
                .name(name)
                .file(new File(name))
                .urlPath(urlPrefixPath + name)
                .previewFile(new File(previewPath))
                .previewUrlPath(urlPrefixPath + previewPath)
                .thumbnailFile(new File(thumbnailPath))
                .thumbnailUrlPath(urlPrefixPath + thumbnailPath)
                .build();
    }
}
