const baseUrl = 'http://localhost:3001'

// listen for file input change and change the displayed image
function changeImage(event, img) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()

    reader.onload = function (e) {
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  } else {
    img.src = "../img/placeholder.png"
  }
}


// addEvent to databse
function addEvent(formData) {
  fetch(baseUrl + '/event/addEvent', {
    method: 'POST',
    body: formData
  })
    .then(response => {
      if (!response.ok) {
        throw new Error()
      }
      return response.json()
    })
    .then(data => {
      if (data.status === "success") {
        window.location.href = "/event?id=" + data.id
      } else {
        throw new Error()
      }
    })
    .catch(() => {
      alert("Event could not be created. Check your input and internet connection and try again.")
    })
}

function saveEvent(formData) {
  fetch(baseUrl + '/event/edit', {
    method: 'POST',
    body: formData
  })
    .then(response => {
      if (!response.ok) {
        throw new Error()
      }
      return response.json()
    })
    .then(data => {
      if (data.status === "success") {
        window.location.href = "/event?id=" + data.id
      } else {
        throw new Error()
      }
    })
    .catch(() => {
      alert("Event could not be saved. Check your input and internet connection and try again.")
    })

}

function deleteEvent(eventId) {
  fetch(baseUrl + '/event/delete?id=' + eventId, {
    method: 'DELETE',
  })
    .then(response => {
      if (!response.ok) {
        throw new Error()
      }
      return response.json()
    })
    .then(data => {
      if (data.status === "success") {
        window.location.href = "/"
      } else {
        throw new Error()
      }
    })
    .catch(() => {
      alert("Event could not be deleted. Check your internet connection and try again.")
    })
}

const fileInput = document.getElementById('fileInput')
const img = document.getElementById('addEventImage')
const resetButton = document.getElementById('resetButton')
const eventForm = document.getElementById('addEventForm')
const addEventButton = document.getElementById('addEventButton')
const deleteEventButton = document.getElementById('deleteEventButton')
const saveEventButton = document.getElementById('saveEventButton')

fileInput.addEventListener('change', (event) => changeImage(event, img))

// add event listeners for buttons

if (resetButton && addEventButton) {
  resetButton.addEventListener('click', () => {
    img.src = "../img/placeholder.png"
  })
  addEventButton.addEventListener('click', (event) => {
    const form = eventForm
    if (form.checkValidity()) {
      event.preventDefault()
      let formData = new FormData(form)
      addEvent(formData)
    } else {
      form.reportValidity()
    }
  })
}

if (saveEventButton && deleteEventButton) {
  saveEventButton.addEventListener('click', (event) => {
    const form = eventForm;
    if (form.checkValidity()) {
      event.preventDefault()
      let formData = new FormData(form)
      saveEvent(formData)
    } else {
      form.reportValidity()
    }
  })

  deleteEventButton.addEventListener('click', (event) => {
    event.preventDefault()
    const eventId = document.getElementById('eventId').value
    deleteEvent(eventId)
  })
}





