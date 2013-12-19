describe('actionFns', function() {

	var actionFns = require('../../../multi/game/actionFns');
	var Board = require('../../../multi/game/board');
	var board, player1, player2;


	beforeEach(function() {
		player1 = {
			_id: 1,
			name: 'Philly',
			team: 1
		};
		player2 = {
			_id: 2,
			name: 'Sue Grafton',
			team: 2
		};

		var columns = 2;
		var rows = 2;
		board = new Board([player1, player2], columns, rows);
	});


	it('should perform a valid action', function() {
		board.target(1,0,0).card = {
			abilities: ['heal'],
			health: 3
		};
		var result = actionFns.doAction(board, player1, 'heal', [{playerId:1, row:0, column:0}]);
		expect(result).toBe('success');
		expect(board.target(1,0,0).card.health).toBe(4);
	});


	it('should not perform an action on an invalid target', function() {
		var result = actionFns.doAction(board, player1, 'heal', [{playerId:1, row:0, column:0}]);
		expect(result).not.toBe('success');
	});


	it('should not let you use a card you do not own', function() {
		board.target(2,0,0).card = {
			abilities: ['heal'],
			health: 3
		};
		var result = actionFns.doAction(board, player1, 'heal', [{playerId:2, row:0, column:0}]);
		expect(result).toContain('not your card');
	});


	it('should not let you use an ability the card does not have', function() {
		board.target(2,0,0).card = {
			abilities: ['sduc', 'mooo']
		};
		var result = actionFns.doAction(board, player1, 'attk', [{playerId:2, row:0, column:0}, {playerId:1, row:0, column:0}]);
		expect(result).toBe('card does not have this ability');
	});


	it('should perform multi-step validations', function() {
		board.target(1,0,0).card = {
			abilities: ['male']
		};
		board.target(1,0,1).card = {
			abilities: ['feml']
		};
		var result = actionFns.doAction(board, player1, 'male', [
			{playerId:1, column:0, row:0}, //male
			{playerId:1, column:0, row:1}, //female
			{playerId:1, column:1, row:0} //empty slot for child
		]);
		expect(result).toBe('success');
		expect(board.target(1,1,0).card.name).toBe('WAR BABY');
	});


	it('should fail bad multi-step validations', function() {
		board.target(1,0,0).card = {
			abilities: ['male']
		};
		board.target(1,0,1).card = {
			abilities: ['feml']
		};
		var result = actionFns.doAction(board, player1, 'feml', [
			{playerId:1, column:0, row:1}, //male
			{playerId:1, column:0, row:0}, //female
			{playerId:2, column:1, row:0} //enemy territory, should fail here
		]);
		expect(result).toBe('target is not allowed');
	});

});