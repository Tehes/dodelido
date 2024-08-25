var dodelido = (function () {
    /* --------------------------------------------------------------------------------------------------
    Variables
    ---------------------------------------------------------------------------------------------------*/
    var cards = [];
    var round = 0;
    var gameScore = 0;
    var highScore;
    var keyword;
    var input = "";
    var roundTimer;
    var timerDuration = document.querySelector("input").value;
    var displayGameScore = document.querySelector("#gameScore span");
    var displayhighScore = document.querySelector("#highScore span");
    var displayTimer = document.querySelector("#timer span");
    var buttons = document.querySelector("#buttons");
    var instructions = document.querySelector("aside");

    /* --------------------------------------------------------------------------------------------------
    functions
    ---------------------------------------------------------------------------------------------------*/
    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function newCard() {
        var animal, animalInt, color, colorInt;
        var animalList = ["Alpaka", "Wal", "Faultier", "Schildkröte", "Pinguin", "T-Rex"];
        var colorList = ["Lila", "Weiß", "Blau", "Gelb", "Grün", "Schwarz"];

        animalInt = getRndInteger(0, 105);

        if (animalInt <= 20) {
            animal = animalList[0];
        }
        else if (animalInt > 20 && animalInt <= 40) {
            animal = animalList[1];
        }
        else if (animalInt > 40 && animalInt <= 60) {
            animal = animalList[2];
        }
        else if (animalInt > 60 && animalInt <= 80) {
            animal = animalList[3];
        }
        else if (animalInt > 80 && animalInt <= 100) {
            animal = animalList[4];
        }
        else if (animalInt > 100 && animalInt <= 105) {
            animal = animalList[5];
        }

        colorInt = getRndInteger(0, 100);

        if (colorInt <= 20) {
            color = colorList[0];
        }
        else if (colorInt > 20 && colorInt <= 40) {
            color = colorList[1];
        }
        else if (colorInt > 40 && colorInt <= 60) {
            color = colorList[2];
        }
        else if (colorInt > 60 && colorInt <= 80) {
            color = colorList[3];
        }
        else if (colorInt > 80 && colorInt <= 100) {
            color = colorList[4];
        }

        if (animal === "T-Rex") {
            color = colorList[5];
        }

        return {
            animal: animal,
            color: color
        };
    }

    function play() {
        var index, slot;

        index = round % 3;
        cards[index] = newCard();
        slot = document.querySelectorAll("main div")[index];

        slot.dataset.color = cards[index].color;
        slot.dataset.animal = cards[index].animal;
        slot.className = "wiggle";

        if (cards[index].animal === "T-Rex") {
            slot.addEventListener("click", catchTRex, false);
        }

        round++;
        setKeyword();
        roundTimer = setTimeout(timer, timerDuration * 1000);
    }

    function setKeyword() {
        var colors, colorvalues, highestColorNo, colorIndex, colornames, om, animals, animalvalues, highestAnimalNo, animalIndex, animalnames, solution;

        colors = {};
        cards.forEach(function (i) {
            colors[i.color] = (colors[i.color] || 0) + 1;
        });

        colorvalues = Object.values(colors);
        highestColorNo = Math.max(...colorvalues);
        colorIndex = colorvalues.indexOf(highestColorNo);
        colornames = Object.keys(colors);

        animals = {};
        cards.forEach(function (i) {
            animals[i.animal] = (animals[i.animal] || 0) + 1;
        });

        om = "";
        if (animals.Faultier) {
            for (var i = 0; i < animals.Faultier; i++) {
                om += "Om ";
            }
        }

        animalvalues = Object.values(animals);
        highestAnimalNo = Math.max(...animalvalues);
        animalIndex = animalvalues.indexOf(highestAnimalNo);
        animalnames = Object.keys(animals);

        solution = "Nichts";
        if (animalvalues[animalIndex] > 1 && colorvalues[colorIndex] > 1 && animalvalues[animalIndex] === colorvalues[colorIndex]) {
            solution = "Dodelido";
        }
        else if (animalvalues[animalIndex] > colorvalues[colorIndex]) {
            solution = animalnames[animalIndex];
        }
        else if (animalvalues[animalIndex] < colorvalues[colorIndex]) {
            solution = colornames[colorIndex];
        }

        if (animals["T-Rex"]) {
            keyword = "T-Rex";
        }
        else {
            keyword = om + solution;
        }
    }

    function putKeyword(ev) {
        var target = ev.target;

        if (target.tagName === "DIV") {
            target = target.parentElement;
        }
        if (target.tagName === "LI") {
            input += target.textContent + " ";
            solve(input.trim());
        }
    }

    function solve(getInput) {
        var keywordsubstr, inputsubstr;

        if (keyword === "T-Rex") {
            alert("Du hättest den T-Rex anklicken müssen");
            reset();
            return;
        }
        if (getInput.length <= keyword.length) {
            keywordsubstr = keyword.substring(0, getInput.length);
            inputsubstr = getInput.substring(0, getInput.length);

            if (keywordsubstr !== inputsubstr) {
                alert("Das war leider falsch. Richtig wäre '" + keyword + "' gewesen.");
                reset();
            }
        }
        else {
            alert("Das war leider falsch. Richtig wäre '" + keyword + "' gewesen.");
            reset();
        }
        if (keyword === getInput) {
            clearTimeout(roundTimer);
            play();
            input = "";
            gameScore++;
            displayGameScore.textContent = gameScore;
        }
    }

    function stopWiggling() {
        event.target.classList.remove("wiggle");
    }

    function reset(withoutScore) {
        var cardstack, i;

        clearTimeout(roundTimer);
        round = 0;

        if (!withoutScore) {
            highScore = displayhighScore.textContent;
            if (gameScore > highScore) {
                localStorage.setItem("Dodelido_highscore_" + timerDuration, gameScore);
                displayhighScore.textContent = gameScore;
            }
            gameScore = 0;
            buttons.removeEventListener("click", putKeyword, false);
        }

        displayGameScore.textContent = gameScore;
        input = "";
        keyword = "";
        cards = [];
        cardstack = document.querySelectorAll("main div");

        for (i = 0; i < cardstack.length; i++) {
            delete cardstack[i].dataset.color;
            delete cardstack[i].dataset.animal;
            cardstack[i].classList.remove("wiggle");
        }
    }

    function start() {
        reset();
        buttons.addEventListener("click", putKeyword, false);
        play();
    }

    function timer() {
        alert(timerDuration + " Sekunden sind um.");
        reset();
    }

    function catchTRex() {
        event.target.removeEventListener("click", catchTRex, false);
        reset(true);
        play();
    }

    function setTimerDuration() {
        timerDuration = event.target.value;
        displayTimer.textContent = timerDuration;
        displayhighScore.textContent = localStorage.getItem("Dodelido_highscore_" + timerDuration) || 0;
        localStorage.setItem("Dodelido_timerDuration", timerDuration);
    }

    function toggleWindow() {
        instructions.classList.toggle("hidden");
    }

    function init() {
        var startButton = document.querySelector(".start");
        var helpButton = document.querySelector(".help");
        var gameSpace = document.querySelector("main");
        var slider = document.querySelector("input");

        timerDuration = localStorage.getItem("Dodelido_timerDuration") || 9;
        document.querySelector("input").value = timerDuration;
        displayTimer.textContent = timerDuration;
        displayhighScore.textContent = localStorage.getItem("Dodelido_highscore_" + timerDuration) || 0;

        document.addEventListener("touchstart", function () { }, false);
        startButton.addEventListener("click", start, false);
        gameSpace.addEventListener("animationend", stopWiggling, false);
        slider.addEventListener("input", setTimerDuration, false);
        helpButton.addEventListener("click", toggleWindow, false);
        instructions.addEventListener("click", toggleWindow, false);
    }

    /* --------------------------------------------------------------------------------------------------
    public members, exposed with return statement
    ---------------------------------------------------------------------------------------------------*/
    return {
        init: init
    };

})();

dodelido.init();
