.PHONY: up app down install webpack view

up:
	sudo docker-compose up -d

app:
	sudo docker exec -it itheatmap.github.page bash

down:
	sudo docker-compose down

npm:
	sudo docker exec itheatmap.github.page npm install --no-optional
	sudo docker exec itheatmap.github.page npm install --global webpack webpack-cli --no-optional

webpack:
	sudo docker exec itheatmap.github.page webpack -c "--mode=production"

install: up npm webpack

view:
	google-chrome index.html