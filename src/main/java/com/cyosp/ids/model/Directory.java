package com.cyosp.ids.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Directory extends FileSystemElement {

    public Directory(String id, String name) {
        super(id, name, Directory.class.getSimpleName());
    }
}
