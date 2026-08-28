use base64::{Engine, engine::general_purpose::STANDARD};
use std::fs;
use std::io;
use std::path::PathBuf;
use xxhash_rust::xxh3::xxh3_128;

pub fn cache_image(data_url: &str) -> io::Result<PathBuf> {
    // Create hash of the image url to skip repeated file creation
    let hash = xxh3_128(data_url.as_bytes());
    let filename = format!("{:032x}", hash);

    let extension = if data_url.starts_with("data:image/jpeg;base64,") {
        "jpg"
    } else if data_url.starts_with("data:image/png;base64,") {
        "png"
    } else if data_url.starts_with("data:image/webp;base64,") {
        "webp"
    } else if data_url.starts_with("data:image/gif;base64,") {
        "gif"
    } else {
        // TODO Test this
        return Err(io::Error::new(
            io::ErrorKind::InvalidInput,
            "unsupported image format",
        ));
    };

    // Create temporary directory (cleared after restart)
    let cache_dir = std::env::temp_dir().join("current_music_sources");
    fs::create_dir_all(&cache_dir)?;

    // Create temporary file path of image, but early exit if this file already exists
    let path = cache_dir.join(format!("{}.{}", filename, extension));
    if path.exists() {
        return Ok(path);
    }

    // Decorde the image data to an image file
    let encoded = data_url
        .split_once(',')
        .map(|(_, data)| data)
        .ok_or_else(|| io::Error::new(io::ErrorKind::InvalidInput, "invalid data URL"))?;
    let image_bytes = STANDARD
        .decode(encoded)
        .map_err(|error| io::Error::new(io::ErrorKind::InvalidData, error))?;
    fs::write(&path, image_bytes)?;

    Ok(path)
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn cache_images() {
        const IMAGES: &[(&str, &str)] = &[
            (
                "png",
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAABA0lEQVR4nO3RQQ2DUABAsb9lThZ0cAMboAFzuAMbD9Ja6G8+zmu8wLb8x75On/Fw30GKkBghMUJihMQIiRESIyRGSIyQGCExQmKExAiJERIjJEZIjJAYITFCYoTECIkREiMkRkiMkBghMUJihMQIiRESIyRGSIyQGCExQmKExAiJERIjJEZIjJAYITFCYoTECIkREiMkRkiMkBghMUJihMQIiRESIyRGSIyQGCExQmKExAiJERIjJEZIjJAYITFCYoTECIkREiMkRkiMkBghMUJihMQIiRESIyRGSIyQGCExQmKExAiJERIjJEZIjJAYITFCYoTECIkREiMkRkiMkBghMTcPzwTLeAKIjwAAAABJRU5ErkJggg==",
            ),
            (
                "jpg",
                "data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAAQABAAD/wAARCABkAGQDAREAAhEBAxEB/9sAQwD//////////////////////////////////////////////////////////////////////////////////////9sAQwH//////////////////////////////////////////////////////////////////////////////////////8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwBKYgoAKACgAoAKAEbt9P6mkMbQAUAFABQAUAFAD6YgoAKACgAoAKAEbt9P6mkMbQAUAFABQAUAFAD6YgoAKACgAoAKAEbt9P6mkMbQAUAFABQAUAFAD6YgoAKACgAoAKAEbt9P6mkMbQAUAFABQAUAFAD6YgoAKACgAoAKAEbt9P6mkMbQAUAFABQAUAFAD6YgoAKACgAoAKAEbt9P6mkMbQAUAFABQAUAFAD6YgoAKACgAoAKAEbt9P6mkMbQAUAFABQAUAFAD6YgoAKACgAoAKAEbt9P6mkMbQAUAFABQAUAFAD6YgoAKACgAoAKAEbt9P6mkMbQAUAFABQAUAFAD6YgoAKACgAoAKAEbt9P6mkMbQAUAFABQAUAFAD6YgoAKACgAoAKAEbt9P6mkMbQAUAFABQAUAFAD6YgoAKACgAoAKAEbt9P6mkMbQAUAFABQAUAFAD6YgoAKACgAoAKAEbt9P6mkMbQAUAFABQAUAFAH//Z",
            ),
            //("webp", "data:image/webp;base64,..."),
            //("gif", "data:image/gif;base64,..."),
        ];
        for &(extension, data_url) in IMAGES {
            let path = cache_image(&data_url).expect("failed to cache image");
            assert!(path.exists());
            assert_eq!(
                path.extension().and_then(|ext| ext.to_str()),
                Some(extension)
            );
        }
    }

    #[test]
    fn rejects_unsupported_image_format() {
        let result = cache_image("data:image/bmp;base64,AAAA");
        assert!(result.is_err());
        assert_eq!(result.unwrap_err().kind(), io::ErrorKind::InvalidInput);
    }

    #[test]
    fn rejects_invalid_base64() {
        let result = cache_image("data:image/png;base64,not-valid-base64!");
        assert!(result.is_err());
        assert_eq!(result.unwrap_err().kind(), io::ErrorKind::InvalidData);
    }
}
