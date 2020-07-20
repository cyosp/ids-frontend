package com.cyosp.ids.configurer;

import com.cyosp.ids.configuration.IdsConfiguration;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class ImagesWebConfigurer implements WebMvcConfigurer {
    public static final String IMAGES_PATH = "/images";

    private final IdsConfiguration idsConfiguration;

    public ImagesWebConfigurer(IdsConfiguration idsConfiguration) {
        this.idsConfiguration = idsConfiguration;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry resourceHandlerRegistry) {
        resourceHandlerRegistry.addResourceHandler(IMAGES_PATH + "/**")
                .addResourceLocations("file:" + idsConfiguration.getImagesDirectory() + "/");
    }
}