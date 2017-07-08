function timeEngine() {
  return {
    name: function() {
      return "timeEngine";
    },
    react: function(query) {
      if (query.indexOf('time') >= 0 || query.indexOf('date') >= 0) {
        return '<b>' + new Date()
          .toLocaleString(); + '</b>';
      }
      return false;
    },
    getCapabilities: function() {
      return [
        "Ask me about the time like 'what time is it?'",
        "Ask me about the date like 'what's today date?'"
      ];
    },
    getSuggestUrl: function() {
      return null;
    }
  }
}
