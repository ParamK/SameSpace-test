import React, { useState } from "react";
import PauseIcon from "../../assets/images/pauseIcon.svg";
import PlayIcon from "../../assets/images/playIcon.png";
import NextIcon from "../../assets/images/nextIcon.svg";
import PrevIcon from "../../assets/images/prevIcon.svg";
import VolumeIcon from '../../assets/images/volume.svg';
import OptionsIcon from '../../assets/images/optionsIcon.svg';

import { Slider } from 'antd';

const AudioControls = ({ isPlaying, onPlayPauseClick, onPrevClick, onNextClick, onVolSliderChange }) => {

    const [showSlider, setShowSlider] = useState(false);
    return (
        <div className="audio-controls">
            <button
                type="button"
                className="options"
                aria-label="Options"
            >
                <img src={OptionsIcon} alt="" />
            </button>
            <button
                type="button"
                className="prev"
                aria-label="Previous"
                onClick={onPrevClick}
            >
                <img src={PrevIcon} alt="" />
            </button>
            {isPlaying ? (
                <button
                    type="button"
                    className="pause"
                    onClick={() => onPlayPauseClick(false)}
                    aria-label="Pause"
                >
                    <img src={PlayIcon} alt="" />
                </button>
            ) : (
                <button
                    type="button"
                    className="play"
                    onClick={() => onPlayPauseClick(true)}
                    aria-label="Play"
                >
                    <img src={PauseIcon} alt="" />
                </button>
            )}
            <button
                type="button"
                className="next"
                aria-label="Next"
                onClick={onNextClick}
            >
                <img src={NextIcon} alt="" />
            </button>
            <button className="volume-section"
                onClick={() => {
                    setShowSlider(!showSlider);
                }}>
                <img src={VolumeIcon} alt="volume-icon" />
                {showSlider &&
                    <div className="volume-slider">
                        <Slider vertical
                            defaultValue={[100]}
                            onChange={onVolSliderChange}
                            railStyle={{background:'#fff', opacity:"0.2"}}
                            trackStyle={{background:'#fff'}}
                        />
                    </div>
                }
            </button>
        </div>
    );
}
export default AudioControls;
