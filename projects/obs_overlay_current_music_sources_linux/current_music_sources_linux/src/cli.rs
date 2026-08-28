use clap::{ArgAction, Parser};

#[derive(Parser, Debug)]
#[command(name = "current-music-sources")]
#[command(
    about = "Reads currently active Media Player Remote Interfacing Specification (MPRIS) D-Bus media sources"
)]
pub struct Args {
    /// Print the program version
    #[arg(
        short = 'V',
        long = "version",
        action = ArgAction::SetTrue
    )]
    pub version: bool,
    /// Print the JSON schema instead of current media sources
    #[arg(long)]
    pub schema: bool,
}
