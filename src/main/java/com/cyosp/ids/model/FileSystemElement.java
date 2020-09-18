package com.cyosp.ids.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.File;

import static lombok.AccessLevel.PROTECTED;

@Data
@NoArgsConstructor(access = PROTECTED)
public abstract class FileSystemElement {
    protected String id;

    protected String name;

    protected String type;

    protected FileSystemElement(File file, Class<? extends FileSystemElement> clazz) {
        setup(file, clazz);
    }

    protected void setup(File file, Class<? extends FileSystemElement> clazz) {
        id = file.toString();
        name = file.getName();
        type = clazz.getSimpleName();
    }
}
