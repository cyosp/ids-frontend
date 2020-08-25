package com.cyosp.ids.graphql;

import com.cyosp.ids.configuration.IdsConfiguration;
import com.cyosp.ids.model.Image;
import com.cyosp.ids.model.User;
import com.cyosp.ids.repository.UserRepository;
import graphql.schema.DataFetcher;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.nio.file.AccessDeniedException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

import static com.cyosp.ids.configurer.ImagesWebConfigurer.IMAGES_PATH;
import static com.cyosp.ids.model.Role.ADMINISTRATOR;
import static java.nio.file.Files.newDirectoryStream;
import static java.nio.file.Paths.get;
import static java.util.UUID.randomUUID;
import static org.springframework.security.core.context.SecurityContextHolder.getContext;

@Component
public class GraphQLDataFetchers {
    private final IdsConfiguration idsConfiguration;

    private final UserRepository userRepository;

    public GraphQLDataFetchers(IdsConfiguration idsConfiguration,
                               UserRepository userRepository) {
        this.idsConfiguration = idsConfiguration;
        this.userRepository = userRepository;
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
        return dataFetchingEnvironment -> {
            if (getContext().getAuthentication().getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .anyMatch(authority -> ADMINISTRATOR.name().equals(authority)))
                return userRepository.findAll();
            else
                throw new AccessDeniedException("Only administrator user is allowed");
        };
    }

    public DataFetcher<User> addAdminUserDataFetcher() {
        return dataFetchingEnvironment -> {
            User user = User.builder()
                    .id(randomUUID().toString())
                    .login(dataFetchingEnvironment.getArgument("login"))
                    .password(dataFetchingEnvironment.getArgument("password"))
                    .role(ADMINISTRATOR)
                    .build();
            return userRepository.save(user);
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
