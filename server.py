from flask import Flask, jsonify
import pymysql.cursors

app = Flask(__name__, static_url_path='')

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
