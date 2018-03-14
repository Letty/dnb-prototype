# dnb-prototype

## Development Mode

Frontend

* cd to `static/prototype`
* run `npm install`
* run `ng build`

Backend

* go back to root dir
* Install dependencies `pip3 install flask pymysql`
* Import database dump into mysql 
* adjust db connection and database if needed in `server.py` line 14-19 
* Run Server with flask:
* `export FLASK_APP=server.py`
* `flask run`
* browse to: `localhost:5000`