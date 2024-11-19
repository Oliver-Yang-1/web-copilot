document.addEventListener("DOMContentLoaded", function () {
  // Load server address if available
  const serverAddress = localStorage.getItem('serverAddress');
  if (serverAddress) {
    document.getElementById('server-address').value = serverAddress;
  }

  // Save server address function
  function saveSettings() {
    const serverAddress = document.getElementById('server-address').value;
    localStorage.setItem('serverAddress', serverAddress);
    alert('Server address saved successfully!');
  }

  // Add event listener to save button
  const saveButton = document.querySelector('button');
  if (saveButton) {
    saveButton.addEventListener('click', saveSettings);
  }
});
