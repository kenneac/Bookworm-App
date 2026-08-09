/(backend)
1. >npm init -y
2. Command: > npm i express mongoose dotenv jsonwebtoken cloudinary bcryptjs cors
express – a minimal web framework for building your Node.js server and defining API routes.
mongoose – an ODM (Object Data Modeling) library that lets you interact with MongoDB using JavaScript objects/schemas instead of raw queries.
dotenv – loads environment variables from a .env file into process.env so you can keep secrets/config out of your code.
jsonwebtoken – creates and verifies JWTs (JSON Web Tokens) for authentication/authorization.
cloudinary – SDK for uploading, storing, and transforming images/media on the Cloudinary cloud service.
bcryptjs – hashes and compares passwords securely so you never store plain-text passwords.
cors – middleware that enables Cross-Origin Resource Sharing so your frontend (on a different origin/port) can call your backend API.
3. > npm i nodemon -D
a development package for monitoring files.
4. create server.js 
5. modify package.json  to add: "type": "module",
6.  add .gitignore, Readme.md, then connect to github
------------------------
1. create a project in https://www.mongodb.com/products/platform/atlas-database
- set up a cluster
-  get the MONGODB_ username, password, and uri (at the first instance, else it may no longer be available)
- choose a connection method
- add the database name: MONGO_URI=mongodb+srv://meetkenn2diol_db_user:c2IT33FU06FPCdk0@bookwormcluster.lsyaiqm.mongodb.net/bookworm_db?appName=bookwormcluster
- update the network access

2. configure your backend to connect to mongoDB

3. create mongodb schema for a  user
- https://www.dicebear.com to get avatars for profile image
- use bycrypt for hashing the 
- run > openssl rand -base64 32   --- with git bash terminal to generate a random

4. create the mongodb model for a user
5. create the schema and model for books
- implement pagination for infinite scrolling
6. set up cloudinary https://cloudinary.com
7. create the project and folders you need in cloudinary
8. connect cloudinary to your backend
9. run > npm i cron   --- to run cron jobs