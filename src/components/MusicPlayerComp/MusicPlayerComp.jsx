import { useState, useRef, useEffect } from 'react';
import './MusicPlayerComp.css';
import moment from 'moment';


const MusicPlayerComp = ({ songInfo, tracksGroup, songsListData, songKey }) => {

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState('00:00');
    const [duration, setDuration] = useState('00:00');
    const [songIndex, setSongIndex] = useState(0);

    const audioRef = useRef(null);
    const track_art_Ref = useRef(null);
    const track_name_Ref = useRef(null);
    const track_artist_Ref = useRef(null);

    const loadTrack = (songIndex, audioRef, songsListData) => {
        // debugger
        if (audioRef && songsListData.length > 0) {
            audioRef.current.src = songsListData[songIndex].url;
            audioRef.current.load();

            // Update details of the track
            track_art_Ref.current.style.backgroundImage = "url(" + songsListData[songIndex].photo + ")";
            track_name_Ref.current.textContent = songsListData[songIndex].title;
            track_artist_Ref.current.textContent = songsListData[songIndex].artist;
            // Set an interval of 1000 milliseconds for updating the seek slider
            // updateTimer = setInterval(seekUpdate, 1000);

            // Move to the next track if the current one finishes playing
            audioRef.current.addEventListener("ended", nextTrack);
            playTrack();
        }

        // Apply a random background color
        // const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        // track_art_Ref.current.style.backgroundColor = "#" + randomColor;
    }
    const playpauseTrack = () => {
        if (!isPlaying) playTrack();
        else pauseTrack();
    };
    const playTrack = () => {
        debugger
        audioRef.current.play();
        setIsPlaying(true);
        // Replace icon with the pause icon
        // You can use the isPlaying state to conditionally render the play/pause icon
        // Here's an example:
        // <i className={`fa ${isPlaying ? 'fa-pause-circle' : 'fa-play-circle'} fa-5x`}></i>
    };
    const pauseTrack = () => {
        audioRef.current.pause();
        setIsPlaying(false);
        // Replace icon with the play icon
    };

    const nextTrack = () => {
        debugger
        if (songIndex < tracksGroup.length - 1) {
            setSongIndex(songIndex + 1);
        } else {
            setSongIndex(0);
        }
        loadTrack(songIndex + 1, audioRef, songsListData);
        playTrack();
    };

    const prevTrack = () => {
        if (songIndex > 0) {
            setSongIndex(songIndex - 1);
        } else {
            setSongIndex(tracksGroup.length - 1);
        }
        loadTrack(songIndex - 1, audioRef, songsListData);
        playTrack();
    };

    const seekTo = () => {
        // handle seeking the audio track
    };

    const setVolume = () => {
        // handle setting the volume of the audio track
    };
    // function resetValues() {
    //     curr_time.textContent = "00:00";
    //     total_duration.textContent = "00:00";
    //     seek_slider.value = 0;
    // }
    // function seekUpdate() {
    //     let seekPosition = 0;

    //     // Check if the current track duration is a legible number
    //     if (!isNaN(curr_track.duration)) {
    //         seekPosition = curr_track.currentTime * (100 / curr_track.duration);
    //         seek_slider.value = seekPosition;

    //         // Calculate the time left and the total duration
    //         let currentMinutes = Math.floor(curr_track.currentTime / 60);
    //         let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
    //         let durationMinutes = Math.floor(curr_track.duration / 60);
    //         let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

    //         // Adding a zero to the single digit time values
    //         if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
    //         if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
    //         if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
    //         if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

    //         curr_time.textContent = currentMinutes + ":" + currentSeconds;
    //         total_duration.textContent = durationMinutes + ":" + durationSeconds;
    //     }
    // }
    const handleTimeUpdate = () => {
        const duration = audioRef.current.duration;
        const currentTime = audioRef.current.currentTime;
        // setCurrentTime(moment.duration(currentTime, 'seconds').format());
        setCurrentTime(moment.utc(currentTime * 1000).format('mm:ss'))
        setDuration(moment.duration(duration, 'seconds').format());

    };

    const handleLoadedData = () => {
        const duration = audioRef.current.duration;
        // setCurrentTime(moment.duration(currentTime, 'seconds').format());
        setDuration(moment.duration(duration, 'seconds').format());
    };


    useEffect(() => {
        setSongIndex(songKey);
        setIsPlaying(true);
        loadTrack(songKey, audioRef, songsListData)
    }, [songInfo, songKey]);

    useEffect(() => {
        debugger
        if (audioRef && songsListData.length > 0) {
            loadTrack(songIndex, audioRef, songsListData);
            playTrack();
        }
    }, [])
    return (
        <>
            {Object.keys(songInfo).length !== 0 &&
                <div className="player">
                    <div className="details">
                        <div className="track-art" ref={track_art_Ref} style={{ backgroundImage: `url(${songInfo.photo})` }}></div>
                        <div className="track-name" ref={track_name_Ref}>{songInfo.title}</div>
                        <div className="track-artist" ref={track_artist_Ref}>{songInfo.artist}</div>
                    </div>
                    <div className="buttons">
                        <div className="prev-track" onClick={prevTrack}><i className="fa fa-step-backward fa-2x"></i></div>
                        <div className="playpause-track" onClick={playpauseTrack}>
                            <i className={`fa ${isPlaying ? 'fa-pause-circle' : 'fa-play-circle'} fa-5x`}></i>
                        </div>
                        <div className="next-track" onClick={nextTrack}><i className="fa fa-step-forward fa-2x"></i></div>
                    </div>
                    <div className="slider_container">
                        <div className="current-time">{currentTime}</div>
                        <input type="range" min="1" max="100" value="0" className="seek_slider" onChange={seekTo} />
                        <div className="total-duration">{moment.duration(songInfo.duration, 'seconds').format()}</div>

                    </div>
                    <div className="slider_container">
                        <i className="fa fa-volume-down"></i>
                        <input type="range" min="1" max="100" value="99" className="volume_slider" onChange={setVolume} />
                        <i className="fa fa-volume-up"></i>
                    </div>
                    <audio
                        ref={audioRef}
                        src={songInfo.url}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedData={handleLoadedData}
                    />
                </div>
            }

        </>
    );
}

export default MusicPlayerComp