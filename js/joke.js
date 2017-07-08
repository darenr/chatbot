function jokeEngine() {

  return {
    name: function() {
      return "jokeEngine";
    },
    react: function(query) {
      if (query.indexOf('joke') >= 0) {
        var content = "I'd love to, but...";
        jokeResponses = [
          "I have to floss my cat.",
          "I've dedicated my life to linguine.",
          "I want to spend more time with my blender.",
          "The President said he might drop in.",
          "The man on television told me to say tuned.",
          "I've been scheduled for a karma transplant.",
          "I'm staying home to work on my cottage cheese sculpture.",
          "It's my parakeet's bowling night.",
          "It wouldn't be fair to the other Beautiful People.",
          "I'm building a pig from a kit.",
          "I did my own thing and now I've got to undo it.",
          "I'm enrolled in aerobic scream therapy.",
          "There's a disturbance in the Force.",
          "I'm doing door-to-door collecting for static cling.",
          "I have to go to the post office to see if I'm still wanted.",
          "I'm teaching my ferret to yodel.",
          "I have to check the freshness dates on my dairy products.",
          "I'm going through cherry cheesecake withdrawal.",
          "I'm planning to go downtown to try on gloves.",
          "My crayons all melted together.",
          "I'm trying to see how long I can go without saying yes.",
          "I'm in training to be a household pest.",
          "I'm getting my overalls overhauled.",
          "My patent is pending.",
          "I'm attending the opening of my garage door.",
          "I'm sandblasting my oven.",
          "I'm worried about my vertical hold.",
          "I'm going down to the bakery to watch the buns rise.",
          "I'm being deported.",
          "The grunion are running.",
          "I'll be looking for a parking space.",
          "My Millard Fillmore Fan Club meets then.",
          "The monsters haven't turned blue yet, and I have to eat more dots.",
          "I'm taking punk totem pole carving.",
          "I have to fluff my shower cap.",
          "I'm converting my calendar watch from Julian to Gregorian.",
          "I've come down with a really horrible case of something or other.",
          "I made an appointment with a cuticle specialist.",
          "My plot to take over the world is thickening.",
          "I have to fulfill my potential.",
          "I don't want to leave my comfort zone.",
          "It's too close to the turn of the century.",
          "I have some real hard words to look up in the dictionary.",
          "My subconscious says no.",
          "I'm giving nuisance lessons at a convenience store.",
          "I left my body in my other clothes.",
          "The last time I went, I never came back.",
          "I've got a Friends of Rutabaga meeting.",
          "None of my socks match.",
          "I have to be on the next train to Bermuda.",
          "I'm having all my plants neutered.",
          "People are blaming me for the Spanish-American War.",
          "I changed the lock on my door and now I can't get out.",
          "Refrigerator.",
          "I'm attending a perfume convention as guest sniffer.",
          "My yucca plant is feeling yucky.",
          "I'm touring China with a wok band.",
          "My chocolate-appreciation class meets that night.",
          'I never go out on days that end in "Y"',
          "My mother would never let me hear the end of it.",
          "I'm running off to Yugoslavia with a foreign-exchange student named",
          "Basil Metabolism.",
          "it down.",
          "I'm too old/young for that stuff.",
          "I have to wash/condition/perm/curl/tease/torment my hair.",
          "I have too much guilt.",
          "There are important world issues that need worrying about.",
          "I'm uncomfortable when I'm alone or with others.",
          "I promised to help a friend fold road maps.",
          "I feel a song coming on.",
          "I'm trying to be less popular.",
          "My bathroom tiles need grouting.",
          "I have to bleach my hare.",
          "I'm waiting to see if I'm already a winner.",
          "I'm writing a love letter to Richard Simmons.",
          "You know how we psychos are.",
          "My favorite commercial is on TV.",
          "I have to study for a blood test.",
          "I'm going to be old someday.",
          "I've been traded to Cincinnati.",
          "I'm observing National Apathy Week.",
          "I have to rotate my crops.",
          "My uncle escaped again.",
          "I'm up to my elbows in waxy buildup.",
          "I have to knit some dust bunnies for a charity bazaar.",
          "I'm having my baby shoes bronzed.",
          "I have to go to court for kitty littering.",
          "I'm going to count the bristles in my toothbrush.",
          "I have to thaw some karate chops for dinner.",
          "Having fun gives me prickly heat.",
          "I'm going to the Missing Persons Bureau to see if anyone is looking",
          "for me.",
          "I have to jog my memory.",
          "My palm reader advised against it.",
          "My Dress For Obscurity class meets then.",
          "I have to stay home and see if I snore.",
          "I prefer to remain an enigma.",
          "I think you want the OTHER  [your name].",
          "I have to sit up with a sick ant.",
          "I'm trying to cut down."
        ];
        var rand = jokeResponses[Math.floor(Math.random() * jokeResponses.length)];
        content += "<p>&nbsp;&nbsp;&nbsp;" + rand + "</p>";
        ChatBot.addChatEntry(content, 'bot');
      }
    },
    getCapabilities: function() {
      return [
        "Tell me a joke!"
      ];
    },
    getSuggestUrl: function() {
      return null;
    }
  }
}
