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

var textId = 0;
var choiceId = 1;
function createScreen(id, imagePath, text, choices) {
    // Create screen container element and assign properties
    var screen = document.createElement("div");
    screen.id = id;
    screen.className = "screen";
    // Define content inside screen container as HTML elements
    screen.innerHTML = `
    <div class="content">
        <img src="${imagePath}" style="height: -webkit-fill-available; object-fit: cover;">
    </div>
    <div id="${textId}" class="text">${textProcessor(text)}</div>
    <button onClick="switchScreen('${id}', 'start')" style="position: fixed; align-self: normal; font-size: smaller; width: min-content; padding: 10px;">Start Over</button>
    `;
    // Create div for choices and assign properties to be added to the screen container
    const choicesDiv = document.createElement("div");
    choicesDiv.id = choiceId;
    choicesDiv.className = "choices";
    // Loop through list of choices, for each choice in the list of given choices, create a button element to be added to the screen
    for (var choice of choices) {
        choicesDiv.innerHTML += `<button onClick="nextText('${id}', '${textId}', '${choiceId}', '${choice.destination}', '${choice.next}')">${choice.text}</button>`;
    }
    // Add choices div to screen container and screen container to the body of the program
    screen.appendChild(choicesDiv);
    document.body.appendChild(screen);
    textId += 2;
    choiceId += 2;
}

// textProcessor() function processes the text to be displayed on the screen
// Function is called in createScreen() to format the text to be displayed on the screen
function textProcessor(inputText) {
    var lines = inputText.split('|');
    var processed = lines.map((line) => {
        var splitLines = [];
        var currentLine = '';
        var words = line.split(' ');
        for (var word of words) {
            if ((currentLine + word).length > 120) {
                splitLines.push(currentLine.trim());
                currentLine = word;
            } else {
                currentLine += (currentLine ? ' ' : '') + word;
            }
        }
        if (currentLine) {
            splitLines.push(currentLine.trim());
        }
        return splitLines.map(splitLine => {
            return `<div class="type-anim" style="--length: ${splitLine.length}; --duration: ${splitLine.length * 0.02}s;">${splitLine}</div>`;
        }).join('');
    }).join('');
    return processed;
}

// nextText() function dynamically switches the text and choice buttons displayed to the user then navigates to the next screen
// Function is called on click of any of the choice buttons
// Parameters:
//    id (str) - unique identifier of screen a button is associated with
//    tId (str) - unique identifier of text div to be updated
//    cId (str) - unique identifier of choice div to be updated
//    to (str) - unique identifier of screen to be displayed when button is clicked
//    nextText (str) - text to be displayed on the screen after the button is clicked
// If nextText is empty, the screen will be switched to the next screen immediately
function nextText(id, tId, cId, to, nextText){
    if (nextText == "") {
        switchScreen(id, to);
    }else{
        document.getElementById(tId).innerHTML = textProcessor(nextText);
        document.getElementById(cId).innerHTML = `<button onClick="switchScreen('${id}', '${to}')">Next</button>`;
    }
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
    var savedScreen = localStorage.getItem("currentScreen");
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
    "Teacher:  Where do you think YOU'RE going?!",
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
        { text: "Nah", destination: "UnknownCaller", next: "Dante: zamn ok ig…" },
        { text: "Sureeee", destination: "SureFootball", next: "Dante: Ight bet" },
        { text: "Yes!!!", destination: "YESFootball", next: "Dante: Fyeeeee! I’ll see u there ahaha 😘" }
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
    "YESFootball",
    "StockdalePhotos/dantefield.jpg",
    "You arrive at the field, sit down, and watch the game play out.|Dante manages to score a touchdown right as the final quarter wraps up!|Dante: Yoooo did you see that dawg??? I COOKED them lol|You: You sure did!|Dante:Say, wanna go get something to chow down on? I sure am hungry after carrying this entire team on my back.",
    [
        { text: "I'll pass.", destination: "Sleep", next: "Dante: oh ok|Dante turns around and walks away." },
        { text: "Of course!", destination: "Diner", next: "Dante: Sweet I’ll give u a ride" }
    ]
);

createScreen(
    "UnknownCaller",
    "StockdalePhotos/ynbedroom1.jpg",
    "You're in your room about to go to bed when you get a call on your phone from a number you don’t recognize.",
    [
        { text: "Don't Pick Up", destination: "Sleep", next: "You think ‘this is MAD shady!’ and turn your phone off. You go to sleep." },
        { text: "PickUp", destination: "Sleep", next: "" }
    ]
);

createScreen(
    "PickUp",
    "StockdalePhotos/ynbedroom1.jpg",
    "You press accept and raise the phone to your ear.|Random Caller: Come to Stockdale Park in 15 minutes.|The caller hangs up after saying this. Will you follow their orders?",
    [
        { text: "Yes", destination: "Park", next: "" },
        { text: "No", destination: "Sleep", next: "You turn your phone off and go to sleep." }
    ]
)

createScreen(
    "Sleep",
    "StockdalePhotos/ynbedroom1.jpg",
    "You go to bed.",
    [
        { text: "StartOver?", destination: "start", next: "" }
    ]
);

createScreen(
    "Park",
    "StockdalePhotos/dantepark.jpg",
    "You arrive at the park and see Dante approaching you.|Dante: Yooo haha whats poppin? I asked one of your homegirls for your number 🤭 hope ya dont mind.|You: …|Dante: I like… just found you intriguing lowkey… |He sits down at a nearby bench|Dante: Wanna chit chat?",
    [
        { text: "Nah, I got bigger fish to fry", destination: "Sleep", next: "Dante: Fine! Be that way 🤬|He gets up and leaves. You return home and go to sleep." },
        { text: "Sure, let's talk", destination: "AkwardPark", next: "" }
    ]
);

createScreen(
    "AwkardPark",
    "StockdalePhotos/dantepark.jpg",
    "You sit down next to him and wait for him to initiate conversation.|Dante: So like… whats ur type?|You: What kind of question is that??|Dante: idk|You: Ugh. Well I don’t really know. Never thought about it too hard.|Dante: faxxxxxxx me neither ahahahahaha|You:...|Dante:...|You: So you play football, huh?|Dante: Yessss 😁 ball is life bro, you feel me?|You: Mhm.|Dante: Broooo todays game was CRAZY you shouldve seen that touchdown I made in the last quarter.|The two of you talk about football for the next hour, eventually parting ways to go to bed.",
    [
        { text: "Next", destination: "Diner", next: "" }
    ]
);

createScreen(
    "Diner",
    "StockdalePhotos/dantediner.jpg",
    "Dante parks his car in front of a 50’s style diner and leads you in. The two of you sit down and look at the menus.|Dante: This bacon egg n’ cheese sandwich looks BUSS dawg… lowkey might snag one. You?|You: probably just fries.|Dante: littttttt. Did u see how i played out there?? TELL me i aint the goat. First I was like “omg no we’re down a few points we’re gonna fumble this so bad” but then I locked in and was all “I understand it now” and absolutely COOKED the other team|You:...yea|Dante:...|He sees that youre visibly bored by his football talk. After a few seconds, he asks you a question.|Dante: So… what do you do for fun?",
    [
        { text: "Nothing rly", destination: "HocoSale2", next: "Dante: oh cool |After your lousy response to Dante wanting to learn more about you, you receive your food and eat in awkward silence.|Dante: That B.E.C. was fire 🤤 Here’s a 10–I gotta bounce.|He slides a 5 dollar bill to you and dashes out of the diner. You call your mom for a ride home and go to bed." },
        { text: "I like to draw a bit", destination: "HocoSale1", next: "Dante: yooo me too 🔥🔥🔥 Dinosaurs lowk are so fun to doodle|The two of you bond over your shared interest while eating. Dante gives you a ride home and you go to sleep." }
    ]
);

createScreen(
    "HocoSale1",
    "StockdalePhotos/schoolhall1.jpg",
    "You arrive at school to see that homecoming tickets are on sale. You remember hearing that dante wanted to go but didn’t have a date. You think of texting him, asking if he’d like to go with you. Do you?",
    [
        { text: "Yes", destination: "DanteXGlenn", next: "You text him, asking to go to Homecoming with you. He texts back almost immediately, cheerfully agreeing to coming!" },
        { text: "No", destination: "Sleep", next: "You decide that tickets are a waste of money and that school dances are a waste of time, so you pass on your last opportunity to attend." }
    ]
);

createScreen(
    "HocoSale2",
    "StockdalePhotos/danteglennhallway.jpg",
    "You arrive at school to see that homecoming tickets are on sale. You see Dante talking to that nerdy kid in your Bio class. They seem to be having a great discussion, bright smiles illuminating across both of their faces. You decide to not interrupt their conversation and buy a ticket.",
    [
        { text: "Next", destination: "DanteXGlenn", next: "" }
    ]
)

createScreen(
    "DanteXGlenn",
    "StockdalePhotos/danteglennhoco.jpg",
    "You arrive a bit late to homecoming, taking a seat at the bleachers in hopes that Dante finds you. Instead, to your surprise, you see Dante and the nerd from before dancing together. You think nothing of it at first, excusing it as friends dancing together.",
    [
        { text: "Start Over?", destination: "start", next: "" }
    ]
);


createScreen(
    "HocoDante",
    "StockdalePhotos/dantehoco.jpg",
    "The night of homecoming, Dante picks you up and drives the two of you there. After only about half an hour of dancing, you get bored and desperate for some fresh air. Youre leaving this jawn eventually, regardless of if Dante wants to come with you. Will you ditch him, or ask him to leave Homecoming with you?",
    [
        { text: "Ditch Him", destination: "Sleep", next: "" },
        { text: "Ask Him to Come", destination: "DanteEnd", next: "You: Hey, wanna dip? This sucks.|Dante: highkey ur right. Lets skidaddle 🥳" }
    ]
);

createScreen(
    "DanteEnd",
    "StockdalePhotos/black.jpg",
    "The two of you leave HOCO and go bowling.",
    [
        { text: "Start Over?", destination: "start", next: "" }
    ]
);

createScreen(
    "SitWithGlenn",
    "StockdalePhotos/glennclassroom.jpg",
    "You take a seat next to four-eyes. He doesn’t say anything, just keeps reading his book titled “Sir Isaac Newton's Mathematical Principles of Natural Philosophy and His System of the World.”|You: Hey… what’s your name?|Glenn: I am, if you must know, called Glenn.|You:..|Glenn:...|You: What are you reading?|Glenn: “Sir Isaac Newton's Mathematical Principles of Natural Philosophy and His System of the World,” are you, perchance, illiterate?|You: Sorry…|The two of you sit in silence until the end of the period, which is concluded by your teacher announcing a mini-project to review content from last year. Glenn is your partner since you share a table.",
    [
        { text: "Next", destination: "GlennHallway", next: "" },
    ]
);

createScreen(
    "GlennHallway",
    "StockdalePhotos/glennhallway1.jpg",
    "Glenn: And where, pray tell, do you suggest we begin our undertaking?",
    [
        { text: "Your House", destination: "YourHouse", next: "Glenn: Very well, then. Until we meet again." },
        { text: "His House", destination: "GlennHouse", next: "Glenn: Very well, then. Until we meet again." },
        { text: "Library", destination: "Library", next: "Glenn: Very well, then. Until we meet again." }
    ]
);

createScreen(
    "YourHouse",
    "StockdalePhotos/glenn.ynhouse.jpg",
    "You’re in your bedroom doing homework when you hear knocking at the door. You go downstairs and open the door to see Glenn in a nice outfit, like he was going out to dinner.|Glenn: Let us proceed with the matter at hand, shall we?|You: Yup.|You lead Glenn to your bedroom. You sit on the floor and get out the supplies you need for your assignment. You see Glenn staring at your Pokemon poster with admiration.|Glenn: Good heavens–a Pokemon poster! How utterly delightful; I simply ADORE Pokemon!|He starts yapping about random Pokemon trivia, most of which was niche knowledge only a dedicated fan would know. You try to keep working as he spews words, but its too distracting. What do you do?",
    [
        { text: "Shut Him Up", destination: "Present", next: "You: Zip it. We need to focus.|Glenn: Very well, my sincerest apologies. Let us embark with the task at hand.|The two of you manage to finish the project in only an hour, mainly since Glenn didn’t speak for the entire work session. Once he leaves, you finish your homework and head to bed." },
        { text: "Chat With Him", destination: "AskHoco", next: "You: Have you seen Imakuni’s Doduo? Cool card, isnt it?|Glenn: Ah, yes! Imakuni’s Doduo! What a splendid card. It graces my personal collection, of course.|The two of you barely get any work done, spending the majority of your time together talking about Pokemon." }
    ]
);

createScreen(
    "Present",
    "StockdalePhotos/schoolhall1.jpg",
    "The next day, the two of you present your project and earn As on it. You leave class and see that homecoming tickets are now on sale. Having no one to take with you, you decide to skip it.",
    [
        { text: "Next", destination: "Sleep", next: "" }
    ]
)

createScreen(
    "GlennHouse",
    "StockdalePhotos/glennglennhouse.jpg",
    "Your mom drops you off in front of a large colonial-style house with quartz fountains and freshly-trimmed hedges decorating the yard. You knock on the door and await a response. Glenn opens the door and grants you entry.|Glenn: Welcome to my humble abode! Do come along–my quarters are right this way!|The two of you enter his room. You’re immediately bombarded with a rather impressive array of dinosaur-related items, such as diagrams and models. Gosh, this kid is a nerd. You look over at Glenn, his face visibly a bright red from what you assume to be embarrassment. You should probably say something.",
    [
        { text: "Insult", destination: "Present", next: "You: Jeez, did you decorate this place or carbon date it?|Glenn looks away, looking even more uncomfortable than before.|Glenn: Let us simply attend to the task without further delay.|The two of you finished your project in a few hours, barely speaking the entire time." },
        { text: "Compliment", destination: "AskHoco", next: "You: Your room is pretty cool|Glenn’s expression immediately lightens.|Glenn: Why, thank you! I do try to curate an atmosphere of refined eccentricity.|You and Glenn work on your project until sunset, talking about your interests and hobbies. You leave his place with a far better opinion on him than you did before." }
    ]
);

createScreen(
    "Library",
    "StockdalePhotos/glennlibrary.jpg",
    "After school, you meet up with glenn in the library to work on your assignment. You both sit down and get to work, chit chatting a bit here and there, until you hear a loud voice coming from behind you.|???: Hey Glenn! How’s it going?|You turn around to see a shorter dude in a yellow turtleneck approaching your table.",
    [
        { text: "Next", destination: "GlennGabeLibrary", next: "" },
    ]
);

createScreen(
    "GlennGabeLibrary",
    "StockdalePhotos/glenngabelibrary.jpg",
    "Glenn: Please remove yourself from our presence, Gabe.|Gabe: Not until you pay me back.|Glenn: As I’ve already made abundantly clear, I am under no obligation to furnish you with anything whatsoever. Good day.|Glenn gathers his belongings and gets up. You do the same and follow him to another area, but Gabe blocks his path.|Gabe: Ummmm? Where do you think you’re going?|He gives Glenn a shove, knocking a few things out of his grasp. Glenn puts the rest of his stuff on a table and storms back towards Gabe. Looks like a fight is about to ensue– what do you do?",
    [
        { text: "Don't Interfere", destination: "Hospital", next: "" },
        { text: "Intervene", destination: "AskHoco", next: "You get between the two, preventing any physical contact.|You: Glenn, chill out. And you… Gaybe or whatever… get outta here.|Gabe: I’ll be back!|Gabe scurries out of the library, seemingly nervous after having his first real encounter with a woman. You and Glenn decide to work on your project another time and part ways." }
    ]
);

createScreen(
    "AskHoco",
    "StockdalePhotos/glennhallway1.jpg",
    "A week later, Glenn pulls you to the side of the hallway during passing period.|Glenn: I have an inquiry.|You: Yeah, what’s up?|Glenn: Ahem. I realize this may come as rather unexpected but–might I interest you in accompanying me to the upcoming Homecoming festivities? I daresay we’d make… quite the formidable pair.",
    [
        { text: "Yes", destination: "HocoGlenn", next: "Glenn: Splendid– I am positively delighted. Well then, until later… try not to let the drudgery of class dampen your brilliance." },
        { text: "No", destination: "RejectedGlenn", next: "" }
    ]
);

createScreen(
    "RejectedGlenn",
    "StockdalePhotos/schoolhall1.jpg",
    "You tell Glenn you don't want to go. He turns around saying by in a shaky voice and walks away.",
    [
        { text: "Start Over?", destination: "start", next: "" }
    ]
);

createScreen(
    "HocoGlenn",
    "StockdalePhotos/glennhoco.jpg",
    "You meet up with Glenn outside the school gym and enter HOCO with him. You begin to dance when Gabe grabs Glenn's shoulder and punches him. |What do you do?",
    [
        { text: "Spectate", destination: "Hospital", next: "" },
        { text: "Tell Gabe to back off.", destination: "HappyHoco", next: "" }
    ]
);

createScreen(
    "HappyHoco",
    "StockdalePhotos/glennhoco.jpg",
    "You tell Gabe to back off. He backs off because he is afraid of women. Glenn thanks you and you have a great time at HOCO.",
    [
        { text: "Start Again?", destination: "start", next: "" }
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
