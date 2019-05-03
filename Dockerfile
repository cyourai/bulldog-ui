FROM cyourai/nginx
MAINTAINER cyourai <cyourai@sina.com>

RUN mkdir -p /workspaces/html/bulldog-ui/dist
RUN chmod 777 /workspaces/html/bulldog-ui/dist

COPY ./dist /workspaces/html/bulldog-ui/dist
COPY entrypoint.sh /entrypoint.sh


# EXPOSE 映射端口
EXPOSE 80
WORKDIR /workspaces/html/bulldog-ui
# 启动Nginx服务 smart-im-server -容器启动时执行
#CMD exec nginx -g 'daemon off;' && nohup sh -c 'npm start'
CMD ["nginx", "-g", "daemon off;"]
# 容器启动后时执行
#ENTRYPOINT ["/entrypoint.sh"]
