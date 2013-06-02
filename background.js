

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    // http://www.myspace.com/video/motley-crue/sex-lyric-video/109083538
    var url = tab.url;
    if (/^http:\/\/www\.youtube\.com\/.*\bv=/.test(url) ||
        /^http:\/\/www\.myspace\.com\/video\/[^\/]+\/[^\/]+\/[0-9]+$/.test(url) ||
        /^http:\/\/www.myspace.com\/[^\/]+\/music\/songs\/[^\/]+/.test(url)) {
        chrome.pageAction.show(tabId);
    }
});

var CONTENT = {};

function get_content() {
    //if (JSON.stringify(CONTENT) == '{}') {
        chrome.tabs.query({'active': true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {});
        })
    //}
    return CONTENT;
}

// content_script.js sends us a message
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    CONTENT = request; // save it for popup
    console.log(CONTENT);
    // Return nothing to let the connection be cleaned up.
    //chrome.tabs.sendMessage(sender.tab.id, {});
    sendResponse({});
});

///// context menus

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId == "contextlink") {
    } else if (info.menuItemId == "radio1" || info.menuItemId == "radio2") {
        console.log("radio item " + info.menuItemId +
                    " was clicked (previous checked state was "  +
                    info.wasChecked + ")");
    } else if (info.menuItemId == "checkbox1" || info.menuItemId == "checkbox2") {
        console.log(JSON.stringify(info));
        console.log("checkbox item " + info.menuItemId +
                    " was clicked, state is now: " + info.checked +
                    " (previous state was " + info.wasChecked + ")");
    
    } else {
        console.log("item " + info.menuItemId + " was clicked");
        console.log("info: " + JSON.stringify(info));
        console.log("tab: " + JSON.stringify(tab));
    }
});

// Set up context menu tree at install time.
chrome.runtime.onInstalled.addListener(function() {
    // Create one test item for each context type.
    var contexts = [
        //"page",
        //"selection",
        "link"
        //"editable",
        //"image",
        //"video",
        //"audio"
    ];

    var id = chrome.contextMenus.create(
        {"title"   : "Add link to Winamp Cloud",
         "contexts": ["link"],
         "id"      : "contextlink"
        });
    console.log("'link' item:" + id);

  /*
  // Create a parent item and two children.
  chrome.contextMenus.create({"title": "Test parent item", "id": "parent"});
  chrome.contextMenus.create(
      {"title": "Child 1", "parentId": "parent", "id": "child1"});
  chrome.contextMenus.create(
      {"title": "Child 2", "parentId": "parent", "id": "child2"});
  console.log("parent child1 child2");
    */

    /*
  // Create some radio items.
  chrome.contextMenus.create({"title": "Radio 1", "type": "radio",
                              "id": "radio1"});
  chrome.contextMenus.create({"title": "Radio 2", "type": "radio",
                              "id": "radio2"});
  console.log("radio1 radio2");

  // Create some checkbox items.
  chrome.contextMenus.create(
      {"title": "Checkbox1", "type": "checkbox", "id": "checkbox1"});
  chrome.contextMenus.create(
      {"title": "Checkbox2", "type": "checkbox", "id": "checkbox2"});
  console.log("checkbox1 checkbox2");
    */
  // Intentionally create an invalid item, to show off error checking in the

    /*
  // create callback.
  console.log("About to try creating an invalid item - an error about " +
      "duplicate item child1 should show up");
  chrome.contextMenus.create({"title": "Oops", "id": "child1"}, function() {
    if (chrome.extension.lastError) {
      console.log("Got expected error: " + chrome.extension.lastError.message);
    }
  });
    */
});
