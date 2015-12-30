import json
import requests
from bs4 import BeautifulSoup

def write_json(file_name, content):
    with open(file_name, 'w') as output_file:
        json.dump(content, output_file, indent=4)

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

    title = title.text
    item = { \
        'title': title,\
        'date': date, \
        'rank': rank, \
        'intro': intro \
    }
    output.append(item)


write_json('data/movie_rank_week.json', output)
print ('done')
