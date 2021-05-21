//API to retrieve 12 US employees from API
//Feel free to change URl to test error checking!
api_url = 'https://randomuser.me/api/?results=12&nat=US'

//Helper function to properly format phone numbers as US type 
//e.g. (xxx) xxx-xxxx
function format_phone(phone){

    let pn = phone.replace(/\D/g, '').match(/^(\d{3})(\d{3})(\d{4}$)/)

    return `(${pn[1]}) ${pn[2]}-${pn[3]}`

}

//Take a string date and strip out the month/day/year
function format_birthday(birthdate){

    let dob = birthdate.match(/^(\d{4})-(\d{2})-(\d{2})/)

    let year = dob[1]
    let month = dob[2]
    let day = dob[3]

    return `Birthday: ${month}/${day}/${year}`
}


/*This function creates a dynamic modal when the corresponding employee
card is selected */
function create_dynamic_modal(dataset){

    let modal_div = document.createElement('div');
    modal_div.className = 'modal-container';

    //We use the dataset provided by the card div and interpolate the inner HTML
    modal_div.innerHTML = 
    `
    <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn">
            <strong>X</strong>
        </button>
        <div class="modal-info-container">
            <img class="modal-img" src="${dataset.photo}" 
            alt="profile picture">
            <h3 id="name" class="modal-name cap">${dataset.name}</h3>
            <p class="modal-text">${dataset.email}</p>
            <p class="modal-text cap">${dataset.city}</p>
            <hr>
            <p class="modal-text">${dataset.phone}</p>
            <p class="modal-text">${dataset.address}</p>
            <p class="modal-text">${dataset.birthday}</p>
    </div>
    `

    //Dynamically add an event listener to the button to remove the modal once clicked
    modal_div.querySelector('#modal-close-btn').addEventListener('click', () => {
        document.body.lastElementChild.remove();
    })

    //Add the modal to the body, when this is done the user cannot interact with the page
    document.body.appendChild(modal_div);

}


/* this is the function that is called iteratively in the loop through employees
function. DIVs are dynamically created and use the response JSON object from the API */
function create_employee(employee){

    console.log(employee);

    let gallery = document.querySelector('#gallery');

    card_div = document.createElement('div')
    card_div.className = 'card'

    //create inner html using string interpolation
    card_div.innerHTML = 
    `
        <div class="card-img-container">
            <img class="card-img" src="${employee.picture.large}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">
                ${employee.name.first + ' ' + employee.name.last}
            </h3>
            <p class="card-text">
                ${employee.email}
            </p>
            <p class="card-text cap">
                ${employee.location.city + ', ' + employee.location.state}
            </p>
        </div>
    `

    /*Because the API doesn't provide a way to retrieve a 
    specific user (by an ID for example) we must store the details we will show
    in the modal as data attributes that we will push to the create dynamic modal function
    */
    card_div.setAttribute('data-name', 
        `${employee.name.first + ' ' + employee.name.last}`);
    card_div.setAttribute('data-phone', format_phone(employee.phone));
    card_div.setAttribute('data-birthday', format_birthday(employee.dob.date));
    card_div.setAttribute('data-email', employee.email);
    card_div.setAttribute('data-city', employee.location.city);
    card_div.setAttribute('data-photo', employee.picture.large);
    
    card_div.setAttribute('data-address', 

        String(employee.location.street.number) + ' ' + 
        employee.location.street.name + ', ' +
        employee.location.city + ', ' +
        employee.location.state + ' ' + 
        String(employee.location.postcode)
    );

    gallery.appendChild(card_div);
}

//This loops through each of the items received from the API and creates corresponding divs
function loop_over_employees(results){
    for (var i = 0; i < results.length; i++){
        create_employee(results[i]);
    }
}

//This function adds a click event listener to each of the cards
function loop_over_cards(){

    let cards = [...document.querySelectorAll('.card')];

    cards.map(card => {

        card.addEventListener('click', () => {

            create_dynamic_modal(card.dataset)

        });

    });

}

//This optional function will create an error message for the user if the fetch promise fails
function display_API_error(e){

    let page_body = document.body;

    page_body.innerHTML = 
    `
    <h1 style='color:red;'>
        There was an error loading data. Please refresh the page and try again.
    </h1>
    <h3>
        For more detailed information. Refer to the Javascript console.
    </h3>
    `
}


//Main promise created
let data = fetch(api_url)
    .then(response => response.json()) //parse the results to JSON
    .then(data => loop_over_employees(data.results)) //loop through each result
    .then(loop_over_cards) // create dynamic modal functions for each card
    .catch(e => display_API_error(e)); //catch errors if there are any


