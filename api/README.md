# Smartphone Auto Settings
Physical Web Smartphone Auto Settings Project

## Setting up the API

### Setting up MongoDB
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
> db.createCollection('users')
```
4. Exit from the Mongo Shell Client
```shell
> exit
```

### Setting up the API Server
The API Server for the Smartphone Auto Settings Project is created using Node.js along with MongoDB as the database.

It may be required to set up the API server locally, or in a remote server. You may select the preferred method of deployment.
* Running API server in a [local instance](https://github.com/Savidude/smartphone-auto-settings/blob/master/documentation/api-local.md).
* Deploying API server in [remote hosting](https://github.com/Savidude/smartphone-auto-settings/blob/master/documentation/api-remote.md).
