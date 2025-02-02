// Listen for when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed or updated');
    
    // Set up default behavior or first-time setup
    chrome.storage.local.set({ "isFirstRun": true });
});

// This listens for user clicking on the extension icon (browser action)
chrome.action.onClicked.addListener((tab) => {
    console.log('Extension icon clicked');
    
    // Optionally, perform an action, like opening a new tab or sending a message
    chrome.tabs.create({ url: 'popup.html' }); // Open the popup or any other page
});

// Example of listening for messages from content scripts or other parts of your extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GET_USER_INFO') {
        // Example: Get the current user info (you could fetch this from local storage, API, etc.)
        chrome.storage.local.get(['userEmail', 'userName'], (data) => {
            sendResponse(data);  // Send the response back to the sender (content script, popup, etc.)
        });
    }
    
    // Keep the message channel open for asynchronous response
    return true; 
});

// You can also listen for other events like tab changes
chrome.tabs.onActivated.addListener((activeInfo) => {
    console.log('Tab activated:', activeInfo);
    // Perform actions based on the active tab if necessary
});

// Example of sending data to the background script (for storage or API calls)
function storeUserData(email, name) {
    chrome.storage.local.set({ userEmail: email, userName: name }, () => {
        console.log('User data stored');
    });
}

// Optionally, you could handle cleanup or termination on extension disable
chrome.runtime.onSuspend.addListener(() => {
    console.log('Extension is being suspended');
});
