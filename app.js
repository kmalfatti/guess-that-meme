$(document).ready(function(){
  var memeIDs = [];
  var currentMeme;
  var shuffledMemes;
  var correct = 0;
  var incorrect = 0;
  var memeName;
  //start local storage
  var lsGetCor = localStorage.getItem("numberCorrect");
  var lsGetIncor = localStorage.getItem("numberIncorrect");
  $('#lifeCorrect').text("Correct: " + (lsGetCor || 0));
  $('#lifeIncorrect').text("Incorrect: " + (lsGetIncor || 0));

  // Trophy setup upon user returning to site, using local storage.
  if (lsGetCor > 4) {
      $('#notrophy').hide();
      $("#bronze").hide();
      $("#bronzeImg").show();
      if (lsGetCor > 24) {
        $("#silver").hide();
        $("#silverImg").show();
        if (lsGetCor > 99) {
          $("#gold").hide();
          $("#goldImg").show();
      }
    }
  }

  if(lsGetIncor > 49) {
    $('#troll').hide();
    $('#trollImg').show();
    $('#troll').prev().text("Congratulations! You've managed to get 50 incorrect!");
  }
  // Start game on user return to site
  nextMeme();

  function nextMeme(){
    $('#pic').empty();
    $.ajax({
      method: "GET",
      url: "https://api.imgflip.com/get_memes",
      dataType: "json",
      success: function ajaxSuccessResponse(meme){
        meme.data.memes.forEach(function(pic){
            memeIDs.push(pic);
        });
        shuffledMemes = _.shuffle(memeIDs);
        var img = ('<img id="main" src="' + shuffledMemes[0].url + '">');
        $('#pic').append(img).hide().fadeIn();
        memeName = shuffledMemes[0].name;
        },
    });
  }
  $('form').on('submit', function(e){
    e.preventDefault();

    var guess = ($('#guess').val().toLowerCase().replace(/\s/g,""));
    var answer = memeName.toLowerCase().replace(/\s/g,"");
    var ld = (levenshteinDistance(guess, answer));
      
    // if the API answer is 10 character or less. Player's answer can only be off by 2 characters.
    // if the API answer is 11 characters or more. Player's answer can off by 5 characters.
    if((answer.length <= 10 && ld < 3) || (answer.length > 10 && ld < 6)){
      correct++;
      $('.action').text('Correct!');
      $('.correct').text("Correct: " + correct);
      localStorage.setItem('numberCorrect', Number(localStorage.getItem("numberCorrect")) + 1);
      $('#lifeCorrect').text("Correct: " + localStorage.getItem("numberCorrect"));
    } else {
      incorrect++;
      $('.action').text('Incorrect');
      $('.incorrect').text("Incorrect: " + incorrect);
      localStorage.setItem('numberIncorrect', Number(localStorage.getItem("numberIncorrect")) + 1);
      $('#lifeIncorrect').text("Incorrect: " + localStorage.getItem("numberIncorrect"));
    }

    $('#answer').text(memeName);
    $('input').val("");

    if (localStorage.getItem("numberCorrect") > 4) {
      $('#notrophy').hide();
      $("#bronze").hide();
      $("#bronzeImg").show();
      if (localStorage.getItem("numberCorrect") > 24) {
        $("#silver").hide();
        $("#silverImg").show();
        if (localStorage.getItem("numberCorrect") > 99) {
          $("#gold").hide();
          $("#goldImg").show();
        }
      }
    }

    if(localStorage.getItem("numberIncorrect") > 49) {
      $('#troll').hide();
      $('#trollImg').show();
      $('#troll').prev().text("Congratulations! You've managed to get 50 incorrect!");
        if (localStorage.getItem("numberIncorrect") == 50) {
          window.alert("You've unlocked the secret trophy!");
        }
    }
    setTimeout(nextMeme,1000);
  });



  // Compute the edit distance between the two given strings
  function levenshteinDistance(a, b) {
    if(a.length === 0) return b.length; 
    if(b.length === 0) return a.length; 
    var matrix = [];
    // increment along the first column of each row
    var i;
    for(i = 0; i <= b.length; i++){
      matrix[i] = [i];
    }
    // increment each column in the first row
    var j;
    for(j = 0; j <= a.length; j++){
      matrix[0][j] = j;
    }
    // Fill in the rest of the matrix
    for(i = 1; i <= b.length; i++){
      for(j = 1; j <= a.length; j++){
        if(b.charAt(i-1) == a.charAt(j-1)){
          matrix[i][j] = matrix[i-1][j-1];
        } else {
          matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                  Math.min(matrix[i][j-1] + 1, // insertion
                                           matrix[i-1][j] + 1)); // deletion
        }
      }
    }

    return matrix[b.length][a.length];
  }
  
});

