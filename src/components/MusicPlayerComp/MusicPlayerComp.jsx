import { useState, useRef, useEffect } from 'react';
import './MusicPlayerComp.css';
import AudioControls from "./AudioControls";
import moment from 'moment';
import { Slider } from 'antd';
import VolumeIcon from '../../assets/images/volume.svg';
import ColorThief from 'colorthief'
import { useSelector, useDispatch } from 'react-redux'
import { updateBgColor } from '../../features/bgColor/BgColorSlice'


const MusicPlayerComp = ({ songInfo, tracksGroup, songsListData, songKey }) => {
    // State
    const [trackIndex, setTrackIndex] = useState(0);
    const [trackProgress, setTrackProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [myAlbumInfo, setMyAlbumInfo] = useState({});
    const [BgColor, setBgColor] = useState("")
    const bgColor = useSelector((state) => state.bgColor.value)

    // Refs
    const audioRef = useRef(new Audio(myAlbumInfo.url));
    const intervalRef = useRef();
    const thumbImageRef = useRef();
    const isReady = useRef(false);

    // Destructure for conciseness
    const { duration } = audioRef.current;

    const currentPercentage = duration
        ? `${(trackProgress / duration) * 100}%`
        : "0%";
    const trackStyling = `
    -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${currentPercentage}, #fff), color-stop(${currentPercentage}, #777))
  `;

    const startTimer = () => {
        // Clear any timers already running
        clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            if (audioRef.current.ended) {
                toNextTrack();
            } else {
                setTrackProgress(audioRef.current.currentTime);
            }
        }, [1000]);
    };

    const onScrub = (value) => {
        debugger
        // Clear any timers already running
        clearInterval(intervalRef.current);
        audioRef.current.currentTime = value;
        setTrackProgress(audioRef.current.currentTime);
    };

    const onScrubEnd = () => {
        // If not already playing, start
        if (!isPlaying) {
            setIsPlaying(true);
        }
        startTimer();
    };

    const toPrevTrack = () => {
        debugger
        if (trackIndex - 1 < 0) {
            setTrackIndex(songsListData.length - 1);
            setMyAlbumInfo(songsListData[songsListData.length - 1]);
        } else {
            setTrackIndex(trackIndex - 1);
            setMyAlbumInfo(songsListData[trackIndex - 1]);
        }
    };

    const toNextTrack = () => {
        debugger
        if (trackIndex < songsListData.length - 1) {
            setTrackIndex(trackIndex + 1);
            setMyAlbumInfo(songsListData[trackIndex + 1]);
        } else {
            setTrackIndex(0);
            setMyAlbumInfo(songsListData[0]);
        }
    };

    useEffect(() => {
        // debugger
        if (isPlaying) {
            audioRef.current.play();
            startTimer();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying, songInfo, myAlbumInfo]);

    useEffect(() => {
        if (isPlaying) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    startTimer();
                }).catch(error => {
                    console.log(error);
                });
            }
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying, songInfo, myAlbumInfo]);

    useEffect(() => {
        // debugger
        audioRef.current.pause();
        // console.log(songsListData[trackIndex].title);
        // console.log(trackIndex);
        // console.log(songInfo);
        audioRef.current = new Audio(songInfo.url);
        setTrackProgress(audioRef.current.currentTime);

        if (isReady.current) {
            if (audioRef.current.paused) { // check if the audio is paused before playing
                audioRef.current.play();
                setIsPlaying(true);
                startTimer();
            } else {
                // The audio is still playing or in the process of pausing, so we wait until it has completely paused before playing it again.
                audioRef.current.onpause = () => {
                    audioRef.current.play();
                    setIsPlaying(true);
                    startTimer();
                };
            }
        } else {
            // Set the isReady ref as true for the next pass
            isReady.current = true;
        }
    }, [trackIndex, songInfo]);


    useEffect(() => {
        // debugger
        // Pause and clean up on unmount
        return () => {
            audioRef.current.pause();
            clearInterval(intervalRef.current);
        };
    }, []);
    useEffect(() => {
        setMyAlbumInfo(songInfo);
    }, [songInfo])

    useEffect(() => {
        // debugger
        // console.log(songInfo);
        if (songKey) {
            setTrackIndex(songKey)
        }
        else {
            setTrackIndex(0);
        }
    }, [songKey])

    useEffect(() => {
        if (bgColor) {
            console.log("BG COLOR " + bgColor);
            setBgColor(bgColor);
        }
        else {
            setBgColor("");
        }
    }, [])

    const onVolSliderChange = (vol) => {
        // console.log(e);
        console.log(vol / 100);
        audioRef.current.volume = vol / 100;
    }
    return (
        <>
            {Object.keys(myAlbumInfo).length !== 0 &&
                <div className="audio-player" style={{ backgroundColor: BgColor }}>
                    <div className="track-info">
                        <div className="album-details">
                            <h2 className="title">{myAlbumInfo.title}</h2>
                            <h3 className="artist">{myAlbumInfo.artist}</h3>
                        </div>
                        <img
                            id='album-cover-img'
                            className="artwork"
                            ref={thumbImageRef}
                            src={myAlbumInfo.photo}
                            alt={`track artwork for ${myAlbumInfo.title} by ${myAlbumInfo.artist}`}
                        />
                        <div className='music-seeker'>
                            <input
                                type="range"
                                value={trackProgress}
                                step="1"
                                min="0"
                                max={duration ? duration : `${duration}`}
                                className="progress"
                                onChange={(e) => onScrub(e.target.value)}
                                onMouseUp={onScrubEnd}
                                onKeyUp={onScrubEnd}
                                style={{ background: trackStyling }}
                            />
                            {/* <Slider
                                // defaultValue={[100]}
                                value={trackProgress}
                                min={1}
                                // step={1}
                                max={duration ? duration : `${duration}`}
                                onChange={(e) => onScrub(e)}
                                // onAfterChange = {(e) => onScrub(e)}
                                onMouseUp={onScrubEnd}
                                onKeyUp={onScrubEnd}
                                tooltip={{ color: "red" }}
                                // tooltipVisible={false}
                                railStyle={{ background: '#fff', opacity: "0.2", height: '6px' }}
                                trackStyle={{ background: '#fff', height: '6px' }}
                            /> */}
                        </div>
                        <AudioControls
                            isPlaying={isPlaying}
                            onPrevClick={toPrevTrack}
                            onNextClick={toNextTrack}
                            onPlayPauseClick={setIsPlaying}
                            onVolSliderChange={onVolSliderChange}

                        />
                    </div>
                </div>
            }

        </>

    );
}

export default MusicPlayerComp