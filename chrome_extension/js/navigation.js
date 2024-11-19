document.addEventListener("DOMContentLoaded", function () {
  // Navigate back to the chatting page
  const backButton = document.getElementById('back-button');
  if (backButton) {
    backButton.addEventListener('click', function () {
      window.location.href = './popup.html';
    });
  }
});
