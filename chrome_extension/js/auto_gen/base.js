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
