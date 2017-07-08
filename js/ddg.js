function ddgEngine() {
  return {
    name: function() {
      return "ddgEngine";
    },
    react: function(query) {
      $.ajax({
          type: 'GET',
          url: 'http://api.duckduckgo.com/?format=json&pretty=1&q=' + encodeURIComponent(query),
          dataType: 'jsonp'
        })
        .done(function(data) {

          var content = data.AbstractText;

          // no direct answer? tell about related topics then
          if (content == '' && data.RelatedTopics.length > 0) {
            var ob = data.RelatedTopics[0];

            var media = [];
            if (ob.Result !== undefined) {
              if (ob.Icon.URL != '' && ob.Icon.URL.indexOf(".ico") < 0) {
                media.push(ob.Icon.URL);
              }

              content += '<p>' + ob.Result.replace("</a>", "</a> ") + '</p>';

              if (media.length > 0) {
                var m = media[0];
                content += '<img src="' + media[0] + '" style="margin-right:5px"/>';
              }

            }
            ChatBot.addChatEntry(content, 'bot');
          } else {
            if (data.Image != undefined && data.Image != '') {

              content += '<br>';
              content += '<div class="imgBox">' +
                '<img src="' + data.Image + '" />' +
                '<div class="title">' + data.Heading + '</div>' +
                '</div>';
              ChatBot.addChatEntry(content, 'bot');

            }
          }

          return false;

        });
    },
    getCapabilities: function() {
      return [
        "Ask what something is like 'What is DNA'?",
        "Ask where something is like 'Where is China'?",
        "Ask about a person like 'Who is Larry Ellison'?",
        "Say a movie/person/location name like 'Titanic' to get information about that entity",
        "Say something like 'simpsons characters' to get information about that phrase",
      ];
    },
    getSuggestUrl: function() {
      return null;
    }
  }
}
