# IDS

IDS is the acronym of: *Image Directory Sharing* whose aims are:
 * Share images from a directory
 * Doesn't use a database

## Build

### Bootable JAR

IDS can be built into a single bootable JAR with:

`./gradlew bootJar`

Bootable JAR is then in directory: `build/libs`

## Run

### Bootable JAR

Update `ids.toml` project file if needed and run:

`java -jar build/libs/ids-*.jar`