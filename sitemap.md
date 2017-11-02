# Landingpage

Zeitstrahl: immer einen kleinen als Filter
            nach dem Filtern -> großer als Filteransicht / -zoom

## No filter (false-false-false)

* Time: default (all Items over Year)
* Person: default (top 20)
* Topics: default (top 20)

## Time filter (true-false-false)

* Time:  
    - show mini timeline for complete dataset
    - show expand version of time filter `[{year, count}, {}, {}, ..]`
* Person: 
    - setFilterForYearResultPerson
    - `[{id, name, lastname, count}, {}, {}, {}, ..]`
* Topics: default (top 20)
    - setFilterForYearResultTopic
    - `[{id, keyword, count}, {}, {}, ..]`

## Person filter (false-true-false)
* Time: 
    - ?
* Person: coautoren und ähnliche autoren
* Topics: 
    - setFilterForPersonResultTopic
    - `[{id, keyword, count}, {}, {}, ..]`

## Topic filter (false-false-true)
* Time: ?
* Person: 
    - setFilterForTopicResultPerson
    - `[{id, name, lastname, count}, {}, {}, {}, ..]`
* Topics: ähnliche / verknüpfte topics

## Person and Topic filter (false-true-true)
* Time: ?
* Person: coautoren und ähnliche autoren mit diesem thema
* Topics: ähnliche / verknüpfte topics von diesem autor


## Time and Person filter (true-true-false)

* Time: ?
* Person: coautoren und ähnliche autoren innerhalb des Zeitpunkts
* Topics: 
    - setFilterForYearPersonResultTopic
    - `[{id, keyword, count}, {}, {}, ..]`

## Time and Topic filter (true-false-true)
* Time: ?
* Person: 
    - setFilterForTimeTopicResultPerson
    - `[{id, name, lastname, count}, {}, {}, {}, ..]`
* Topics: ähnliche / verknüpfte topics innerhalb des Zeitpunkts

## Time, Person and Topic filter (true-true-true)
* Time: ?
* Person: coautoren und ähnliche autoren innerhalb des Zeitpunkts zu diesem Thema
* Topics: ähnliche / verknüpfte topics innerhalb des Zeitpunkts von dieser person


# Person Page

## No filter (false-false-false)

* Time: default (all Items over Year)
* Person: top 50 mit Lebensdaten

## Time filter (true-false-false)

* Time: ?
* Person: top 50 für Zeitraum mit Lebensdaten

## Person filter (false-true-false)
* Time: ?
* Person: coautoren und ähnliche autoren (50)

## Topic filter (false-false-true)
* Time: ?
* Person: alle Personen die zum Thema publiziert haben (50)

## Person and Topic filter (false-true-true)
* Time: ?
* Person: coautoren und ähnliche autoren (50) zum Thema

## Time and Person filter (true-true-false)

* Time: ?
* Person: coautoren und ähnliche autoren innerhalb des Zeitraums (50)

## Time and Topic filter (true-false-true)
* Time: ?
* Person: alle Personen die zum Thema publiziert haben innerhalb des Zeitraums (50)

## Time, Person and Topic filter (true-true-true)
* Time: ?
* Person: coautoren und ähnliche autoren der ausgewählten Person die zum Thema publiziert haben innerhalb des Zeitraums (50)


---- ab hier weiter -----
# Topic Page

## No filter (false-false-false)

* Time: default (all Items over Year)
* Topics: Netzwerk der Top 50 

## Time filter (true-false-false)

* Time: ?
* Topics: Netzwerk der Top 50 für Zeitspanne und wie häufig sie miteinander auftretem

## Person filter (false-true-false)
* Time: ?
* Topics: Netzwerk der Top 50 Themen der Person und wie häufig sie miteinander auftretem

## Topic filter (false-false-true)
* Time: ?
* Topics: verwandte themen zu diesem thema und wie häufig sie miteinander auftretem

## Person and Topic filter (false-true-true)
* Time: ?
* Topics: netzwerk der 50 verwandte themen einer person und des ausgewählten themas sowie die verknüpfung


## Time and Person filter (true-true-false)

* Time: ?
* Topics: Netzwerk der Top 50 Themen der Person innerhalb der Zeitspanne und wie häufig sie miteinander auftretem

## Time and Topic filter (true-false-true)
* Time: ?
* Topics: Netzwerk der Top 50 verwandte Themen innerhalb der Zeitspanne und wie häufig sie miteinander auftretem

## Time, Person and Topic filter (true-true-true)
* Time: ?
* Topics: Netzwerk der Top 50 verwandte Themen einer person+thema innerhalb der Zeitspanne und wie häufig sie miteinander auftretem

--readme content
# DNB Prototype

# Install

```
sudo pip3 install Flask
pip3 install PyMySQL
```

```
cd static/prototype
npm install
```

# Development

## Server

```
export FLASK_APP=server.py
flask run
```

## Angular

```
npm start
```

## Browser
```
http://127.0.0.1:4200/
```
