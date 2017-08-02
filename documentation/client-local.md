# Smartphone Auto Settings
Physical Web Smartphone Auto Settings Project

## Setting up the Client application in a Local Environment

##### 1. In the "config/conf.json" file, enter the configurations required to set up the application
```javascript
{
  "apiEndpointUrl":"https://<YOUR_LOCAL_IP_ADDRESS>:3000",
  "clientEndpointUrl":"https://<YOUR_LOCAL_IP_ADDRESS>:9443"
}
```

#### 2. Generate the required SSL certificates to run a HTTPS client locally.
1. Navigate into the smartphone-auto=settings/front-end directory of the repository.
2. Run the "setup-server.sh" shell script to generate the certificate.
```shell
$ ./setup-server.sh
```
3. Hit the "Enter/return" key for all of the prompted values.
![Client SSL Generation](https://github.com/savidude/smartphone-auto-settings/blob/master/documentation/images/client-ssl-generation.png "Client SSL Generation")

#### 3. Run the client application
```shell
$ python SimpleHTPPSServer.py
```

#### 4. Open the application from a web browser on your mobile device.
The application can be accessed from the URL "https://<YOUR_IP_ADDRESS>:9443"