package com.economicfoodexchanger.sharedpost;

import com.economicfoodexchanger.User;
import com.economicfoodexchanger.sharedpost.delivery.Delivery;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "sharedpost")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SharedPost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "title")
    private String title;

    @Column(name = "discription")
    private String discription;

    @Column(name = "quentity")
    private String quentity;

    @Lob
    @Column(name = "photos", columnDefinition = "MEDIUMBLOB")
    private byte[] image;

    @Column(name = "createdateandtime")
    private LocalDateTime createdateandtime;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User username;

    @OneToMany(mappedBy = "sharedpost", fetch = FetchType.EAGER)
    private List<BitDetails> bitDetails;

    @OneToMany(mappedBy = "sharedPost", fetch = FetchType.EAGER)
    private List<Review> reviews;

    @ManyToOne
    @JoinColumn(name = "categoreystatus_id", referencedColumnName = "id")
    private CategoreyStatus categoreyStatus;

    @Transient
    @JsonIgnore
    public MediaContainer getMediaContainer() {
        if (image == null || image.length == 0) {
            return new MediaContainer();
        }
        
        try (ByteArrayInputStream bis = new ByteArrayInputStream(image);
             ObjectInputStream ois = new ObjectInputStream(bis)) {
            return (MediaContainer) ois.readObject();
        } catch (Exception e) {
            System.err.println("Error deserializing media container: " + e.getMessage());
            return new MediaContainer();
        }
    }

    @Transient
    @JsonIgnore
    public void setMediaContainer(MediaContainer mediaContainer) {
        if (mediaContainer == null || mediaContainer.getMediaFiles().isEmpty()) {
            this.image = null;
            return;
        }
        
        try (ByteArrayOutputStream bos = new ByteArrayOutputStream();
             ObjectOutputStream oos = new ObjectOutputStream(bos)) {
            oos.writeObject(mediaContainer);
            this.image = bos.toByteArray();
        } catch (Exception e) {
            System.err.println("Error serializing media container: " + e.getMessage());
            this.image = null;
        }
    }

    @Transient
    @JsonIgnore
    public void addMediaFile(byte[] data, String contentType, String fileName, MediaContainer.MediaType mediaType) {
        MediaContainer container = getMediaContainer();
        MediaContainer.MediaFile mediaFile = new MediaContainer.MediaFile(data, contentType, fileName, mediaType);
        container.addMediaFile(mediaFile);
        setMediaContainer(container);
    }

    @Transient
    @JsonIgnore
    public int getMediaCount() {
        MediaContainer container = getMediaContainer();
        return container.getMediaFiles().size();
    }

    @Transient
    @JsonIgnore
    public MediaContainer.MediaFile getMediaFile(int index) {
        MediaContainer container = getMediaContainer();
        List<MediaContainer.MediaFile> files = container.getMediaFiles();
        if (index >= 0 && index < files.size()) {
            return files.get(index);
        }
        return null;
    }
}