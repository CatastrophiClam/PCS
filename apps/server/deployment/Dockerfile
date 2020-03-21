FROM python:alpine

# Assume this is wth apps/server as context
EXPOSE 5000
WORKDIR /app
COPY * ./
RUN pip install -r requirements.txt
CMD python main.py