import L from 'leaflet'

// 重置marker icon路径
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('../../node_modules/leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('../../node_modules/leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('../../node_modules/leaflet/dist/images/marker-shadow.png')
})

// 天地图瓦片 img：影像图 cia：路网图 subdomains：子域
export const tiandiTileLayer = {
  img: 'http://t{s}.tianditu.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}',
  cia: 'http://t{s}.tianditu.cn/DataServer?T=cia_w&X={x}&Y={y}&L={z}',
  subdomains: ['0', '1', '2', '3', '4', '5', '6', '7']
}

// 智图
export const geoqTileLayer = {
  darkblue: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}'
}
