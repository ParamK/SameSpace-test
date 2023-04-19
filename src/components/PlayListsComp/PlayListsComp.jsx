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


  useEffect(() => {
    handleGetPlaylists();
  }, []);

  const handleGetPlaylists = () => {
    axios({
      url: endpoint,
      method: 'post',
      data: {
        query: GetPlayListsQuery,
        // variables: { playlistId: 1 }
      }
    })
      .then((response) => {
        if (Object.keys(response.data).length !== 0) {
          let responseData = response.data.data.getPlaylists;
          // console.log(responseData);
          if (responseData.length > 0) {
            setPlayListData(responseData);
            setPlayListHeading(responseData[0].title);
            // console.log(responseData[0].title)
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
      <div className="playlist-section">
        <div className="container">

          <div className="playlist-wrapper">
            <Layout className='playlist-layout'>
              <Sider
                breakpoint="md"
                collapsedWidth="0"
                style={{
                  // overflow: 'unset',
                  // height: '100vh',
                  // position: 'sticky',
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
                    // console.log(playListsData[e.key-1].title);
                    setPlayListHeading(playListsData[e.key - 1].title);
                    setPlayListId(e.key);
                  }}
                  items={playListsData.map((elem, i) => {
                    return {
                      label: `${elem.title}`,
                      // icon: React.createElement(elem),
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
            {/* <div className="playlist-types">
              <Tabs
                tabPosition="left"
                items={playListsData.map((elem, i) => {
                  return {
                    label: `${elem.title}`,
                    key: `${elem.id}`,
                    children: <SongsListComp playListId={elem.id} playListHeading={elem.title} />,
                  };
                })}
              />
            </div> */}
          </div>

        </div>
      </div>

    </React.Fragment >
  )
}

export default PlayListsComp