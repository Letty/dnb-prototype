from flask import Flask, jsonify, request
from flask_cors import CORS  # remove for production
import json
from datetime import datetime, date
import pymysql.cursors
import itertools
import utils

app = Flask(__name__, static_url_path='')
CORS(app)  # remove for production

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
    result = utils.get_default_topics(connection)
    return jsonify(utils.getTopicsPercentage(result))


@app.route('/getTopPeople')
def get_top_people():
    with connection.cursor() as cursor:
        sql = 'select * from dnb_author_count order by count DESC limit 20'
        cursor.execute(sql)
        result = cursor.fetchall()
        return jsonify(result)


@app.route('/getStartResults')
def get_start_results():
    year = date.today().year

    with connection.cursor() as cursor:
        sql = 'select item.id, item.title, item.publisher, ac.lastname, ac.name '\
            'from dnb_author_count ac, dnb_author_item ai, dnb_item item '\
            'where ai.year = %s and item.id = ai.i_id and ai.a_id = ac.id limit 50'
        cursor.execute(sql, (year))
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
        sql = 'select a.t_id id, tc.keyword, a.count from dnb_author_topic a '\
            'inner join dnb2.dnb_topic_count tc on a.t_id= tc.id '\
            'where a.a_id=%s order by count desc limit 20'
        try:
            cursor.execute(sql, (person_id))
        except:
            topic_result['error'] = str(sys.exc_info()[0])
        else:
            topic_result['data'] = utils.getTopicsPercentage(cursor.fetchall())
    uptime = str(datetime.now() - startTime)
    print('uptime: %s', (uptime))
    return jsonify(topic_result)


@app.route('/setFilterForPersonResultPerson', methods=['PUT'])
def filter_by_person_result_person():
    # todo
    person_id = request.data.decode('utf-8')
    person_result = {'data': None, 'error': None}

    #
    #
    #
    #
    #
    #
    #

    return jsonify(person_result)


@app.route('/setFilterForPersonResultItems', methods=['PUT'])
def filter_by_person_result_items():
    # todo
    person_id = request.data.decode('utf-8')
    person_result = {'data': None, 'error': None}

    with connection.cursor() as cursor:
        sql = 'select item.id, item.title, item.publisher, ac.lastname, ac.name '\
            'from dnb_author_count ac, dnb_author_item ai, dnb_item item '\
            'where ai.a_id = %s and item.id = ai.i_id and ai.a_id = ac.id limit 100'
        try:
            cursor.execute(sql, (person_id))
        except:
            person_result['error'] = str(sys.exc_info()[0])
        else:
            person_result['data'] = cursor.fetchall()

    return jsonify(person_result)


@app.route('/setFilterForTopicResultYear', methods=['PUT'])
def filter_by_topic_result_year():
    topic_id = request.data.decode('utf-8')
    year_result = {'data': None, 'error': None}

    with connection.cursor() as cursor:
        sql = 'select year, count(i_id) count from dnb_item_topic where t_id =%s group by year'
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
        sql = 'select a.a_id id, ac.name, ac.lastname, ac.date_of_birth, ac.date_of_death,a.count '\
            'from dnb2.dnb_author_topic a, dnb2.dnb_author_count ac where a.t_id =%s '\
            'and a.a_id=ac.id order by count desc limit 20'
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

    #
    #
    #
    #
    #
    #
    #
    #
    return jsonify(person_result)


@app.route('/setFilterForTopicResultItems', methods=['PUT'])
def filter_by_topic_result_items():
    topic_id = request.data.decode('utf-8')
    items_result = {'data': None, 'error': None}

    with connection.cursor() as cursor:
        sql = 'select item.id, item.title, item.publisher, ac.lastname, ac.name '\
            'from dnb_author_count ac, dnb_author_item ai, dnb_item_topic it, dnb_item item '\
            'where it.t_id = %s and it.i_id = ai.i_id and item.id = ai.i_id and ai.a_id = ac.id limit 100'
        try:
            cursor.execute(sql, (topic_id))
        except:
            items_result['error'] = str(sys.exc_info()[0])
        else:
            items_result['data'] = cursor.fetchall()
    return jsonify(items_result)


@app.route('/setFilterForYearResultPerson', methods=['PUT'])
def filter_by_year_result_person():
    startTime = datetime.now()
    years = json.loads(request.data.decode('utf-8'))
    person_result = {'data': None, 'error': None}

    with connection.cursor() as cursor:
        sql = 'select ai.a_id id, ac.lastname, ac.name, ac.date_of_birth, ac.date_of_death, '\
            'count(ai.a_id) count from dnb_author_item ai, dnb_author_count ac '\
            'where ai.a_id = ac.id and ai.year >= %s and ai.year <= %s '\
            'group by ai.a_id order by count desc limit 20'
        try:
            cursor.execute(sql, (years[0], years[1]))
        except:
            person_result['error'] = str(sys.exc_info()[0])
        else:
            person_result['data'] = cursor.fetchall()
    uptime = str(datetime.now() - startTime)
    print('uptime: %s', (uptime))
    return jsonify(person_result)


@app.route('/setFilterForYearResultTopic', methods=['PUT'])
def filter_by_year_result_topic():
    years = json.loads(request.data.decode('utf-8'))
    topic_result = {'data': None, 'error': None}

    with connection.cursor() as cursor:
        sql = 'select it.t_id id, tc.keyword, count(it.t_id) count '\
            'from dnb_item_topic it inner join dnb_topic_count tc '\
            'on it.t_id = tc.id where it.year >= %s and it.year <= %s '\
            'group by it.t_id order by count desc limit 20'
        try:
            cursor.execute(sql, (years[0], years[1]))
        except:
            topic_result['error'] = str(sys.exc_info()[0])
        else:
            topic_result['data'] = utils.getTopicsPercentage(cursor.fetchall())
    return jsonify(topic_result)


@app.route('/setFilterForYearResultItems', methods=['PUT'])
def filter_by_year_result_items():
    years = json.loads(request.data.decode('utf-8'))
    items_result = {'data': None, 'error': None}

    # todo - row count befor result list
    # todo - how to load dynamically the items? fetch one after another and
    # make a datastream?
    with connection.cursor() as cursor:
        sql = 'select item.id, item.title, item.publisher, ac.name, ac.lastname from '\
            'dnb_item item, dnb_author_item ai, dnb_author_count ac ' \
            'where item.year >= %s and item.year <= %s and item.id = ai.i_id and '\
            'ai.a_id = ac.id limit 20'
        try:
            cursor.execute(sql, (years[0], years[1]))
        except:
            items_result['error'] = str(sys.exc_info()[0])
        else:
            items_result['data'] = cursor.fetchall()

    return jsonify(items_result)


@app.route('/setFilterForYearPersonResultYear', methods=['PUT'])
def filter_by_year_person_result_year():
    params = json.loads(request.data.decode('utf-8'))
    year_result = {'data': None, 'error': None}

    with connection.cursor() as cursor:
        sql = 'select a_id id, count(a_id) as count, year from dnb_author_item '\
            'where a_id = %s and year >= %s and year <= %s GROUP by a_id, year'
        try:
            cursor.execute(sql, (params['person_id'],
                                 params['min_year'], params['max_year']))
        except:
            year_result['error'] = str(sys.exc_info()[0])
        else:
            year_result['data'] = cursor.fetchall()
    return jsonify(year_result)


@app.route('/setFilterForYearPersonResultTopic', methods=['PUT'])
def filter_by_year_person_result_topic():
    params = json.loads(request.data.decode('utf-8'))
    topic_result = {'data': {}, 'error': None}
    t = []

    with connection.cursor() as cursor:
        sql = 'select ai.i_id, ai.year, it.t_id, item.title, tc.keyword from dnb_author_item ai, ' \
            'dnb_item_topic it, dnb_topic_count tc, dnb_item item where  ai.a_id = %s ' \
            'and ai.year >= %s and ai.year <= %s and ai.i_id = it.i_id and it.t_id = tc.id and item.id=ai.i_id'

        try:
            cursor.execute(sql, (params['person_id'],
                                 params['min_year'], params['max_year']))
        except:
            topic_result['error'] = str(sys.exc_info()[0])
        else:
            topics = {}
            data = cursor.fetchall()
            for d in data:
                try:
                    topics[d['t_id']]
                except KeyError:
                    topics[d['t_id']] = {
                        'keyword': d['keyword'],
                        'count': 1
                    }
                else:
                    topics[d['t_id']]['count'] += 1

            for key in topics:
                t.append({'id': key, 'keyword': topics[key][
                         'keyword'], 'count': topics[key]['count']})

        topic_result['data'] = utils.getTopicsPercentage(t)
    return jsonify(topic_result)


@app.route('/setFilterForYearPersonResultPerson', methods=['PUT'])
def filter_by_year_person_result_person():
    params = json.loads(request.data.decode('utf-8'))
    person_result = {'data': {}, 'error': None}

    #
    #
    ##
    #
    #
    #
    #


@app.route('/setFilterForYearPersonResultItems', methods=['PUT'])
def filter_by_year_person_result_items():
    params = json.loads(request.data.decode('utf-8'))
    items_result = {'data': {}, 'error': None}

    with connection.cursor() as cursor:
        sql = 'select ai.i_id id, ai.year, item.title, ac.name, ac.lastname from dnb_author_item ai, '\
            'dnb_item item, dnb_author_count ac where  ai.a_id =%s and ai.year >= %s and ai.year <=%s '\
            'and ai.i_id = item.id and ai.a_id = ac.id'
        try:
            cursor.execute(sql, (params['person_id'],
                                 params['min_year'], params['max_year']))
        except:
            items_result['error'] = str(sys.exc_info()[0])
        else:
            items_result['data'] = cursor.fetchall()

    return jsonify(items_result)


@app.route('/setFilterForPersonTopicResultYear', methods=['PUT'])
def filter_by_person_topic_result_year():
    params = json.loads(request.data.decode('utf-8'))
    year_result = {'data': {}, 'error': None}

    with connection.cursor() as cursor:
        sql = 'select count(ai.i_id) count, ai.year from dnb_author_item ai, dnb_item_topic it '\
            'where ai.a_id =%s and it.t_id = %s and ai.i_id = it.i_id group by ai.year'
        try:
            cursor.execute(sql, (params['person_id'], params['topic_id']))
        except:
            year_result['error'] = str(sys.exc_info()[0])
        else:
            year_result['data'] = cursor.fetchall()

    return jsonify(year_result)


@app.route('/setFilterForPersonTopicResultItems', methods=['PUT'])
def filter_by_person_topic_result_items():
    params = json.loads(request.data.decode('utf-8'))
    items_result = {'data': {}, 'error': None}

    with connection.cursor() as cursor:
        sql = 'select item.id, item.title, item.publisher, ac.name, ac.lastname '\
            'from dnb_item item, dnb_author_item ai, dnb_author_count ac, dnb_item_topic it '\
            'where ai.a_id =%s and it.t_id = %s and item.id = ai.i_id '\
            'and ai.a_id = ac.id and ai.i_id = it.i_id limit 100'
        try:
            cursor.execute(sql, (params['person_id'], params['topic_id']))
        except:
            items_result['error'] = str(sys.exc_info()[0])
        else:
            items_result['data'] = cursor.fetchall()

    return jsonify(items_result)


@app.route('/setFilterForYearTopicResultYear', methods=['PUT'])
def filter_by_year_topic_result_year():
    params = json.loads(request.data.decode('utf-8'))
    year_result = {'data': {}, 'error': None}

    with connection.cursor() as cursor:
        sql = 'select count(ai.i_id) count, ai.year from dnb_author_item ai, dnb_item_topic it '\
            'where ai.year > %s and ai.year < %s and it.t_id = %s '\
            'and ai.i_id = it.i_id group by ai.year'
        try:
            cursor.execute(sql, (params['min_year'],
                                 params['max_year'], params['topic_id']))
        except:
            year_result['error'] = str(sys.exc_info()[0])
        else:
            year_result['data'] = cursor.fetchall()

    return jsonify(year_result)


@app.route('/setFilterForYearTopicResultPerson', methods=['PUT'])
def filter_by_year_topic_result_person():
    params = json.loads(request.data.decode('utf-8'))
    person_result = {'data': {}, 'error': None}

    #
    #
    #
    #
    #
    #
    #
    #
    #

    return jsonify(person_result)


@app.route('/setFilterForYearTopicResultItems', methods=['PUT'])
def filter_by_year_topic_result_items():
    params = json.loads(request.data.decode('utf-8'))
    items_result = {'data': {}, 'error': None}

    with connection.cursor() as cursor:
        sql = 'select item.id, item.title, item.publisher, ac.name, ac.lastname '\
            'from dnb_item item, dnb_author_item ai, dnb_author_count ac, dnb_item_topic it '\
            'where ai.year > %s and ai.year < %s and it.t_id = %s and '\
            'item.id = ai.i_id and ai.a_id = ac.id limit 100'
        try:
            cursor.execute(sql, (params['min_year'],
                                 params['max_year'], params['topic_id']))
        except:
            items_result['error'] = str(sys.exc_info()[0])
        else:
            items_result['data'] = cursor.fetchall()

    return jsonify(items_result)


@app.route('/setFilterForYearPersonTopicResultYear', methods=['PUT'])
def filter_by_year_person_topic_result_year():
    params = json.loads(request.data.decode('utf-8'))
    year_result = {'data': {}, 'error': None}

    with connection.cursor() as cursor:
        sql = 'select count(ai.i_id) count, ai.year from dnb_author_item ai, dnb_item_topic it '\
            'where ai.a_id =%s and ai.year > %s and ai.year < %s and it.t_id = %s and '\
            'ai.i_id = it.i_id group by ai.year'
        try:
            cursor.execute(sql, (params['person_id'], params['min_year'],
                                 params['max_year'], params['topic_id']))
        except:
            year_result['error'] = str(sys.exc_info()[0])
        else:
            year_result['data'] = cursor.fetchall()

    return jsonify(year_result)


@app.route('/setFilterForYearPersonTopicResultItems', methods=['PUT'])
def filter_by_year_person_topic_result_items():
    params = json.loads(request.data.decode('utf-8'))
    items_result = {'data': {}, 'error': None}

    with connection.cursor() as cursor:
        sql = 'select item.id, item.title, item.publisher, ac.name, ac.lastname '\
            'from dnb_item item, dnb_author_item ai, dnb_author_count ac, dnb_item_topic it '\
            'where ai.a_id =%s and ai.year > %s and ai.year < %s and it.t_id = %s and '\
            'item.id = ai.i_id and ai.a_id = ac.id and ai.i_id = it.i_id limit 100'
        try:
            cursor.execute(sql, (params['person_id'], params['min_year'],
                                 params['max_year'], params['topic_id']))
        except:
            items_result['error'] = str(sys.exc_info()[0])
        else:
            items_result['data'] = cursor.fetchall()

    return jsonify(items_result)


@app.route('/getItem', methods=['PUT'])
def get_item():
    item_id = request.data.decode('utf-8')
    item_result = {'data': {'item': {},
                            'person': [], 'keyword': []}, 'error': None}

    with connection.cursor() as cursor:
        sql = 'select * from dnb_item where id = %s'
        try:
            cursor.execute(sql, (item_id))
        except:
            item_result['error'] = str(sys.exc_info()[0])
        else:
            item_result['data']['item'] = cursor.fetchone()

        sql = 'select ac.lastname, ac.name from dnb_author_item ai, dnb_author_count ac where ai.i_id = %s and ai.a_id = ac.id'
        try:
            cursor.execute(sql, (item_id))
        except:
            item_result['error'] = str(sys.exc_info()[0])
        else:
            item_result['data']['person'] = cursor.fetchall()

        sql = 'select tc.keyword from dnb_item_topic it, dnb_topic_count tc where it.i_id=%s and it.t_id = tc.id'
        try:
            cursor.execute(sql, (item_id))
        except:
            item_result['error'] = str(sys.exc_info()[0])
        else:
            item_result['data']['keyword'] = cursor.fetchall()

    return jsonify(item_result)


@app.route('/searchForPerson', methods=['PUT'])
def search_for_person():
    query = request.data.decode('utf-8')
    query_result = {'data': {}, 'error': None}

    with connection.cursor() as cursor:
        sql = 'select id, lastname, name from dnb_author_count where lastname like %s limit 3'
        try:
            cursor.execute(sql, ('%' + query + '%'))
        except:
            query_result['error'] = str(sys.exc_info()[0])
        else:
            query_result['data'] = cursor.fetchall()

    return jsonify(query_result)


@app.route('/searchForTopic', methods=['PUT'])
def search_for_topic():
    query = request.data.decode('utf-8')
    query_result = {'data': {}, 'error': None}

    with connection.cursor() as cursor:
        sql = 'select id, keyword from dnb_topic_count where keyword like %s limit 3'
        try:
            cursor.execute(sql, ('%' + query + '%'))
        except:
            query_result['error'] = str(sys.exc_info()[0])
        else:
            query_result['data'] = cursor.fetchall()

    return jsonify(query_result)


@app.route('/getTopTopicNetwork')
def get_top_topic_network():
    network_result = {'data': []}
    result = utils.get_default_topics(connection)
    network_result['data'] = utils.combine_topics(result, connection)

    return jsonify(network_result)

# for aws foo
# app.run(host='0.0.0.0', port=80)
