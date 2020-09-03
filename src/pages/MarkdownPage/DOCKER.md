
> Настройка.

```
sudo groupadd docker
sudo usermod -aG docker $USER
exit
```

> Собрать образ 

```
docker build -t parser:1 .
```

> Пробросить порт. Передать переменные окружения. Запустить контейнер.

```
docker run -d -p 3010:3010 -e FINEPROXY_LOGIN=login -e FINEPROXY_PASSWORD=pass --shm-size=1gb parser:1
```

> Запустить и зайти в контейнер.

```
docker run -it -e FINEPROXY_LOGIN=login -e FINEPROXY_PASSWORD=pass parser:1 sh
```

> Запустить контейнер в фоне.

```
docker run -d -e FINEPROXY_LOGIN=login -e FINEPROXY_PASSWORD=pass parser:1
```

> Рестарт несколько контейнеров.

```
for i in {1..24}; do docker restart parser:$i; done
// или
docker restart parser-{1..24}
```

> Выполнить команду для нескольких контейнеров.

```
for i in {1..24}; do docker exec -it parser:$i ls -lah runtime/; done
```