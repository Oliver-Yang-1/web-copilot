// Check if maxMail is already defined, and define it if not
if (typeof window.playerClass === 'undefined') {
  window.playerClass = 'death-knight'; // Set it globally
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


async function runSequence() {
  let playerClass = window.playerClass;
  let xpath = `/html[@class='tablesaw-enhanced']/body[@id='tier-list']/div[@class='wrapper']/section[@id='${playerClass}']//dl`
  let result = extractTextByXPath(xpath)
  let resultList = [];
  for (let i = 0; i < result.length; i++) {
    let item = {cardName: '', cardScore: 0};
    const items = result[i].split('\n');
    item.cardName = items[0];
    if (item.cardName !== "") {
      item.cardScore = items[1];
      item.cardScore = item.cardScore.replace(/^新/, '')
      resultList.push(item);
    }
  }
  console.log(resultList);
  downloadJSON(resultList, playerClass + '.json');
}


runSequence();
