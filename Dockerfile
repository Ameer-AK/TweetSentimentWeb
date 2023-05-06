FROM python:3.8.10

WORKDIR /app
COPY . .

RUN pip install -r requirements.txt

RUN apt-get update
RUN apt-get update && apt-get install -y nodejs npm supervisor
RUN npm install

RUN cp supervisord.conf /etc/supervisor/conf.d/supervisord.conf


EXPOSE 8080
CMD ["/usr/bin/supervisord"]