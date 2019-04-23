#!/bin/bash
echo 启动IM-server
nohup npm start &
nginx -g 'daemon off;'
echo 启动IM-server 完毕
