//  Begin Javascript Code File
//  ALL CODE WRITTEN BY CYMBERLY TSAI AND VI COVRLJAN UNLESS OTHERWISE STATED
//  This program is inteaded to provide entertaiment to users through creative story telling.
//  Users are immersed in the story as a character interacting with other charactars.
//  Throughout the program, the user is presented with choices, allowing the user to control their own fate within the program.

// createScreen() function creates different HTML elements to represent screens in the story
// A screen is a div container element containing an div to display image, div for text, and div for choice buttons
// Function is called manually in the program to create screens
// Parameters:
//    id (str) - unique identifier of the screen
//    imagePath (str) - path to image to be displayed on screen
//    text (str) - text to be displayed with screen
//    choices (list)- list of dictionary containing the text to be diplayed on choice button and destination screen from clicking the button
function createScreen(id, imagePath, text, choices) {
    // Create screen container element and assign properties
    const screen = document.createElement("div");
    screen.id = id;
    screen.className = "screen";
    // Process text argument for display
    const lines = text.split('|');
    const textContent = lines.map((line, index) => {
        // Split long lines into multiple lines if they exceed 100 characters
        const wrappedLines = [];
        let currentLine = '';
        const words = line.split(' ');
        for (const word of words) {
            if ((currentLine + word).length > 100) {
                wrappedLines.push(currentLine.trim());
                currentLine = word;
            } else {
                currentLine += (currentLine ? ' ' : '') + word;
            }
        }
        if (currentLine) {
            wrappedLines.push(currentLine.trim());
        }
        return wrappedLines.map(wrappedLine => {
            // Calculate duration based on text length (20ms per character)
            const duration = wrappedLine.length * 0.02;
            return `<div class="type-anim" style="--length: ${wrappedLine.length}; --duration: ${duration}s; --delay: ${index * 2}s;">${wrappedLine}</div>`;
        }).join('');
    }).join('');
    // Define content inside screen container as HTML elements
    screen.innerHTML = `
    <div class="content">
        <img src="${imagePath}" style="height: -webkit-fill-available; object-fit: cover;">
    </div>
    <div class="text">${textContent}</div>
    <button onClick="switchScreen('${id}', 'start')" style="position: fixed; align-self: normal; font-size: smaller; width: min-content; padding: 10px;">Start Over</button>
    `;
    // Create div for choices and assign properties to be added to the screen container
    const choicesDiv = document.createElement("div");
    choicesDiv.className = "choices";
    // Loop through list of choices, for each choice in the list of given choices, create a button element to be added to the screen
    for (var choice of choices) {
        const button = document.createElement("button");
        button.textContent = choice.text;
        button.onclick = function() {
            // Hide all choice buttons
            choicesDiv.style.display = "none";
            
            // Create and show the next text with animation
            const nextTextDiv = document.createElement("div");
            nextTextDiv.className = "next-text";
            const nextLines = choice.next.split('|');
            const nextTextContent = nextLines.map((line, index) => {
                const duration = line.length * 0.02;
                return `<div class="type-anim" style="--length: ${line.length}; --duration: ${duration}s; --delay: ${index * 2}s;">${line}</div>`;
            }).join('');
            nextTextDiv.innerHTML = nextTextContent;
            
            // Add the next text to the text container
            const textContainer = screen.querySelector('.text');
            textContainer.appendChild(nextTextDiv);
            
            // Create and show the next button after animation
            const nextButton = document.createElement("button");
            nextButton.textContent = "Next";
            nextButton.onclick = function() {
                switchScreen(id, choice.destination);
            };
            
            // Add the next button after all animations are complete
            const totalAnimationTime = nextLines.reduce((acc, line) => acc + (line.length * 0.02), 0) + (nextLines.length * 2);
            setTimeout(() => {
                textContainer.appendChild(nextButton);
            }, totalAnimationTime * 1000);
        };
        choicesDiv.appendChild(button);
    }
    // Add choices div to screen container and screen container to the body of the program
    screen.appendChild(choicesDiv);
    document.body.appendChild(screen);
}

// switchScreen() function dynamically switches which screen containers are displayed to the user
// Function is called on click of any of the choice buttons
// Parameters:
//    from (str) - unique identifier of screen a button is associated with
//    to (str) - unique identifier of screen to be displayed when button is clicked
function switchScreen(from, to) {
    document.getElementById(from).style.animation = "fade 0.5s forwards";
    setTimeout(() => {
        document.getElementById(to).style.display = "grid";
        document.getElementById(from).style.display = "none";
        document.getElementById(to).style.animation = "none";
        const typeAnims = document.getElementById(to).querySelectorAll('.text .type-anim');
        typeAnims.forEach((anim, index) => {
            setTimeout(() => {anim.style.setProperty('--char', anim.textContent.length);}, index * 2000);
        });
        localStorage.setItem("currentScreen", to);
    }, 1000);
}

// Background animation adapted from Binary Beats from Medium
// Define a function that creates a heart element with random properties
function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.style.width = `${Math.floor(Math.random() * 65) + 10}px`;
    heart.style.height = heart.style.width;
    heart.style.left = `${Math.floor(Math.random() * 100) + 1}%`;
    heart.style.background = `rgba(255, ${Math.floor(Math.random() * 25) + 100 - 25}, ${Math.floor(Math.random() * 25) + 100}, 1)`;
    const duration = Math.floor(Math.random() * 5) + 5;
    heart.style.animation = `love ${duration}s ease`;
    return heart;
}
// Get the container element where the hearts will be added
const container = document.getElementById('start');   
// Define a function that removes hearts that have gone off screen
function removeHearts() {
    const hearts = container.querySelectorAll('.heart');
    hearts.forEach((heart) => {
    const top = parseFloat(getComputedStyle(heart).getPropertyValue('top'));
    const width = parseFloat(getComputedStyle(heart).getPropertyValue('width'));
    if (top <= -100 || width >= 150) {
        heart.remove();
    }
    });
}
// Define a function that repeatedly adds hearts to the container
function addHeart() {
    const heart1 = createHeart();
    const heart2 = createHeart();
    container.appendChild(heart1);
    container.appendChild(heart2);
    setTimeout(removeHearts, 1000);
}
var h = setInterval(addHeart, 500);
// END OF ADAPTED CODE

// Event listener to load in user's saved screen when the page loads
window.onload = function () {
    const savedScreen = localStorage.getItem("currentScreen");
    if (savedScreen && document.getElementById(savedScreen)) {
        h = setInterval(addHeart, 500);
        document.getElementById(savedScreen).style.display = "grid";
        if (savedScreen != "start") {
            document.getElementById(savedScreen).style.display = "grid";
            document.getElementById(savedScreen).style.animation = "none";
            document.getElementById("start").style.display = "none";
            const typeAnims = document.getElementById(savedScreen).querySelectorAll('.text .type-anim');
            typeAnims.forEach((anim, index) => {
                setTimeout(() => {anim.style.setProperty('--char', anim.textContent.length);}, index * 2000);
            });
            localStorage.setItem("currentScreen", savedScreen);
                clearInterval(h);
        }
    }
};

// Call createScreen() function to create screens for the program
createScreen(
    "FirstDayofSchool",
    "StockdalePhotos/ynbedroom1.jpg",
    "Todays the first day of senior year! You wake up, put on your nicest outfit, gather your  belongings, and head out.You arrive on campus after walking for a few minutes. You're reminded that your first period class is…AP Bio. Ugh. You conjure up the genius idea to simply skip class! What will you do? ",
    [
        { text: "Yes, go to school.", destination: "APBio", next: "" },
        { text: "No, don't go to school.", destination: "Detention", next: "" }
    ]
);

createScreen(
    "Detention",
    "StockdalePhotos/schoolhall1.jpg",
    "You decide to roam the halls for a little while.|You then hear footsteps approaching from around the corner.",
    [
        { text: "Next?", destination: "DetentionEnd", next: "" }
    ]
);

createScreen(
    "DetentionEnd",
    "StockdalePhotos/black.jpg",
    "Teacher:  Where do you think YOU'RE going?! [BAD ENDING]",
    [
        { text: "Start Over?", destination: "start", next: "" }
    ]
);

createScreen(
    "APBio",
    "StockdalePhotos/danteglennclassroom.jpg",
    "You arrive to class just as the bell rings. You notice that every seat is taken except for two. One is next to a blonde, sporty-looking young man. The other is next to a guy who looks like the stereotypical nerd. Who do you sit with?",
    [
        { text: "Geek", destination: "SitWithGlenn", next: "" },
        { text: "Jock", destination: "SitWithDante", next: "" }
    ]
);

createScreen(
    "SitWithDante",
    "StockdalePhotos/danteclassroom.jpg",
    "Dante: Hey mamas what's good? 😉|You: Um…|Dante: Th'names Dante. Like that guy with the inferno yk??|You: For sureeee|Dante: Lit. Say, I got a game later this week for homecoming. You should totally slide 😝",
    [
        { text: "Nah", destination: "NoToDante", next: "" },
        { text: "Sureeee", destination: "SureToDante", next: "" },
        { text: "Yes!!!", destination: "YesToDante", next: "" }
    ]
);

createScreen(
    "NoToDante",
    "StockdalePhotos/danteclassroom.jpg",
    "Dante: zamn ok ig…",
    [
        { text: "Next", destination: "UnknownCaller", next: "" }
    ]
);

createScreen(
    "YesToDante",
    "StockdalePhotos/danteclassroom.jpg",
    "Dante: Fyeeeee! I'll see u there ahaha 😘",
    [
        { text: "Next", destination: "YESFootball", next: "" }
    ]
);

createScreen(
    "SureToDante",
    "StockdalePhotos/danteclassroom.jpg",
    "Dante: Ight bet",
    [
        { text: "Next", destination: "SureFootball", next: "" }
    ]
);

createScreen(
    "SureFootball",
    "StockdalePhotos/dantefield.jpg",
    "You get bored and leave early.",
    [
        { text: "Next", destination: "UnknownCaller", next: "" }
    ]
);

createScreen(
    "UnknownCaller",
    "StockdalePhotos/ynbedroom1.jpg",
    "You are at home doing homework when you get a call from |an unknown number asking to meet at a park. |Do you go?",
    [
        { text: "Yes", destination: "Park", next: "" },
        { text: "No, that's shady.", destination: "Sleep", next: "" }
    ]
);

createScreen(
    "Sleep",
    "StockdalePhotos/ynbedroom1.jpg",
    "You go to bed.",
    [
        { text: "Next?", destination: "HocoSale", next: "" }
    ]
);

createScreen(
    "Park",
    "StockdalePhotos/dantepark.jpg",
    "You go to the park and see Dante. |He asked your friend for your number.|Creeped out you ask why he called you out here. He says he was intrgiugued by you and would like to get to know yout better. How do you respond?",
    [
        { text: "GET OUT", destination: "NoHoco", next: "" },
        { text: "sure...?", destination: "HocoDante", next: "" }
    ]
);

createScreen(
    "HocoDante",
    "StockdalePhotos/dantehoco.jpg",
    "Yo go to hoco ad are boared. You want to leave bc it's bored, do you leave with dante?",
    [
        { text: "For sure twin", destination: "FootballGame", next: "" },
        { text: "No, ditch him", destination: "NoHoco", next: "" }
    ]
);

createScreen(
    "DanteEnd",
    "StockdalePhotos/black.jpg",
    "Good ending with Dante|[GOOD ENDING]",
    [
        { text: "Start Over?", destination: "start", next: "" }
    ]
);

createScreen(
    "AwkardPark",
    "StockdalePhotos/dantepark.jpg",
    "Sit with dante in park",
    [
        { text: "Next", destination: "HocoSale", next: "" }
    ]
);

createScreen(
    "YESFootball",
    "StockdalePhotos/dantefield.jpg",
    "You arrive at the field, sit down, and watch the game play out.|Dante manages to score a touchdown right as the final quarter wraps up!|Dante: Yoooo did you see that dawg??? I COOKED them lol|You: You sure did!|Dante:Say, wanna go get something to chow down on? I sure am hungry after carrying this entire team on my back.",
    [
        { text: "I'll pass.", destination: "Sleep", next: "" },
        { text: "Of course!", destination: "Diner", next: "" }
    ]
);

createScreen(
    "Diner",
    "StockdalePhotos/dantediner.jpg",
    "He drives you to a decent-looking diner. You grab a seat and he immediatly |starts talking about his gae, glazing himself to the max.|He sees that you are bored and asks you about yout hobbies.| How do you respond?",
    [
        { text: "Answer enthusiatically", destination: "Bonding", next: "" },
        { text: "Be cold", destination: "HocoSale", next: "" }
    ]
);

createScreen(
    "Bonding",
    "StockdalePhotos/dantepark.jpg",
    "You and Dante bond over your mutual love of Pokemon.|Dante gives you his number. Do you later text Dante to go to HOCO?",
    [
        { text: "Sure", destination: "HocoDante", next: "" },
        { text: "Nah", destination: "NoHoco", next: "" }
    ]
);

createScreen(
    "HocoSale",
    "StockdalePhotos/danteglennhallway.jpg",
    "HOCO tickets are on sale! In class a few days later, you see Dante with Glenn, who is vibrantly smilig.|You buy a ticket, avoiding any interaction with the two.|It's the afternoon before HOCO. Do you go?",
    [
        { text: "Ya", destination: "DanteXGlenn", next: "" },
        { text: "No", destination: "NoHoco", next: "" }
    ]
);

createScreen(
    "DanteXGlenn",
    "StockdalePhotos/danteglennhoco.jpg",
    "Dante takes glenn to prom. |[BAD ENDING]",
    [
        { text: "Start Over?", destination: "start", next: "" }
    ]
);

createScreen(
    "SitWithGlenn",
    "StockdalePhotos/glennclassroom.jpg",
    "You sit with Glenn. He doesn't say anything.|You are assigned a project to review biology from last year and Glenn is your partner.|You both agree to meet up to work after school. Where do you meet?",
    [
        { text: "Your House", destination: "YourHouse", next: "" },
        { text: "His House", destination: "GlennHouse", next: "" },
        { text: "Library", destination: "Library", next: "" }
    ]
);

createScreen(
    "YourHouse",
    "StockdalePhotos/glenn.ynhouse.jpg",
    "Glenn arrives at your house, well-dressed and smiling. |You invite him inside and begin working. You and Glenn enter your room. Glenn points out your Pokemon poster |and begins talking passionately about it. |Do you shut him up?",
    [
        { text: "naur", destination: "AskHoco", next: "" },
        { text: "yea", destination: "GlennWorkingSad", next: "" }
    ]
);

createScreen(
    "GlennHouse",
    "StockdalePhotos/glennglennhouse.jpg",
    "You go to Glenn's house and enter his room, which is cluttered with| space and dinosaur decorations (the nerdy kinds).| He seems embarrassed, what do you say?",
    [
        { text: "Clown his goofy ahh room.", destination: "GlennHouseSad", next: "" },
        { text: "You tease him in a good-humored way.", destination: "GlennHouseRizz", next: "" }
    ]
);

createScreen(
    "NoHoco",
    "StockdalePhotos/black.jpg",
    "You stay home from HOCO [normal ending]",
    [
        { text: "Start Over?", destination: "start", next: "" }
    ]
);

createScreen(
    "GlennWorkingSad",
    "StockdalePhotos/glennglennhouse.jpg",
    "Glenn doesn't respond, staying quiet for the rest of the time you guys work.",
    [
        { text: "Next?", destination: "NoHoco", next: "" }
    ]
);

createScreen(
    "GlennHouseRizz",
    "StockdalePhotos/glennglennhouse.jpg",
    "Glenn feels a little ambaressed about his room, |but you two get to work and Glenn remains talkative.",
    [
        { text: "Next", destination: "HocoAsk", next: "" }
    ]
);

createScreen(
    "Library",
    "StockdalePhotos/glennlibrary.jpg",
    "Glenn meets you at a table in the library. You get to work when someone |yells his name across the room. It's Gabe, a jock known for picking on people. |Glenn and Gabe go back and forth until Glenn looks ready to throw a punch. |Intervene?",
    [
        { text: "Lol no", destination: "Fight", next: "" },
        { text: "Ya", destination: "Intervention", next: "" }
    ]
);

createScreen(
    "Intervention",
    "StockdalePhotos/glenngabelibrary.jpg",
    "You get between the two and break up the fight. Gabe insults you and Glenn |and walks away. Glenn thanks you for standing up for him and you continue working.",
    [
        { text: "Next", destination: "AskHoco", next: "" }
    ]
);

createScreen(
    "AskHoco",
    "StockdalePhotos/glennhallway1.jpg",
    "You're working on an English assignment in your room when you hear the doorbell ring. |You open the door and find Glenn. He asks you to your school Homecoming Dance. |Do you go?",
    [
        { text: "Of course, my glorious kind.", destination: "Hoco", next: "" },
        { text: "Naur", destination: "RejectedGlenn", next: "" }
    ]
);

createScreen(
    "RejectedGlenn",
    "StockdalePhotos/schoolhall1.jpg",
    "You tell Glenn you don't want to go. He turns around saying by |in a shaky voice and walks away.",
    [
        { text: "Start Over?", destination: "start", next: "" }
    ]
);

createScreen(
    "HocoGlenn",
    "StockdalePhotos/glennhoco.jpg",
    "You meet up with Glenn outside the school gym and enter HOCO with him. |You begin to dance when Gabe grabs Glenn's shoulder and punches him. |What do you do?",
    [
        { text: "Spectate", destination: "Hospital", next: "" },
        { text: "Tell Gabe to back off.", destination: "HappyHoco", next: "" }
    ]
);

createScreen(
    "HappyHoco",
    "StockdalePhotos/glennhoco.jpg",
    "You tell Gabe to back off. He backs off because he is afraid of women. |Glenn thanks you and you have a great time at HOCO. [GOOD ENDING]",
    [
        { text: "Start Again?", destination: "start", next: "" }
    ]
);

createScreen(
    "Fight",
    "StockdalePhotos/glenngabehoco.jpg",
    "Glenn throws a punch at Gabe. Gabe knocks Glenn out.",
    [
        { text: "Ayo call an ambulance.", destination: "Hospital", next: "" }
    ]
);

createScreen(
    "Hospital",
    "StockdalePhotos/black.jpg",
    "You watch as Glenn is carried to an ambulance on a stretcher. [BAD ENDING]",
    [
        { text: "Start Over?", destination: "start", next: "" }
    ]
);
