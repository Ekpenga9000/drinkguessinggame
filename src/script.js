// const API_KEY = "1";
const URL = "http://www.thecocktaildb.com/api/json/v1/1/random.php";

const app = document.querySelector(".app");

app.innerHTML = createLoadScreen();

// function to create the application section

// start screen
function createLoadScreen() {
    return `
        <section class="start-menu-container--show">
            <article class="start-menu-container__title-container">
                <h2 class="start-menu-container__title">Drink Guessing Game</h2>            
            </article>
            <div class="start-game-btn__container">
                <button class="start-game-btn__btn">${returnText("Start Game")}</button>                
            </div>
        </section>
    `
}


// game main view
function mainContainer() {
    return `
        <section class="main-container">
            <section class="title-container">
                <div class="title-container__menu-btn-container">Home page</div>
                <div class="title-container__pause-container">Pause</div>
                <div class="title-container__drink-name-container"><h3 class="title-container__title">Name of Drink</h3></div>
                <div class="title-container__scores-container"><h3 class="title-container__score-icon">🍹</h3> <h3 class="title-container__score">0</h3></div>
            </section>
            <section class="test-container">
                <article class="test-container__view-container">
                    <h3 class="test-container__img-title">Title</h3>
                    <div class="test-container__img-container">
                        <img class="test-container__img" src=${changeImgSrc()} alt=${changeImgAlt()}>
                    </div>
                    
                    </article>
                <article class="test-container__option-container">
                    <div class="test-container__title-container">
                        <h3 class="test-container__title">Which of this ingredient is in the cocktail?</h3>
                    </div>
                    <form class="form-class">
                        <div class="test-container__options-container">
                            
                        </div>
                        <div class="test-container__btn-container">
                            <button class="test-container__btn">Submit👍</buttom>
                        </div>
                    </form>
                </article>
            </section>
            <section class="feedback-container">
                
            </section>
        </section>
    `;
}

function returnText(str) {
    return `
        ${str}
    `;
}

let points = 1; 

function handleApiCall() {
    axios
        .get(URL)
        .then(response => {
            console.log(response.data.drinks[0])
            const drink = response.data.drinks[0];
            const img = document.querySelector(".test-container__img");
            const header = document.querySelector(".title-container__drink-name-container");
            const title = document.querySelector(".test-container__img-title");
            const ingredients = [];
            const optionsDiv = document.querySelector(".test-container__options-container");
            const homePage = document.querySelector(".title-container__menu-btn-container");
          
            // menu btn
            homePage.addEventListener("click", () => {
                app.innerHTML = createLoadScreen();
                location.reload();
            })

            for (let i = 1; i <= 15; i++){
                if (drink["strIngredient" + i]) {
                    ingredients.push(drink["strIngredient" + i]);
                }
            }
            console.log("ingredients",ingredients)
            const newArray = shuffleArray(ingredients);
            console.log("new ingredients", newArray);
            img.setAttribute("src", drink.strDrinkThumb);
            img.setAttribute("alt", drink.strDrink);

            header.innerText = "Name of drink: " + drink.strDrink;
            title.innerText = drink.strDrink;
            console.log(optionsDiv);
            optionsDiv.innerHTML = generateMultipleChoice(newArray);
            
            // logic for selected option
            const score = document.querySelector(".title-container__score");
            const form = document.querySelector("form"); 
            const feedback = document.querySelector(".feedback-container");
            const formContainer = document.querySelector(".test-container__option-container");
            form.addEventListener('submit', e => {
                e.preventDefault();
                const selected = e.target.radio.value;
                console.log(selected);
                if (!selected) {
                    return;
                }
                const isIngredient = trueIngredient(selected, ingredients); 
                if (isIngredient) {
                    
                    feedback.innerHTML = returnRetry("Good job! You do know your drink  👍", "green", "Next");
                    const retryBtn = document.querySelector(".retry-container__retry-btn--green");
                    formContainer.classList.add("no-pointer");
                    formContainer.classList.remove("test-container__option-container");
                                                        
                    retryBtn.addEventListener("click", () => {
                        score.innerText = points++;
                        console.log(points);
                        handleApiCall(); 
                        feedback.innerHTML = "";
                        formContainer.classList.add("test-container__option-container");
                        formContainer.classList.remove("no-pointer");
                    })


                } else {
                    feedback.innerHTML = returnRetry(`Uh oh... You didn't get the answer correctly this time 😟, Your score is 🍸${score.innerText}.`, "red", "Restart");
                    const retryBtn = document.querySelector(".retry-container__retry-btn--red");
                    formContainer.classList.add("no-pointer");
                    formContainer.classList.remove("test-container__option-container");
                                      
                    retryBtn.addEventListener("click", () => {
                        app.innerHTML = createLoadScreen();
                        location.reload();
                    })
                    
                }
                
            })
        })
        .catch(error => {
            console.log(error);
        });
}

// To get the button to load the game

const startBtn = document.querySelector(".start-game-btn__btn");

// add the function to the button. This button will also call the function to make the first API call as the game loads.

startBtn.addEventListener('click', () => {
    removeTheStartScreen();
})

//raise the load menu away
function removeTheStartScreen() {
    const screen = document.querySelector(".start-menu-container--show");

    screen.classList.remove("start-menu-container--show");
    screen.classList.add("start-menu-container--hide");

    app.innerHTML = "";
    app.innerHTML = mainContainer();

    handleApiCall();
}

//return the default image

function changeImgSrc() {
    return "../asset/images/cocktaildefault.jpg";
}

function changeImgAlt() {
    return "Drinks in cocktail glasses";
}


function shuffleArray(arr) {
//  have a default array
    const ingredients = handleShuffle([
        "Vodka",
        "Gin",
        "Tequila",
        "Dark rum",
        "Light rum",
        "Orange liqueur",
        "Mint leaves",
        "Lemon juice",
        "Lime juice",
        "Simple syrup",
        "Tonic water",
        "Angostura bitters",
        "Pineapple juice",
        "Cranberry juice",
        "Maraschino cherries",
        "Olive brine",
        "Coffee liqueur",
        "Cream of coconut",
        "Fresh strawberries",
        "Grenadine",
        "Triple sec",
        "Peach schnapps",
        "Apple schnapps",
        "Amaretto",
        "Irish cream",
        "Cointreau",
        "Campari",
        "Vermouth",
        "Brandy",
        "Whiskey",
        "Pomegranate juice",
        "Blue curaçao",
        "Champagne",
        "Prosecco",
        "Kahlua",
        "Absinthe",
        "Baileys Irish Cream",
        "Pisco",
        "Bourbon",
        "Sake"
    ]); 
    
    // compare the false array and the true array for similar values
    // create an array that contains values that not shared in both arrays
    let notSharedArray = ingredients
        .filter(item => !arr.includes(item));
        // .concat(arr.filter(item => !ingredients.includes(item)));
    
    // make a random number for true array index
    const randomIndex = generateRandomNumber(arr.length);

    // push the first 3 items and the true one into a new array
    const shuffledArray = handleShuffle([notSharedArray[generateRandomNumber(ingredients.length)], notSharedArray[generateRandomNumber(ingredients.length)], notSharedArray[generateRandomNumber(ingredients.length)], arr[generateRandomNumber(randomIndex)]]);    
    //return a shuffled array.
    return shuffledArray;
}

function generateRandomNumber(num) {
    return Math.floor(Math.random() * num); 
}

function handleShuffle(arr) {
    let currentIndex = arr.length, randomIndex;

    while (currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--; 

        [arr[currentIndex], arr[randomIndex]] = [
            arr[randomIndex], arr[currentIndex]
        ]
    }
    return arr;
}

function generateMultipleChoice(arr) {

    arr.forEach(item => {
        if (!item || item === "Water") {
            console.log("item", item)
            item = "None of the options";
            console.log("new item", item)
        }
    });
    const option1 = arr[0].split(" ").join("");
    const option1label = arr[0];
    const option2 = arr[1].split(" ").join("");
    const option2label = arr[1];
    const option3 = arr[2].split(" ").join("");
    const option3label = arr[2];
    const option4 = arr[3].split(" ").join("");
    const option4label = arr[3];

    return `
    <div class="test-container__div">
        <input type="radio" name="radio" id="radio1" class="test-container__option" value=${option1}>
        <label for="radio1" class="test-container__option-label">${option1label}</label>
    </div>
    <div class="test-container__div">
        <input type="radio" name="radio" id="radio2" class="test-container__option" value=${option2.split("").join("")}>
        <label for="radio2" class="test-container__option-label">${option2label}</label>
    </div>
    <div class="test-container__div">
        <input type="radio" name="radio" id="radio3" class="test-container__option" value=${option3.split("").join("")}>
        <label for="radio3" class="test-container__option-label">${option3label}</label>
    </div>
    <div class="test-container__div">
        <input type="radio" name="radio" id="radio4" class="test-container__option" value=${option4.split("").join("")}>
        <label for="radio4" class="test-container__option-label">${option4label}</label>
    </div>
    
    `
}

// check for ingredients

function trueIngredient(item, arr) {
    let result = false;
    arr.forEach(ingredient => {
        if (item === ingredient.split(" ").join("")) {
            result = true; 
            return result;
        }
    })

    return result;
}

function returnRetry(msg, color, btnMsg) {
    return `
        <article class="retry-container">
            <h2 class="retry-container__retry-msg--${color}">${msg}</h2>
            <div class="retry-container__retry-btn-container">
                <button class="retry-container__retry-btn--${color}">${btnMsg}</button>
            </div>
        </article>
    `
}