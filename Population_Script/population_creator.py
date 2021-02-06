import json
import random
import time
import os
import shutil
from bson import ObjectId

##### UTILS #####

# To generate random dates or numbers
def str_time_prop(start, end, format, prop):
    stime = time.mktime(time.strptime(start, format))
    etime = time.mktime(time.strptime(end, format))
    ptime = stime + prop * (etime - stime)
    return time.strftime(format, time.localtime(ptime))

def random_date(start, end, prop):
    return str_time_prop(start, end, '%m/%d/%Y %I:%M %p', prop)

random.seed(1)
def random_number(number):
    r = random.randint(0,number)
    return r

# String -> ObjectID
def stringToId(s):
    return {
        '$oid' : s
    }

# To pick random user
def pick_random_user(users):
    key = random.choice(list(users.keys()))
    value = users.get(key)
    return {'_id': stringToId(key), 'name': value}

# To pick random resource
def pick_random_resource(resources):
    key = random.choice(list(resources.keys()))
    value = resources.get(key)
    return {'_id': stringToId(key), 'title': value}

##### USERS CREATION #####

### META-INFO ###

# Meta-data to be used for users
names = ['Luis', 'Ulisses', 'Ricardo', 'JCR', 'Marega']
position = ['STUD', 'TEAC']
course = ['Informática', 'Medicina', 'Biologia', 'Desporto', 'Filosofia']

# Generate JSON data for users
data_users = []
users_id = []
users = {}

for x in range(50):
    dataReg = random_date("01/01/2019 1:30 PM", "12/08/2020 4:50 AM", random.random())
    lastSeen = random_date("12/31/2020 1:30 PM", "02/03/2021 4:50 AM", random.random())
    aux = ObjectId()
    id = stringToId(str(aux))
    name = names[x%5] + '_' + str(x)
    data_users.append({
        '_id': id,
        'name': name,
        'email': names[x%5] + '_' + str(x) + "@gmail.com",
        'password': "pass",
        'position': position[x%2],
        'course': course[random_number(4)],
        'level': 'PROD',
        'dateReg': dataReg,
        'lastOnline': lastSeen,
        'favs': random_number(100),
        'favouriteResources':[],
        'favouritePosts': []
    })
    users_id.append(str(aux))
    users[str(aux)] = name

# Write to file
with open('population_result\\users.json', 'w', encoding='utf-8') as file:
    json.dump(data_users, file, indent=2)


### PICTURE FOLDERS ###

current_path = os.getcwd()

for x in users_id:
    try:
        new_path = current_path + '\\population_result\\user_files\\' + x
        os.mkdir(new_path)
        image = str(random_number(8)) + '.jpg'
        shutil.copy(current_path + '\\user_images_examples\\' + image, new_path)
        os.rename(new_path + '\\' + image, new_path + '\\' + "picture")
    except OSError as err:
        print (str(err))

##### RESOURCES CREATION #####

### META-INFO ###

# Meta-data to be used for resources
titles = ["Teste de PI", "Recurso de PI", "Receita de coelho", "Tática do jogo", "Vitória!"]
subtitles = ["Com cebola", "O melhor", "Cartoon e companhia", "Tese do melhor que há!", "Fichas da UMinho"]
themes = ["REPORT", "THESIS", "ARTICLE", "APP", "SLIDES", "TEST", "SOLVEDPROB"]

# Generate JSON data for resources
data_resources = []
resources = {}

for x in range(500):
    dataCreate = random_date("01/01/2019 1:30 PM", "12/08/2020 4:50 AM", random.random())
    dataRegistered = random_date("12/09/2019 1:30 PM", "12/08/2021 4:50 AM", random.random())
    aux = ObjectId()
    id = {
        '$oid' : str(aux)
    }
    title = titles[x%5]
    producer = pick_random_user(users)
    data_resources.append({
        '_id': id,
        'title': title,
        'subtitle': subtitles[x%5],
        'type': themes[x%7],
        'producer': producer,
        'files': [],
        'createdAt': dataCreate,
        'registeredAt': dataRegistered,
        'downloads': random_number(50),
        'favs': random_number(5),
        'public': True
    })
    resources[str(aux)] = title

# Write to file
with open('population_result\\resources.json', 'w', encoding='utf-8') as file:
    json.dump(data_resources, file, indent=2)

### RESOURCE FOLDERS ###

##### POSTS CREATION #####

### META-INFO ###

# Meta-data to be used for posts
titles = ["Receita mágica para ter sucesso na vida", "Testes que preparam para todo tipo de combate", "Investigação sobre as cebolas", "Tese de doutoramento", "Análise ao jogo do FCPorto"]
subtitles = ["De ver e chorar por mais", "Testes variados", "Trabalho de investigação", "O melhor que verás!", "Fichas da universidade da Lapónia"]
themes = ["REPORT", "THESIS", "ARTICLE", "APP", "SLIDES", "TEST", "SOLVEDPROB"]
content = ["Neste post está representado todo o meu trabalho e dedicação, e permitiu concluir que não foi em vão", "Para mais posts como este, visitem regularmente o meu perfil ;)", "Um favorito vale por mil haters", "Exponho desta forma todo o trabalho realizado por mim ao longo do ano letivo", "Apenas um conteúdo sobre a vida"]
comments = ["Muito bom post !", "Quem escreveu este post merece um prémio de cartão", "Não gosto do contéudo, mas reparo que houve esforço", "Ajudou imenso este post, obrigado", "Fraco conteúdo"]

# Generate JSON data for posts
data_posts = []

for x in range(500):
    dataCreate = random_date("01/01/2019 1:30 PM", "12/08/2020 4:50 AM", random.random())
    aux = ObjectId()
    id = {
        '$oid' : str(aux)
    }
    comments_aux = []
    res = []
    if (x%2):
        res.append(pick_random_resource(resources))
    else:
        for x in range(3):
            res.append(pick_random_resource(resources))
    for y in range(10):
        comment = {
            'user': pick_random_user(users),
            'text': comments[random_number(4)],
            'createdAt': random_date("12/10/2020 1:30 PM", "12/31/2020 4:50 AM", random.random())
        }
        comments_aux.append(comment)
    data_posts.append({
        '_id': id,
        'title': titles[x%5],
        'subtitle': subtitles[x%5],
        'themes': themes[x%7],
        'content': content[x%5],
        'views': random_number(1000),
        'favs': random_number(5),
        'producer': pick_random_user(users),
        'resources' : res,
        'comments': comments_aux,
        'createdAt': dataCreate
    })

# Write to file
with open('population_result\\posts.json', 'w', encoding='utf-8') as file:
    json.dump(data_posts, file, indent=2)