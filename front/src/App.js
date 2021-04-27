import { useEffect, useState } from 'react';
import './App.css';
import Map from 'ol/Map';
import View from 'ol/View';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import * as proj from 'ol/proj'
import * as interaction from 'ol/interaction'
import Vector from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import * as geom from 'ol/geom'
import Feature from 'ol/Feature'
import Icon from 'ol/style/Icon'
import Style from 'ol/style/Style'
function App() {
  const [userInfo, setuserInfo] = useState()
  const [search, setSearch] = useState()
  const [ipType, setIpType] = useState("IPv4")
  function getIPInfo(search) {
    let path = ""
    if (search) {
      path = search.trim();
      if (path.includes("//")) {
        path = path.split("//")[1].split("/")[0]
      }
    }
    fetch(search ? `/api/ip/${path}` : "/api/ip").then((res) => res.json()).then((data) => {
      const map = document.getElementById("map")
      if (map) map.innerHTML = ""
      setuserInfo(data)
      if (data.query.includes(":")) {
        setIpType("IPv6")
      }
      loadMap([data.lon, data.lat])
    })


  }

  function loadMap(cord) {
    var map = new Map({
      target: 'map',
      layers: [
        new Tile({
          source: new OSM()
        }),

      ],
      view: new View({
        center: proj.fromLonLat(cord),
        zoom: 8,
      }),
      controls: [],
      interactions: interaction.defaults({ mouseWheelZoom: false }),

    });

    var layer = new VectorLayer({
      source: new Vector({
        features: [
          new Feature({
            geometry: new geom.Point(proj.fromLonLat(cord)),
          })
        ]
      })
    });


    var icon = new Feature({
      geometry: new geom.Point(proj.fromLonLat(cord)),
    });

    var iconLayerSource = new Vector({
      features: [icon]
    });

    var iconLayer = new VectorLayer({
      source: iconLayerSource,
      style: new Style({
        image: new Icon({
          src: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
          anchor: [0.5, 1],
          scale: 0.05
        }),
      })
    });
    map.addLayer(layer)
    map.addLayer(iconLayer)
  }

  useEffect(() => {
    getIPInfo()
  }, [])

  return (
    <div id="whatip-whole-container" >
      <nav id="nav-bar">
        <div id="nav-content" onClick={() => { window.location.reload() }}>
          <h1 id="website-name">IpInfo</h1>
        </div>

      </nav>
      <div id="search-ip-container">
        <div id="search-box">
          <input id="search-ip" placeholder="Search-IP/Domain" onChange={(e) => { setSearch(e.target.value) }}></input>
          <button onClick={() => { getIPInfo(search) }}>Search</button>
        </div>

      </div>
      {userInfo ?
        <>
          <div className="mid-content-container flex-container">
            <div id="map" className="map"></div>
            <div id="ip-container">
              <span id="type-ip" className="mini-span">{ipType}</span>
              <span className="title-span">{userInfo.query}</span>
              <span className="mini-span">Location</span>
              <span className="title-span">{userInfo.city}, {userInfo.country}</span>
            </div>
          </div>

          <div className="mid-content-container all-info-container" >
            <div style={{ width: "100%", position: "relative", display: "flex", marginTop: "2rem" }}>
              <div className="combine-container">
                <span className="mini-span">ISP</span>
                <span className="title-span">{userInfo.org}</span>
              </div>
            </div>

            <div className="combine-container">
              <span className="mini-span">City</span>
              <span className="title-span info-span">{userInfo.city}</span>
            </div>
            <div className="combine-container">
              <span className="mini-span">Region</span>
              <span className="title-span info-span">{userInfo.regionName}</span>
            </div>

            <div className="combine-container">
              <span className="mini-span">Country</span>
              <span className="title-span info-span">{userInfo.country}</span>
            </div>
            <div className="combine-container">
              <span className="mini-span">Zip</span>
              <span className="title-span info-span">{userInfo.zip}</span>
            </div>
            <div className="combine-container">
              <span className="mini-span">Latitude</span>
              <span className="title-span info-span">{userInfo.lat}</span>
            </div>
            <div className="combine-container">
              <span className="mini-span">Longitude</span>
              <span className="title-span info-span">{userInfo.lon}</span>
            </div>

          </div>

        </>
        : null}
    </div>


  );
}

export default App;
