# Node Process Management

##  Node process management in containers
- no need for nodemon, forever or pm2 on server
- we'll use nodemon in dev for file watch later
- docker manages app start, stop, restart and healthcheck
- node multi-thread: docker can manages multiple "replicas"
- one npm/node problem: they dont listen for proper shutdown signals.

## The truth about the PID1 problem
- PID1 (process identifier) is the first process in a system (or container) (AKA init)
- init process in a container has 2 jobs:
    -- reap zombie processes
    -- pass signals to sub-processes
- zombie not a big node issue (so no need to handle them)
- focus on proper node shutdown

## Proper CMD for healthy shutdown
- Docker uses Linux signals to stop app (SIGINT / SIGTERM / SIGKILL )
- SIGINT / SIGTERM -> allow graceful STOP
- npm doesnt respond to SIGINT/SIGTERM
- node doesnt respond by default, but with code it can handle them properly
- Docker provides a init PID 1 replacement option (not needed if we properly handle the shutdown)

## Proper Node Shutdown Options
If we launch node directly inside the container, we have 3 options to handle shutdown (least to most prefered order)
- temp: use --init to fix ctrl-c for now (launch container with --init so it can respond to ctrl-c)
- workaround: add tini to your image
- production: your app captures SIGINT for proper exit

- Example:
    -- run any node app with --init to handle signals (temp solution)
    >docker run --init -d nodeapp
    -- add tini to your Dockerfile, then use it in CMD (permanent workaround)
    >RUN apk add --no-cache tini
    >ENTRYPOINT ["/sbin/tini", "--"]
    >CMD ["node","./bin/www"]

# Assignement 1
- Make a Dockerfile for an existing Node app
- use ./assignement-dockerfile/Dockerfile
- start with node 10.15 on alpine
- install tini, start node with tini
- copy package/lock files first, then npm, then clean, then copy

# Assignement 2
- use ./assignment-dockerfile/
- run with tini built in, try to ctrl-c
- run with tini built in, try to stop
- remove ENTRYPOINT, rebuild
- try to ctrl-c and stop
- add --init to run command, try ctrl-c/stop
- bonus: add signal watch code from ./sample-graceful-shutdown