// index.js
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
  ramenDetail.innerHTML = `
    <h3>${ramen.name}</h3>
    <p>Rating: ${ramen.rating}</p>
    <p>Comment: ${ramen.comment}</p>
  `;

  const editForm = document.querySelector('#edit-ramen');
  const deleteButton = document.querySelector('#delete-ramen');
  editForm.dataset.id = ramen.id;
  deleteButton.dataset.id = ramen.id;
}

// add submit listener to the new ramen form
function addSubmitListener() {
  const form = document.querySelector('#new-ramen');
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(form);
    const newRamen = {
      name: formData.get('name'),
      image: formData.get('image'),
      rating: formData.get('rating'),
      comment: formData.get('new-comment')
    };

    //post request
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
  });
}


// display new ramen in the #ramen-menu div
function displayNewRamen(ramen) {
  const ramenMenu = document.querySelector('#ramen-menu');
  const ramenImg = document.createElement('img');
  ramenImg.src = ramen.image;
  ramenImg.addEventListener('click', () => handleClick(ramen));
  ramenMenu.appendChild(ramenImg);
}

// add listener to edit ramen details
function addEditListener() {
  const form = document.querySelector('#edit-ramen');
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    const id = form.dataset.id;
    const updatedRamen = {
      rating: document.querySelector('#edit-rating').value,
      comment: document.querySelector('#edit-comment').value
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
      displayRamenDetails(data);
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
      document.querySelector('#ramen-detail').innerHTML = '<h2>Details</h2>';
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




//add new Ramen -> commment always comes up null but can edit;


