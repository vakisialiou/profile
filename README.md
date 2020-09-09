# profile

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Docker build
```
docker build . -t profile
```

### Docker run
```
docker run -d -p 8080:80 profile
```

### Docker stop running container
```
// list running containers
docker ps
// CONTAINER ID - your running container
docker stop {CONTAINER ID}
```

### Server help
```
docker pull watchtower
docker pull containrrr/watchtower

docker ps
docker stop 560a393c0381
docker ps
docker pull valerykiseliou/profile
docker run -d -p 80:80 valerykiseliou/profile
```
