FROM python:alpine

# Assume this is wth apps/server as context
EXPOSE 5000
WORKDIR /app
COPY * ./
RUN apk add --no-cache --virtual .build-deps \
    gcc \
    python3-dev \
    musl-dev \
    postgresql-dev \
    && pip install -r requirements.txt
CMD python main.py