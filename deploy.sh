#!/bin/sh
echo "当前目录:"
echo shellPath=$(cd `dirname $0`; pwd)
echo "------------------------step1: 是否编译生产版本------------------------"
read -t 60 -p "是否重新编译 默认编译（0:编译/1:不编译）:" paramPackage
echo ""
echo ""
echo ""
if [ ! -n "$paramPackage" ] ||  [ "$paramPackage" = "0" ] ;then
    echo "------------------------step2: 请选择当前编译环境 dev/test/sit/prod------------------------"
    read -t 60 -p "请选择当前编译环境 dev/test/sit/prod:" profile
    echo ""
    echo ""
    echo ""
    cat ./smart-ui/config/$profile.env.js
    read -p "按任意键继续"
fi
echo "------------------------step3: 选择推送服务器------------------------"
deploy() {
    echo 代码推送中... $1
    ssh root@$1 rm -rf /workspaces/html/smart-ui
    ssh root@$1 rm -rf /workspaces/html/smart-im-server
    ssh root@$1 rm -rf /workspaces/html/smart-exhibit
    echo 清空原有发布项目...
    ssh root@$1 mkdir -p /workspaces/html/smart-ui/dist
    ssh root@$1 mkdir -p /workspaces/html/smart-im-server
    ssh root@$1 mkdir -p /workspaces/html/smart-exhibit
    echo 代码推送smart-im-server...
    echo `scp -r ./smart-im-server root@$1:/workspaces/html`
    echo 代码推送smart-ui...
    echo `scp -r ./smart-ui/dist root@$1:/workspaces/html/smart-ui`
    echo 代码推送smart-exhibit...
    echo `scp -r ./smart-exhibit/dist root@$1:/workspaces/html/smart-exhibit`
    echo nginx.config推送...
    echo `scp nginx.conf root@$1:/workspaces/nginx`
    echo 代码推送结束... $1
    ssh root@$1 docker restart nginx
    echo 重启nginx
}
echo "选择需要推送的服务器编号，默认all 全部推送  多选:0123"
echo "all:全部"
echo "0:192.168.11.167-内网测试机-1"
echo "1:192.168.11.168-内网测试机-2"
echo "2:39.104.87.198-应用阿里测试机-1"
echo "3:39.104.57.251-应用阿里测试机-2"
hosts=(192.168.11.167 192.168.11.168 39.104.87.198 39.104.57.251)
read -t 60 -p "（0/1/2/3）:" paramHost
if [ ! -n "$paramPackage" ] ||  [ "$paramPackage" = "0" ] ;then
    echo ""
    echo "正在重新编译:"
    cd smart-ui
    npm run build:$profile
    sleep 3
fi
if [ ! -n "$paramHost" ] || [ "$paramHost" = "all" ] ;then
  for host in ${hosts[@]}
  do
    deploy ${host}
  done
fi
if [[ $paramHost =~ "0" ]] ;then
  deploy ${hosts[0]}
fi
if [[ $paramHost =~ "1" ]] ;then
  deploy ${hosts[1]}
fi
if [[ $paramHost =~ "2" ]] ;then
  deploy ${hosts[2]}
fi
if [[ $paramHost =~ "3" ]] ;then
  deploy ${hosts[3]}
fi
