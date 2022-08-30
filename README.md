# Heres the frontend repo
[https://github.com/lassesuomela/webasto-web](https://github.com/lassesuomela/webasto-web)

## Things needed to get this API running

Notes:
 - Nginx is configured to only allow request from cloudflares ip addresses.
 - ./cloudflare.sh adds exception for cloudflares ip addresses to http and https ports

These steps are required to do:
1. Run `npm install` to install dependencies
2. Hash a secret key with bcrypt
3. MySQL server with webasto database provided in the sql file
4. Create and edit **.env** file
5. Run `npm start`

These are optional steps but required if you want to use nginx:
1. Configure reverse_proxy/nginx.conf with paths to SSL certificates and server_name
2. Configure docker-compose.yml with paths to SSL certificates 
3. Change config/auth.js files line `ipData.country !== 'FI'` from 'FI' to your country code or comment the whole if statement if you are running this locally. (Because it will not find a country code with local ip address and it will return 403 status code.)
4. If nginx is properly configurated you can run `./build.sh` and `./restart.sh` to build a docker image and run it
   
---

## Add **.env** file to the root folder

These need to be added with your own credentials:

```
DB_HOST=localhost
DB_USERNAME=root
DB_PASSWORD=root
DB_DATABASE=webasto
NODE_ENV=dev
TOKEN=some_secret_token
```
To hash your token type these to the terminal:
```
node
const bcrypt = require('bcrypt');
bcrypt.hash('secret', 10, (err, hash) => {console.log(hash)});
```

---

## Edit reverse_proxy/nginx.conf file
And change these to match your configuration if you want to use nginx as a reverse proxy. There is no need to change these if you want to run only the Node.js backend.

```
ssl_certificate
ssl_certificate_key

server_name
```
---

## Edit docker-compose.yml file

Private key and public key paths need to match your configuration. And if you need to change docker containers ports, you can do that here. But then `reverse_proxy/nginx.conf` proxy_pass need to reconfigured.
```
volumes:
      - ./reverse_proxy/nginx.conf:/etc/nginx/nginx.conf
      - /root/webasto-backend/public_key.pem:/root/webasto-backend/public_key.pem
      - /root/webasto-backend/private_key.key:/root/webasto-backend/private_key.key
	  
...

environment:
      - DOCKER_APP_PORT=8080
```

---

## Endpoints

All of these enpoints require an **API key** in the Authorization header of the request. Except `/robots.txt`.

These are the **GET** endpoints:

```
/api/timers
/api/timers/all
/api/status/:id
/api/temp
/api/temp/hour
/api/voltage
/api/voltage/hour
/api/logs
/api/logs/:page
/api/history/:page
/api/token
/api/uptime
/api/uptime/week
/ota/version
```
And these are the **POST** endpoints:
```
/api/login
/api/secret
/api/secret/remove
/api/timers
/api/status/:id
/api/temp
/api/voltage
/api/logs
/api/uptime
/ota/upload
```
---
## Usage

Bearer Authorization token needs to be set in every request. That token can be either API KEY from Database or it can also be JWT that you get from loggin in.

GET example request: http://localhost:8080/api/timers.
This will return JSON object with these key value pairs:
```
{
	"time": "06:59:00",
	"time2": "13:25:00",
	"enabled": 1,
	"enabled2": 1,
	"onTime": 10
}
```
Another example to http://localhost:8080/api/logs
```
{
	"status": "success",
	"data": {
		"startTime": "02:27:00",
		"endTime": "02:37:00",
		"onTime": 10,
		"timestamp": "2022-05-30T02:27:32.000Z"
	}
}
```

POST example request: http://localhost:8080/api/voltage.
and in the request body:

```
{
	"voltage":"0"
}
```
