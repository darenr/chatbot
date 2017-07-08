function weatherEngine() {

    return {
        name: function() {
            return "weatherEngine";
        },
        react: function(query) {
            var zipcodePattern = /weather\s*(in)?\s*(\d{5})/i;
            if(query.match(zipcodePattern)) {
              var zipcode = query.match(zipcodePattern)[2];
              console.log("found weather intent with zip code of " + zipcode);
              // do zipcode lookup
              var content = "found weather intent with zip code of " + zipcode;
              return content;
            } else if(query.match(/.*(weather here|my weather).*$/i))  {
              // use html5 lat/lon
              if(navigator.geolocation){
                 navigator.geolocation.getCurrentPosition(
                   function showLocation(position) {
                     var lat = position.coords.latitude;
                     var lon = position.coords.longitude;
                     ChatBot.addChatEntry("found weather intent with lat/lon of " + lat + " " + lon, 'bot');
                     console.log("found weather intent with lat/lon of " + lat + " " + lon);
                   },
                   function errorHandler(err) {
                     if(err.code == 1) {
                        ChatBot.addChatEntry("Sorry, Access denied!", 'bot');
                     }
                     else if( err.code == 2) {
                        alert("Error: Position is unavailable!");
                        ChatBot.addChatEntry("Sorry, Position is unavailable!", 'bot');
                     }
                   },
                   {
                     timeout:30000
                   });
              }
              else{
                 ChatBot.addChatEntry("Sorry, browser does not support geolocation!", 'bot');
              }
            }

            return false;
        },
        getCapabilities: function() {
            return [
              "Ask about the weather like 'What is my weather?'",
              "Ask about the weather in a certain zipcode, like 'What is the weather in 94065?'"
            ];
        },
        getSuggestUrl: function() {
            return null;
        }
    }
}
