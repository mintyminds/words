$(document).ready(function(){
    //DEFINING VARIABLES
    var words = new Array();
    var eng_words = new Array();
    var rus_words = new Array();
    var audioElement = document.createElement('audio');

    //PARSING TXT FILE
    $.get('words.txt', function(data){
        words = data.split('\n');
        parse_words(words);
    });

    function parse_words(ar) {
        for (var i=0; i<ar.length; i++){
            var parts = ar[i].split(' -- ');
            var eng = parts[parts.length - 2];
            var rus = parts[parts.length - 1];

            
            eng_words.push(eng);

            if (rus.indexOf(',') !== -1){
                rus_words.push(rus.substring(0, rus.indexOf(',')));  
            } else if (rus.indexOf(' ') !== -1) {
                rus_words.push(rus.substring(0, rus.indexOf(' ')));
            } else {
                rus_words.push(rus.substring(0, rus.length));
            }
            
        }
    }

    //BUILDING QUESTIONS
    $('#button').click(function() {
        build_question();
        $('#button').fadeOut();

        $('#correct').click(function() {
            build_question();
        });
    });

    function build_question() {
        
        var rand = Math.floor(Math.random() * eng_words.length);
        var rand_1 = Math.floor(Math.random() * eng_words.length);
        var rand_2 = Math.floor(Math.random() * eng_words.length);
        var rand_3 = Math.floor(Math.random() * eng_words.length);

        var orig = eng_words[rand];

        $('#original').text(orig);

        $('.play').click(function() {
            pronoun(orig);
        });
        
        var ans_1 = '<div class="variant" id="correct">'+rus_words[rand]+'</div>';
        var ans_2 = '<div class="variant">'+rus_words[rand_1]+'</div>';
        var ans_3 = '<div class="variant">'+rus_words[rand_2]+'</div>';
        var ans_4 = '<div class="variant">'+rus_words[rand_3]+'</div>';

        var answers = [ans_1, ans_2, ans_3, ans_4];
        shuffle(answers);

        var translations = answers[0]+answers[1]+answers[2]+answers[3];

        $('#translation').html(translations);
        $('#correct').click(function() {
            build_question();
        });
    }

    //SHUFFLE ARRAY TO SHUFFLE VARIANTS
    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex ;
        while (0 !== currentIndex) {

            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    //WTF?!
    function pronounce(){
        
        /*if(results['items'].length != 0){
                var path = jsonp['items'][0]['pathogg'];
                $("#audioplayer")
                    .append($("<audio />")
                        .attr({
                            width: '300',
                            height: '35',
                            src: path
                        }));
        }*/
    }

    //JSON REQUEST TO FORVO.COM TO GET AUDIO FILE
    function pronoun(word) {
        var key = 'da53a5b03edc9e84d29b63003669f420';
        var url = 'http://apifree.forvo.com/key/'+key+'/format/json/callback/pronounce/action/standard-pronunciation/word/'+encodeURI(word)+'/language/en';
        var mp3;
        var ogg;
        $.ajax({
            url: url,
            jsonpCallback: "pronounce",
            dataType: "jsonp",
            type: "jsonp",
            success: function (json) {
                mp3 = json.items[0].pathmp3;
                //ogg = json.items[0].pathogg;
                change_source(mp3);
            },
            error: function(){
                console.log("error");
            }
        });
    }

    //CHANGING SOURCE OF THE AUDIO WITH CHANGING WORD
    function change_source(src) {
        //audioElement.removeAttr('src');
        audioElement.setAttribute('src', src);
        audioElement.play();
    }


});