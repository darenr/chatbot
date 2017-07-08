function weatherEngine() {

  return {
    name: function() {
      return "weatherEngine";
    },
    react: function(query) {

      var q = query.replace('?', '')
      var pat = /weather\s+(in\s+)?(.*$)/i;
      if (q.match(pat)) {
        var place = q.match(pat)[2];
        console.log("found weather intent place of " + place);
        fetchWeather(ChatBot, place)
      } else if (q.match(/.*(weather here|my weather).*$/i)) {
        // use html5 lat/lon
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            function showLocation(position) {
              var lat = position.coords.latitude;
              var lon = position.coords.longitude;
              console.log("found weather intent with lat/lon of " + lat + " " + lon);
              fetchWeather(ChatBot, '(' + lat + ',' + lon + ')');
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

function fetchWeather(ChatBot, place) {
  // docs: https://developer.yahoo.com/weather/
  var select = 'select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="' + place + '")';
  var url = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(select) + '&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
  console.log("fetching weather...");
  $.ajax({
      type: 'GET',
      url: url,
      dataType: 'jsonp'
    })
    .done(function(data) {
      var content = "Weather for " +
        data.query.results.channel.location.city + ", " +
        data.query.results.channel.location.region + " is " +
        data.query.results.channel.item.condition.text + " and " +
        data.query.results.channel.item.condition.temp + " F (wind speed of " +
        data.query.results.channel.wind.speed + " mph) and a forecast of " +
        data.query.results.channel.item.forecast[0].text + " having a high of " +
        data.query.results.channel.item.forecast[0].high + " and a low of " +
        data.query.results.channel.item.forecast[0].low + " today and " +
        data.query.results.channel.item.forecast[1].text + " tomorrow with a high of " +
        data.query.results.channel.item.forecast[1].high + " and a low of " +
        data.query.results.channel.item.forecast[1].low;

      ChatBot.addChatEntry(content, 'bot');
    });

}
