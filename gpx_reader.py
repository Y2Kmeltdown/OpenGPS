import requests
from bs4 import BeautifulSoup

filename = "test.gpx"
osmFile = "test.osm"
url = 'https://overpass-api.de/api/interpreter'


with open(filename, 'r') as f:
    data = f.read()

Bs_data = BeautifulSoup(data, "xml")

b_unique = Bs_data.find_all('trkpt')

lat = [float(i['lat']) for i in b_unique]
lon = [float(i['lon']) for i in b_unique]

maxlat = max(lat)
minlat = min(lat)
maxlon = max(lon)
minlon = min(lon)
coords = zip(lat, lon)

lat_offset = abs(maxlat - minlat)/2
lon_offset = abs(maxlon - minlon)/2

osmReq = f"[out:xml];(way['highway'='footway']({minlat-lat_offset},{minlon-lon_offset},{maxlat+lat_offset},{maxlon+lon_offset});way['highway'='path']({minlat-lat_offset},{minlon-lon_offset},{maxlat+lat_offset},{maxlon+lon_offset});way['waterway']({minlat-lat_offset},{minlon-lon_offset},{maxlat+lat_offset},{maxlon+lon_offset});relation['waterway']({minlat-lat_offset},{minlon-lon_offset},{maxlat+lat_offset},{maxlon+lon_offset});way['natural'='water']({minlat-lat_offset},{minlon-lon_offset},{maxlat+lat_offset},{maxlon+lon_offset});way['landuse'='residential']({minlat-lat_offset},{minlon-lon_offset},{maxlat+lat_offset},{maxlon+lon_offset});way['landuse'='commercial']({minlat-lat_offset},{minlon-lon_offset},{maxlat+lat_offset},{maxlon+lon_offset});way['landuse'='industrial']({minlat-lat_offset},{minlon-lon_offset},{maxlat+lat_offset},{maxlon+lon_offset});way['landuse'='forest']({minlat-lat_offset},{minlon-lon_offset},{maxlat+lat_offset},{maxlon+lon_offset});relation['landuse']({minlat-lat_offset},{minlon-lon_offset},{maxlat+lat_offset},{maxlon+lon_offset});way['natural'='wood']({minlat-lat_offset},{minlon-lon_offset},{maxlat+lat_offset},{maxlon+lon_offset}););out body;>;out skel qt;"

#osmReq = f"[out:xml];(way['highway'='footway']({minlat-lat_offset},{minlon-lon_offset},{maxlat+lat_offset},{maxlon+lon_offset});way['highway'='path']({minlat-lat_offset},{minlon-lon_offset},{maxlat+lat_offset},{maxlon+lon_offset}););out body;>;out skel qt;"

#osmReq = f"node({minlat-lat_offset},{minlon-lon_offset},{maxlat+lat_offset},{maxlon+lon_offset});out;"

osmData = requests.post(url, data=osmReq.encode("utf-8"))

with open(osmFile, 'w', encoding="utf-8") as f:
    f.write(osmData.text)





