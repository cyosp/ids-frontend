package com.cyosp.ids.graphql;

import com.cyosp.ids.configuration.IdsConfiguration;
import com.cyosp.ids.model.Image;
import graphql.schema.DataFetcher;
import org.springframework.stereotype.Component;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

import static java.nio.file.Files.newDirectoryStream;
import static java.nio.file.Paths.get;

@Component
public class GraphQLDataFetchers {

    private final IdsConfiguration idsConfiguration;

    public GraphQLDataFetchers(IdsConfiguration idsConfiguration) {
        this.idsConfiguration = idsConfiguration;
    }

    public DataFetcher<List<Image>> getImagesDataFetcher() {
        return dataFetchingEnvironment -> {
            final List<Image> images = new ArrayList<>();
            newDirectoryStream(get(idsConfiguration.getImagesDirectory()), path -> lowerCaseExtension(path).endsWith(".jpg"))
                    .forEach(path -> {
                        String fileName = path.getFileName().toString();
                        images.add(new Image(fileName, fileName));
                    });
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
