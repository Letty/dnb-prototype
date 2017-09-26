from flask import Flask, jsonify, request
import json
import pymysql.cursors

app = Flask(__name__, static_url_path='')

topicID = ''
personID = ''
yearID = ''


def seq_iter(obj):
    return obj if isinstance(obj, dict) else range(len(obj))

connection = pymysql.connect(host='127.0.0.1',
                             user='root',
                             password='',
                             db='dnb',
                             charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)


@app.route('/')
def root():
    return app.send_static_file('dist/index.html')


@app.route('/getTopTopics')
def get_top_topics():
    with connection.cursor() as cursor:
        sql = 'select * from dnb_reduced_topic_count order by count DESC limit 20'
        cursor.execute(sql)
        result = cursor.fetchall()
        return jsonify(result)


@app.route('/getTopPeople')
def get_top_people():
    with connection.cursor() as cursor:
        sql = 'select * from dnb_reduced_author_count order by count DESC limit 20'
        cursor.execute(sql)
        result = cursor.fetchall()
        return jsonify(result)


@app.route('/getTimeline')
def get_timeline():
    with connection.cursor() as cursor:
        sql = 'select year, count from dnb_reduced_years_abstract_count'
        cursor.execute(sql)
        result = cursor.fetchall()
        return jsonify(result)


@app.route('/setFilterForTopic', methods=['PUT'])
def set_filter_for_topic():
    params = json.loads(request.data)
    topicID = params.get('id')
    print('topic: %s' % (topicID))
    print('person: %s' % (personID))
    print('year: %s' % (yearID))
    return 'set topic'


@app.route('/setFilterForPerson', methods=['PUT'])
def set_filter_for_person():
    params = json.loads(request.data)
    personID = params.get('id')
    print('topic: %s' % (topicID))
    print('person: %s' % (personID))
    print('year: %s' % (yearID))
    return 'set person'


@app.route('/setFilterForYear', methods=['PUT'])
def set_filter_for_year():
    params = json.loads(request.data)
    yearID = params.get('id')
    print('topic: %s' % (topicID))
    print('person: %s' % (personID))
    print('year: %s' % (yearID))
    return 'set year'
