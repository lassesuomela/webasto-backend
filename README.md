**Things needed to get this API running**

You need certifacate if you want ssl to work with Nginx. You can get free SSL certificate from [Cloudflare](https://www.cloudflare.com/). Even though its not needed for this API to work it is recommended to use HTTPS. You need SQL server and you need to store those credentials in .env file. Also you need to create an API_KEY that will be compared against clients key. Also there are docker files for you to get to work in docker container. Also you need a server to host this. I found mine on [LowEndTalk](https://lowendtalk.com/).

---

## Edit .env file

These need to be edited:

```
DB_HOST=IPADDRESS
DB_USERNAME=USERNAME
DB_PASSWORD=PASSWORD
DB_DATABASE=DATABASE

API_KEY=SECRET_API_KEY
```

---

## Edit nginx.conf file in reverse_proxy folder

```
ssl_certificate
ssl_certificate_key

server_name
```
---