# Frontend

## Deployment

### Prod

1. Run `make build-prod-webapp` to build prod webapp image

- This makes an image called webapp:prod

2. Tag image for push with `docker tag webapp:prod catastrophiclam/pcs_frontend`
3. Push image with `docker push catastrophiclam/pcs_frontend`
4. Download image from dockerhub and run with `docker run -it -p 80:80 --rm pcs_frontend:prod`

### Development

1. Navigate to apps/webapp/app and run `npm start`
