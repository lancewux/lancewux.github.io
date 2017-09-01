<h1 align="center"> 授权 </h1>

HTTP Basic Authorization
-

HTTP基本认证是指Web浏览器或其他客户端程序发送请求时提供用户名加口令形式的凭证来进行身份认证。<a href="http://blog.csdn.net/dxswzj/article/details/39202217" target="blank"> HTTP Basic Authorization</a>

Base64算法编码（username：password ）

例如，用户名是: admin，口令是: admin123，拼接后的结果是: admin:admin123，然后再用Base64编码，得到YWRtaW46YWRtaW4xMjM=。然后放到头部Authorization: Basic YWRtaW46YWRtaW4xMjM=

认证过程：

**1** 客户端向服务器请求数据，
**2** 服务器返回401（Unauthorised）
**3** 符合http1.0或1.1规范的客户端（如IE，FIREFOX）收到401返回值时，将自动弹出一个登录窗口，要求用户输入用户名和密码。
**4** 用户输入用户名和密码后，将用户名及密码以BASE64加密方式加密，重新向服务器发起请求。
**5** 服务器解码认证信息，认证成功后返回请求的资源。

缺点： 安全性比较差

Key Authorization
-

根据用户生成key：secret的秘钥对，key和secret都是UUID，即通用唯一识别码 (Universally Unique Identifier)。

OAuth 2.0
-



