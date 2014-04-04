angular.module('futurism')
	.directive('poisonAnim', function($, animFns, sound) {
		'use strict';


		return {
			restrict: 'A',
			link: function(scope, boardElem) {


				// poison effect
				scope.$on('post:poison', function(srcScope, update) {

					var waitTime = 0;

					var animTargets = animFns.updatedAnimTargets(update);

					_.each(animTargets, function(animTarget) {
						_.delay(function() {

							sound.play('hit');

							// skull
							animFns.animFlasher(boardElem, animTarget.center, 'poison');

							// -1 health floaty
							animFns.animNotif(boardElem, animTarget.center, '-1 health', 'danger');

						}, waitTime);
						waitTime += 100;
					});

				});
			}
		}
	});