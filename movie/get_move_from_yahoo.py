import json
import requests
from bs4 import BeautifulSoup

def write_json(file_name, content):
    with open(file_name, 'w') as output_file:
        json.dump(content, output_file, indent=4)

req = requests.get('https://tw.movies.yahoo.com/movie_thisweek.html')
req.encoding = 'big-5'
boca_soup = BeautifulSoup(req.text, "html.parser") #get text content of the website
output = []
ranking = boca_soup.find('div', attrs={'class', 'subpanel'})
movies = ranking.find_all('tr')
date = ranking.find('td', attrs={'class', 'duration'}).span.text.split('~')[0].replace(' ', '')
for item in movies:
    rank = item.find('td', attrs={'class', 'rank'})
    if (not rank):
        continue
    rank = rank.text
    title = item.find('td', attrs={'class', 'title'})
    m_id = title.p.get('mvid')
    intro = 'https://tw.movies.yahoo.com/movieinfo_main.html/id=' + m_id
    req = requests.get(intro)
    req.encoding = 'big-5'
    boca_soup = BeautifulSoup(req.text, "html.parser")
    ymvmvf = boca_soup.find('div', attrs={'id': 'ymvmvf'})
    img = ymvmvf.find('img').get('src')
    req = requests.get('https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + title.text + '預告片&key=AIzaSyCN7Fm5tDc3S1uIy1UPk9dURgYL3dreVmw')
    data = json.loads(req.text)
    youtube = data['items'][0]['id']['videoId']
    print (youtube)
    
    title = title.text
    item = { \
        'title': title,\
        'date': date, \
        'rank': rank, \
        'intro': intro, \
        'poster': img, \
        'youtube': youtube,
    }
    output.append(item)


write_json('data/movie_rank_week.json', output)
print ('done')
