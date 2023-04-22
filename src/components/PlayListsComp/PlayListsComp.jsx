import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { GraphQLClient } from 'graphql-request'
import SongsListComp from '../SongsListComp';
import './PlayListsComp.css';
import Logo from '../../assets/images/logo.png';
import ProfileImg from '../../assets/images/Profile.png';
import { Radio, Space, Tabs } from 'antd';
import { Layout, Menu, theme } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { updateBgColor } from '../../features/bgColor/BgColorSlice'


const endpoint = 'https://api.ss.dev/resource/api'
const { Header, Content, Footer, Sider } = Layout;
const GetPlayListsQuery = `
query GetPlaylists {
  getPlaylists {
    id
    title
  }
}
`

const PlayListsComp = ({ playlistId }) => {

  const [playListsData, setPlayListData] = useState([]);
  const [playListId, setPlayListId] = useState(1);
  const [playListHeading, setPlayListHeading] = useState("");
  const [BgColor, setBgColor] = useState("")
  const bgColor = useSelector((state) => state.bgColor.value)


  useEffect(() => {
    handleGetPlaylists();
    if (bgColor) {
      console.log("BG COLOR " + bgColor);
      setBgColor(bgColor);
    }
    else {
      setBgColor("");
    }
  }, []);

  const handleGetPlaylists = () => {
    axios({
      url: endpoint,
      method: 'post',
      data: {
        query: GetPlayListsQuery,
      }
    })
      .then((response) => {
        if (Object.keys(response.data).length !== 0) {
          let responseData = response.data.data.getPlaylists;
          if (responseData.length > 0) {
            setPlayListData(responseData);
            setPlayListHeading(responseData[0].title);
          }
          else {
            setPlayListData([]);
            setPlayListHeading("")
          }
        }
      })
      .catch((error) => {
        setPlayListData([]);
        setPlayListHeading("")
        console.error(error)
      })
  }

  return (
    <React.Fragment>
      <div className="playlist-section" style={{ backgroundColor: BgColor }}>
        <div className="container">
          <div className="playlist-wrapper">
            <Layout className='playlist-layout'>
              <Sider
                breakpoint="md"
                collapsedWidth="0"
                style={{
                  backgroundColor: BgColor,
                  left: 0,
                  top: 0,
                  bottom: 0,
                }}
                width="100%"
              >

                <div className="logo-section">
                  <img src={Logo} alt="logo-icon" />
                  <div className="logo" />
                </div>
                <Menu
                  theme="dark"
                  mode="inline"
                  className='mt-4'
                  defaultSelectedKeys="1"
                  onClick={(e) => {
                    setPlayListHeading(playListsData[e.key - 1].title);
                    setPlayListId(e.key);
                  }}
                  items={playListsData.map((elem, i) => {
                    return {
                      label: `${elem.title}`,
                      key: `${elem.id}`,
                    };
                  })}
                />
                <div className="profile-img-section">
                  <img src={ProfileImg} alt="user-profile" />
                </div>
              </Sider>
            </Layout>
            <Layout className='songs-list-layout'>
              <SongsListComp playListId={playListId} playListHeading={playListHeading} />
            </Layout>
          </div>

        </div>
      </div>

    </React.Fragment >
  )
}

export default PlayListsComp