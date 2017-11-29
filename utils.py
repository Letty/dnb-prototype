import ast
import json


def seq_iter(obj):
    return obj if isinstance(obj, dict) else range(len(obj))


def createTopicList(topics_result, topic_id):
    result_dict = {}
    result = []
    topic_id = int(topic_id)

    for t in topics_result:
        selector = ''
        if t['t_id1'] == topic_id:
            selector = 't_id2'
        else:
            selector = 't_id1'

        if t[selector] in result_dict:
            result_dict[t[selector]]
        else:
            result_dict[t[selector]] = {'count': 0, 'keyword': t['keyword']}

        result_dict[t[selector]]['count'] += t['count']

    for key in result_dict:
        result.append({'id': key, 'keyword': result_dict[key][
                      'keyword'], 'count': result_dict[key]['count']})

    # todo order result by count and limit to 20 entries
    return result


def extract_publisher_name(data):
    for r in data:
        if 'publisher' in r:
            if r['publisher'] != '':
                publisher_name = []
                p = ast.literal_eval(r['publisher'])
                j_ = json.dumps(p)
                j = json.loads(j_)
                for pub in j:
                    publisher_name.append(pub['name'])
                r['publisher'] = publisher_name
    return data
