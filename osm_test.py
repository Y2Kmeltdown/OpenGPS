import requests

test = """
node(50.745,7.17,50.75,7.18);
out;
"""

url = 'https://overpass-api.de/api/interpreter'
myobj = {'somekey': 'somevalue'}

x = requests.post(url, data=test.encode("utf-8"))

print(x.text)