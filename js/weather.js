function weatherEngine() {

  return {
    name: function() {
      return "weatherEngine";
    },
    react: function(query) {
      var q = query.replace('?', '')
      var zipcodePattern = /weather\s+(in\s+)?(\d{5})/i;
      var cityPattern = /weather\s+(in)\s+(.*$)/i;
      if (q.match(zipcodePattern)) {
        var zipcode = q.match(zipcodePattern)[2];
        console.log("found weather intent with zip code of " + zipcode);
        // docs: https://developer.yahoo.com/weather/
        var select = 'select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="' + zipcode + '")';
        var url = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(select) + '&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'jsonp'
          })
          .done(function(data) {
            console.log(data);
            ChatBot.addChatEntry(data.query.results.channel.title, 'bot');
          });
      } else if (q.match(cityPattern)) {
        var city = q.match(cityPattern)[2];
        console.log("found weather intent with zip code of " + city);
        // do city lookup
        var content = "found weather intent with city of " + city;
        ChatBot.addChatEntry(content, 'bot');
      } else if (q.match(/.*(weather here|my weather).*$/i)) {
        // use html5 lat/lon
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            function showLocation(position) {
              var lat = position.coords.latitude;
              var lon = position.coords.longitude;
              ChatBot.addChatEntry("found weather intent with lat/lon of " + lat + " " + lon, 'bot');
              console.log("found weather intent with lat/lon of " + lat + " " + lon);
            },
            function errorHandler(err) {
              if (err.code == 1) {
                ChatBot.addChatEntry("Sorry, Access denied!", 'bot');
              } else if (err.code == 2) {
                alert("Error: Position is unavailable!");
                ChatBot.addChatEntry("Sorry, Position is unavailable!", 'bot');
              }
            }, {
              timeout: 30000
            });
        } else {
          ChatBot.addChatEntry("Sorry, browser does not support geolocation!", 'bot');
        }
      }
    },
    getCapabilities: function() {
      return [
        "Ask about the weather like 'What is my weather?'",
        "Ask about the weather like 'What is weather in San Francisco?'",
        "Ask about the weather in a certain zipcode, like 'What is the weather in 94065?'"
      ];
    },
    getSuggestUrl: function() {
      return null;
    }
  }
}
