# reci-p-server
A server for the Reci-P app. Uses Google cloud SQL

### Setting up the system
For local development, clone the repository and create a `src/db/config.json` file. In this file, put:
```javascript
{
  "GCLOUD_PROJECT": "your-project-name",
  "DATA_BACKEND": "cloudsql",
  "MYSQL_USER": "your-sql-user",
  "MYSQL_PASSWORD": "your-sql-password",
  "INSTANCE_CONNECTION_NAME": "your-connection-name"
}
```
- To run the server use either `npm run start` or `yarn start`.
- To build the server for deployment run `npm run build` or `yarn build`
  - This will give you access to the `deploy` script which you can use to deploy the app on GAE with `npm run deploy` or `yarn deploy`
