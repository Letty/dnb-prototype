from flask import Flask, jsonify, request
from flask_cors import CORS  # remove for production
import json
from datetime import datetime, date
import pymysql.cursors
import queryhelper as qh
import utils

app = Flask(__name__, static_url_path='')
CORS(app)  # remove for production


def open_db_connection():
    connection = pymysql.connect(host='127.0.0.1',
                                 user='root',
                                 password='',
                                 db='dnb2',
                                 charset='utf8mb4',
                                 cursorclass=pymysql.cursors.DictCursor)
    return connection


@app.route('/')
def root():
    return app.send_static_file('dist/index.html')


@app.route('/getTopTopics')
def get_top_topics():
    con = open_db_connection()
    result = qh.get_default_topics(con)
    con.close()
    return jsonify(result)


@app.route('/getTopPeople')
def get_top_people():
    con = open_db_connection()
    result = []
    with con.cursor() as cursor:
        sql = 'select * from dnb_author_count order by count DESC limit 20'
        cursor.execute(sql)
        result = cursor.fetchall()
    con.close()
    return jsonify(result)


@app.route('/getStartResults')
def get_start_results():
    con = open_db_connection()
    result = []
    year = date.today().year

    with con.cursor() as cursor:
        sql = 'select item.id, item.title, item.publisher, ac.lastname, ac.name '\
            'from dnb_author_count ac, dnb_author_item ai, dnb_item item '\
            'where ai.year = %s and item.id = ai.i_id and ai.a_id = ac.id limit 50'
        cursor.execute(sql, (year))
        res = cursor.fetchall()
        result = utils.extract_publisher_name(res)
    con.close()
    return jsonify(result)


@app.route('/getTimeline')
def get_timeline():
    con = open_db_connection()
    result = []
    with con.cursor() as cursor:
        sql = 'select * from dnb_year_count where year >= 1000 and year <= 2021'
        cursor.execute(sql)
        result = cursor.fetchall()
    con.close()
    return jsonify(result)


@app.route('/setFilterForPersonResultYear', methods=['POST'])
def filter_by_person_result_year():
    con = open_db_connection()
    person_id = request.data.decode('utf-8')
    year_result = {'data': None, 'error': None}

    with con.cursor() as cursor:
        sql = 'select year, count(i_id) count from dnb_author_item where a_id=%s group by year'
        try:
            cursor.execute(sql, (person_id))
        except:
            year_result['error'] = str(sys.exc_info()[0])
        else:
            year_result['data'] = cursor.fetchall()
    con.close()
    return jsonify(year_result)


@app.route('/setFilterForPersonResultTopic', methods=['POST'])
def filter_by_person_result_topic():
    con = open_db_connection()
    person_id = request.data.decode('utf-8')

    topic_result = qh.get_topics_for_person(person_id, con)
    con.close()
    return jsonify(topic_result)


@app.route('/setFilterForPersonResultItems', methods=['POST'])
def filter_by_person_result_items():
    con = open_db_connection()
    # todo
    person_id = request.data.decode('utf-8')
    item_result = {'data': None, 'error': None}

    with con.cursor() as cursor:
        sql = 'select item.id, item.title, item.publisher, ac.lastname, ac.name '\
            'from dnb_author_count ac, dnb_author_item ai, dnb_item item '\
            'where ai.a_id = %s and item.id = ai.i_id and ai.a_id = ac.id limit 100'
        try:
            cursor.execute(sql, (person_id))
        except:
            item_result['error'] = str(sys.exc_info()[0])
        else:
            res = cursor.fetchall()
            item_result['data'] = utils.extract_publisher_name(res)

    con.close()
    return jsonify(item_result)


@app.route('/setFilterForTopicResultYear', methods=['POST'])
def filter_by_topic_result_year():
    con = open_db_connection()
    topic_id = request.data.decode('utf-8')
    year_result = {'data': None, 'error': None}

    with con.cursor() as cursor:
        sql = 'select year, count(i_id) count from dnb_item_topic where t_id =%s group by year'
        try:
            cursor.execute(sql, (topic_id))
        except:
            year_result['error'] = str(sys.exc_info()[0])
        else:
            year_result['data'] = cursor.fetchall()
    con.close()
    return jsonify(year_result)


@app.route('/setFilterForTopicResultPerson', methods=['POST'])
def filter_by_topic_result_person():
    con = open_db_connection()
    topic_id = request.data.decode('utf-8')
    person_result = {'data': None, 'error': None}

    with con.cursor() as cursor:
        sql = 'select a.a_id id, ac.name, ac.lastname, ac.date_of_birth, ac.date_of_death,a.count '\
            'from dnb_author_topic a, dnb_author_count ac where a.t_id =%s '\
            'and a.a_id=ac.id order by count desc limit 20'
        try:
            cursor.execute(sql, (topic_id))
        except:
            person_result['error'] = str(sys.exc_info()[0])
        else:
            person_result['data'] = cursor.fetchall()
    con.close()
    return jsonify(person_result)


@app.route('/setFilterForTopicResultTopic', methods=['POST'])
def filter_by_topic_result_topic():
    con = open_db_connection()
    topic_id = request.data.decode('utf-8')
    topic = []
    with con.cursor() as cursor:
        sql = 'select id, keyword, count from dnb_topic_count where id =%s '
        cursor.execute(sql, (topic_id))
        topic = cursor.fetchone()
    topic_result = qh.get_topics_for_topics(topic_id, con)
    con.close()
    if len(topic_result['data']) > 0:
        topic_result['data'].append(topic)
    else:
        topic_result['data'] = [topic]
    return jsonify(topic_result)


@app.route('/setFilterForTopicResultItems', methods=['POST'])
def filter_by_topic_result_items():
    con = open_db_connection()
    topic_id = request.data.decode('utf-8')
    items_result = {'data': None, 'error': None}
    with con.cursor() as cursor:
        sql = 'select item.id, item.title, item.publisher, ac.lastname, ac.name '\
            'from dnb_author_count ac, dnb_author_item ai, dnb_item_topic it, dnb_item item '\
            'where it.t_id = %s and it.i_id = ai.i_id and item.id = ai.i_id and ai.a_id = ac.id limit 100'
        try:
            cursor.execute(sql, (topic_id))
        except:
            err = sys.exc_info()[0]
            items_result['error'] = str(err)
        else:
            res = cursor.fetchall()
            items_result['data'] = utils.extract_publisher_name(res)
    con.close()
    return jsonify(items_result)


@app.route('/setFilterForYearResultPerson', methods=['POST'])
def filter_by_year_result_person():
    con = open_db_connection()
    startTime = datetime.now()
    years = json.loads(request.data.decode('utf-8'))
    person_result = {'data': None, 'error': None}

    with con.cursor() as cursor:
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
    con.close()
    uptime = str(datetime.now() - startTime)
    print('uptime: %s', (uptime))
    return jsonify(person_result)


@app.route('/setFilterForYearResultTopic', methods=['POST'])
def filter_by_year_result_topic():
    con = open_db_connection()
    years = json.loads(request.data.decode('utf-8'))

    topic_result = qh.get_topics_for_year(years, con)
    con.close()
    return jsonify(topic_result)


@app.route('/setFilterForYearResultItems', methods=['POST'])
def filter_by_year_result_items():
    con = open_db_connection()
    years = json.loads(request.data.decode('utf-8'))
    items_result = {'data': None, 'error': None}

    # todo - row count befor result list
    # todo - how to load dynamically the items? fetch one after another and
    # make a datastream?
    with con.cursor() as cursor:
        sql = 'select item.id, item.title, item.publisher, ac.name, ac.lastname from '\
            'dnb_item item, dnb_author_item ai, dnb_author_count ac ' \
            'where item.year >= %s and item.year <= %s and item.id = ai.i_id and '\
            'ai.a_id = ac.id limit 20'
        try:
            cursor.execute(sql, (years[0], years[1]))
        except:
            items_result['error'] = str(sys.exc_info()[0])
        else:
            res = cursor.fetchall()
            items_result['data'] = utils.extract_publisher_name(res)
    con.close()
    return jsonify(items_result)


@app.route('/setFilterForYearPersonResultYear', methods=['POST'])
def filter_by_year_person_result_year():
    con = open_db_connection()
    params = json.loads(request.data.decode('utf-8'))
    year_result = {'data': None, 'error': None}

    with con.cursor() as cursor:
        sql = 'select a_id id, count(a_id) as count, year from dnb_author_item '\
            'where a_id = %s GROUP by a_id, year'
        try:
            cursor.execute(sql, (params['person_id']))
        except:
            year_result['error'] = str(sys.exc_info()[0])
        else:
            year_result['data'] = cursor.fetchall()
    con.close()
    return jsonify(year_result)


# todo in extra fkt und dazu noch das netzwerk
@app.route('/setFilterForYearPersonResultTopic', methods=['POST'])
def filter_by_year_person_result_topic():
    con = open_db_connection()
    params = json.loads(request.data.decode('utf-8'))
    topic_result = {'data': {}, 'error': None}
    t = []

    with con.cursor() as cursor:
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

        topic_result['data'] = t
    con.close()

    return jsonify(topic_result)


@app.route('/setFilterForYearPersonResultItems', methods=['POST'])
def filter_by_year_person_result_items():
    con = open_db_connection()
    params = json.loads(request.data.decode('utf-8'))
    items_result = {'data': {}, 'error': None}

    with con.cursor() as cursor:
        sql = 'select ai.i_id id, ai.year, item.title, ac.name, ac.lastname from dnb_author_item ai, '\
            'dnb_item item, dnb_author_count ac where  ai.a_id =%s and ai.year >= %s and ai.year <=%s '\
            'and ai.i_id = item.id and ai.a_id = ac.id'
        try:
            cursor.execute(sql, (params['person_id'],
                                 params['min_year'], params['max_year']))
        except:
            items_result['error'] = str(sys.exc_info()[0])
        else:
            res = cursor.fetchall()
            items_result['data'] = utils.extract_publisher_name(res)
    con.close()
    return jsonify(items_result)


@app.route('/setFilterForPersonTopicResultYear', methods=['POST'])
def filter_by_person_topic_result_year():
    con = open_db_connection()
    params = json.loads(request.data.decode('utf-8'))
    year_result = {'data': {}, 'error': None}

    with con.cursor() as cursor:
        sql = 'select count(ai.i_id) count, ai.year from dnb_author_item ai, dnb_item_topic it '\
            'where ai.a_id =%s and it.t_id = %s and ai.i_id = it.i_id group by ai.year'
        try:
            cursor.execute(sql, (params['person_id'], params['topic_id']))
        except:
            year_result['error'] = str(sys.exc_info()[0])
        else:
            year_result['data'] = cursor.fetchall()
    con.close()
    return jsonify(year_result)


@app.route('/setFilterForPersonTopicResultTopic', methods=['POST'])
def filter_by_person_topic_result_topic():
    con = open_db_connection()
    params = json.loads(request.data.decode('utf-8'))
    topic = []
    with con.cursor() as cursor:
        sql = 'select a.t_id id, tc.keyword, a.count from dnb_author_topic a '\
            'inner join dnb_topic_count tc on a.t_id= tc.id '\
            'where a.a_id=%s and a.t_id=%s'
        cursor.execute(sql, (params['person_id'], params['topic_id']))
        topic = cursor.fetchone()
    topic_result = qh.get_topics_for_person_topic(
        params['person_id'], params['topic_id'], con)
    con.close()
    if len(topic_result['data']) > 0:
        topic_result['data'].append(topic)
    else:
        topic_result['data'] = [topic]
    return jsonify(topic_result)


@app.route('/setFilterForPersonTopicResultItems', methods=['POST'])
def filter_by_person_topic_result_items():
    con = open_db_connection()
    params = json.loads(request.data.decode('utf-8'))
    items_result = {'data': {}, 'error': None}

    with con.cursor() as cursor:
        sql = 'select item.id, item.title, item.publisher, ac.name, ac.lastname '\
            'from dnb_item item, dnb_author_item ai, dnb_author_count ac, dnb_item_topic it '\
            'where ai.a_id =%s and it.t_id = %s and item.id = ai.i_id '\
            'and ai.a_id = ac.id and ai.i_id = it.i_id limit 100'
        try:
            cursor.execute(sql, (params['person_id'], params['topic_id']))
        except:
            items_result['error'] = str(sys.exc_info()[0])
        else:
            res = cursor.fetchall()
            items_result['data'] = utils.extract_publisher_name(res)
    con.close()
    return jsonify(items_result)


@app.route('/setFilterForYearTopicResultYear', methods=['POST'])
def filter_by_year_topic_result_year():
    con = open_db_connection()
    params = json.loads(request.data.decode('utf-8'))
    year_result = {'data': {}, 'error': None}

    with con.cursor() as cursor:
        sql = 'select count(ai.i_id) count, ai.year from dnb_author_item ai, dnb_item_topic it '\
            'where it.t_id = %s and ai.i_id = it.i_id group by ai.year'
        try:
            cursor.execute(sql, (params['topic_id']))
        except:
            year_result['error'] = str(sys.exc_info()[0])
        else:
            year_result['data'] = cursor.fetchall()
        cursor.close()
    return jsonify(year_result)


@app.route('/setFilterForYearTopicResultTopic', methods=['POST'])
def filter_by_year_topic_result_topic():
    con = open_db_connection()
    params = json.loads(request.data.decode('utf-8'))
    topic = []
    with con.cursor() as cursor:
        sql = 'select it.t_id id, tc.keyword, count(it.t_id) count '\
            'from dnb_item_topic it inner join dnb_topic_count tc '\
            'on it.t_id = tc.id where it.year >= %s and it.year <= %s '\
            'and it.t_id = %s'
        cursor.execute(sql, (params['min_year'], params[
                       'max_year'], params['topic_id']))
        topic = cursor.fetchone()
    topic_result = qh.get_topics_for_year_topic(params['topic_id'],
                                                params['min_year'], params['max_year'], con)
    con.close()
    if len(topic_result['data']) > 0:
        topic_result['data'].append(topic)
    else:
        topic_result['data'] = [topic]
    return jsonify(topic_result)


@app.route('/setFilterForYearTopicResultPerson', methods=['POST'])
def filter_by_year_topic_result_person():
    con = open_db_connection()
    params = json.loads(request.data.decode('utf-8'))
    person_result = {'data': {}, 'error': None}

    with con.cursor() as cursor:
        sql = 'select ac.id, ac.lastname, ac.name, count(ai.a_id) count '\
            'from dnb_author_count ac, dnb_author_item ai, dnb_item_topic it '\
            'where  it.t_id = %s and it.year >= %s and it.year <= %s and it.i_id = ai.i_id '\
            'and ac.id = ai.a_id group by ai.a_id order by count desc limit 20'
        try:
            cursor.execute(sql, (params['topic_id'],
                                 params['min_year'], params['max_year']))
        except:
            person_result['error'] = str(sys.exc_info()[0])
        else:
            person_result['data'] = cursor.fetchall()
    con.close()
    return jsonify(person_result)


@app.route('/setFilterForYearTopicResultItems', methods=['POST'])
def filter_by_year_topic_result_items():
    con = open_db_connection()
    params = json.loads(request.data.decode('utf-8'))
    items_result = {'data': {}, 'error': None}

    with con.cursor() as cursor:
        sql = 'select item.id, item.title, item.publisher, ac.name, ac.lastname '\
            'from dnb_item item, dnb_author_item ai, dnb_author_count ac, dnb_item_topic it '\
            'where ai.year >= %s and ai.year <= %s and it.t_id = %s and '\
            'item.id = ai.i_id and ai.a_id = ac.id limit 100'
        try:
            cursor.execute(sql, (params['min_year'],
                                 params['max_year'], params['topic_id']))
        except:
            items_result['error'] = str(sys.exc_info()[0])
        else:
            res = cursor.fetchall()
            items_result['data'] = utils.extract_publisher_name(res)
    con.close()
    return jsonify(items_result)


@app.route('/setFilterForYearPersonTopicResultYear', methods=['POST'])
def filter_by_year_person_topic_result_year():
    con = open_db_connection()
    params = json.loads(request.data.decode('utf-8'))
    year_result = {'data': {}, 'error': None}

    with con.cursor() as cursor:
        sql = 'select count(ai.i_id) count, ai.year from dnb_author_item ai, dnb_item_topic it '\
            'where it.t_id = %s and ai.a_id = %s and ai.i_id = it.i_id group by ai.year'
        try:
            cursor.execute(sql, (params['topic_id'], params['person_id']))
        except:
            year_result['error'] = str(sys.exc_info()[0])
        else:
            year_result['data'] = cursor.fetchall()
    con.close()
    return jsonify(year_result)


@app.route('/setFilterForYearPersonTopicResultTopic', methods=['POST'])
def filter_by_year_person_topic_result_topic():
    con = open_db_connection()
    params = json.loads(request.data.decode('utf-8'))

    t = {}
    with con.cursor() as cursor:
        sql = 'select ai.i_id, ai.year, it.t_id, item.title, tc.keyword from dnb_author_item ai, ' \
            'dnb_item_topic it, dnb_topic_count tc, dnb_item item where  ai.a_id = %s ' \
            'and ai.year >= %s and ai.year <= %s and it.t_id = %s and ai.i_id = it.i_id and '\
            'it.t_id = tc.id and item.id=ai.i_id'
        cursor.execute(sql, (params['person_id'],
                             params['min_year'], params['max_year'], params['topic_id']))
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
            t = {'id': key, 'keyword': topics[key][
                'keyword'], 'count': topics[key]['count']}

    topic_result = qh.get_topics_for_year_person_topic(params['person_id'], params['topic_id'],
                                                       params['min_year'], params['max_year'], con)
    con.close()
    if len(topic_result['data']) > 0:
        topic_result['data'].append(topic)
    else:
        topic_result['data'] = [topic]
    return jsonify(topic_result)


@app.route('/setFilterForYearPersonTopicResultItems', methods=['POST'])
def filter_by_year_person_topic_result_items():
    con = open_db_connection()
    params = json.loads(request.data.decode('utf-8'))
    items_result = {'data': {}, 'error': None}

    with con.cursor() as cursor:
        sql = 'select item.id, item.title, item.publisher, ac.name, ac.lastname '\
            'from dnb_item item, dnb_author_item ai, dnb_author_count ac, dnb_item_topic it '\
            'where ai.a_id =%s and ai.year >= %s and ai.year <= %s and it.t_id = %s and '\
            'item.id = ai.i_id and ai.a_id = ac.id and ai.i_id = it.i_id limit 100'
        try:
            cursor.execute(sql, (params['person_id'], params['min_year'],
                                 params['max_year'], params['topic_id']))
        except:
            items_result['error'] = str(sys.exc_info()[0])
        else:
            res = cursor.fetchall()
            items_result['data'] = utils.extract_publisher_name(res)
    con.close()
    return jsonify(items_result)


@app.route('/getItem', methods=['POST'])
def get_item():
    con = open_db_connection()
    item_id = request.data.decode('utf-8')
    item_result = {'data': {'item': {},
                            'person': [], 'keyword': []}, 'error': None}

    with con.cursor() as cursor:
        sql = 'select * from dnb_item where id = %s'
        try:
            cursor.execute(sql, (item_id))
        except:
            item_result['error'] = str(sys.exc_info()[0])
        else:
            item_result['data']['item'] = cursor.fetchone()

        sql = 'select ac.id, ac.lastname, ac.name from dnb_author_item ai, dnb_author_count ac where ai.i_id = %s and ai.a_id = ac.id'
        try:
            cursor.execute(sql, (item_id))
        except:
            item_result['error'] = str(sys.exc_info()[0])
        else:
            item_result['data']['person'] = cursor.fetchall()

        sql = 'select tc.id, tc.keyword from dnb_item_topic it, dnb_topic_count tc where it.i_id=%s and it.t_id = tc.id'
        try:
            cursor.execute(sql, (item_id))
        except:
            item_result['error'] = str(sys.exc_info()[0])
        else:
            item_result['data']['keyword'] = cursor.fetchall()
    con.close()
    return jsonify(item_result)


@app.route('/searchForPerson', methods=['POST'])
def search_for_person():
    con = open_db_connection()
    query = request.data.decode('utf-8')
    query_result = {'data': {}, 'error': None}

    with con.cursor() as cursor:
        sql = 'select id, lastname, name from dnb_author_count where lastname like %s  order by count desc limit 3'
        try:
            cursor.execute(sql, (query + '%'))
        except:
            query_result['error'] = str(sys.exc_info()[0])
        else:
            query_result['data'] = cursor.fetchall()
    con.close()
    return jsonify(query_result)


@app.route('/searchForTopic', methods=['POST'])
def search_for_topic():
    con = open_db_connection()
    query = request.data.decode('utf-8')
    query_result = {'data': {}, 'error': None}

    with con.cursor() as cursor:
        sql = 'select id, keyword from dnb_topic_count where keyword like %s order by count desc limit 3'
        try:
            cursor.execute(sql, (query + '%'))
        except:
            query_result['error'] = str(sys.exc_info()[0])
        else:
            query_result['data'] = cursor.fetchall()
    con.close()
    return jsonify(query_result)


@app.route('/getTopTopicNetwork')
def get_top_topic_network():
    con = open_db_connection()
    network_result = {'data': []}
    result = qh.get_default_topics(con)
    network_result['data'] = qh.combine_topics_with_queries(result, con)
    con.close()
    return jsonify(network_result)


@app.route('/getTopicNetworkFilterYear', methods=['POST'])
def get_topic_network_filter_year():
    con = open_db_connection()
    years = json.loads(request.data.decode('utf-8'))
    network_result = {'data': []}
    result = qh.get_topics_for_year(years, con)
    network_result['data'] = qh.combine_topics_with_queries(
        result['data'], con)
    con.close()
    return jsonify(network_result)


@app.route('/getTopicNetworkFilterPerson', methods=['POST'])
def get_topic_network_filter_person():
    con = open_db_connection()
    person_id = request.data.decode('utf-8')
    network_result = {'data': []}
    result = qh.get_topics_for_person(person_id, con)
    network_result['data'] = qh.combine_topics_with_queries(
        result['data'], con)
    print(network_result)
    con.close()
    return jsonify(network_result)


@app.route('/getTopicNetworkFilterTopic', methods=['POST'])
def get_topic_network_filter_topic():
    con = open_db_connection()
    topic_id = request.data.decode('utf-8')
    network_result = {'data': []}
    result = qh.get_topics_for_topics(topic_id, con)
    network_result['data'] = qh.combine_topics(result['data'], topic_id)
    con.close()
    return jsonify(network_result)


@app.route('/getTopicNetworkFilterYearTopic', methods=['POST'])
def get_topic_network_filter_year_topic():
    con = open_db_connection()
    network_result = {'data': []}
    params = json.loads(request.data.decode('utf-8'))
    result = qh.get_topics_for_year_topic(params['topic_id'], params['min_year'],
                                          params['max_year'], con)
    network_result['data'] = qh.combine_topics(
        result['data'], params['topic_id'])
    con.close()
    return jsonify(network_result)


@app.route('/getTopicNetworkFilterPersonTopic', methods=['POST'])
def get_topic_network_filter_person_topic():
    con = open_db_connection()
    network_result = {'data': []}
    params = json.loads(request.data.decode('utf-8'))
    result = qh.get_topics_for_person_topic(params['person_id'], params['topic_id'],
                                            con)
    network_result['data'] = qh.combine_topics(
        result['data'], params['topic_id'])
    con.close()
    return jsonify(network_result)


@app.route('/getTopicNetworkFilterYearPersonTopic', methods=['POST'])
def get_topic_network_filter_year_person_topic():
    con = open_db_connection()
    network_result = {'data': []}
    params = json.loads(request.data.decode('utf-8'))
    result = qh.get_topics_for_year_person_topic(params['person_id'], params['topic_id'],
                                                 params['min_year'], params['max_year'], con)
    network_result['data'] = qh.combine_topics(
        result['data'], params['topic_id'])
    con.close()
    return jsonify(network_result)
