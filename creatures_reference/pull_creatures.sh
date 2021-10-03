#!/bin/bash
counter=1
while [ $counter -le 22 ]
do
	curl "https://api.open5e.com/monsters/?page=$counter" > "creature_page_$counter.json"
	((counter++))
done
