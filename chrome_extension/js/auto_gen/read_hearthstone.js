if (typeof window.heroClass === 'undefined') {
  const url = window.location.href;

  // Extract the hash fragment
  const hash = url.split('#')[1]; // Get everything after the '#'

  // Parse the hash
  const params = new URLSearchParams(hash);

  // Extract the 'playerClass' parameter
  window.playerClass = params.get('playerClass');

}
if (typeof window.maxItems === 'undefined') {
  window.maxItems = 5; // Set it globally
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

function extractFirstTextByXPath(xpath) {
  const result = extractTextByXPath(xpath);
  return result[0] ?? '';
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fillTemplate(template, content) {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return content[key] !== undefined ? content[key] : match;
  });
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

// Usage Example
// Scroll down 1000 pixels over 2 seconds (2000ms)


async function runSequence() {
  let xpath = `//div[@id='content']/div[@id='cards-container']/main[@class='cards']/div[@class='card-list-wrapper page-with-banner-container']/div[@class='card-list-wrapper']//div[@class='table-wrapper']/div[@class='table-container']//figure[@class='card-tile']/div[@class='card-frame']/figcaption[@class='card-name']`
  let xpath2 = `/html/body/div[@id='content']/div[@id='cards-container']/main[@class='cards']//div[@class='table-cell'][{{num}}]`
  let result = extractTextByXPath(xpath);
  scrollDown(8000, 50, 2000);
  await delay(800);
  let resultList = [];
  for (let i = 0; i < result.length; i++) {
    let cardName = result[i] ?? '';
    let dataList = [];
    for (let j = 1; j <= 5; j++) {
      let temp1 = fillTemplate(xpath2, {num: i * 5 + j});
      dataList.push(extractFirstTextByXPath(temp1));
    }
    let item = {
      cardName: cardName,
      appearProb: dataList[0],
      avgNums: dataList[1],
      deckWR: dataList[2],
      playTimes: dataList[3],
      useWR: dataList[4]
    }
    resultList.push(item);
  }
  downloadJSON(resultList, playerClass + ".json");
}


runSequence();
