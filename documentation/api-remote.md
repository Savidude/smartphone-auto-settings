# Smartphone Auto Settings
Physical Web Smartphone Auto Settings Project

## Setting up the API Server in a Remote Server

##### 1. Navigate to the smartphone-auto-settings/api directory
```shell
$ cd smartphone-auto-settings/api
```
##### 2. Install the required node modules
```shell
$ npm install
```
##### 3. In the "config/conf.json" file, enter the configurations required to set up the server.
```javascript
{
    "mongoDBUrl":"mongodb://localhost/smartphone-auto-settings",
    "frontEndUrl":"<CLIENT_URL>",
    "hosting":"remote"
}
```
If the MongoDB database is running in the same virtual machine as the API, then set the mongoDBURL to 
```javascript
mongodb://localhost/smartphone-auto-settings
```
If a  MongoDB instance is hosted elsewhere, enter the URL with the required credentials in the following format.
```javascript
mongodb://username:password@host:port/smartphone-auto-settings?options...
```

Note that the front end URL must contain the HTTPS protocol in order for Physical Web applications to work. For example,
```javascript
"frontEndUrl": "https://smartphone-auto-settings-d61a2.firebaseapp.com"
```

##### 4. Run the API Server

Note that the Node.js server must already contain a valid SSL certificate in order for Physical Web to function.
You may use [Heroku](https://www.heroku.com/) for HTTPS hosting for Node.js apps.
```shell
$ node app
```
##### 5. If successfully executed, the following message should be displayed.
```shell
$ Web Server listening on port 3000
```