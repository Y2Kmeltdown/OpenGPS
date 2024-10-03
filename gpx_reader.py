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

osmReq = f"node({minlat-lat_offset},{minlon-lon_offset},{maxlat+lat_offset},{maxlon+lon_offset});out;"

osmData = requests.post(url, data=osmReq.encode("utf-8"))

with open(osmFile, 'w', encoding="utf-8") as f:
    f.write(osmData.text)





