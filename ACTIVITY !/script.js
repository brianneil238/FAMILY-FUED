var app = {
    version: 1,
    currentQ: 0,
    jsonFile:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/40041/FF3.json",
    board: $("<div class='gameBoard'>"+
             
               "<!--- Scores --->"+
               "<div class='score' id='boardScore'>0</div>"+
               "<div class='score' id='team1' >0</div>"+
               "<div class='score' id='team2' >0</div>"+
             
               "<!--- Question --->"+
               "<div class='questionHolder'>"+
                 "<span class='question'></span>"+
               "</div>"+
             
               "<!--- Answers --->"+
               "<div class='colHolder'>"+
                 "<div class='col1'></div>"+
                 "<div class='col2'></div>"+
               "</div>"+
             
               "<!--- Buttons --->"+
               "<div class='btnHolder'>"+
                 "<div id='awardTeam1' data-team='1' class='button'>Award Team 1</div>"+
                 "<div id='newQuestion' class='button'>New Question</div>"+
                 "<div id='awardTeam2' data-team='2'class='button'>Award Team 2</div>"+
               "</div>"+
             
             "</div>"),
    // Utility functions
    shuffle: function(array){
      var currentIndex = array.length, temporaryValue, randomIndex;
      while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
      return array;
    },
    jsonLoaded: function(data){
      console.clear()
      app.allData   = data
      app.questions = Object.keys(data)
      app.shuffle(app.questions)
      app.makeQuestion(app.currentQ)
      $('body').append(app.board)
    },
    // Action functions
    makeQuestion: function(qNum){
      var qText  = app.questions[qNum]
      var qAnswr = app.allData[qText]
  
      var qNum = qAnswr.length
          qNum = (qNum<8)? 8: qNum;
          qNum = (qNum % 2 != 0) ? qNum+1: qNum;
      
      var boardScore = app.board.find("#boardScore")
      var question   = app.board.find(".question")
      var col1       = app.board.find(".col1")
      var col2       = app.board.find(".col2")
      
      boardScore.html(0)
      question.html(qText.replace(/&x22;/gi,'"'))
      col1.empty()
      col2.empty()
  
      for (var i = 0; i < qNum; i++){
        var aLI     
        if(qAnswr[i]){
          aLI = $("<div class='cardHolder'>"+
                    "<div class='card'>"+
                      "<div class='front'>"+
                        "<span class='DBG'>"+(i+1)+"</span>"+
                      "</div>"+
                      "<div class='back DBG'>"+
                        "<span>"+qAnswr[i][0]+"</span>"+
                        "<b class='LBG'>"+qAnswr[i][1]+"</b>"+
                      "</div>"+
                    "</div>"+
                  "</div>")
        } else {
          aLI = $("<div class='cardHolder empty'><div></div></div>")
        }
        var parentDiv = (i<(qNum/2))? col1: col2;
        $(aLI).appendTo(parentDiv)
      }  
      
      var cardHolders = app.board.find('.cardHolder')
      var cards       = app.board.find('.card')
      var backs       = app.board.find('.back')
      var cardSides   = app.board.find('.card>div')
  
      TweenLite.set(cardHolders , {perspective:800});
      TweenLite.set(cards       , {transformStyle:"preserve-3d"});
      TweenLite.set(backs       , {rotationX:180});
      TweenLite.set(cardSides   , {backfaceVisibility:"hidden"});
  
      cards.data("flipped", false)
      
      function showCard(){
        var card = $('.card', this)
        var flipped = $(card).data("flipped")
        var cardRotate = (flipped)?0:-180;
        TweenLite.to(card, 1, {rotationX:cardRotate, ease:Back.easeOut})
        flipped = !flipped
        $(card).data("flipped", flipped)
        app.getBoardScore()
      }
      cardHolders.on('click',showCard)
    },
    getBoardScore: function(){
      var cards = app.board.find('.card')
      var boardScore = app.board.find('#boardScore')
      var currentScore = {var: boardScore.html()}
      var score = 0
      function tallyScore(){
        if($(this).data("flipped")){
           var value = $(this).find("b").html()
           score += parseInt(value)
        }
      }
      $.each(cards, tallyScore)      
      TweenMax.to(currentScore, 1, {
        var: score, 
        onUpdate: function () {
          boardScore.html(Math.round(currentScore.var));
        },
        ease: Power3.easeOut,
      });
    },
    awardPoints: function(num){
      var num          = $(this).attr("data-team")
      var boardScore   = app.board.find('#boardScore')
      var currentScore = {var: parseInt(boardScore.html())}
      var team         = app.board.find("#team"+num)
      var teamScore    = {var: parseInt(team.html())}
      var teamScoreUpdated = (teamScore.var + currentScore.var)
      TweenMax.to(teamScore, 1, {
        var: teamScoreUpdated, 
        onUpdate: function () {
          team.html(Math.round(teamScore.var));
        },
        ease: Power3.easeOut,
      });
      
      TweenMax.to(currentScore, 1, {
        var: 0, 
        onUpdate: function () {
          boardScore.html(Math.round(currentScore.var));
        },
        ease: Power3.easeOut,
      });
    },
    changeQuestion: function(){
      app.currentQ++
      app.makeQuestion(app.currentQ)
    },
    // Inital function
    init: function(){
      $.getJSON(app.jsonFile, app.jsonLoaded)
      app.board.find('#newQuestion' ).on('click', app.changeQuestion)
      app.board.find('#awardTeam1'  ).on('click', app.awardPoints)
      app.board.find('#awardTeam2'  ).on('click', app.awardPoints)
    }  
  }
  app.init()
  //http://www.qwizx.com/gssfx/usa/ff.htm

  $(document).ready(function () {
    const questions = [
        {
            question: "Magbigay ng salitang pwedeng pang-describe sa saging?",
            answers: [["Mahaba", 43], ["Masarap", 10], ["Matamis", 9], ["Dilaw", 6], ["Malambot", 4], ["Kurbado", 4]]
        },
        {
            question: "Mahirap maging (blank).",
            answers: [["Pogi", 60], ["Mahirap", 17], ["Mabait", 4], ["Pangit", 4], ["Single", 3]]
        },
        {
            question: "Ano ang karaniwang ginagawa sa dilim?",
            answers: [["Natutulog", 21], ["Kiss / Sexy time", 16], ["Nangangapa", 11], ["Nagtatago", 11], ["Nagse-cellphone", 7]]
        },
        {
            question: "Anong mga pambobola ang sinasabi ng lalaki sa babae?",
            answers: [["Ang ganda mo", 32], ["Ikaw lang wala na", 31], ["Di kita iiwan", 10], ["I miss you", 10], ["Ang sexy mo", 3]]
        },
        {
            question: "Magbigay ng tunog na nalilikha ng katawan?",
            answers: [["Utot", 24], ["Boses", 14], ["Sipol", 10], ["Hilik", 9], ["Palakpak", 1]]
        },
        {
            question: "Matutuwa ka kung ano ang mabango sa lalaki?",
            answers: [["Buhok / Ulo", 32], ["Kilikili", 18], ["Leeg", 12], ["Bibig / Hininga", 12], ["Dibdib", 4]]
        },
        {
            question: "Anong nagagawa ng bibe na kaya mo rin gawin?",
            answers: [["Lumangoy / Maligo", 38], ["Lumakad / Kumendeng", 26], ["Tumuka / Kumain", 13], ["Uminom", 6], ["Mag quack quack", 3]]
        },
        {
            question: "Sino kinakausap mo pag may problem ka sa lovelife?",
            answers: [["Friend", 51], ["Parents", 13], ["Kapatid", 6], ["Sarili", 4], ["Lord", 3]]
        },
    ];

    let currentQuestionIndex = 0;
    let currentScores = [0, 0];
    let currentPlayer = 0; // 0 for Player 1, 1 for Player 2
    let incorrectAttempts = [0, 0];

    // Show welcome screen
    $('#startGame').click(function () {
        const player1Name = $('#player1Name').val();
        const player2Name = $('#player2Name').val();

        if (player1Name && player2Name) {
            $('#welcomeScreen').hide();
            $('#gameScreen').show();
            $('#score1').text(`${player1Name}: 0`);
            $('#score2').text(`${player2Name}: 0`);
            startRound();
        } else {
            alert("Please enter names for both players!");
        }
    });

    // Start a new round
    function startRound() {
        if (currentQuestionIndex < questions.length) {
            $('#question').text(questions[currentQuestionIndex].question);
            $('#answerInput').val('');
            $('#warning').text('');
            startTimer(60);
        } else {
            alert("Game Over! Final Scores:\n" + $('#score1').text() + "\n" + $('#score2').text());
        }
    }

    // Timer
    function startTimer(duration) {
        let timer = duration;
        const timerInterval = setInterval(function () {
            $('#timer').text(timer);
            timer--;

            if (timer < 0) {
                clearInterval(timerInterval);
                // Transition to the next question
                currentQuestionIndex++;
                startRound();
            }
        }, 1000);
    }

    // Answer submission
    $('#submitAnswer').click(function () {
        const answer = $('#answerInput').val().trim().toLowerCase();
        const answers = questions[currentQuestionIndex].answers;

        const correctAnswer = answers.find(ans => ans[0].toLowerCase() === answer);
        if (correctAnswer) {
            const points = correctAnswer[1];
            currentScores[currentPlayer] += points;
            $('#score' + (currentPlayer + 1)).text(`Player ${currentPlayer + 1}: ${currentScores[currentPlayer]}`);
            $('#answerInput').val('');
        } else {
            incorrectAttempts[currentPlayer]++;
            $('#warning').text(`Incorrect! You have ${3 - incorrectAttempts[currentPlayer]} attempts left.`);
            $('#incorrectIndicators').append(`<span class="incorrectMark">X</span>`);

            if (incorrectAttempts[currentPlayer] === 3) {
                alert(`Player ${currentPlayer + 1} has too many incorrect answers. Passing turn to Player ${3 - currentPlayer}.`);
                currentPlayer = 1 - currentPlayer; // Switch player
                incorrectAttempts = [0, 0]; // Reset attempts
                $('#incorrectIndicators').empty(); // Clear previous incorrect marks
            }
        }
    });

    // Pass answer
    $('#passAnswer').click(function () {
        alert(`Player ${currentPlayer + 1} passed their turn. It's now Player ${3 - currentPlayer}'s turn.`);
        currentPlayer = 1 - currentPlayer; // Switch player
        $('#answerInput').val('');
        incorrectAttempts[currentPlayer] = 0; // Reset attempts for new player
    });
});