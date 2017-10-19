from flask import Flask, jsonify, request
import json
from datetime import datetime
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
                             db='dnb2',
                             charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)


@app.route('/')
def root():
    return app.send_static_file('dist/index.html')


@app.route('/getTopTopics')
def get_top_topics():
    with connection.cursor() as cursor:
        sql = 'select * from dnb_topic_count order by count DESC limit 20'
        cursor.execute(sql)
        result = cursor.fetchall()
        return jsonify(result)


@app.route('/getTopPeople')
def get_top_people():
    with connection.cursor() as cursor:
        sql = 'select * from dnb_author_count order by count DESC limit 20'
        cursor.execute(sql)
        result = cursor.fetchall()
        return jsonify(result)


@app.route('/getTimeline')
def get_timeline():
    with connection.cursor() as cursor:
        sql = 'select * from dnb_year_count where year > 1000 and year < 2021'
        cursor.execute(sql)
        result = cursor.fetchall()
        return jsonify(result)


@app.route('/setFilterForPersonResultYear', methods=['PUT'])
def filter_by_person_result_year():
    person_id = request.data.decode('utf-8')
    year_result = {'data': None, 'error': None}

    with connection.cursor() as cursor:
        sql = 'select year, count(i_id) count from dnb_author_item where a_id=%s group by year'
        try:
            cursor.execute(sql, (person_id))
        except:
            year_result['error'] = str(sys.exc_info()[0])
        else:
            year_result['data'] = cursor.fetchall()
    return jsonify(year_result)


@app.route('/setFilterForPersonResultTopic', methods=['PUT'])
def filter_by_person_result_topic():
    startTime = datetime.now()
    person_id = request.data.decode('utf-8')
    topic_result = {'data': None, 'error': None}

    with connection.cursor() as cursor:
        sql = 'select a.t_id, tc.keyword, a.count from dnb_author_topic a '\
            'inner join dnb2.dnb_topic_count tc on a.t_id= tc.id '\
            'where a.a_id=%s order by count desc limit 20'
        try:
            cursor.execute(sql, (person_id))
        except:
            topic_result['error'] = str(sys.exc_info()[0])
        else:
            topic_result['data'] = cursor.fetchall()
            print(topic_result['data'])
    uptime = str(datetime.now() - startTime)
    print('uptime: %s', (uptime))
    return jsonify(topic_result)


@app.route('/setFilterForPersonResultPerson', methods=['PUT'])
def filter_by_person_result_person():
    # todo
    person_id = request.data.decode('utf-8')
    person_result = {'data': None, 'error': None}

    return jsonify(person_result)


@app.route('/setFilterForTopicResultYear', methods=['PUT'])
def filter_by_topic_result_year():
    topic_id = request.data.decode('utf-8')
    year_result = {'data': None, 'error': None}

    with connection.cursor() as cursor:
        sql = 'select year, count(i_id) from dnb_item_topic where t_id =%s group by year'
        try:
            cursor.execute(sql, (topic_id))
        except:
            year_result['error'] = str(sys.exc_info()[0])
        else:
            year_result['data'] = cursor.fetchall()
    return jsonify(year_result)


@app.route('/setFilterForTopicResultPerson', methods=['PUT'])
def filter_by_topic_result_person():
    topic_id = request.data.decode('utf-8')
    person_result = {'data': None, 'error': None}

    with connection.cursor() as cursor:
        sql = 'select a.a_id, ac.name, ac.lastname,a.count '\
            'from dnb_author_topic a inner join dnb_author_count ac '\
            'on a.a_id=ac.id where a.t_id =%s order by count desc limit 20'
        try:
            cursor.execute(sql, (topic_id))
        except:
            person_result['error'] = str(sys.exc_info()[0])
        else:
            person_result['data'] = cursor.fetchall()
    return jsonify(person_result)


@app.route('/setFilterForTopicResultTopic', methods=['PUT'])
def filter_by_topic_result_topic():
    topic_id = request.data.decode('utf-8')
    topic_result = {'data': None, 'error': None}

    # select time
    # with connection.cursor() as cursor:
    #     sql = 'select * from dnb_author_topic where t_id = %s order by count desc limit 20'
    #     try:
    #         cursor.execute(sql, (topic_id))
    #     except:
    #         person_result['error'] = str(sys.exc_info()[0])
    #     else:
    #         person_result['data'] = cursor.fetchall()
    return jsonify(person_result)
