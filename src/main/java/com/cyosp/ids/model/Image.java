package com.cyosp.ids.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Image {
    private String id;

    private String name;

    private String urlPath;
}
