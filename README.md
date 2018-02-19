# Worker Queue Starter
A simple starter app which implements a producer-consumer model
using a local RabbitMQ node as the message broker. This is a modified
version of one of RabbitMQ's [tutorials](https://www.rabbitmq.com/tutorials/tutorial-two-javascript.html) 
to support containerized services

## Usage
##### Install node dependencies
npm `npm install` or yarn `yarn install`

##### RabbitMQ
Generate a random cookie used to authenticate nodes in a [cluster](https://www.rabbitmq.com/clustering.html)

Windows / Unix (Requires [PowerShell](https://github.com/PowerShell/PowerShell))
``` bash
pwsh ./scripts/generate-cookie.ps1
```

Start a containerized node
```bash
docker-compose up
```

After the node is up you can connect to the web management portal 
[http://localhost:15672/](http://localhost:15672/)

Using the default creds User:`guest` Pass:`guest`

#### Start the example worker
This starts a worker listening for tasks in the queue hosted at RABBIT_HOST.

##### Locally
```bash
RABBIT_HOST=localhost node workers/example/worker.js
```
##### In a container
```bash
RABBIT_HOST=rabbit1 docker-compose -f docker-compose.yml -f workers/example/docker-compose.yml up -d
```

#### Submit a task to the queue
```bash
node new_task.js Task 1.
```
View logs of the processed task
```bash
docker-compose -f docker-compose.yml -f workers/example/docker-compose.yml logs -f worker_example
```