import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { GraphQLClient } from 'graphql-request'
import './SongsListComp.css';
import moment from 'moment';
import 'moment-duration-format'
import MusicPlayerComp from '../MusicPlayerComp/MusicPlayerComp';
import { Input, Space, Button } from "antd";
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

  useEffect(() => {
    handleGetSongsList(playListId);
    // console.log(songInfo)
  }, [playListId, playListHeading]);

  const handleGetSongsList = (playListId) => {
    axios({
      url: endpoint,
      method: 'post',
      data: {
        query: GetSongsQuery,
        variables: { playlistId: playListId ? Number(playListId) : 0 }
      }
    })
      .then((response) => {
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
          }
        }
      })
      .catch((error) => {
        setSongsListData([]);
        console.error(error)
        setError(error);
      })
  }

  //search filter starts
  const handleFilter = (e) => {
    debugger
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
  };
  //search filter ends
  return (
    <React.Fragment>
      <div className="song-wrapper">
        <div className="songs-list-section">
          <div className="playlist-heading">
            <h2>{playListHeading}</h2>
          </div>
          <div className="searchInputs">
            <Search
              placeholder="Search Song, Artist"
              value={input}             
              onChange={(e) => handleFilter(e)}
              enterButton
            />
          </div>
          <ul className="song-items">
            {filteredData.slice(0, 10).map((song, i) => {
              return (
                <li className="song-card" key={i}
                  onClick={() => {
                    setSongInfo(song);
                    // console.log(song);
                    setSongKey(i);
                  }}>
                  <div className="song-img">
                    <img src={song.photo} alt="song-thumbnail" />
                  </div>
                  <div className="song-desc">
                    <h5>{song.title}</h5>
                    <p>{song.artist}</p>
                  </div>
                  <div className="song-duration">
                    <p>{moment.duration(song.duration, 'seconds').format()}</p>
                  </div>
                </li>
              )
            })
            }
          </ul>
        </div>
        {songsListData.length > 0 &&
          <div className="song-player-section">
            <MusicPlayerComp songInfo={songInfo} tracksGroup={tracksGroup} songsListData={songsListData} songKey={songKey} />
          </div>
        }


      </div>


    </React.Fragment>
  )
}

export default SongsListComp