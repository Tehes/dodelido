var dodelido = (function() {
    /* --------------------------------------------------------------------------------------------------
    Variables
    ---------------------------------------------------------------------------------------------------*/
    var cards = [];
    var animals = ["Alpaka", "Wal", "Faultier", "Schildkröte", "Pinguin", "T-Rex"];
    var colors = ["Lila", "Weiß", "Blau", "Gelb", "Grün", "Schwarz"];
    var round = 0;
	var keyword;
	var input = "";

    /* --------------------------------------------------------------------------------------------------
    functions
    ---------------------------------------------------------------------------------------------------*/
    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function newCard() {
        var animal, animalInt, color, colorInt;

        animalInt = getRndInteger(0, 105);

        if (animalInt <= 20) {
            animal = animals[0];
        }
        else if (animalInt > 20 && animalInt <= 40) {
            animal = animals[1];
        }
        else if (animalInt > 40 && animalInt <= 60) {
            animal = animals[2];
        }
        else if (animalInt > 60 && animalInt <= 80) {
            animal = animals[3];
        }
        else if (animalInt > 80 && animalInt <= 100) {
            animal = animals[4];
        }
        else if (animalInt > 100 && animalInt <= 105) {
            animal = animals[5];
        }

        colorInt = getRndInteger(0, 100);

        if (colorInt <= 20) {
            color = colors[0];
        }
        else if (colorInt > 20 && colorInt <= 40) {
            color = colors[1];
        }
        else if (colorInt > 40 && colorInt <= 60) {
            color = colors[2];
        }
        else if (colorInt > 60 && colorInt <= 80) {
            color = colors[3];
        }
        else if (colorInt > 80 && colorInt <= 100) {
            color = colors[4];
        }

        if (animal === "T-Rex") {
            color = colors[5];
        }

        return {
            animal: animal,
            color: color
        };
    }

    function play() {
        var index = round % 3;
        cards[index] = newCard();
        var slot = document.querySelectorAll("main div")[index];

		slot.dataset.color = cards[index].color;
		slot.dataset.animal = cards[index].animal;
        slot.className = "wiggle";

        round++;
        setKeyword();
   	}

    function setKeyword() {
        var colors = {};
		cards.forEach(function(i) { colors[i.color] = (colors[i.color]||0) + 1;});

		var colorvalues = Object.values(colors);
		var highestColorNo = Math.max(...colorvalues);
		var colorIndex = colorvalues.indexOf(highestColorNo);
		var colornames = Object.keys(colors);

		var animals = {};
		cards.forEach(function(i) { animals[i.animal] = (animals[i.animal]||0) + 1;});

		var Om = "";
		if (animals.Faultier) {
			for (var i = 0; i < animals.Faultier; i++) {
				Om += "Om "
			}
		}

		var animalvalues = Object.values(animals);
		var highestAnimalNo = Math.max(...animalvalues);
		var animalIndex = animalvalues.indexOf(highestAnimalNo);
		var animalnames = Object.keys(animals);

		var solution = "Nichts";
		if (animalvalues[animalIndex] > 1 && colorvalues[colorIndex] > 1 && animalvalues[animalIndex] === colorvalues[colorIndex]) { solution = "Dodelido";}
		else if (animalvalues[animalIndex] > colorvalues[colorIndex]) { solution = animalnames[animalIndex];}
		else if (animalvalues[animalIndex] < colorvalues[colorIndex]) { solution = colornames[colorIndex];}

		keyword = Om + solution;
    }

	function putKeyword(ev) {
        input += ev.target.textContent + " ";

		solve(input.trim());
	}

    function solve (getInput) {
        if (getInput.length <= keyword.length) {
            keywordsubstr = keyword.substring(0, getInput.length);
            inputsubstr = getInput.substring(0, getInput.length);

            if (keywordsubstr !== inputsubstr) {
                alert("Das war leider falsch. Richtig wäre '"+keyword+ "' gewesen.");
            }
            if (keyword === getInput) {

                play();
                input = "";
            }
        }
    }

    function stopWiggling(ev) {
        ev.target.classList.remove("wiggle");
    }

    function init() {
        var playButton = document.querySelector(".play");
        var cardstack = document.querySelector("main");
		var buttons = document.querySelector("#buttons");

		document.addEventListener("touchstart", function() {},false);
        playButton.addEventListener("click", play, false);
		buttons.addEventListener("click", putKeyword, true)
        cardstack.addEventListener("animationend", stopWiggling, false);
    }

    /* --------------------------------------------------------------------------------------------------
    public members, exposed with return statement
    ---------------------------------------------------------------------------------------------------*/
    return {
        init: init
    };

})();

dodelido.init();
