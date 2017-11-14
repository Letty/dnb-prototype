import itertools
import pymysql.cursors


def get_default_topics(connection):
    result = []
    with connection.cursor() as cursor:
        sql = 'select * from dnb_topic_count order by count DESC limit 20'
        cursor.execute(sql)
        result = cursor.fetchall()
    return result


def get_topics_for_year(years, connection):
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
            topic_result['data'] = cursor.fetchall()
    return topic_result


def get_topics_for_person(person_id, connection):
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
            topic_result['data'] = cursor.fetchall()
    return topic_result


def combine_topics(topics, connection):
    result = []
    topic_comb = list(itertools.combinations(topics, 2))

    with connection.cursor() as cursor:
        for t in topic_comb:
            r = {'source': t[0]['id'], 'target': t[1]['id'], 'strength': 0}

            sql = 'select count from dnb_topic_topic where t_id1=%s and t_id2=%s'
            cursor.execute(sql, (t[0]['id'], t[1]['id']))
            f = cursor.fetchone()
            if f != None:
                r['strength'] += f['count']

            cursor.execute(sql, (t[1]['id'], t[0]['id']))
            f = cursor.fetchone()
            if f != None:
                r['strength'] += f['count']

            result.append(r)
    return result
