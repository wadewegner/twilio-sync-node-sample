# twilio-sync-node-sample

A simple exploration of the Twilio Sync API and some of the capabilities.

## Get Started

Create a .env file with the following values:

```
TWILIO_SID=<your_twilio_sid>
TWILIO_AUTH_TOKEN=<your_twilio_auth_token>
USE_PROXY=false
PROXY_URL=localhost
PROXY_PORT=8866
```

You can get the Twilio values from the Twilio Console.

If you use a tool like Fiddler to inspect the traffice (I find this valuable when learning), change `USE_PROXY` to `true` and then update your settings. I left the defaults in for Fiddler.

To run, type:

```
npm install
npm start
```

You should see output like the following:

```
GET: Sync Services
    Sync Service SID: IS658bdb254e15fdd3847f74d1ddbb7ffa
POST: Create Sync List
    Sync List SID: ES5f259db392384b87b18dd56d7acc2f1c
    Sync List UniqueName: MyList2
POST: Create Sync List Item 1
    Sync List Item SID: ES5f259db392384b87b18dd56d7acc2f1c
POST: Create Sync List Item 2
    Sync List Item SID: ES5f259db392384b87b18dd56d7acc2f1c
GET: Get List Items
    length: 2
    List Item 1 Value: World
    List Item 2 Value: Moon
DELETE: Delete List
```

Enjoy!
