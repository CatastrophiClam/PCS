# PCS

## Frontend

[Frontend Documentation](./webapp/README.md)

## Backend

## Docker

### Login to Docker

- `docker login --username=yourhubusername`
  - If you encounter an error message: "Error: Cannot perform an interactive login from a non TTY device",
    add `winpty` to the front of above command

### Push image to Docker

- Ensure that you have a repository created on DockerHub
- run `docker image ls` to view local images
- tag image with `docker tag local_repository/local_tag yourhubusername/hub_repository_name:hub_repository_tag
- push image to DockerHub with `docker push yourhubusername/hub_repository_name`

### Running Docker Images Note

- If any run command error out with `the input device is not a TTY`, put `winpty` before it and run it
- Both the postgres db and server run on the user created docker network "pcs_net". To create this
  network run `docker network create --driver bridge pcs_net`
