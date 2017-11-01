from flask import Flask, jsonify, request
from flask_cors import CORS  # remove for production
import json
from datetime import datetime
import pymysql.cursors

app = Flask(__name__, static_url_path='')
CORS(app)  # remove for production

connection = pymysql.connect(host='127.0.0.1',
                             user='root',
                             password='',
                             db='dnb2',
                             charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)


def avoidSmallPercentage(values, threshold):
    missing_percentage = 0
    percentage_above_threshold = 0

    # Find out how much percentage is missing and how much is above the
    # threshold
    for value in values:
        if (value['percentage'] < (threshold)):
            missing_percentage += threshold - value['percentage']
        else:
            percentage_above_threshold += value['percentage']

    # This method is not completly clean. The sum of the resulting percentages
    # are above 100 if items are higher than the threshold but would fall
    # below if subtracted.
    if (missing_percentage > 0):
        for value in values:
            # Calculate the needed subtraction
            value_subtraction = value['percentage'] / \
                percentage_above_threshold * missing_percentage
            # Check if item would be below threshold after subtraction
            if (value['percentage'] - value_subtraction < (threshold)):
                value['percentage'] = (threshold)
            else:
                value['percentage'] = value['percentage'] - value_subtraction

    return values


def getTopicsPercentage(topics):
    number_of_bins = 5  # The number of columns the visualization has
    threshold_percentage = 10

    # Calculate the percentage each topic has
    total = sum(topic['count'] for topic in topics)
    for topic in topics:
        topic['percentage'] = topic['count'] * 100 / total

    # Recalculate to have no values below threshold
    topics = avoidSmallPercentage(
        topics, threshold_percentage / number_of_bins)

    # The percentage each column should hold
    percentage_per_bin = 100 / number_of_bins
    bins = [[] for _ in range(number_of_bins)]  # Create arrays for each column

    # Distribute the topics to the bins
    for bin in bins:
        for topic in topics:
            if (sum(topic['percentage'] for topic in bin) < percentage_per_bin):
                bin.append(topic)
                topics.remove(topic)

    # Sort bins to have the one least filled at front
    bins.sort(key=lambda bin: sum(topic['percentage']
                                  for topic in bin), reverse=True)

    # Distribute the remaining topics to the columns
    current_bin = 0
    for topic in topics:
        bins[current_bin].append(topic)
        current_bin += 1
        if current_bin == number_of_bins:
            current_bin = 0

    # Filter empty columns
    bins = list(filter(lambda bin: len(bin) != 0, bins))

    # Calculate the percentage each topic has of its column
    for bin in bins:
        total = sum(topic['percentage'] for topic in bin)
        for topic in bin:
            topic['percentage'] = topic['percentage'] * 100 / total

        # Recalculate again to have no values below threshold
        bin = avoidSmallPercentage(bin, threshold_percentage)

        # Sort items to have biggest at top
        bin.sort(key=lambda topic: topic['percentage'], reverse=True)

    # Sort bins to have the one with the highest first value first
    bins.sort(key=lambda bin: bin[0]['percentage'], reverse=True)

    # Sort bins to have the one with the least topics first
    # bins.sort(key = lambda bin: len(bin))

    return bins


@app.route('/')
def root():
    return app.send_static_file('dist/index.html')


@app.route('/getTopTopics')
def get_top_topics():
    with connection.cursor() as cursor:
        sql = 'select * from dnb_topic_count order by count DESC limit 20'
        cursor.execute(sql)
        result = cursor.fetchall()
        return jsonify(getTopicsPercentage(result))


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
        sql = 'select a.t_id id, tc.keyword, a.count from dnb_author_topic a '\
            'inner join dnb2.dnb_topic_count tc on a.t_id= tc.id '\
            'where a.a_id=%s order by count desc limit 20'
        try:
            cursor.execute(sql, (person_id))
        except:
            topic_result['error'] = str(sys.exc_info()[0])
        else:
            topic_result['data'] = getTopicsPercentage(cursor.fetchall())
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
        sql = 'select a.a_id id, ac.name, ac.lastname,a.count '\
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

    #
    #
    #
    #
    #
    #
    #
    #
    return jsonify(person_result)


@app.route('/setFilterForYearResultPerson', methods=['PUT'])
def filter_by_year_result_person():
    startTime = datetime.now()
    years = json.loads(request.data.decode('utf-8'))
    person_result = {'data': None, 'error': None}

    with connection.cursor() as cursor:
        # sql = 'select ai.a_id, ac.lastname, ac.name, count(ai.a_id) count '\
        #     'from dnb_author_item ai inner join dnb_author_count ac '\
        #     'on ai.a_id = ac.id where '\
        #     'ai.year > %s and ai.year < %s group by ai.a_id order by count desc limit 20'
        sql = 'select ai.a_id id, ac.lastname, ac.name, count(ai.a_id) count '\
            'from dnb_author_item ai, dnb_author_count ac '\
            'where ai.a_id = ac.id and ai.year > %s and ai.year < %s '\
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
            'on it.t_id = tc.id where it.year > %s and it.year < %s '\
            'group by it.t_id order by count desc limit 20'
        try:
            cursor.execute(sql, (years[0], years[1]))
        except:
            topic_result['error'] = str(sys.exc_info()[0])
        else:
            topic_result['data'] = getTopicsPercentage(cursor.fetchall())
    return jsonify(topic_result)


@app.route('/setFilterForYearPersonResultYear', methods=['PUT'])
def filter_by_year_person_result_year():
    params = json.loads(request.data.decode('utf-8'))
    year_result = {'data': None, 'error': None}

    with connection.cursor() as cursor:
        sql = 'select a_id id, count(a_id) as count, year from dnb_author_item '\
            'where a_id = %s and year > %s and year < %s GROUP by a_id, year'
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
            'and ai.year > %s and ai.year < %s and ai.i_id = it.i_id and it.t_id = tc.id and item.id=ai.i_id'

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

        topic_result['data'] = getTopicsPercentage(t)
    return jsonify(topic_result)


def seq_iter(obj):
    return obj if isinstance(obj, dict) else range(len(obj))
