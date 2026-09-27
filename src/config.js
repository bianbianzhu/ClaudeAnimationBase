// config.js: project settings.
//   duration: the video's length in seconds.
//   bpm:      the rhythm that bounces, dances and pulse() follow. Clawd always moves to some beat; if the video has music,
//             set this to the song's tempo, and set offset to the time in seconds of its first downbeat.
//             A beat map (PROJECT.beats, loaded after this file; see docs/MUSIC_SYNC.md) makes the beat follow a song
//             whose tempo drifts; bpm is then its average tempo.
const PROJECT = { duration: 85.16, bpm: 151.3, offset: 0.223, audio: 'assets/jingle_extended.mp3' };
