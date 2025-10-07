// Saves options to chrome.storage
const saveOptions = () => {
  const closeAfterSend = document.getElementById('close_after_send').checked;
  
  chrome.storage.sync.set({ closeAfterSend: closeAfterSend }, () => {
      // Update status to let user know options were saved.
      const status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(() => {
        status.textContent = '';
      }, 750);
    });
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
  chrome.storage.sync.get({ closeAfterSend: false }, (items) => {
      document.getElementById('close_after_send').checked = items.closeAfterSend;
  });
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
