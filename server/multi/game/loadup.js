(function() {
	'use strict';

	var _ = require('lodash');
	var DeckGoose = require('../../models/deck');
	var deckFns = require('../../../shared/deckFns');
	var cardFns = require('../../../shared/cardFns');
	var nextCid = require('./nextCid');


	/**
	 * @class Preload player's decks and futures before a game starts
	 *
	 * @param {array.<Player>} players
	 * @param {object} rules
	 * @param {function} callback
	 */
	var Loadup = function(players, rules, callback) {
		var self = this;


		/**
		 * Load a deck from mongo, then add those cards to the player
		 * @param {Player} player
		 * @param {string} deckId
		 * @param {function} callback
		 * @returns {null}
		 */
		self.selectDeck = function(player, deckId, callback) {
			DeckGoose
				.findById(deckId)
				.populate('cards')
				.exec(function(err, deck) {
					if(err) {
						return callback(err);
					}
					if(!deck) {
						return callback('deck id "'+deckId+'" not found');
					}

					if(deck.cards.length > rules.deckSize) {
						return callback('this deck has too many cards');
					}
					if(player.cards.length > 0) {
						return callback('a deck was already loaded for you');
					}
					if(String(player._id) !== String(deck.userId)) {
						return callback('you do not own this deck');
					}

					player.deck = deck;
					player.deckSize = deck.cards.length;
					player.cards = [];
					_.each(deck.cards, function(card) {
						var publicCard = _.pick(card, 'faction', 'attack', 'health', 'abilities', 'hasImage', 'name', 'story', 'userId', '_id');
						publicCard.cid = nextCid();
						publicCard.moves = 0;
						publicCard.pride = cardFns.calcPride(publicCard);
						player.cards.push(publicCard);
					});

					self.nextIfDone();
					return callback(null, deck);
				});
		};


		/**
		 * Call next if every account has loaded a deck
		 */
		self.nextIfDone = function() {
			var allLoaded = true;
			_.each(players, function(player) {
				if(!player.cards.length > 0) {
					allLoaded = false;
				}
			});
			if(allLoaded) {
				self.next();
			}
		};


		/**
		 * Callback with every player
		 * @returns {*}
		 */
		self.next = function() {
			clearTimeout(forceStartTimeout);
			return callback(null, players);
		};


		/**
		 * Give people 30 seconds (default) to pick a deck before leaving them behind
		 */
		var forceStartTimeout = setTimeout(self.next, rules.prepTime*1000);
	};

	module.exports = Loadup;

}());