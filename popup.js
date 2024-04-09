convert = function(word) {
  hex = word.selectionText;
  if (isValidHex(hex)) {
    convertHexToARM(hex);
  } else {
    document.getElementById('result').innerHTML = 'Invalid hex value.';
  }
}

chrome.contextMenus.removeAll(function() {
  chrome.contextMenus.create({
    id: 'convertToARM',
    title: 'Convert to ARM',
    contexts: ['selection']
  });  
});
chrome.contextMenus.onClicked.addListener(convert);

function isValidHex(hex) {
  return /^[0-9A-Fa-f]/.test(hex);
}

function convertHexToARM(hex) {
  var data = { hex: hex, arch: ["arm64"] };
  fetch('https://armconverter.com/api/convert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(result => {
      console.log('Success:', result);
      var arm64Instruction = result.asm.arm64[1];
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.notifications.create('', {
          type: 'basic',
          iconUrl: 'icon.png',
          title: arm64Instruction,
          message: 'Made by tien0246',
        }, function(notificationId) {
          chrome.notifications.onClicked.addListener(function(clickedNotificationId) {
            if (clickedNotificationId === notificationId) {
              chrome.tabs.create({ url: 'https://armconverter.com/?code=' + encodeURIComponent(arm64Instruction) });
            }
          });
        });
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
