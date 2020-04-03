FROM python:alpine
ENV PYTHONPATH /app

# Assume this is wth apps/server as context
EXPOSE 5000
WORKDIR /app
COPY . ./
RUN apk add --no-cache --virtual .build-deps \
    gcc \
    python3-dev \
    musl-dev \
    postgresql-dev \
    && pip install --trusted-host pypi.python.org --trusted-host files.pythonhosted.org --trusted-host pypi.org -r requirements.txt
WORKDIR server
CMD python main.py