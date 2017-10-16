# Landing Page (no Filter) (time-author-topic)(false-false-false)

* Z: `select * from dnb_year_count where year > 1000 and year < 2021`
* A: `select * from dnb_author_count order by count DESC limit 20` - is it faster to have a top 100 table?
* T: `select * from dnb_topic_count order by count DESC limit 20` - same q as above

# Set Time Filter (true-false-false)

* A: `select a_id, count(a_id) count from dnb2.dnb_author_item where year > 1999 and year < 2006 group by a_id order by count desc` (5sek)
* T1: `select it.t_id, count(t_id) count from dnb2.dnb_item_topic it where it.year > 1999 and it.year < 2006 group by t_id order by count desc` - (< 1sek)
* T2: `select it.t_id, tc.keyword, count(t_id) count from dnb2.dnb_item_topic it inner join dnb2.dnb_topic_count tc on tc.id=it.t_id where it.year > 1999 and it.year < 2006 group by t_id order by count desc` -- toooo long (12 sek)

# Set Author (false-true-false)

* Z: `select year, count(i_id) count from dnb2.dnb_author_item where a_id = '118540238' group by year`
* A: ``
* T: `select * from dnb2.dnb_author_topic where a_id = '118540238' order by count desc limit 20` - namen noch auflisten

# Set Topic (false-false-true)

* Z: `select year, count(t_id) from dnb2.dnb_item_topic where t_id = '10160' group by year`
* A: `select * from dnb2.dnb_author_topic where t_id = '10160' order by count desc limit 20` - namen fehlen, dauert lang
* T: 

# Set Author and Time (true-true-false)

* Z: `select a_id, count(a_id) as count, year from dnb2.dnb_author_item where a_id = '118540238' and year > 1899 and year < 2005 GROUP by a_id, year` - sehr schnell
* A:
* T: `select a.a_id, i.t_id,count(i.t_id) count from dnb2.dnb_author_item a inner join dnb2.dnb_item_topic i on i.i_id = a.i_id  where a.a_id = '118540238' and a.year > 1999 and a.year < 2002 group by i.t_id`

# Set Topic and Time (true-false-true)

* Z: `select t_id, count(t_id) as count, year from dnb2.dnb_item_topic where t_id='10160' and year > 1999 and year < 2005 group by t_id, year`
* A:``
* T: `select a.t_id, count(a.t_id) count, a.year from dnb2.dnb_item_topic a inner join dnb2.dnb_author_item b on a.i_id = b.i_id  where a.t_id = '10160' and a.year > 1999 and a.year < 2002 group by a.year`

# Set Topic-Author-Time (true-true-true)

* Z:
* A: 
* T: 

# Expand Time View

* A: `select a_id, year, count(a_id) count from dnb2.dnb_author_item where year > 1999 and year < 2006 group by a_id, year order by count desc` - (5sek) 
* T1: `select it.t_id, it.year, count(t_id) count from dnb2.dnb_item_topic it where it.year > 1999 and it.year < 2006 group by t_id, year order by count desc` - (1sek)
* T2: `select it.t_id, tc.keyword, it.year, count(t_id) count from dnb2.dnb_item_topic it inner join dnb2.dnb_topic_count tc on tc.id=it.t_id where it.year > 1999 and it.year < 2006 group by t_id, year order by count desc` - (13sek)


# Sonstiges

* alle themen eines autors in einem zeitraum auf zeit und thema gezählt: `select a.a_id, a.year, i.t_id,count(i.t_id) count from dnb2.dnb_author_item a inner join dnb2.dnb_item_topic i on i.i_id = a.i_id  where a.a_id = '118540238' and a.year > 1999 and a.year < 2002 group by i.t_id, a.year`


12:34:37    select a.a_id, a.year, i.t_id,count(i.t_id) count from dnb2.dnb_author_item a inner join dnb2.dnb_item_topic i on i.i_id = a.i_id  where a.a_id = '118540238' and a.year > 1999 and a.year < 2002 group by i.t_id, i.year   Error Code: 1055. Expression #2 of SELECT list is not in GROUP BY clause and contains nonaggregated column 'dnb2.a.year' which is not functionally dependent on columns in GROUP BY clause; this is incompatible with sql_mode=only_full_group_by   0.00036 sec
