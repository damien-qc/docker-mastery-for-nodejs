# Dockerfile node basics

## COPY, not ADD
    -> ADD can do much more, simpler and safer to use COPY

## npm/yarn install during build
    -> no need to install npm and yarn, already in the images
    -> can use npm or yarn, no need to upgrade them
    -> make sure to clean after yourself -> `npm install && npm cache clean --force`
        --> will make sure the image is as small as possible

## CMD node, not npm
    -> stick with node, skip npm -> `CMD ["node", "app.js"]`
    -> npm requires another application to run
    -> npm not as literal in Dockerfile, we want to be literal and specific
    -> npm doesn't work well as an init or PID 1 process in UNIX
    -> npm doesn't pass the signal from UNIX properly, node does

## use WORKDIR not run mkdir
    -> ```WORKDIR /usr/src/app```
    -> unless you need specific permissions (chown)

# From Base Image Guidelines
    -> stick to even numbered major releases
    -> don't use :latest tag
    -> start with Debian if migrating from pre docker to docker
        ### move to alpine when possible
        ### move to alpine when possible
        ### move to alpine when possible
    -> don't use :slim, very very small, need more tools most likely
    -> don't use :onbuild, will cause problems later on

# When to use Alpine images
    -> "small" and "sec focused"
    -> debian/ubuntu are now small too
    -> 100mb difference is not significant
    -> Alpine has it issues
    -> Alpine CVE Scanning fails: issue for vulnerability checking
    -> enterprises may require CentOS or ubuntu/debian: 

# Least Privilege: Use node user
    -> official node images have a node user
    -> but it's not used by default
    -> switch to node user AFTER APT/APK and npm i -g
    -> switch to node user before npm iinstall
    -> may cause write and permissions issues
    -> may require chown node:node
    -> Change user from root to node
        -> USER node
        -> RUN, CMD and ENTRYPOINT will use that user
    -> Set permissions on app dir
        -> RUN mkdir app && chown -R node:node .
    -> run a command as root in container
        -> docker compose exec -u root


### Examples:
```
    cd /user-node
    docker build -t usernode .
    docker run -it usernode bash
```

# Making Images Efficiently
    -> pick proper from image
    -> line order matters
    -> COPY twice:
        1. copy only the package and lock files (.json*)
        2. run npm install
        3. copy everything else
    -> one apt-get per Dockerfile
        -> apt-get update cache prob
        -> pin specific versions of the dependancies & package manager
    