// Check if maxMail is already defined, and define it if not
if (typeof window.maxMail === 'undefined') {
  window.maxMail = 20; // Set it globally
}
function clickElement(xpath) {
  // Evaluate the XPath to get all matching elements
  const result = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  );

  // Loop through all matching elements
  if (result.snapshotLength > 0) {
    for (let i = 0; i < result.snapshotLength; i++) {
      const element = result.snapshotItem(i);
      if (element) {
        // Trigger a click on each element
        element.click();
        console.log(`Clicked element ${i + 1}`);
        return;
      }
    }
  } else {
    console.error("No elements found for the provided XPath.");
  }
}

function clickElements(xpath) {
  // Evaluate the XPath to get all matching elements
  const result = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  );

  // Loop through all matching elements
  if (result.snapshotLength > 0) {
    for (let i = 0; i < result.snapshotLength; i++) {
      const element = result.snapshotItem(i);
      if (element) {
        // Trigger a click on each element
        element.click();
        console.log(`Clicked element ${i + 1}`);
      }
    }
  } else {
    console.error("No elements found for the provided XPath.");
  }
}

function simulateMouseEvent(xpath) {
  // Evaluate the XPath to get all matching elements
  const result = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  );

  // Loop through all matching elements
  if (result.snapshotLength > 0) {
    for (let i = 0; i < result.snapshotLength; i++) {
      const element = result.snapshotItem(i);
      if (element) {
        // Create and dispatch the mousedown event
        const mouseDownEvent = new MouseEvent('mousedown', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        element.dispatchEvent(mouseDownEvent);

        // Create and dispatch the mouseup event
        const mouseUpEvent = new MouseEvent('mouseup', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        element.dispatchEvent(mouseUpEvent);

        // Create and dispatch the click event
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        element.dispatchEvent(clickEvent);

        console.log(`Simulated mouse event on element ${i + 1}`);
      }
    }
  } else {
    console.error("No elements found for the provided XPath.");
  }
}

function extractTextByXPath(xpath) {
  const result = [];
  const xpathResult = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.ORDERED_NODE_ITERATOR_TYPE,
    null
  );

  let node = xpathResult.iterateNext();
  while (node) {
    result.push(node.textContent.trim());
    node = xpathResult.iterateNext();
  }
  return result;
}

function downloadJSON(data, filename) {
  // Convert data to JSON string
  const jsonData = JSON.stringify(data, null, 2); // Pretty print JSON with 2 spaces
  // Create a Blob from the JSON data
  const blob = new Blob([jsonData], {type: 'application/json'});
  // Create a link element
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename; // Set the filename for the download
  a.style.display = 'none';
  // Append the link to the document, trigger the download, then remove it
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function simulateKeyPress(key) {
  // Create a new KeyboardEvent for the keydown event
  const keyDownEvent = new KeyboardEvent('keydown', {
    key: key,            // The key that is pressed
    code: key,           // The physical key code
    keyCode: key.charCodeAt(0),  // The keyCode of the key (for compatibility)
    bubbles: true,       // Allow event to propagate
    cancelable: true,    // Allow event to be canceled
    view: window         // The window in which the event is dispatched
  });

  // Create a new KeyboardEvent for the keyup event
  const keyUpEvent = new KeyboardEvent('keyup', {
    key: key,
    code: key,
    keyCode: key.charCodeAt(0),
    bubbles: true,
    cancelable: true,
    view: window
  });

  // Dispatch the keydown event
  document.dispatchEvent(keyDownEvent);

  // Dispatch the keyup event after a short delay (to simulate holding and releasing the key)
  setTimeout(() => {
    document.dispatchEvent(keyUpEvent);
  }, 100); // Delay of 100ms between keydown and keyup
}


function scrollDown(pixels, interval = 100, totalDuration = 2000) {
  let scrolled = 0;
  const step = (pixels / (totalDuration / interval));

  const scrollInterval = setInterval(() => {
    if (scrolled >= pixels) {
      clearInterval(scrollInterval); // Stop scrolling after the total pixels are reached
    } else {
      window.scrollBy(0, step); // Scroll down by step
      scrolled += step;
    }
  }, interval);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getDroplist() {
  const xpath = "/html/body/div[@id='app']/div[@id='appContainer']//div[@id='mainApp']//div[@id='MainModule']//div[@id='跳到邮件列表-region']//button[@id='mailListFilterMenu']";
  clickElement(xpath);
}

function selectUnread() {
  // Define the new XPath
  const newXPath = "/html/body//div/div[contains(@class, 'fui-MenuItem')][2]/span/span[@class='UagSo']";
  clickElement(newXPath);
}

function clickFirstMail() {
  const xpath = "//div[@id='app']/div[@id='appContainer']//div[@id='mainApp']//div[@id='跳到邮件列表-region']/div[@id='MailList']//div[contains(@class, 'ms-Checkbox-checkbox')]/i";
  clickElement(xpath);
}


function extractContentAndLog() {
  const xpath = "//div[@id='mainApp']//div[@id='ReadingPaneContainerId']//div[@id='ConversationReadingPaneContainer']//div[contains(@class, 'allowTextSelection')]/div";
  const author_xpath = "//div[@id='mainApp']//div[@id='MainModule']//div[@id='跳到邮件-region']/div[@id='ReadingPaneContainerId']//div[@class='wide-content-host']/div[@id='focused']//span[@class='OZZZK']"
  // Use document.evaluate to find all matching elements
  // Prepare the object to store title and content
  let extractedData = {
    title: "",
    content: "",
    author: ""
  };
  let result = extractTextByXPath(xpath);
  extractedData.title = result[0] ?? '';
  extractedData.content = result[1] ?? '';
  result = extractTextByXPath(author_xpath);
  extractedData.author = result[0] ?? '';

  console.log(extractedData);
  return extractedData;
}



async function waitExtractMail(lastMail, interval = 600, max_retries = 3) {
  let newMail;
  let retries = 0
  await delay(interval);
  newMail = extractContentAndLog();

  while (newMail.content === lastMail.content) {
    await delay(interval);
    newMail = extractContentAndLog();
    retries++;
    if (retries >= max_retries) {
      return newMail;
    }
  }
  return newMail;
}


// Define an async function to run your code
async function runSequence() {
  getDroplist();
  await delay(200);

  selectUnread();
  await delay(2000);

  clickFirstMail();
  await delay(1200);

  let list = [];
  let data, lastData;
  lastData = {content: '', title: ''};
  for (let i = 0; i < maxMail; i++) {
    data = await waitExtractMail(lastData);
    lastData = data;
    list.push(data);
    await delay(200);
    clickElement("//div[@id='app']//span[text()='已读/未读']");
  }
  console.log(list);
  downloadJSON(list, 'extracted_data.json');
}

// Call the async function
runSequence();
