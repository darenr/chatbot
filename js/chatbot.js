var ChatBot = function() {

    //// common vars
    // custom patterns and rewrites
    var patterns;

    // the bot's name
    var botName;

    // the human's name
    var humanName;

    // the html (text / image etc.) that is displayed when the bot is busy
    var thinkingHtml;

    // a selector to all inputs the human can type to
    var inputs;

    // whether to list the capabilities below the input field
    var inputCapabilityListing;

    // the example phrases that can be said (to be listed under the input field)
    var examplePhrases = [];

    // the engines to use for answering queries that are not caught by simple patterns
    var engines;

    // whether a sample conversation is running
    var sampleConversationRunning = false;

    // a callback for after a chat entry has been added
    var addChatEntryCallback;

    // list all the predefined commands and the commands of each engine
    function updateCommandDescription() {
        var description = '';

        // first explain manually defined commands and then all by all used engines
        var descriptions = [];

        var i, j;
        for (i = 0; i < patterns.length; i++) {
            if (patterns[i].description != undefined) {
                descriptions.push(patterns[i].description);
            }
        }
        for (i = 0; i < engines.length; i++) {
            var caps = engines[i].getCapabilities();
            for (j = 0; j < caps.length; j++) {
                descriptions.push(caps[j]);
            }
        }

        examplePhrases = [];
        for (i = 0; i < descriptions.length; i++) {
            var pdesc = descriptions[i].replace(/(['"][^'"]+['"])/gi, '<span class="phraseHighlight">$1</span>');
            pdesc = pdesc.replace(/(\[[^\[\]]+\])/gi, '<span class="placeholderHighlight">$1</span>');
            //console.log(pdesc);
            var matches = pdesc.match(/<span class=['"]phraseHighlight["']>['"](.+?)['"]<\/span>/gi);
            //console.log(matches);
            if (matches != null) {
                //console.log(matches);
                for (j = 0; j < matches.length; j++) {
                    var cleanMatch = matches[j].replace(/<\/?span[^>]*>/gi, '');
                    examplePhrases.push(cleanMatch.replace(/['"]/gi, ''));
                }
            }
            description += '<div class="commandDescription">' + pdesc + '</div>';
        }

        var datalist = $('#chatBotCommands');
        if (datalist.size() == 0) {
            datalist = $('<datalist id="chatBotCommands">');
            $('body').append(datalist);
        } else {
            datalist.html('');
        }

        for (i = 0; i < examplePhrases.length; i++) {
            datalist.append($('<option value="' + examplePhrases[i] + '"></option>'));
        }

        //console.log(examplePhrases);

        $('#chatBotCommandDescription').html(description);
    }

    // type writer
    function playConversation(state, pauseLength) {

        setTimeout(function() {
            var newValue = '';
            if ($(inputs).val() != '|') {
                newValue += $(inputs).val();
            }
            newValue += state.currentInput.slice(state.start, state.start + 1);
            $(inputs).val(newValue);
            state.start++;

            if (state.start < state.currentInput.length) {
                // keep typing
                playConversation(state, pauseLength);
            } else {

                // press enter and wait for some time and then write the next entry
                ChatBot.addChatEntry(state.currentInput, "human");
                ChatBot.react(state.currentInput);
                $(inputs).val(state.currentInput);

                setTimeout(function() {
                    state.conversationArrayIndex++;
                    state.conversationArrayIndex = state.conversationArrayIndex % state.conversationArray.length;

                    // did we cycle through the conversation array? if so, stop
                    if (state.conversationArrayIndex == 0) {
                        $('#chatBotConversationLoadingBar').remove();
                        sampleConversationRunning = false;
                        return;
                    }

                    state.start = 0;
                    $(inputs).val('|');
                    state.currentInput = state.conversationArray[state.conversationArrayIndex];
                    playConversation(state, pauseLength);
                }, pauseLength);

                var chclb = $('#chatBotConversationLoadingBar');
                if (chclb.size() == 0) {
                    chclb = $('<div id="chatBotConversationLoadingBar"></div>');
                    chclb.css('position', 'absolute');
                    $('body').append(chclb);
                }

                var left = $(inputs).offset().left;
                var top = $(inputs).offset().top + $(inputs).outerHeight() - 3;
                chclb.css('left', left + 'px');
                chclb.css('top', top + 'px');

                chclb.animate({
                    width: $(inputs).outerWidth() + 'px',
                }, pauseLength, function() {
                    chclb.css('width', '0');
                });

            }
        }, Math.random() * 120 + 10);
    }

    return {
        Engines: {

            //
            elizaEngine: function() {
                // Load Eliza engine
                var eliza = new ElizaBot;
                eliza.memSize = 1024;

                return {
                    name: function() {
                        return "elizaEngine";
                    },
                    react: function(query) {
                        var content = eliza.transform(query);
                        if(content) {
                          return "Eliza says..." + content;
                        }
                        return false;
                    },
                    getCapabilities: function() {
                        return [
                            "Let's talk about our feelings!",
                        ];
                    },
                    getSuggestUrl: function() {
                        return null;
                    }
                }
            },

            timeEngine: function() {

                return {
                    name: function() {
                        return "timeEngine";
                    },
                    react: function(query) {
                        if (query.indexOf('time') >= 0 || query.indexOf('date') >= 0) {
                            return '<b>' + new Date().toLocaleString(); + '</b>';
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
            },

            jokeEngine: function() {

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
                          return content;
                        }
                        return false;
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
            },

            ddgEngine: function() {

                // patterns that the engine can resolve
                var capabilities = [
                    "Ask what something is like 'What is DNA'?",
                    "Ask where something is like 'Where is China'?",
                    "Ask about a person like 'Who is Larry Ellison'?",
                    "Say a movie/person/location name like 'Titanic' to get information about that entity",
                    "Say something like 'simpsons characters' to get information about that phrase",
                ];

                return {
                    name: function() {
                        return "ddgEngine";
                    },
                    react: function(query) {
                        console.log("asking ddg instant answers...");
                        $.ajax({
                            type: 'GET',
                            url: 'http://api.duckduckgo.com/?format=json&pretty=1&q=' + encodeURIComponent(query),
                            dataType: 'jsonp'
                        }).done(function(data) {

                            console.log("ddg has an answer... " + data.AbstractText);

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
                        return capabilities;
                    },
                    getSuggestUrl: function() {
                        return null;
                    }
                }
            }
        },

        init: function(options) {
            var settings = jQuery.extend({
                // these are the defaults.
                botName: 'Bot',
                humanName: 'You',
                thinkingHtml: '<img src="data:image/gif;base64,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"/>',
                inputs: '',
                inputCapabilityListing: true,
                engines: [],
                patterns: [],
                addChatEntryCallback: function(entryDiv, text, origin) {
                    entryDiv.addClass('appear');
                }
            }, options);

            botName = settings.botName;
            humanName = settings.humanName;
            thinkingHtml = settings.thinkingHtml;
            inputs = settings.inputs;
            inputCapabilityListing = settings.inputCapabilityListing;
            engines = settings.engines;
            patterns = settings.patterns;
            addChatEntryCallback = settings.addChatEntryCallback;

            // update the command description
            updateCommandDescription();

            // input capability listing?
            if (inputCapabilityListing) {
                $(inputs).attr("list", "chatBotCommands");
            }

            // listen to inputs on the defined fields
            $(inputs).keyup(function(e) {
                if (e.keyCode == 13) {
                    ChatBot.addChatEntry($(this).val(), "human");
                    ChatBot.react($(this).val());
                }
            });

        },
        setBotName: function(name) {
            botName = name;
        },
        setHumanName: function(name) {
            humanName = name;
            $('.chatBotChatEntry.human .origin').html(name);
        },
        addChatEntry: function addChatEntry(text, origin) {
            if (text == undefined) {
                return;
            }
            if (text == '') {
                text = 'Sorry, I have no idea.';
            }
            var entryDiv = $('<div class="chatBotChatEntry ' + origin + '"></div>');
            entryDiv.html('<span class="origin">' + (origin == 'bot' ? botName : humanName) + '</span>' + text);
            $('#chatBotHistory').prepend(entryDiv);
            if (addChatEntryCallback != undefined) {
                addChatEntryCallback.call(this, entryDiv, text, origin);
            }
        },
        thinking: function(on) {
            var ti = $('#chatBotThinkingIndicator');
            if (on) {
                if (!sampleConversationRunning) {
                    $(inputs).attr('disabled', 'disabled');
                }
                ti.html(thinkingHtml);
            } else {
                if (!sampleConversationRunning) {
                    $(inputs).removeAttr('disabled');
                    $(inputs).val('');
                    $(inputs).focus();
                }
                ti.html('');
            }
        },
        react: function react(text) {
            this.thinking(true);

            // check for custom patterns
            for (var i = 0; i < patterns.length; i++) {
                var pattern = patterns[i];
                var r = new RegExp(pattern.regexp, "i");
                var matches = text.match(r);
                //console.log(matches);
                if (matches) {
                    switch (pattern.actionKey) {
                        case 'rewrite':
                            text = pattern.actionValue;
                            for (var j = 1; j < matches.length; j++) {
                                text = text.replace("$" + j, matches[j]);
                            }
                            //console.log("rewritten to " + text);
                            if (pattern.callback != undefined) {
                                pattern.callback.call(this, matches);
                            }
                            break;
                        case 'response':
                            var response = pattern.actionValue;
                            if (response != undefined) {
                                for (var j = 1; j < matches.length; j++) {
                                    response = response.replace("$" + j, matches[j]);
                                }
                                this.addChatEntry(response, "bot");
                            }
                            ChatBot.thinking(false);
                            if (pattern.callback != undefined) {
                                pattern.callback.call(this, matches);
                            }
                            return;
                    }
                    break;
                }
            }

            for (var e = 0; e < engines.length; e++) {
                var engine = engines[e];
                var reaction = engine.react(text);
                console.log('trying ' + engine.name() + " ************ " + reaction);
                if (reaction != null && reaction != false && reaction != undefined) {
                    ChatBot.addChatEntry(reaction, 'bot');
                    break; // exit after first response
                }

            }
            ChatBot.thinking(false);

        },
        playConversation: function(conversation, pauseLength) {

            if (pauseLength == undefined) {
                pauseLength = 3000;
            }

            if (sampleConversationRunning) {
                return false;
            }

            $(inputs).val('');

            sampleConversationRunning = true;

            var state = {
                start: 0,
                conversationArrayIndex: 0,
                conversationArray: conversation,
                currentInput: conversation[0]
            };

            playConversation(state, pauseLength);

            return true;
        },
        addPatternObject: function(obj) {
            patterns.push(obj);
            updateCommandDescription();
        },
        addPattern: function(regexp, actionKey, actionValue, callback, description) {
            var obj = {
                regexp: regexp,
                actionKey: actionKey,
                actionValue: actionValue,
                description: description,
                callback: callback
            };
            this.addPatternObject(obj);
        }

    }
}();
