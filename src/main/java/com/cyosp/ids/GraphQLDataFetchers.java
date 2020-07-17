package com.cyosp.ids;

import com.cyosp.ids.model.Image;
import graphql.schema.DataFetcher;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

import static java.nio.file.Files.newDirectoryStream;
import static java.nio.file.Paths.get;

@Component
public class GraphQLDataFetchers {

    public DataFetcher<List<Image>> getImagesDataFetcher() {
        return dataFetchingEnvironment -> {
            final List<Image> images = new ArrayList<>();
            newDirectoryStream(get("."), path -> path.toString().endsWith(".jpg"))
                    .forEach(path -> {
                        String fileName = path.getFileName().toString();
                        images.add(new Image(fileName, fileName));
                    });
            return images;
        };
    }
}
