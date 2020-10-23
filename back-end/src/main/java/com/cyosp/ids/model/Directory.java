package com.cyosp.ids.model;

import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.File;

import static lombok.AccessLevel.PRIVATE;

@NoArgsConstructor(access = PRIVATE)
@EqualsAndHashCode(callSuper = true)
public class Directory extends FileSystemElement {

    public Directory(String absoluteImagesDirectory, File relativeFile) {
        super(absoluteImagesDirectory, relativeFile);
    }
}
