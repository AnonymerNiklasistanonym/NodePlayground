// imports
use crate::Track;
use crate::albumart_from_file::extract_embedded_art;
use crate::albumart_from_file::file_url_to_path;
use crate::tempimage::cache_image;
use std::collections::HashMap;
use zbus::zvariant::{OwnedValue, Value};

/// All known (expected) metadata keys
const KNOWN_METADATA: &[&str] = &[
    "xesam:title",
    "xesam:artist",
    "xesam:album",
    "xesam:albumArtist",
    "xesam:genre",
    "xesam:trackNumber",
    "xesam:url",
    "mpris:trackid",
    "mpris:length",
    "mpris:artUrl",
];

/// Log if metadata keys are found that are unknown (unexpected)
fn log_unknown_metadata(bus_name: &str, metadata: &HashMap<String, OwnedValue>) {
    for key in metadata.keys() {
        if !KNOWN_METADATA.contains(&key.as_str()) {
            eprintln!(
                "[{}] Ignoring unknown MPRIS metadata property: {}",
                bus_name, key
            );
        }
    }
}

/// One year
const MAX_TRACK_LENGTH_US: i64 = 365 * 24 * 60 * 60 * 1_000_000;

/// Get Track struct from the given metadata
pub fn track_from_metadata(bus_name: &str, metadata: &HashMap<String, OwnedValue>) -> Track {
    let get = |key: &str| metadata.get(key);

    log_unknown_metadata(bus_name, metadata);

    // Extract album art from 1. art URL and if that is not set from the file URL (if it exists)
    let url = get("xesam:url").and_then(string_value);
    let raw_art_url = get("mpris:artUrl").and_then(string_value).or_else(|| {
        url.as_deref()
            .and_then(file_url_to_path)
            .and_then(|path| extract_embedded_art(&path))
    });
    let art_url = raw_art_url.as_deref().and_then(art_url_value);

    Track {
        title: get("xesam:title").and_then(string_value),
        artists: get("xesam:artist").map(string_array).unwrap_or_default(),
        album: get("xesam:album").and_then(string_value),
        album_artists: get("xesam:albumArtist")
            .map(string_array)
            .unwrap_or_default(),
        genres: get("xesam:genre").map(string_array).unwrap_or_default(),
        track_number: get("xesam:trackNumber").and_then(i64_value),
        url,
        track_id: get("mpris:trackid").and_then(object_path_value),
        length_us: get("mpris:length")
            .and_then(i64_value)
            .filter(|&length| length > 0 && length < MAX_TRACK_LENGTH_US),
        art_url,
    }
}

fn art_url_value(url: &str) -> Option<String> {
    if url.starts_with("data:image/") {
        let path = cache_image(url).ok()?;
        Some(format!("file://{}", path.to_string_lossy()))
    } else {
        Some(url.to_owned())
    }
}

fn string_value(value: &OwnedValue) -> Option<String> {
    let value: &Value<'_> = value;

    match value {
        Value::Str(s) => {
            let s = s.as_str();
            if s.is_empty() {
                None
            } else {
                Some(s.to_string())
            }
        }
        _ => None,
    }
}

fn string_array(value: &OwnedValue) -> Vec<String> {
    let value: &Value<'_> = value;

    match value {
        Value::Array(array) => {
            let mut result = Vec::new();
            for element in array.iter() {
                if let Value::Str(s) = element {
                    let s = s.as_str();

                    if !s.is_empty() {
                        result.push(s.to_string());
                    }
                }
            }
            result
        }
        _ => Vec::new(),
    }
}

fn i64_value(value: &OwnedValue) -> Option<i64> {
    let value: &Value<'_> = value;

    match value {
        Value::I64(number) => Some(*number),
        _ => None,
    }
}

fn object_path_value(value: &OwnedValue) -> Option<String> {
    let value: &Value<'_> = value;

    match value {
        Value::ObjectPath(path) => Some(path.to_string()),
        _ => None,
    }
}
