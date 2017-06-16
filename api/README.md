# Smartphone Auto Settings
Physical Web Smartphone Auto Settings Project

##Setting up the API

###Setting up MongoDB
1. Download and install [MongoDB](https://docs.mongodb.com/manual/installation/)
2. Run the Mongo Shell Client and create the smartphone-auto-settings database
```shell
$ mongo
> use smartphone-auto-settings
```
3. Create the two collections "Events", and "Locations"
```shell
> db.createCollection('events')
> db.createCollection('locations')
```
4. Exit from the Mongo Shell Client
```shell
> exit
```

###Setting up the API Server
1. Navigate to the smartphone-auto-settings/api directory
```shell
$ cd smartphone-auto-settings/api
```
2. Install the required node modules
```shell
$ npm install
```
3. If the MongoDB database is not running on the same server as the API server, change the value of "mongoDBUrl" in config/conf.json to the corresponding mongodb instance.
4. Run the API Server
```shell
$ node app
```
5. If successfully executed, the following message should be displayed
```shell
$ CORS-enabled web server listening on port 3000
```