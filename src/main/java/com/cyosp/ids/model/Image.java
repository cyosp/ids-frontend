package com.cyosp.ids.model;

import lombok.Builder;
import lombok.Data;

import static java.io.File.separator;

@Data
@Builder
public class Image {
    public static final String IMAGES_URL_PATH = "/images";
    public static final String IDS_HIDDEN_DIRECTORY = ".ids";

    private String id;

    private String name;

    private String urlPath;

    private String previewPath;

    private String previewUrlPath;

    private String thumbnailPath;

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
                .urlPath(urlPrefixPath + name)
                .previewPath(previewPath)
                .previewUrlPath(urlPrefixPath + previewPath)
                .thumbnailPath(thumbnailPath)
                .thumbnailUrlPath(urlPrefixPath + thumbnailPath)
                .build();
    }
}
