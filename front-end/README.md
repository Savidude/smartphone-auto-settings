# Smartphone Auto Settings
Physical Web Smartphone Auto Settings Project

## Setting up the front end application
1. Navigate into the smartphone-auto=settings/front-end directory of the repository
```shell
$ cd smartphone-auto-settings/front-end
```
2. Install bower components
```shell
$ bower install
```
3. If the API server is running in a different server, change the value of "apiEndpointUrl" in config/conf.json to the URL of your API Server
4. Run the front end application in a webserver
```shell
$ python -m SimpleHTTPServer <PORT>
eg: $ python -m SimpleHTTPServer 8000
```
5. Open the application on a mobile or desktop web browser with the URL [http://<YOUR_IP_ADDRESS>:<PORT>](http://localhost:8000)