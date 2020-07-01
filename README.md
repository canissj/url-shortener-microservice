# API Project: URL Shortener Microservice for freeCodeCamp

## Try yourself
You can try this online on: https://industrious-lava-dragonfruit.glitch.me

This project relies on MongoDB. If you wish to clone the project you should follow these steps:
 1- To get a free MongoDB host you can register on Mongo Atlas https://www.mongodb.com/cloud/atlas and follow the get started steps.
 2- Create a .env file and set the variable MONGO_URI=YOUR_URI where YOUR_URI is a the uri of the MongoDB host.

### User Stories

1. Post a URL to `[project_url]/api/shorturl/new` and I will receive a shortened URL in the JSON response. Example : `{"original_url":"www.google.com","short_url":1}`
2. If passed an invalid URL that doesn't follow the valid `http(s)://www.example.com(/more/routes)` format, the JSON response will contain an error like `{"error":"invalid URL"}`.
3. When visit the shortened URL, it will redirect me to my original link.

#### Creation Example:

POST [project_url]/api/shorturl/new - body (urlencoded) :  url=https://www.freecodecamp.org/forum/

#### Usage:

[this_project_url]/api/shorturl/3

#### Will redirect to:

https://www.freecodecamp.org/forum/