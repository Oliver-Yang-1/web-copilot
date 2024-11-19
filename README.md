# AI HTML Extractor Chrome Extension and Server

## Project Overview
This project includes a Chrome extension to extract HTML and send user orders to an AI-powered server. The server processes the HTML and orders, returning responses and scripts as needed.

## Project Structure

```
.
├── README.md                  # Project overview and documentation
├── chrome_extension           # Directory for the Chrome extension
│   ├── assets                 # Folder for additional assets like images, fonts, etc.
│   ├── css                    # Folder for CSS styles
│   │   ├── setting.css        # Stylesheet for settings page
│   │   └── style.css          # Stylesheet for the Chrome extension
│   ├── html                   # Folder for HTML files used in the extension
│   │   ├── popup.html         # Popup HTML for the extension's action button
│   │   └── settings.html      # HTML for the settings page
│   ├── icons                  # Folder for extension icons (16x16, 48x48, 128x128, etc.)
│   ├── js                     # Folder for JavaScript files
│   │   ├── background.js      # Background script for the extension
│   │   ├── content.js         # Content script for interacting with web pages
│   │   ├── navigation.js      # JavaScript for handling page navigation
│   │   ├── popup.js           # JavaScript for popup actions
│   │   └── settings.js        # JavaScript for settings page actions
│   └── manifest.json          # Extension manifest file defining permissions and behaviors
```

## How to Run This Extension in Chrome

1. **Clone or Download the Project**
    - Clone the repository or download the project files to your local machine.

2. **Open Chrome Extensions Page**
    - Open Google Chrome.
    - Go to the extensions page by typing `chrome://extensions/` in the address bar.

3. **Enable Developer Mode**
    - In the top-right corner of the extensions page, toggle on **Developer mode**.

4. **Load Unpacked Extension**
    - Click the **Load unpacked** button.
    - Select the `chrome_extension` folder from the project directory.

5. **Test the Extension**
    - Once loaded, the extension icon will appear in the Chrome toolbar.
    - Click the extension icon to open the popup.
    - Use the extension on any web page to extract HTML and interact with the AI server.

6. **Set Server Address**
    - Click on the settings button (`⋮`) in the popup to open the settings page.
    - Enter the server address and click **Save** to configure the extension.

7. **Usage**
    - After setting the server address, you can enter tasks in the popup and click **Send** to interact with the AI server.
