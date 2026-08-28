use base64::{Engine, engine::general_purpose::STANDARD};
use lofty::{file::TaggedFileExt, picture::PictureType, probe::Probe};
use std::path::Path;
use std::path::PathBuf;

pub fn file_url_to_path(url: &str) -> Option<PathBuf> {
    let path = url.strip_prefix("file://")?;
    let path = urlencoding::decode(path).ok()?;
    Some(PathBuf::from(path.as_ref()))
}

pub fn extract_embedded_art(path: &Path) -> Option<String> {
    let tagged_file = Probe::open(path)
        .ok()?
        .guess_file_type()
        .ok()?
        .read()
        .ok()?;

    let tag = tagged_file
        .primary_tag()
        .or_else(|| tagged_file.first_tag())?;

    let picture = tag
        .pictures()
        .iter()
        .find(|picture| picture.pic_type() == PictureType::CoverFront)
        .or_else(|| tag.pictures().first())?;

    let mime_type = picture.mime_type()?;

    let encoded = STANDARD.encode(picture.data());

    Some(format!("data:{mime_type};base64,{encoded}"))
}
