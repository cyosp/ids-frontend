package com.cyosp.ids.graphql;

import com.cyosp.ids.configuration.IdsConfiguration;
import com.cyosp.ids.configuration.IdsUsersConfiguration;
import com.cyosp.ids.model.Image;
import com.cyosp.ids.model.User;
import graphql.schema.DataFetcher;
import org.springframework.stereotype.Component;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

import static com.cyosp.ids.configurer.ImagesWebConfigurer.IMAGES_PATH;
import static com.cyosp.ids.model.Role.ADMINISTRATOR;
import static java.nio.file.Files.newDirectoryStream;
import static java.nio.file.Paths.get;
import static java.util.UUID.randomUUID;

@Component
public class GraphQLDataFetchers {

    private final IdsConfiguration idsConfiguration;
    private final IdsUsersConfiguration idsUsersConfiguration;

    public GraphQLDataFetchers(IdsConfiguration idsConfiguration,
                               IdsUsersConfiguration idsUsersConfiguration) {
        this.idsConfiguration = idsConfiguration;
        this.idsUsersConfiguration = idsUsersConfiguration;
    }

    public DataFetcher<List<Image>> getImagesDataFetcher() {
        return dataFetchingEnvironment -> {
            final List<Image> images = new ArrayList<>();
            newDirectoryStream(get(idsConfiguration.getImagesDirectory()), path -> lowerCaseExtension(path).endsWith(".jpg"))
                    .forEach(path -> {
                        String fileName = path.getFileName().toString();
                        images.add(Image.builder()
                                .id(path.getRoot().toString() + fileName)
                                .name(fileName)
                                .urlPath(IMAGES_PATH + "/" + fileName)
                                .build());
                    });
            return images;
        };
    }

    public DataFetcher<List<User>> getUsersDataFetcher() {
        return dataFetchingEnvironment -> idsUsersConfiguration.getUsers();
    }

    public DataFetcher<User> addAdminUserDataFetcher() {
        return dataFetchingEnvironment -> {
            User user = User.builder()
                    .id(randomUUID().toString())
                    .login(dataFetchingEnvironment.getArgument("login"))
                    .password(dataFetchingEnvironment.getArgument("password"))
                    .role(ADMINISTRATOR)
                    .build();
            idsUsersConfiguration.getUsers().add(user);
            return user;
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
