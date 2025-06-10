package com.economicfoodexchanger.sharedpost;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class MediaContainer implements Serializable {
    private static final long serialVersionUID = 1L;
    private List<MediaFile> mediaFiles;

    public MediaContainer() {
        this.mediaFiles = new ArrayList<>();
    }

    public List<MediaFile> getMediaFiles() {
        return mediaFiles;
    }

    public void setMediaFiles(List<MediaFile> mediaFiles) {
        this.mediaFiles = mediaFiles;
    }

    public void addMediaFile(MediaFile mediaFile) {
        this.mediaFiles.add(mediaFile);
    }

    public static class MediaFile implements Serializable {
        private static final long serialVersionUID = 1L;
        private byte[] data;
        private String contentType;
        private String fileName;
        private MediaType mediaType;
        private long fileSize;

        public MediaFile() {}

        public MediaFile(byte[] data, String contentType, String fileName, MediaType mediaType) {
            this.data = data;
            this.contentType = contentType;
            this.fileName = fileName;
            this.mediaType = mediaType;
            this.fileSize = data != null ? data.length : 0;
        }

        // Getters and setters
        public byte[] getData() { return data; }
        public void setData(byte[] data) {
            this.data = data;
            this.fileSize = data != null ? data.length : 0;
        }

        public String getContentType() { return contentType; }
        public void setContentType(String contentType) { this.contentType = contentType; }

        public String getFileName() { return fileName; }
        public void setFileName(String fileName) { this.fileName = fileName; }

        public MediaType getMediaType() { return mediaType; }
        public void setMediaType(MediaType mediaType) { this.mediaType = mediaType; }

        public long getFileSize() { return fileSize; }
        public void setFileSize(long fileSize) { this.fileSize = fileSize; }
    }

    public enum MediaType {
        IMAGE, VIDEO
    }
}
