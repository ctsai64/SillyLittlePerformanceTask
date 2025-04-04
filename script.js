//  Begin Javascript Code File
//  ALL CODE WRITTEN BY CYMBERLY TSAI AND VI COVRLJAN UNLESS OTHERWISE STATED

function createScreen(id, imagePath, text, choices) {
    const screen = document.createElement("div");
    screen.id = id;
    screen.className = "screen";
    const lines = text.split('|');
    const textContent = lines.map(line => `<div class="type-anim">${line}</div>`).join('');
    screen.innerHTML = `
    <div class="content">
        <img src="${imagePath}" style="width: -webkit-fill-available; height: -webkit-fill-available; object-fit: cover;border-radius: 10px;">
    </div>
    <div class="text">${textContent}</div>
    <button onClick="switchScreen('${id}', 'start')" style="position: fixed; align-self: normal; font-size: smaller; width: min-content; padding: 10px;">Start Over</button>
    `;
    const choicesDiv = document.createElement("div");
    choicesDiv.className = "choices";
    for (var choice of choices) {
        choicesDiv.innerHTML += `<button onClick="switchScreen('${id}', '${choice.destination}')">${choice.text}</button>`;
    }
    screen.appendChild(choicesDiv);
    document.body.appendChild(screen);
}

function switchScreen(from, to) {
    document.getElementById(to).style.display = "grid";
    document.getElementById(from).style.display = "none";
    const typeAnims = document.getElementById(to).querySelectorAll('.text .type-anim');
    typeAnims.forEach((anim, index) => {
        setTimeout(() => {anim.style.setProperty('--char', anim.textContent.length);}, index * 2000);
    });
    localStorage.setItem("currentScreen", to);
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
//End of adapted code

window.onload = function () {
    const savedScreen = localStorage.getItem("currentScreen");
    if (savedScreen && document.getElementById(savedScreen)) {
        h = setInterval(addHeart, 500);
        switchScreen("start", savedScreen);
        document.getElementById(savedScreen).style.display = "grid";
        if (savedScreen != "start") {
            document.getElementById("start").style.display = "none";
            clearInterval(h);
        }
    }
};

createScreen(
    "FirstDayofSchool",
    "Image_Needed.png",
    "It's the first day of your senior year at Stockdale High|Do you go to school?",
    [
        { text: "Yes, go to school.", destination: "APBio" },
        { text: "No, don't go to school.", destination: "Detention" }
    ]
);

createScreen(
    "Detention",
    "Image_Needed.png",
    "You get caught and written up.",
    [
        { text: "Start Over?", destination: "start" }
    ]
);

createScreen(
    "APBio",
    "Image_Needed.png",
    "You go to AP Bio first period. Only two seats are left.",
    [
        { text: "Sit with Glenn", destination: "SitWithGlenn" },
        { text: "Sit with Dante", destination: "SitWithDante" }
    ]
);

createScreen(
    "SitWithDante",
    "Image_Needed.png",
    "Dante tells you he plays football. |Do you ask to watch him play at his next game?",
    [
        { text: "Nah", destination: "UnknownCaller" },
        { text: "Yes (uninterested)", destination: "UnknownCaller" },
        { text: "Yes! (excited)", destination: "YESFootball" }
    ]
);

createScreen(
    "UnknownCaller",
    "Image_Needed.png",
    "You are at home doing homework when you get a call from |an unknown number asking to meet at a park. |Do you go?",
    [
        { text: "Yes", destination: "Park" },
        { text: "No, that's shady.", destination: "Sleep" }
    ]
);

createScreen(
    "Sleep",
    "Image_Needed.png",
    "You go to bed.",
    [
        { text: "Next?", destination: "HocoSale" }
    ]
);

createScreen(
    "Park",
    "Image_Needed.png",
    "You go to the park and see Dante. |He asked your friend for your number.|Creeped out you ask why he called you out here. He says he was intrgiugued by you and would like to get to know yout better. How do you respond?",
    [
        { text: "GET OUT", destination: "NoHoco" },
        { text: "sure...?", destination: "HocoDante" }
    ]
);

createScreen(
    "HocoDante",
    "Image_Needed.png",
    "Yo go to hoco ad are boared. You want to leave bc it's bored, do you leave with dante?",
    [
        { text: "For sure twin", destination: "FootballGame" },
        { text: "No, ditch him", destination: "NoHoco" }
    ]
);

createScreen(
    "DanteEnd",
    "Image_Needed.png",
    "Good ending with Dante|[GOOD ENDING]",
    [
        { text: "Start Over?", destination: "start" }
    ]
)

createScreen(
    "AwkardPark",
    "Image_Needed.png",
    "Sit with dante in park",
    [
        { text: "Next", destination: "HocoSale" }
    ]
)

createScreen(
    "YESFootball",
    "Image_Needed.png",
    "Dante asks to hang out with you at the diner. Do you go?",
    [
        { text: "Nope, I'm going home.", destination: "Sleep" },
        { text: "Yeah", destination: "Diner" }
    ]
);

createScreen(
    "Diner",
    "Image_Needed.png",
    "He drives you to a decent-looking diner. You grab a seat and he immediatly |starts talking about his gae, glazing himself to the max.|He sees that you are bored and asks you about yout hobbies.| How do you respond?",
    [
        { text: "Answer enthusiatically", destination: "Bonding" },
        { text: "Be cold", destination: "HocoSale" }
    ]
);

createScreen(
    "Bonding",
    "Image_Needed.png",
    "You and Dante bond over your mutual love of Pokemon.|Dante gives you his number. Do you later text Dante to go to HOCO?",
    [
        { text: "Sure", destination: "HocoDante" },
        { text: "Nah", destination: "NoHoco" }
    ]

)

createScreen(
    "HocoSale",
    "Image_Needed.png",
    "HOCO tickets are on sale! In class a few days later, you see Dante with Glenn, who is vibrantly smilig.|You buy a ticket, avoiding any interaction with the two.|It's the afternoon before HOCO. Do you go?",
    [
        { text: "Ya", destination: "DanteXGlenn" },
        { text: "No", destination: "NoHoco" }
    ]
);

createScreen(
    "DanteXGlenn",
    "Image_Needed.png",
    "Dante takes glenn to prom. |[BAD ENDING]",
    [
        { text: "Start Over?", destination: "start" }
    ]
)

createScreen(
    "SitWithGlenn",
    "Image_Needed.png",
    "You sit with Glenn. He doesn't say anything.|You are assigned a project to review biology from last year and Glenn is your partner.|You both agree to meet up to work after school. Where do you meet?",
    [
        { text: "Your House", destination: "YourHouse" },
        { text: "His House", destination: "GlennHouse" },
        { text: "Library", destination: "Library" }
    ]
);

createScreen(
    "YourHouse",
    "Image_Needed.png",
    "Glenn arrives at your house, well-dressed and smiling. |You invite him inside and begin working. You and Glenn enter your room. Glenn points out your Pokemon poster |and begins talking passionately about it. |Do you shut him up?",
    [
        { text: "naur", destination: "AskHoco" },
        { text: "yea", destination: "GlennWorkingSad" },
    ]
);

createScreen(
    "GlennHouse",
    "Image_Needed.png",
    "You go to Glenn's house and enter his room, which is cluttered with| space and dinosaur decorations (the nerdy kinds).| He seems embarrassed, what do you say?",
    [
        { text: "Clown his goofy ahh room.", destination: "GlennHouseSad" },
        { text: "You tease him in a good-humored way.", destination: "GlennHouseRizz" },
    ]
);

createScreen(
    "NoHoco",
    "Image_Needed.png",
    "You stay home from HOCO [normal ending]",
    [
        { text: "Start Over?", destination: "start" }
    ]
)

createScreen(
    "GlennWorkingSad",
    "Image_Needed.png",
    "Glenn doesn't respond, staying quiet for the rest of the time you guys work.",
    [
        { text: "Next?", destination: "NoHoco" },
    ]
);
createScreen(
    "GlennHouseRizz",
    "Image_Needed.png",
    "Glenn feels a little ambaressed about his room, |but you two get to work and Glenn remains talkative.",
    [
        { text: "Next", destination: "HocoAsk" }
    ]
);

createScreen(
    "Library",
    "Image_Needed.png",
    "Glenn meets you at a table in the library. You get to work when someone |yells his name across the room. It's Gabe, a jock known for picking on people. |Glenn and Gabe go back and forth until Glenn looks ready to throw a punch. |Intervene?",
    [
        { text: "Lol no", destination: "Fight" },
        { text: "Ya", destination: "Intervention" }
    ]
);

createScreen(
    "Intervention",
    "Image_Needed.png",
    "You get between the two and break up the fight. Gabe insults you and Glenn |and walks away. Glenn thanks you for standing up for him and you continue working.",
    [
        { text: "Next", destination: "AskHoco" }
    ]
);

createScreen(
    "AskHoco",
    "Image_Needed.png",
    "You're working on an English assignment in your room when you hear the doorbell ring. |You open the door and find Glenn. He asks you to your school Homecoming Dance. |Do you go?",
    [
        { text: "Of course, my glorious kind.", destination: "Hoco" },
        { text: "Naur", destination: "RejectedGlenn" }
    ]
);

createScreen(
    "RejectedGlenn",
    "Image_Needed.png",
    "You tell Glenn you don't want to go. He turns around saying by |in a shaky voice and walks away.",
    [
        { text: "Start Over?", destination: "start" }
    ]
);

createScreen(
    "HocoGlenn",
    "Image_Needed.png",
    "You meet up with Glenn outside the school gym and enter HOCO with him. |You begin to dance when Gabe grabs Glenn's shoulder and punches him. |What do you do?",
    [
        { text: "Spectate", destination: "Hospital" },
        { text: "Tell Gabe to back off.", destination: "HappyHoco" }
    ]
);

createScreen(
    "HappyHoco",
    "Image_Needed.png",
    "You tell Gabe to back off. He backs off because he is afraid of women. |Glenn thanks you and you have a great time at HOCO. [GOOD ENDING]",
    [
        { text: "Start Again?", destination: "start" }
    ]
);

createScreen(
    "Fight",
    "Image_Needed.png",
    "Glenn throws a punch at Gabe. Gabe knocks Glenn out.",
    [
        { text: "Ayo call an ambulance.", destination: "Hospital" }
    ]
);

createScreen(
    "Hospital",
    "Image_Needed.png",
    "You watch as Glenn is carried to an ambulance on a stretcher. [BAD ENDING]",
    [
        { text: "Start Over?", destination: "start" }
    ]
);
