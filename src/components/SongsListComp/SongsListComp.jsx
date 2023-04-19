import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { GraphQLClient } from 'graphql-request'
import './SongsListComp.css';
import moment from 'moment';
import 'moment-duration-format'
import MusicPlayerComp from '../MusicPlayerComp/MusicPlayerComp';

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
  const [songInfo, setSongInfo] = useState([]);
  const [tracksGroup, setTracksGroup] = useState([]);
  const [songKey, setSongKey] = useState(0)

  useEffect(() => {
    handleGetSongsList(playListId);
    console.log(songInfo)
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
            let tracksGroup = responseData.map((elem) => {
              return elem.url;
            })
            // console.log(tracksGroup);
            setTracksGroup(tracksGroup);
            console.log(responseData)
          }
          else {
            setSongsListData([]);
          }
        }
      })
      .catch((error) => {
        setSongsListData([]);
        console.error(error)
      })
  }
  return (
    <React.Fragment>
      <div className="song-wrapper">
        <div className="songs-list-section">
          <div className="playlist-heading">
            <h2>{playListHeading}</h2>
          </div>
          <ul className="song-items">
            {songsListData.map((song, i) => {
              return (
                <li className="song-card" key={i}
                  onClick={() => {
                    setSongInfo(song);
                    console.log(song);
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
        <div className="song-player-section">
          <MusicPlayerComp songInfo={songInfo} tracksGroup={tracksGroup} songsListData={songsListData} songKey={songKey}/>
        </div>

      </div>


    </React.Fragment>
  )
}

export default SongsListComp