# Smartphone Auto Settings
Physical Web Smartphone Auto Settings Project

## Setting up the API Server in a Local Environment

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
    "frontEndUrl":"https://<YOUR_LOCAL_IP_ADDRESS>:8000",
    "hosting":"local"
}
```
If the MongoDB database is running locally, then set the mongoDBURL to 
```javascript
mongodb://localhost/smartphone-auto-settings
```
If a  MongoDB instance is hosted elsewhere, enter the URL with the required credentials in the following format.
```javascript
mongodb://username:password@host:port/smartphone-auto-settings?options...
```

##### 4. Generate the SSL certificates required.

Physical Web URLs can only function with an HTTPS protocol. As a result, the client application must contain an https:// URL. 
 Since HTTPS clients must communicate with servers through HTTPS, the backend must also run in HTTPS. As a result, it is 
 required to generate SSL certificates.
 
1. Navigate to the '/api/ssl' directory.
2. Run the generate-certificates shell command.
```shell
$ ./generate-certificates.sh
```
 
##### 5. Import the generated ca.crt certificate into the browser.

The browser must trust the HTTPS backend server when the client application is making API requests. 

1. In Google Chrome, search for "SSL" in the settings menu and select 'Manage Certificates...'.
![Certificate Manager](https://github.com/savidude/smartphone-auto-settings/blob/master/documentation/images/chrome-manage-certificates.png "Certificate Manager")
2. In the Certificate Manager window, select the 'Authorities' tab, click on 'import', and select the 'ca.crt' file generated in step 4.
![Certificate Manager](https://github.com/savidude/smartphone-auto-settings/blob/master/documentation/images/chrome-import-certificate.png "Certificate Manager")
3. In the confirmation dialog check 'Trust this certificate for identifying websites', and click 'OK'.
![Certificate Manager](https://github.com/savidude/smartphone-auto-settings/blob/master/documentation/images/chrome-trust-certificate.png "Certificate Manager")
4. You will now be able to see the imported certificate in the Certificate Manager.
![Certificate Manager](https://github.com/savidude/smartphone-auto-settings/blob/master/documentation/images/chrome-cert-manager.png "Certificate Manager")

##### 6. Run the API Server
```shell
$ node app
```
##### 7. If successfully executed, the following message should be displayed.
```shell
$ CORS-enabled web server listening on port 3000
```