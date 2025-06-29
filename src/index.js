let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});


document.addEventListener('DOMContentLoaded', () => {
  const toyCollection = document.getElementById('toy-collection');
  const toyForm = document.querySelector('.add-toy-form');
  const toyFormContainer = document.querySelector('.container');
  const addToyBtn = document.getElementById('new-toy-btn');
  let addToy = false;

  const TOYS_URL = 'http://localhost:3000/toys';

  // Toggle toy form visibility
  addToyBtn.addEventListener('click', () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = 'block';
    } else {
      toyFormContainer.style.display = 'none';
    }
  });

  // Fetch and render all toys on page load
  fetch(TOYS_URL)
    .then(res => res.json())
    .then(toys => {
      toys.forEach(toy => renderToy(toy));
    })
    .catch(err => console.error('Error fetching toys:', err));

  // Render a single toy card
  function renderToy(toy) {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;

    // Add event listener for like button
    const likeBtn = card.querySelector('.like-btn');
    likeBtn.addEventListener('click', () => {
      increaseLikes(toy, card);
    });

    toyCollection.appendChild(card);
  }

  // Handle new toy form submission
  toyForm.addEventListener('submit', event => {
    event.preventDefault();

    const nameInput = toyForm.querySelector('input[name="name"]');
    const imageInput = toyForm.querySelector('input[name="image"]');

    const newToy = {
      name: nameInput.value,
      image: imageInput.value,
      likes: 0
    };

    // POST new toy to server
    fetch(TOYS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(newToy)
    })
      .then(res => res.json())
      .then(toy => {
        renderToy(toy); // Add new toy card to DOM
        toyForm.reset(); // Clear form inputs
        toyFormContainer.style.display = 'none'; // Hide form
        addToy = false;
      })
      .catch(err => console.error('Error adding toy:', err));
  });

  // Increase likes for a toy
  function increaseLikes(toy, card) {
    const newLikes = toy.likes + 1;

    fetch(`${TOYS_URL}/${toy.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ likes: newLikes })
    })
      .then(res => res.json())
      .then(updatedToy => {
        toy.likes = updatedToy.likes; // Update local toy object
        const p = card.querySelector('p');
        p.textContent = `${updatedToy.likes} Likes`;
      })
      .catch(err => console.error('Error updating likes:', err));
  }
});
