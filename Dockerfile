FROM centos:centos7
MAINTAINER ctsi <ctsidr@qq.com>
# ENV 设置环境变量
ENV PATH /usr/bin;/usr/sbin:$PATH
# 挂载卷
#VOLUME /workspaces
# RUN 配置nginx/nodejs环境
RUN yum update -y
RUN yum -y install rpm crul vim gcc-c++ make yarn
RUN rpm -Uvh http://nginx.org/packages/centos/7/noarch/RPMS/nginx-release-centos-7-0.el7.ngx.noarch.rpm
RUN yum install -y nginx
RUN curl --silent --location https://rpm.nodesource.com/setup_8.x | bash -
RUN yum install -y nodejs
COPY smart-ui/dist /workspaces/html/smart-ui/dist
COPY smart-im-server /workspaces/html/smart-im-server
COPY nginx.conf /etc/nginx/nginx.conf
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
# EXPOSE 映射端口
EXPOSE 9526 9527 9528
# smart-im-server 启动
WORKDIR /workspaces/html/smart-im-server
RUN npm install
# 启动Nginx服务 smart-im-server -容器启动时执行
#CMD exec nginx -g 'daemon off;' && nohup sh -c 'npm start'
#CMD ["nginx", "-g", "daemon off;"]
# 容器启动后时执行
ENTRYPOINT ["/entrypoint.sh"]
