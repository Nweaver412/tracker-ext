document.addEventListener('DOMContentLoaded', function() {
  const habitType = document.getElementById('habitType');
  const mealForm = document.getElementById('mealForm');
  const sleepForm = document.getElementById('sleepForm');
  const anxietyForm = document.getElementById('anxietyForm');
  const submitButton = document.getElementById('submitHabit');

  function updateFormVisibility() {
    mealForm.style.display = 'none';
    sleepForm.style.display = 'none';
    anxietyForm.style.display = 'none';

    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().split(' ')[0].slice(0, 5);

    switch(habitType.value) {
      case 'meal':
        mealForm.style.display = 'block';
        if (document.getElementById('mealDate')) {
          document.getElementById('mealDate').value = currentDate;
        }
        if (document.getElementById('mealTime')) {
          document.getElementById('mealTime').value = currentTime;
        }
        break;
      case 'sleep':
        sleepForm.style.display = 'block';
        if (document.getElementById('sleepDate')) {
          document.getElementById('sleepDate').value = currentDate;
        }
        break;
      case 'anxiety':
        anxietyForm.style.display = 'block';
        if (document.getElementById('anxietyDate')) {
          document.getElementById('anxietyDate').value = currentDate;
        }
        if (document.getElementById('anxietyTime')) {
          document.getElementById('anxietyTime').value = currentTime;
        }
        break;
    }
  }

  habitType.addEventListener('change', updateFormVisibility);
  updateFormVisibility();

  submitButton.addEventListener('click', function() {
    let data = {
      type: habitType.value,
      timestamp: new Date().toISOString()
    };

    switch(habitType.value) {
      case 'meal':
        data.date = document.getElementById('mealDate') ? document.getElementById('mealDate').value : new Date().toISOString().split('T')[0];
        data.time = document.getElementById('mealTime') ? document.getElementById('mealTime').value : new Date().toTimeString().split(' ')[0].slice(0, 5);
        data.description = document.getElementById('mealDescription').value;
        data.duration = document.getElementById('mealDuration').value;
        break;
      case 'sleep':
        data.date = document.getElementById('sleepDate').value;
        data.duration = document.getElementById('sleepDuration').value;
        break;
      case 'anxiety':
        data.date = document.getElementById('anxietyDate') ? document.getElementById('anxietyDate').value : new Date().toISOString().split('T')[0];
        data.time = document.getElementById('anxietyTime') ? document.getElementById('anxietyTime').value : new Date().toTimeString().split(' ')[0].slice(0, 5);
        data.duration = document.getElementById('anxietyDuration').value;
        data.severity = document.getElementById('anxietySeverity').value;
        data.triggers = document.getElementById('anxietyTriggers').value;
        break;
    }

    chrome.storage.local.get({habits: []}, function(result) {
      let habits = result.habits;
      habits.push(data);
      chrome.storage.local.set({habits: habits}, function() {
        console.log('Habit saved');
        // Clear form
        document.querySelectorAll('input').forEach(input => input.value = '');
        document.querySelectorAll('select').forEach(select => select.selectedIndex = 0);
        updateFormVisibility();
      });
    });
  });
});

function syncWithBackend() {
  chrome.storage.local.get({habits: []}, function(result) {
    let habits = result.habits;
    if (habits.length > 0) {
      fetch('http://localhost:5000/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({habits: habits}),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Sync successful', data);
        // Clear synced data from local storage
        chrome.storage.local.set({habits: []});
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
  });
}

// Sync every 5 minutes
setInterval(syncWithBackend, 5 * 60 * 1000);