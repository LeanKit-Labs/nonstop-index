## nonstop index

## Security Roles
Each of the actions provided by the index's API requires a user assigned to a specific role. The roles are:

 * admin - can perform all actions
 * agent - can upload new packages to the index
 * client - can make calls related to searching the index, downloading packages, registering hosts and updating status

### Installation
Install the index globally from NPM:

```bash
npm install nonstop-index -g
```

### Setup
You'll need to provide some information during the first run in order to create client and agent credentials. This information is stored in NeDB files by default. The `users.db` file will contain a list of users that displays their roles and tokens.

### Running
Once you've set everything up, use the `-s` flag to auto-start the service and skip the menu.

```bash
nsindex -s
```

## Configuration
The process will look in the current working directory (where `nsindex` was called from, not where it is installed to) for a `config.json` file. This file can provide keys that will override the defaults specified.

> Note: when overriding a key with an array value, you must provide _all_ desired values for the array.

### defaults
```javascript
{
	host: {
		cors: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "X-Requested-With,Authorization,Content-Type",
			"Access-Control-Allow-Methods": "OPTIONS,POST,PUT,PATCH,GET,DELETE"
		},
		modules: [
			"nonstop-package-resource",
			"nonstop-registry-resource",
			"autohost-webhook"
		],
		noSession: true,
		apiPrefix: "",
		urlPrefix: "",
		port: 4444,
		logging: {
			adapters: {
				stdOut: {
					level: 3,
					topic: "#"
				}
			}
		}
	}
}
```

### config.json
```javascript
{
	"host": {
		"cors": {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "X-Requested-With,Authorization,Content-Type",
				"Access-Control-Allow-Methods": "OPTIONS,POST,PUT,PATCH,GET,DELETE"
		},
		"modules": [
			"nonstop-package-resource",
			"nonstop-registry-resource",
			"autohost-webhook"
		],
		"noSession": true,
		"apiPrefix": "",
		"urlPrefix": "",
		"port": 4444
	},
	"logging": {
		"adapters": {
			"stdOut": {
				"level": 3,
				"topic": "#"
			}
		}
	},
	"storage": {
		"s3": {
			"id": "",
			"key": "",
			"bucket": "nonstop-packages"
		},
		"rethink": {
			"host": "localhost",
			"port": 28015,
			"database": "nonstop"
		}
	}
}
```

## Dockerization
Using the sample Dockerfile below, you can supply a config.json file that will provide the customization you need.

### Sample Dockerfile
```bash
FROM nodesource/trusty:0.12.7
ENV DEBIAN_FRONTEND noninteractive
USER root

# install node via NPM and nonstop index
RUN /bin/bash -c "npm install nonstop-index@0.2.0 -g"

# Index HTTP
EXPOSE 4444

# setup directories for data and packages
RUN mkdir /usr/src/app/data && mkdir /usr/src/app/public

# expose data and packages as volumes
VOLUME [ "/usr/src/app/data", "/usr/src/app/public" ]

# add configuration file
ADD config.json /usr/src/app/config.json

CMD /bin/bash -c "nsindex -s"
```

## Setup
The first time you run this container will need to be in interactive mode in order to create the authentication information.

> Note: the image name `nonstop-index` is intentionally generic and would be replaced with your own Docker image.

### first-time setup
```bash
sudo docker run -it \
	-v ~/nsdata:/usr/src/app/data \
	-v ~/packages:/usr/src/app/public \
	-e HOSTNAME=nonstop-index \
	-p 4444:4444 \
	--name nonstop-index \
	--restart=always \
	nonstop-index \
	bash
```

## Updating
After that, container instances based on the original or newer versions of the image can be started directly as they will re-use the externalized NeDB files.

### starting the container after setup
```bash
sudo docker run -d \
	-v ~/nsdata:/usr/src/app/data \
	-v ~/packages:/usr/src/app/public \
	-e HOSTNAME=nonstop-index \
	-p 4444:4444 \
	--name nonstop-index \
	--restart=always
	nonstop-index
```
