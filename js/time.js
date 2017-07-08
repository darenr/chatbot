function timeEngine() {
  return {
    name: function() {
      return "timeEngine";
    },
    react: function(query) {
      if (query.match(/time|^now$/i)) {
        var d = new Date()
          .toLocaleString()
          .slice(10);
        ChatBot.addChatEntry('The current time is: <b>' + d + '</b>', 'bot');
      } else if (query.match(/date|^today$/i)) {
        var d = new Date()
          .toLocaleString()
          .slice(0, 8);
        ChatBot.addChatEntry('The current date is: <b>' + d + '</b>', 'bot');
      }
    },
    getCapabilities: function() {
      return [
        "Ask me about the time like 'what is the current time?'",
        "Ask me about the date like 'what is the date today?'"
      ];
    },
    getSuggestUrl: function() {
      return null;
    }
  }
}
