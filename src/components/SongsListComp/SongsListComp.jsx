import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { GraphQLClient } from 'graphql-request'
import './SongsListComp.css';
import moment from 'moment';
import 'moment-duration-format'
import MusicPlayerComp from '../MusicPlayerComp/MusicPlayerComp';
import { Audio, ColorRing, FidgetSpinner, Loader } from 'react-loader-spinner'
import { Input, Space, Button } from "antd";
import { useSelector, useDispatch } from 'react-redux'
import { updateBgColor } from '../../features/bgColor/BgColorSlice'

const { Search } = Input;


const endpoint = 'https://api.ss.dev/resource/api'
// const graphQLClient = new GraphQLClient(endpoint)

const GetSongsQuery = `
  query GetSongs($playlistId: Int!) {
    getSongs(playlistId: $playlistId) {
      _id
      title
      photo
      url
      duration
      artist
    }
  }
`

const SongsListComp = ({ playListId, playListHeading }) => {

  const [songsListData, setSongsListData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [songInfo, setSongInfo] = useState([]);
  const [tracksGroup, setTracksGroup] = useState([]);
  const [songKey, setSongKey] = useState(0);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [BgColor, setBgColor] = useState("")
  const bgColor = useSelector((state) => state.bgColor.value)
  const [cardSelected, setCardSelected] = useState(false);

  useEffect(() => {
    handleGetSongsList(playListId);
    // console.log(songInfo)
  }, [playListId, playListHeading]);

  useEffect(() => {
    if (bgColor) {
      console.log("BG COLOR " + bgColor);
      setBgColor(bgColor);
    }
    else {
      setBgColor("");
    }
  }, [])

  const handleGetSongsList = (playListId) => {
    setSearchLoading(true);
    axios({
      url: endpoint,
      method: 'post',
      data: {
        query: GetSongsQuery,
        variables: { playlistId: playListId ? Number(playListId) : 0 }
      }
    })
      .then((response) => {
        setSearchLoading(false);
        if (Object.keys(response.data).length !== 0) {
          let responseData = response.data.data.getSongs;
          if (responseData.length > 0) {
            setSongsListData(responseData);
            setFilteredData(responseData)
            // console.log("songslist" + responseData)
            let tracksGroup = responseData.map((elem) => {
              return elem.url;
            })
            // console.log(tracksGroup);
            setTracksGroup(tracksGroup);

          }
          else {
            setSongsListData([]);
            setSearchLoading(false);
          }
        }
      })
      .catch((error) => {
        setSongsListData([]);
        console.error(error)
        setSearchLoading(false);
        setError(error);
      })
  }

  //search filter starts
  const handleFilter = (e) => {
    debugger
    setSearchLoading(true);
    console.log(e);
    const searchInput = e.target.value;
    setInput(searchInput);
    const newFilter = songsListData.filter((value) => {
      return value.title.toLowerCase().includes(searchInput.toLowerCase()) || value.artist.toLowerCase().includes(searchInput.toLowerCase());
    });
    if (searchInput === "") {
      setFilteredData(songsListData);

      console.log(songsListData);
    } else {
      setFilteredData(newFilter);
      console.log(newFilter);
    }
    setTimeout(() => {
      setSearchLoading(false)
    }, 1000);
  };
  //search filter ends
  return (
    <React.Fragment>
      <div className="song-wrapper">
        <div className="songs-list-section"
          style={{ backgroundColor: BgColor }}
        >
          <div className="playlist-heading">
            <h2>{playListHeading}</h2>
          </div>
          <div className="searchInputs">
            <Search
              placeholder="Search Song, Artist"
              value={input}
              onChange={(e) => handleFilter(e)}
              // onSearch={(e) => console.log(e)}
              loading
              // onSearch={(e) => handleFilter(e)}
              enterButton
            />
          </div>

          {searchLoading ?
            <div className="loading-section">
              <ColorRing
                visible={true}
                height="100"
                width="100"
                ariaLabel="blocks-loading"
                wrapperStyle={{}}
                wrapperClass="blocks-wrapper"
                colors={['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF',]}
              />
            </div>
            :
            <ul className="song-items">
              {filteredData.slice(0, 10).map((song, i) => {
                return (
                  <li
                    className="song-card"
                    key={i}
                    onClick={() => {
                      setSongInfo(song);
                      setSongKey(i);
                    }}>
                    <div className="song-img">
                      <img src={song.photo} alt="song-thumbnail" />
                    </div>
                    <div className="song-desc">
                      <h5 className='mb-0'>{song.title}</h5>
                      <p className='mb-0'>{song.artist}</p>
                    </div>
                    <div className="song-duration">
                      <p className='mb-0'>{moment.duration(song.duration, 'seconds').format()}</p>
                    </div>
                  </li>
                )
              })
              }
            </ul>
          }

        </div>
        {songsListData.length > 0 &&
          <div className="song-player-section" style={{ backgroundColor: BgColor }}>
            <MusicPlayerComp songInfo={songInfo} tracksGroup={tracksGroup} songsListData={songsListData} songKey={songKey} />
          </div>
        }


      </div>


    </React.Fragment>
  )
}

export default SongsListComp