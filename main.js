const axios = require("axios");
const qs = require("qs");
const dotenv = require("dotenv");

dotenv.config();

const ApiBaseUrl = "https://sync.twilio.com/v1";

const TwilioAuth = {
  username: process.env.TWILIO_SID,
  password: process.env.TWILIO_AUTH_TOKEN,
};

const postContentTypeHeader = {
  "content-type": "application/x-www-form-urlencoded;charset=utf-8",
};

// used to proxy through tool like Fiddler
const USE_PROXY = process.env.USE_PROXY;
const PROXY_URL = process.env.PROXY_URL;
const PROXY_PORT = process.env.PROXY_PORT;

let useProxy = false;
if (USE_PROXY.toLowerCase() == "true") {
  useProxy = true;
}

const ProxyDetails = {
  host: PROXY_URL,
  port: PROXY_PORT,
};

// list name
const UniqueName = "MyList2";

(async () => {
  // get sync services
  try {
    console.log("GET: Sync Services");

    let syncServicesUrl = `${ApiBaseUrl}/Services`;
    const getServicesResponse = await axios.get(syncServicesUrl, {
      auth: TwilioAuth,
      proxy: useProxy ? ProxyDetails : "",
    });

    let friendly_name = getServicesResponse.data.services[0].friendly_name;
    let url = getServicesResponse.data.services[0].url;
    let sid = getServicesResponse.data.services[0].sid;

    console.log(`   Sync Service SID: ${sid}`);

    let mapsUrl = getServicesResponse.data.services[0].links.maps;
    let documentsUrl = getServicesResponse.data.services[0].links.documents;
    let streamsUrl = getServicesResponse.data.services[0].links.streams;
    let listsUrl = getServicesResponse.data.services[0].links.lists;

    // create list
    console.log("POST: Create Sync List");

    const postListsResponse = await axios({
      method: "post",
      url: listsUrl,
      data: qs.stringify({
        UniqueName: UniqueName,
      }),
      auth: TwilioAuth,
      headers: postContentTypeHeader,
      proxy: useProxy ? ProxyDetails : "",
    });

    let syncListSID = postListsResponse.data.sid;
    let syncListUniqueName = postListsResponse.data.unique_name;
    let syncListItemsUrl = postListsResponse.data.links.items;

    console.log(`   Sync List SID: ${syncListSID}`);
    console.log(`   Sync List UniqueName: ${syncListUniqueName}`);

    // create list item 1
    let jsonItemPost1 = '{ "Hello": "World" }';

    console.log("POST: Create Sync List Item 1");

    const postListItemResponse1 = await axios({
      method: "post",
      url: syncListItemsUrl,
      data: qs.stringify({
        Data: jsonItemPost1,
      }),
      auth: TwilioAuth,
      headers: postContentTypeHeader,
      proxy: useProxy ? ProxyDetails : "",
    });

    let syncListItem1SID = postListItemResponse1.data.list_sid;

    console.log(`   Sync List Item SID: ${syncListItem1SID}`);

    // create list item 2
    let jsonItemPost2 = '{ "GoodNight": "Moon" }';

    console.log("POST: Create Sync List Item 2");

    const postListItemResponse2 = await axios({
      method: "post",
      url: syncListItemsUrl,
      data: qs.stringify({
        Data: jsonItemPost2,
      }),
      auth: TwilioAuth,
      headers: postContentTypeHeader,
      proxy: useProxy ? ProxyDetails : "",
    });

    let syncListItem2SID = postListItemResponse2.data.list_sid;

    console.log(`   Sync List Item SID: ${syncListItem2SID}`);

    // get sync list items
    console.log("GET: Get List Items");

    const getSyncListItemsResponse = await axios.get(`${syncListItemsUrl}`, {
      auth: TwilioAuth,
      proxy: useProxy ? ProxyDetails : "",
    });

    console.log(`   # of items: ${getSyncListItemsResponse.data.items.length}`);

    let itemJson1 = getSyncListItemsResponse.data.items[0].data;
    let hello = JSON.parse(JSON.stringify(itemJson1)).Hello;

    console.log(`   List Item 1 Value: ${hello}`);

    let itemJson2 = getSyncListItemsResponse.data.items[1].data;
    let goodNight = JSON.parse(JSON.stringify(itemJson2)).GoodNight;

    console.log(`   List Item 2 Value: ${goodNight}`);

    // delete list

    console.log("DELETE: Delete List");

    const syncListItemUrl = `${listsUrl}/${syncListSID}`;
    const delListItemResponse = await axios.delete(syncListItemUrl, {
      auth: TwilioAuth,
      proxy: useProxy ? ProxyDetails : "",
    });
  } catch (error) {
    console.log(error);
  }
})();
