document.addEventListener('DOMContentLoaded', function() {
  main();
});

// main function to initialize the app
function main() {
  displayRamens();
  addSubmitListener();
  addEditListener();
  addDeleteListener();
}

// fetch and display all ramen images
function displayRamens() {
  fetch('http://localhost:3000/ramens')
    .then(response => response.json())
    .then(data => {
      const ramenMenu = document.querySelector('#ramen-menu');
      ramenMenu.innerHTML = ''; 
      data.forEach(ramen => {
        const ramenImg = document.createElement('img');
        ramenImg.src = ramen.image;
        ramenImg.dataset.id = ramen.id;
        ramenImg.addEventListener('click', () => handleClick(ramen));
        ramenMenu.appendChild(ramenImg);
      });
      // Display details of the first ramen
      if (data.length > 0) {
        displayRamenDetails(data[0]);
      }
    })
    .catch(error => console.error('Error fetching ramens:', error));
}

// handle click events on ramen images
function handleClick(ramen) {
  displayRamenDetails(ramen);
}

// display ramen details in the #ramen-detail div
function displayRamenDetails(ramen) {
  const ramenDetail = document.querySelector('#ramen-detail');
  ramenDetail.querySelector('.detail-image').src = ramen.image;
  ramenDetail.querySelector('.name').textContent = ramen.name;
  ramenDetail.querySelector('.restaurant').textContent = ramen.restaurant;
  document.querySelector('#rating-display').textContent = ramen.rating;
  document.querySelector('#comment-display').textContent = ramen.comment;

  const editForm = document.querySelector('#edit-ramen');
  editForm.dataset.id = ramen.id;
  editForm.querySelector('#edit-rating').value = ramen.rating;
  editForm.querySelector('#edit-comment').value = ramen.comment;

  const deleteButton = document.querySelector('#delete-ramen');
  deleteButton.dataset.id = ramen.id;
}

// handle the submission of a new ramen
function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const newRamen = {
    name: form.name.value,
    restaurant: form.restaurant.value,
    image: form.image.value,
    rating: form.rating.value,
    comment: form['new-comment'].value
  };

  // Post request to add the new ramen
  fetch('http://localhost:3000/ramens', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newRamen)
  })
  .then(response => response.json())
  .then(data => {
    displayNewRamen(data);
  })
  .catch(error => console.error('Error adding new ramen:', error));
  form.reset();
}

// add submit listener to the new ramen form
function addSubmitListener() {
  const form = document.querySelector('#new-ramen');
  form.addEventListener('submit', handleSubmit);
}

// display new ramen in the #ramen-menu div
function displayNewRamen(ramen) {
  const ramenMenu = document.querySelector('#ramen-menu');
  const ramenImg = document.createElement('img');
  ramenImg.src = ramen.image;
  ramenImg.dataset.id = ramen.id;
  ramenImg.addEventListener('click', () => handleClick(ramen));
  ramenMenu.appendChild(ramenImg);
  handleClick(ramen); // Optional: Display details of the newly added ramen
}

// add listener to edit ramen details
function addEditListener() {
  const form = document.querySelector('#edit-ramen');
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    const id = form.dataset.id;
    const updatedRamen = {
      rating: form.querySelector('#edit-rating').value,
      comment: form.querySelector('#edit-comment').value
    };
    fetch(`http://localhost:3000/ramens/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedRamen)
    })
    .then(response => response.json())
    .then(data => {
      // Update the details on the page with the newly updated ramen
      displayRamenDetails(data);

      // Optionally, update the image in the ramen menu with new data (if applicable)
      const ramenImg = document.querySelector(`#ramen-menu img[data-id='${id}']`);
      if (ramenImg) {
        ramenImg.addEventListener('click', () => handleClick(data));
      }
    })
    .catch(error => console.error('Error updating ramen:', error));
  });
}

// delete ramen
function addDeleteListener() {
  const deleteButton = document.querySelector('#delete-ramen');
  deleteButton.addEventListener('click', function() {
    const id = deleteButton.dataset.id;
    fetch(`http://localhost:3000/ramens/${id}`, {
      method: 'DELETE'
    })
    .then(() => {
      const ramenMenu = document.querySelector('#ramen-menu');
      const ramenImg = ramenMenu.querySelector(`img[data-id='${id}']`);
      if (ramenImg) {
        ramenMenu.removeChild(ramenImg);
      }
      document.querySelector('#ramen-detail').innerHTML = `
        <img class="detail-image" src="./assets/image-placeholder.jpg" alt="Insert Name Here" />
        <h2 class="name">Insert Name Here</h2>
        <h3 class="restaurant">Insert Restaurant Here</h3>
      `;
      document.querySelector('#rating-display').textContent = 'Insert rating here';
      document.querySelector('#comment-display').textContent = 'Insert comment here';
    })
    .catch(error => console.error('Error deleting ramen:', error));
  });
}

// Export functions for testing
export {
  displayRamens,
  addSubmitListener,
  handleClick,
  main,
  addDeleteListener,
  addEditListener,
};
