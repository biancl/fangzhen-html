FROM nginx
COPY . /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/
#RUN chown -R nginx:nginx /var/nginx && chmod -R 777 /var/nginx
EXPOSE 80
