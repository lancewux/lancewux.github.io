<h1 align="center">微服务</h1>

https://www.infoq.com/articles/seven-uservices-antipatterns

http://www.gartner.com/technology/research/methodologies/hype-cycle.jsp

https://www.nginx.com/solutions/api-gateway/

http://microservices.io/

https://www.nginx.com/blog/introduction-to-microservices/

https://www.nginx.com/blog/microservices-reference-architecture-nginx-proxy-model/

https://stackoverflow.com/questions/29894486/which-api-gateway-is-production-ready-and-provides-good-performance-features

http://apiaxle.com/docs/try-it-now/

Swagger OAuth YAML


hello-eureka\eureka-core\build.gradle 

testCompile "org.eclipse.jetty:jetty-server:$jetty_version" //added by hand

hello-eureka\eureka-server\src\test\java\com\netflix\eureka\resources\EurekaClientServerRestIntegrationTest.java

change 8080 to 8081

https://github.com/Netflix/eureka/wiki/Eureka-at-a-glance

https://www.npmjs.com/package/eureka-js-client

https://stackoverflow.com/questions/39127889/eureka-detect-service-status

http://blog.jobbole.com/72992/

https://springcloud.cc/

$TOMCAT_HOME/bin/catalina.sh start

consul
-

新建服务器节点：

10.162.24.231
192.168.122.1

consul agent -server -ui -client 127.0.0.1 -bootstrap-expect=1 \
 -data-dir=/tmp/consul -node=agent-one -bind=192.168.204.49 \
 -enable-script-checks=true -config-dir=/etc/consul.d

 consul agent -server -client 127.0.0.1 -bootstrap-expect=1 \
 -data-dir=/tmp/consul -node=agent-one -bind=10.162.24.231 \
 -enable-script-checks=true -config-dir=/etc/consul.d

consul agent -server -bootstrap-expect=1 \
-data-dir=/tmp/consul -node=agent-one -bind=192.168.204.49 \
-enable-script-checks=true -config-dir=/etc/consul.d

https://www.consul.io/docs/agent/options.html

/usr/local/services/nginx/sbin/nginx -s reload

查看节点：

consul members -http-addr=http://192.168.204.49:8500

curl http://127.0.0.1:8500/v1/catalog/nodes

查看服务（比如web）：

curl --request get http://127.0.0.1:8500/v1/catalog/service/web1

curl http://127.0.0.1:8500/v1/agent/services

查看ui：

curl http://192.168.204.49:8500/ui/

新建客户端节点：

consul agent -data-dir=/tmp/consul -node=agent-two \
-bind=127.0.0.1 -enable-script-checks=true -config-dir=/etc/consul.d

通过49节点加入集群：

consul join 192.168.204.49

重启客户端：

curl --request PUT http://localhost:8500/v1/agent/reload

关闭客户端：

curl --request PUT http://127.0.0.1:8500/v1/agent/leave



添加本地服务：

curl --request PUT --data '{"name": "hello", "tags": ["hwtrip"], "address": "192.168.204.49", "port": 7301}'  http://127.0.0.1:8500/v1/agent/service/register

删除服务：

curl --request PUT http://127.0.0.1:8500/v1/agent/service/deregister/hello


curl 127.0.0.1:3033/micro/hello/lance?age=6



npm install consul --save

npm install koa --save

curl -v --request POST \
-H "Authorization: basic aHd0cmlwd2ViOmh3dHJpcHdlYjIwMTc=" -H "Content-Type: application/json" \
--cookie "cname=cval" --data '{"name":"lance"}' \
http://192.168.204.49:3033/microa/hello/lance?age=6 -i

curl -v --request POST \
-H "Content-Type: application/json" \
--data '{"name":"lance"}' \
http://192.168.204.49:7301/micro/hello/lance?age=6 -i