angular.module('futurism')
	.directive('rechargeAnim', function($, maths, animFns) {
		'use strict';


		return {
			restrict: 'A',
			link: function(scope, boardElem) {


				scope.$on('post:rech', function(srcScope, update) {

					var animTargets = animFns.chainedAnimTargets(update, update.data.targetChain);
					var src = animTargets[0];
					var target = animTargets[1];

					animFns.makeGrabber(boardElem, src.center, target.center, 'recharge');

					// battery fill animation
					var flasher = animFns.animFlasher(boardElem, target.center, 'recharge');
					flasher.addClass('recharge-empty');

					_.delay(function() {
						flasher.removeClass('recharge-empty');
						flasher.addClass('recharge-half');
					}, 660);

					_.delay(function() {
						flasher.removeClass('recharge-half');
						flasher.addClass('recharge-full');
					}, 1200);
				});
			}
		};
	});