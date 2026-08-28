// external files (for this module)
mod albumart_from_file;
mod cli;
mod metadata;
mod tempimage;

// imports
use clap::Parser;
use cli::Args;
use futures::future::join_all;
use schemars::JsonSchema;
use serde::Serialize;
use std::collections::HashMap;
use zbus::zvariant::OwnedValue;
use zbus::{Connection, proxy};

#[proxy(
    interface = "org.mpris.MediaPlayer2",
    default_path = "/org/mpris/MediaPlayer2"
)]
trait MediaPlayer {
    #[zbus(property)]
    fn identity(&self) -> zbus::Result<String>;

    #[zbus(property)]
    fn desktop_entry(&self) -> zbus::Result<String>;
}

#[proxy(
    interface = "org.mpris.MediaPlayer2.Player",
    default_path = "/org/mpris/MediaPlayer2"
)]
trait Player {
    #[zbus(property)]
    fn playback_status(&self) -> zbus::Result<String>;
    #[zbus(property)]
    fn metadata(&self) -> zbus::Result<HashMap<String, OwnedValue>>;
    #[zbus(property)]
    fn position(&self) -> zbus::Result<i64>;
}

#[derive(Serialize, JsonSchema)]
pub struct MediaSource {
    pub bus_name: String,
    pub identity: Option<String>,
    pub desktop_entry: Option<String>,
    pub status: Option<String>,
    pub track: Option<Track>,
    pub position: Option<Position>,
}

#[derive(Serialize, JsonSchema)]
pub struct Track {
    pub title: Option<String>,
    pub artists: Vec<String>,
    pub album: Option<String>,
    pub album_artists: Vec<String>,
    pub genres: Vec<String>,
    pub track_number: Option<i64>,
    pub url: Option<String>,
    pub track_id: Option<String>,
    pub length_us: Option<i64>,
    pub art_url: Option<String>,
}

#[derive(Serialize, JsonSchema)]
pub struct Position {
    pub current_us: Option<i64>,
    pub length_us: Option<i64>,
}

async fn media_source(connection: &Connection, name: &str) -> zbus::Result<MediaSource> {
    let player = PlayerProxy::builder(connection)
        .destination(name)?
        .build()
        .await?;
    let media = MediaPlayerProxy::builder(connection)
        .destination(name)?
        .build()
        .await?;
    let (metadata, position, status, identity, desktop_entry) = tokio::join!(
        player.metadata(),
        player.position(),
        player.playback_status(),
        media.identity(),
        media.desktop_entry(),
    );
    let metadata = metadata.unwrap_or_default();
    let track = if metadata.is_empty() {
        None
    } else {
        Some(metadata::track_from_metadata(name, &metadata))
    };
    let position = Position {
        current_us: position.ok(),
        length_us: track.as_ref().and_then(|track| track.length_us),
    };

    Ok(MediaSource {
        bus_name: name.to_string(),
        identity: identity.ok(),
        desktop_entry: desktop_entry.ok(),
        status: status.ok(),
        position: Some(position),
        track,
    })
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let args = Args::parse();

    if args.version {
        println!("{}", env!("CARGO_PKG_VERSION"));
        return Ok(());
    }
    if args.schema {
        let schema = schemars::schema_for!(Vec<MediaSource>);
        println!(
            "{}",
            serde_json::to_string_pretty(&schema).expect("failed to serialize schema")
        );
        return Ok(());
    }

    // Connect to D-Bus to find MPRIS sources
    let connection = Connection::session().await?;
    let dbus = zbus::fdo::DBusProxy::new(&connection).await?;
    let names = dbus.list_names().await?;

    // Find MPRIS sources and parse them to MediaSource structs
    let futures = names
        .iter()
        .filter(|name| name.starts_with("org.mpris.MediaPlayer2."))
        .map(|name| media_source(&connection, name.as_str()));
    let sources: Vec<MediaSource> = join_all(futures)
        .await
        .into_iter()
        .collect::<Result<_, _>>()?;

    let json = serde_json::to_string_pretty(&sources)?;
    println!("{}", json);

    Ok(())
}
