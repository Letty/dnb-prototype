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

# Time Detail Page

## No filter (false-false-false)

* Time: default (all Items over Year)

## Time filter (true-false-false)

* Time: default (all Items over Year)
* Filtering timespan 

## Person filter (false-true-false)
* Time: default (all Items over Year)
* Person-Zeitleiste für ausgewählte Person

## Topic filter (false-false-true)
* Time: default (all Items over Year)
* Topics-Zeitleiste für ausgewähltes Thema

## Person and Topic filter (false-true-true)
* Time: Time: default (all Items over Year)
* Person-Zeitleiste für ausgewählte Person
* Topics-Zeitleiste für ausgewähltes Thema
* Ergebnis-Zeitleiste: Publikationen von Person zum Thema

## Time and Person filter (true-true-false)

* Time: Time: default (all Items over Year)
* Filtering timespan 
* Person-Zeitleiste für ausgewählte Person im Zeitraum

## Time and Topic filter (true-false-true)
* Time: Time: default (all Items over Year)
* Filtering timespan 
* Topic-Zeitleiste für ausgewählte Topic im Zeitraum

## Time, Person and Topic filter (true-true-true)
* Time: Time: default (all Items over Year)
* Filtering timespan 
* Person-Zeitleiste für ausgewählte Person im Zeitraum
* Topic-Zeitleiste für ausgewählte Topic im Zeitraum
* Ergebnis-Zeitleiste: Publikationen von Person zum Thema in Zeitraum

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
* Person: 
    - setFilterForYearResultPerson
    - `[{id, name, lastname, count}, {}, {}, {}, ..]`
* Topics: default (top 20)
    - setFilterForYearResultTopic
    - `[{id, keyword, count}, {}, {}, ..]`

## Person filter (false-true-false)
* Time: ?
* Person: ?
* Topics: 
    - setFilterForPersonResultTopic
    - `[{id, keyword, count}, {}, {}, ..]`

## Topic filter (false-false-true)
* Time: ?
* Person: 
    - setFilterForTopicResultPerson
    - `[{id, name, lastname, count}, {}, {}, {}, ..]`
* Topics: ?

## Person and Topic filter (false-true-true)
* Time: ?
* Person: ?
* Topics: ?


## Time and Person filter (true-true-false)

* Time: ?
* Person: ?
* Topics: 
    - setFilterForYearPersonResultTopic
    - `[{id, keyword, count}, {}, {}, ..]`

## Time and Topic filter (true-false-true)
* Time: ?
* Person: 
    - setFilterForTimeTopicResultPerson
    - `[{id, name, lastname, count}, {}, {}, {}, ..]`
* Topics: ?

## Time, Person and Topic filter (true-true-true)
* Time: ?
* Person: 
    - setFilterForTimeTopicResultPerson
    - `[{id, name, lastname, count}, {}, {}, {}, ..]`
* Topics: ?

//, dateofbirth, dateofdeath,