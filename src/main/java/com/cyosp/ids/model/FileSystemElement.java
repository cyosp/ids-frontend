package com.cyosp.ids.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.File;

import static java.io.File.separator;
import static lombok.AccessLevel.PROTECTED;

@Data
@NoArgsConstructor(access = PROTECTED)
public abstract class FileSystemElement {
    protected String id;

    protected File file;

    protected String name;

    protected String type;

    protected FileSystemElement(String absoluteImagesDirectory, File relativeFile, Class<? extends FileSystemElement> clazz) {
        setup(absoluteImagesDirectory, relativeFile, clazz);
    }

    protected void setup(String absoluteImagesDirectory, File relativeFile, Class<? extends FileSystemElement> clazz) {
        id = relativeFile.toString();
        file = new File(absoluteImagesDirectory + separator + relativeFile);
        name = relativeFile.getName();
        type = clazz.getSimpleName();
    }
}
