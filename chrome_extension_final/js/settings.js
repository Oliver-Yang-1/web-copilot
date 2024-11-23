// settings.js
document.addEventListener("DOMContentLoaded", function () {
  // Load server address from localStorage
  const serverAddress = localStorage.getItem('serverAddress');
  if (serverAddress) {
    document.getElementById('server-address').value = serverAddress;
  }

  // Save settings
  function saveSettings() {
    let serverAddress = document.getElementById('server-address').value.trim();

    // Check if the serverAddress starts with 'http://' or 'https://'
    if (!serverAddress.startsWith('http://') && !serverAddress.startsWith('https://')) {
      serverAddress = 'https://' + serverAddress; // Add 'https://' if missing
    }
    localStorage.setItem('serverAddress', serverAddress);
    alert('Server address saved successfully!');

    // Save 'Use Light Friday' setting
    const useLightFriday = document.getElementById('use-light-friday').checked;
    localStorage.setItem('useLightFriday', useLightFriday);
    console.log('Use Light Friday setting saved:', useLightFriday);
  }

  // Attach event listener to save button
  const saveButton = document.getElementById('save-button');
  if (saveButton) {
    saveButton.addEventListener('click', saveSettings);
  }

  const sessionListElement = document.getElementById('session-list');
  const sessionNameInput = document.getElementById('session-name');
  const sessionValueInput = document.getElementById('session-value');
  const addSessionButton = document.getElementById('add-session');

  // Load session list from localStorage
  const loadSessionList = () => {
    const sessions = JSON.parse(localStorage.getItem('sessionList')) || [];
    renderSessionList(sessions);
  };

  // Save session list to localStorage
  const saveSessionList = (sessions) => {
    localStorage.setItem('sessionList', JSON.stringify(sessions));
    console.log('Session list saved:', sessions);
  };

  // Render session list in the UI
  const renderSessionList = (sessions) => {
    sessionListElement.innerHTML = '';
    sessions.forEach((session, index) => {
      const listItem = document.createElement('li');

      // Create session name and value elements
      const sessionName = document.createElement('span');
      sessionName.className = 'session-name';
      sessionName.textContent = session.name;

      const sessionValue = document.createElement('span');
      sessionValue.className = 'session-value';
      sessionValue.textContent = session.value;

      // Create delete button
      const deleteButton = document.createElement('button');
      deleteButton.innerHTML = '<i class="fas fa-trash"></i> Delete';
      deleteButton.addEventListener('click', () => {
        removeSession(index);
      });

      // Append elements to list item
      listItem.appendChild(sessionName);
      listItem.appendChild(sessionValue);
      listItem.appendChild(deleteButton);
      sessionListElement.appendChild(listItem);
    });
  };

  // Add a new session
  const addSession = () => {
    const name = sessionNameInput.value.trim();
    const value = sessionValueInput.value.trim();
    if (name && value) {
      const sessions = JSON.parse(localStorage.getItem('sessionList')) || [];
      sessions.push({ name, value });
      saveSessionList(sessions);
      renderSessionList(sessions);
      sessionNameInput.value = '';
      sessionValueInput.value = '';
    } else {
      alert('Please enter both session name and value.');
    }
  };

  // Remove a session
  const removeSession = (index) => {
    const sessions = JSON.parse(localStorage.getItem('sessionList')) || [];
    sessions.splice(index, 1);
    saveSessionList(sessions);
    renderSessionList(sessions);
  };

  // Attach event listener to add session button
  addSessionButton.addEventListener('click', addSession);

  // Load the session list on page load
  loadSessionList();

  // Load 'Use Light Friday' setting on page load
  const useLightFriday = localStorage.getItem('useLightFriday') === 'true'; // Ensure boolean type
  document.getElementById('use-light-friday').checked = useLightFriday;
});