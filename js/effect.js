/* =========================================================
   effect.js  -  Birthday celebration sequence & interactions
   Personalized for CRM AALI - 31 October 2026
   ========================================================= */

// ---------- CONFIGURATION (Easy to customize) ----------
var CONFIG = {
	name: "CRM AALI",
	dateToShow: "31 October 2026",
	dateMetLine: "date to yaad nhi (days since we met)",
	madeForYouLine: "Made for you from past week",
	// Optional privacy gate: Set enabled to false to skip the question
	privacyGate: {
		enabled: true,
		question: "Who is the prettiest girl in the world?",
		answer: "CRM AALI", // case-insensitive, spaces trimmed
		hint: "Hint: Her name starts with CRM... ✨"
	},
	// 16 notes revealed when popping the 16 balloons (H-A-P-P-Y  B-I-R-T-H-D-A-Y  C-R-M)
	balloonNotes: [
		"H: You make every single day brighter ☀️",
		"A: Always keep that radiant smile on your face 🌸",
		"P: Pure magic is what you bring into my life ✨",
		"P: Precious moments with you are my absolute favorite 💖",
		"Y: You are truly one in a billion 🌟",
		"B: Beautiful soul inside and out 🌷",
		"I: I love the genuine way your eyes sparkle 💫",
		"R: Radiating warmth, kindness, and joy 🕊️",
		"T: Thank you for being such a wonderful person 💌",
		"H: Having you around makes everything better 🌼",
		"D: Deserving of every piece of happiness today and always 🎂",
		"A: All your biggest dreams are going to come true 🌌",
		"Y: Your laughter is the sweetest melody 🥰",
		"C: Cheers to another incredible year ahead 🥂",
		"R: Remember how special you are to me ❤️",
		"M: May this year be your happiest and most blessed yet ✨"
	],
	voiceNotePath: "assets/media/voice-note.mp3",
	playlistUrl: "https://open.spotify.com"
};

// Global references & state
var vw, W, H, narrow;
var N = 16;
var placed = false;
var rows = [[0,1,2,3,4],[5,6,7,8,9,10,11,12],[13,14,15]];
var wordStarts = [5, 13]; // HAPPY (0-4) | BIRTHDAY (5-12) | CRM (13-15)
var s = 100;
var rowTop = 180, rowStep = 110;
var root = document.documentElement.style;
var micStream = null;
var audioCtx = null;
var skipTriggered = false;
var msgTimeout = null;
var btnTimer = null;
var poppedCount = 0;

// ---------- Reliable Button Sequencer ----------
function advanceToButton(nextBtnId, delayMs) {
	clearTimeout(btnTimer);
	btnTimer = setTimeout(function(){
		$('.navbar-fixed-bottom button').not(nextBtnId).hide();
		$(nextBtnId).fadeIn(350);
	}, delayMs || 1500);
}

// ---------- Synthetic Web Audio Pop Sound ----------
function playPopSound() {
	try {
		var AudioContext = window.AudioContext || window.webkitAudioContext;
		if (!AudioContext) return;
		if (!audioCtx) audioCtx = new AudioContext();
		if (audioCtx.state === 'suspended') audioCtx.resume();
		
		var osc = audioCtx.createOscillator();
		var gain = audioCtx.createGain();
		osc.type = 'sine';
		osc.frequency.setValueAtTime(520, audioCtx.currentTime);
		osc.frequency.exponentialRampToValueAtTime(70, audioCtx.currentTime + 0.09);
		gain.setValueAtTime(0.7, audioCtx.currentTime);
		gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.09);
		osc.connect(gain);
		gain.connect(audioCtx.destination);
		osc.start();
		osc.stop(audioCtx.currentTime + 0.09);
	} catch(e) {}
}

// ---------- Layout calculation ----------
function layout(){
	W = $(window).width();
	H = $(window).height();
	vw = W / 2;
	narrow = W < 1000;
	if (!narrow){
		// Desktop: 2 balanced rows -> HAPPY (5) / BIRTHDAY CRM (11)
		// Or 3 rows: HAPPY (5) / BIRTHDAY (8) / CRM (3)
		rows = [[0,1,2,3,4], [5,6,7,8,9,10,11,12], [13,14,15]];
		s = Math.max(46, Math.min(76, Math.floor(W * 0.55 / 8.5)));
		rowTop = 150;
		rowStep = Math.round(s * 1.35);
		var totalBalloonHeight = (rows.length - 1) * rowStep + Math.round(s * 1.83);
		var greetingTop = rowTop + totalBalloonHeight + 14;
		var cakeTop = greetingTop + 76;
		var cakeBottom = cakeTop + 300;
		root.setProperty('--pw', Math.max(140, Math.min(260, W * 0.15)) + 'px');
		root.setProperty('--greeting-top', Math.round(greetingTop) + 'px');
		root.setProperty('--cake-top', Math.round(cakeTop) + 'px');
		root.setProperty('--cs', 1);
		root.setProperty('--msg-top', Math.round(Math.min(cakeBottom + 60, H - 90)) + 'px');
	} else {
		// Mobile / tablet: 3 rows -> HAPPY (5) / BIRTHDAY (8) / CRM (3)
		rows = [[0,1,2,3,4], [5,6,7,8,9,10,11,12], [13,14,15]];
		s = Math.max(28, Math.min(52, Math.floor((W - 16) / 8.2)));
		var inner = W < 768 ? W - 30 : 720;
		var bannerH = Math.min(inner, 470) * 147 / 470;
		var pw = Math.min(130, Math.floor((W - 24) / 4));
		var cs = Math.min(0.85, Math.max(0.55, W / 520));
		var greetingTop, albumTop, cakeTop, cakeBottom;
		
		for (var tries = 0; tries < 15; tries++){
			rowTop = 50 + bannerH + 6;
			rowStep = Math.round(s * 1.38);
			var totalBalloonH = (rows.length - 1) * rowStep + Math.round(s * 1.83);
			greetingTop = rowTop + totalBalloonH + 6;
			var greetingH = 74;
			albumTop = greetingTop + greetingH + 6;
			cakeTop = albumTop + Math.round(pw * 0.75) + 20 - Math.round(95 * cs);
			cakeBottom = cakeTop + 300 * cs;
			if (cakeBottom + 65 <= H || (s <= 26 && cs <= 0.45)) break;
			s  = Math.max(25, s - 2);
			cs = Math.max(0.42, cs - 0.03);
		}
		root.setProperty('--pw', pw + 'px');
		root.setProperty('--greeting-top', Math.round(greetingTop) + 'px');
		root.setProperty('--album-top', Math.round(albumTop) + 'px');
		root.setProperty('--cs', cs);
		root.setProperty('--cake-top', Math.round(cakeTop) + 'px');
		root.setProperty('--msg-top', Math.round(Math.min(cakeBottom + 50, H - 90)) + 'px');
	}
	root.setProperty('--s', s + 'px');
}

// Balloon target slot
function slot(i){
	var step = s * 0.92, gap = s * 0.5;
	for (var r = 0; r < rows.length; r++){
		var idx = rows[r].indexOf(i);
		if (idx < 0) continue;
		var first = rows[r][0], last = rows[r][rows[r].length - 1];
		var inWord = function(w){ return w > first && w <= last; };
		var total = (rows[r].length - 1) * step + wordStarts.filter(inWord).length * gap + s;
		var extra = wordStarts.filter(function(w){ return w > first && w <= i; }).length * gap;
		return { left: vw - total / 2 + idx * step + extra, top: rowTop + r * rowStep };
	}
}

function placeBalloons(instant){
	for (var i = 0; i < N; i++){
		var p = slot(i);
		var $b = $('#b' + (i + 1)).stop(true).removeClass('balloons-rotate-behaviour-one balloons-rotate-behaviour-two');
		if (instant){
			$b.css({ top: p.top, left: p.left }).addClass('settled');
		} else {
			$b.delay(i * 130).animate({ top: p.top, left: p.left }, 800, 'swing', (function($b){
				return function(){ $b.addClass('settled'); };
			})($b));
		}
	}
	if (!instant){
		setTimeout(function(){
			burstConfetti();
			$('#balloon-greeting').fadeIn(1000);
			$('.balloons').addClass('pop-ready');
		}, N * 130 + 700);
	} else {
		$('#balloon-greeting').show();
		$('.balloons').addClass('pop-ready');
	}
}

// ---------- Confetti Effects ----------
function burstConfetti(){
	if (typeof confetti !== 'function') return;
	var colors = ['#ff7aa8','#ffd166','#8b6cf0','#4cc9f0','#ffffff','#ff9f68'];
	confetti({ particleCount: 90, spread: 80, origin:{ x: 0.15, y: 0.7 }, angle: 60, colors: colors });
	confetti({ particleCount: 90, spread: 80, origin:{ x: 0.85, y: 0.7 }, angle: 120, colors: colors });
	setTimeout(function(){
		confetti({ particleCount: 120, spread: 110, startVelocity: 38, origin:{ x: 0.5, y: 0.45 }, colors: colors });
	}, 350);
}

function fireworksConfetti(){
	if (typeof confetti !== 'function') return;
	var end = Date.now() + 2500;
	var colors = ['#ff7aa8','#ffd166','#8b6cf0','#4cc9f0','#ffffff','#ff5f96'];
	var iv = setInterval(function(){
		if (Date.now() > end) return clearInterval(iv);
		confetti({ particleCount: 35, spread: 75, origin:{ x: 0.2 + Math.random() * 0.6, y: 0.65 }, colors: colors });
	}, 220);
}

function finaleConfetti(){
	if (typeof confetti !== 'function') return;
	var end = Date.now() + 5000;
	var heart = confetti.shapeFromText ? confetti.shapeFromText({ text: '❤️', scalar: 2 }) : 'circle';
	var colors = ['#ff7aa8','#ff5f96','#ffd166','#8b6cf0','#ffffff'];
	(function frame(){
		confetti({ particleCount: 3, angle: 60, spread: 60, origin:{ x: 0, y: 0.8 }, colors: colors });
		confetti({ particleCount: 3, angle: 120, spread: 60, origin:{ x: 1, y: 0.8 }, colors: colors });
		confetti({ particleCount: 2, spread: 160, startVelocity: 12, gravity: 0.6, ticks: 260,
			origin:{ x: Math.random(), y: -0.05 }, shapes:[heart], scalar: 2, flat: true });
		if (Date.now() < end) requestAnimationFrame(frame);
	})();
}

// ---------- Floating Sparkles ----------
var sparklesOn = false;
function startSparkles(){
	if (sparklesOn) return;
	sparklesOn = true;
	var glyphs = ['✨','❤️','⭐','💖','✨','🌟'];
	var count = narrow ? 14 : 26, c = document.getElementById('sparkles');
	if (!c) return;
	for (var k = 0; k < count; k++){
		var el = document.createElement('span');
		el.className = 'sp';
		el.textContent = glyphs[k % glyphs.length];
		el.style.left = (Math.random() * 100) + '%';
		el.style.fontSize = (12 + Math.random() * 16) + 'px';
		el.style.animationDuration = (9 + Math.random() * 10) + 's';
		el.style.animationDelay = (-Math.random() * 14) + 's';
		el.style.setProperty('--dx', (Math.random() * 60 - 30) + 'px');
		c.appendChild(el);
	}
}

// ---------- Audio Smooth Fade-in & Loop ----------
function fadeInAudio(audio, targetVolume, durationMs) {
	audio.volume = 0;
	audio.loop = true;
	var playPromise = audio.play();
	if (playPromise !== undefined) {
		playPromise.then(function(){
			var stepTime = 50;
			var stepVol = targetVolume / (durationMs / stepTime);
			var currentVol = 0;
			var fader = setInterval(function(){
				currentVol = Math.min(targetVolume, currentVol + stepVol);
				audio.volume = currentVol;
				if (currentVol >= targetVolume) clearInterval(fader);
			}, stepTime);
		}).catch(function(err){
			console.log('Audio autoplay prevented:', err);
		});
	}
}

// ---------- Microphone Blow Detection ----------
function startMicBlowDetection(onBlowDetected) {
	if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
	navigator.mediaDevices.getUserMedia({ audio: true, video: false })
		.then(function(stream){
			micStream = stream;
			var AudioContext = window.AudioContext || window.webkitAudioContext;
			var ctx = new AudioContext();
			var analyser = ctx.createAnalyser();
			var source = ctx.createMediaStreamSource(stream);
			source.connect(analyser);
			analyser.fftSize = 256;
			var dataArray = new Uint8Array(analyser.frequencyBinCount);
			var blowCount = 0;
			
			var iv = setInterval(function(){
				if (!micStream) { clearInterval(iv); return; }
				analyser.getByteFrequencyData(dataArray);
				var lowSum = 0;
				for (var i = 1; i <= 8; i++) { lowSum += dataArray[i]; }
				var avg = lowSum / 8;
				if (avg > 72) {
					blowCount++;
					if (blowCount >= 2) {
						clearInterval(iv);
						stopMic();
						onBlowDetected();
					}
				} else {
					blowCount = Math.max(0, blowCount - 1);
				}
			}, 100);
		})
		.catch(function(){
			// Mic denied or unavailable - tap fallback is already active
		});
}

function stopMic(){
	if (micStream){
		try {
			micStream.getTracks().forEach(function(t){ t.stop(); });
		} catch(e) {}
		micStream = null;
	}
}

// Extinguish Candle & Trigger Fireworks
function extinguishCandle(){
	stopMic();
	$('#blow-hint').fadeOut('fast');
	$('.fuego').fadeOut('fast');
	var $smoke = $('<div class="smoke-puff"></div>');
	$('#candle-stick').append($smoke);
	setTimeout(function(){ $smoke.remove(); }, 1600);
	fireworksConfetti();
	if (window.TJGuide) TJGuide.setPose('wish_message');
	advanceToButton('#wish_message', 1200);
}

// ---------- Window Load ----------
$(window).load(function(){
	$('.loading').fadeOut('fast');
	layout();
	
	if (CONFIG.privacyGate && CONFIG.privacyGate.enabled){
		$('#privacy-q').text(CONFIG.privacyGate.question);
		$('#privacy-box').show();
		$('#start-wrap').hide();
	} else {
		$('#privacy-box').hide();
		$('#start-wrap').show();
	}
});

// ---------- Document Ready ----------
$(document).ready(function(){
	layout();
	
	var rt;
	$(window).resize(function(){
		layout();
		clearTimeout(rt);
		rt = setTimeout(function(){ if (placed) { placeBalloons(true); } }, 80);
	});

	// Privacy Gate Submission
	function checkPrivacyAnswer(){
		var input = $('#privacy-input').val().trim().toLowerCase();
		var expected = CONFIG.privacyGate.answer.trim().toLowerCase();
		if (input === expected || input.replace(/\s+/g,'') === expected.replace(/\s+/g,'')){
			$('#privacy-hint').text('✨ Access Granted! ✨').css('color', '#1db954');
			burstConfetti();
			setTimeout(function(){
				$('#privacy-box').fadeOut('fast', function(){
					$('#start-wrap').fadeIn('fast');
				});
			}, 600);
		} else {
			$('#privacy-hint').text(CONFIG.privacyGate.hint || 'Incorrect! Try again ❤️').css('color', '#e0245e');
			$('#privacy-input').addClass('shake');
			setTimeout(function(){ $('#privacy-input').removeClass('shake'); }, 500);
		}
	}
	$('#privacy-btn').click(checkPrivacyAnswer);
	$('#privacy-input').keypress(function(e){
		if (e.which === 13) checkPrivacyAnswer();
	});

	// Tap to Begin (Dismiss Intro Screen)
	$('#start-btn').click(function(){
		try {
			var AudioContext = window.AudioContext || window.webkitAudioContext;
			if (!audioCtx && AudioContext) audioCtx = new AudioContext();
			if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
		} catch(e) {}
		
		$('#intro-screen').addClass('fade-out');
		setTimeout(function(){
			$('#intro-screen').hide();
			// Use the direct child .container of body (not the navbar's inner container)
			$('body > .container').fadeIn('slow');
			$('.navbar-fixed-bottom button').hide();
			$('#turn_on').fadeIn('slow');
			// Tom & Jerry: first pose — point at the lights button
			if (window.TJGuide) TJGuide.setPose('turn_on');
		}, 600);
	});

	// 1. Turn on Lights
	$('#turn_on').click(function(){
		clearTimeout(btnTimer);
		$(this).stop(true, true).hide();
		$('#bulb_yellow').addClass('bulb-glow-yellow');
		$('#bulb_red').addClass('bulb-glow-red');
		$('#bulb_blue').addClass('bulb-glow-blue');
		$('#bulb_green').addClass('bulb-glow-green');
		$('#bulb_pink').addClass('bulb-glow-pink');
		$('#bulb_orange').addClass('bulb-glow-orange');
		$('body').addClass('peach');
		if (window.TJGuide) TJGuide.setPose('play');
		advanceToButton('#play', 2000);
	});

	// 2. Play Music
	$('#play').click(function(){
		clearTimeout(btnTimer);
		$(this).stop(true, true).hide();
		var audio = $('.song')[0];
		if (audio) {
			fadeInAudio(audio, 0.9, 2500);
		}
		startSparkles();
		$('#bulb_yellow').addClass('bulb-glow-yellow-after');
		$('#bulb_red').addClass('bulb-glow-red-after');
		$('#bulb_blue').addClass('bulb-glow-blue-after');
		$('#bulb_green').addClass('bulb-glow-green-after');
		$('#bulb_pink').addClass('bulb-glow-pink-after');
		$('#bulb_orange').addClass('bulb-glow-orange-after');
		$('body').addClass('peach-after');
		if (window.TJGuide) TJGuide.setPose('bannar_coming');
		advanceToButton('#bannar_coming', 2500);
	});

	// 3. Banner & Polaroids
	$('#bannar_coming').click(function(){
		clearTimeout(btnTimer);
		$(this).stop(true, true).hide();
		$('.bannar').addClass('bannar-come');
		$('.polaroid').fadeIn('slow');
		$('.can-zoom').fadeIn('slow');
		if (window.TJGuide) TJGuide.setPose('balloons_flying');
		advanceToButton('#balloons_flying', 2500);
	});

	// Balloon floating loop
	function loopBalloon(i) {
		if (placed) return;
		var randleft = Math.max(0, W - s) * Math.random();
		var randtop = Math.max(0, H - s * 2.2) * Math.random();
		$('#b' + i).animate({ left: randleft, bottom: randtop }, 10000, function(){
			loopBalloon(i);
		});
	}

	// 4. Balloons Flying
	$('#balloons_flying').click(function(){
		clearTimeout(btnTimer);
		$(this).stop(true, true).hide();
		$('.balloon-border').animate({ top: -500 }, 8000);
		for (var i = 1; i <= N; i++){
			$('#b' + i).addClass(i % 2 ? 'balloons-rotate-behaviour-one' : 'balloons-rotate-behaviour-two');
			loopBalloon(i);
		}
		if (window.TJGuide) TJGuide.setPose('cake_fadein');
		advanceToButton('#cake_fadein', 2500);
	});

	// 5. Cake Fade In & Wish Prompt
	$('#cake_fadein').click(function(){
		clearTimeout(btnTimer);
		$(this).stop(true, true).hide();
		$('.cake').fadeIn('slow');
		if (window.TJGuide) TJGuide.setPose('wish_message');
		setTimeout(function(){
			$('#wish-modal').fadeIn('fast');
			$('#wish-input').focus();
		}, 700);
	});

	// Wish Submission
	function releaseWish(){
		var wishText = $('#wish-input').val().trim() || "A year full of magic & joy ✨";
		$('#wish-modal').fadeOut('fast');
		
		var $lantern = $('<div class="floating-lantern">⭐ ' + $('<div>').text(wishText).html() + '</div>');
		$lantern.css({ left: '50%', top: (H * 0.65) + 'px' });
		$('body').append($lantern);
		
		if (typeof confetti === 'function') {
			confetti({ particleCount: 30, spread: 60, origin:{ x: 0.5, y: 0.65 } });
		}
		
		setTimeout(function(){ $lantern.remove(); }, 4600);
		if (window.TJGuide) TJGuide.setPose('light_candle');
		advanceToButton('#light_candle', 1200);
	}
	$('#send-wish-btn').click(releaseWish);
	$('#wish-input').keypress(function(e){
		if (e.which === 13) releaseWish();
	});
	$('#skip-wish-btn').click(function(){
		$('#wish-modal').fadeOut('fast');
		if (window.TJGuide) TJGuide.setPose('light_candle');
		advanceToButton('#light_candle', 400);
	});

	// 6. Light Candle & Blow Detection
	$('#light_candle').click(function(){
		clearTimeout(btnTimer);
		$(this).stop(true, true).hide();
		$('.fuego').fadeIn('slow');
		$('#blow-hint').fadeIn('slow');
		if (window.TJGuide) TJGuide.setPose('light_candle');
		startMicBlowDetection(extinguishCandle);
	});

	// Tap to Blow Fallback
	$('#tap-blow-btn, #candle-stick, .fuego').click(function(){
		if ($('.fuego').is(':visible')){
			extinguishCandle();
		}
	});

	// 7. Wish Message (Spell Balloons)
	$('#wish_message').click(function(){
		clearTimeout(btnTimer);
		$(this).stop(true, true).hide();
		vw = $(window).width() / 2;
		placed = true;
		placeBalloons();
		$('.balloons').css('opacity', '1');
		$('.balloons h2').fadeIn(3000);
		if (window.TJGuide) TJGuide.setPose('story');
		advanceToButton('#story', 3000);
	});

	// 8. Balloon Pop Interaction
	$(document).on('click', '.balloons.pop-ready', function(){
		var $this = $(this);
		if ($this.hasClass('popped')) return;
		
		playPopSound();
		
		var offset = $this.offset();
		var bw = $this.width(), bh = $this.height();
		if (typeof confetti === 'function'){
			confetti({
				particleCount: 24,
				spread: 60,
				startVelocity: 18,
				origin: {
					x: (offset.left + bw / 2) / W,
					y: (offset.top + bh / 2) / H
				}
			});
		}
		
		$this.addClass('popped');
		poppedCount++;
		$('#reinflate-balloons').show();
		
		var id = parseInt($this.attr('id').replace('b',''), 10) - 1;
		var noteText = (CONFIG.balloonNotes && CONFIG.balloonNotes[id]) ? CONFIG.balloonNotes[id] : "CRM AALI is pure sunshine ✨";
		
		var $note = $('<div class="balloon-note">' + noteText + '</div>');
		var noteLeft = Math.max(10, Math.min(W - 230, offset.left - 20));
		var noteTop = Math.max(10, offset.top + bh * 0.4);
		$note.css({ left: noteLeft + 'px', top: noteTop + 'px' });
		$('#balloon-notes-container').append($note);
		
		$note.click(function(){ $(this).fadeOut(200, function(){ $(this).remove(); }); });
		setTimeout(function(){
			$note.fadeOut(400, function(){ $(this).remove(); });
		}, 7000);
	});

	// Reinflate Balloons
	$('#reinflate-balloons').click(function(){
		$('.balloons').removeClass('popped');
		$('#balloon-notes-container').empty();
		poppedCount = 0;
		$(this).fadeOut('fast');
	});

	// 9. Story Message Sequence & Skip
	function showFinalStep(){
		clearTimeout(msgTimeout);
		$('.message p').hide();
		var $last = $(".message p").last();
		$last.addClass('finale').fadeIn('slow');
		$('.cake').fadeIn('fast');
		$('#skip_message').fadeOut('fast');
		finaleConfetti();
		// Tom & Jerry finale: Jerry gives a flower 🌸
		if (window.TJGuide) TJGuide.setPose('finale');
		
		setTimeout(function(){
			$('#gift-wrapper').fadeIn('slow');
		}, 2600);
	}

	$('#skip_message').click(function(){
		skipTriggered = true;
		showFinalStep();
	});

	$('#story').click(function(){
		clearTimeout(btnTimer);
		$(this).stop(true, true).hide();
		// Hide Tom & Jerry during message reading (comes back at finale)
		if (window.TJGuide) TJGuide.hide();
		$('.cake').fadeOut('fast').promise().done(function(){
			$('.message').fadeIn('slow');
			$('#skip_message').fadeIn('slow');
		});

		var $messages = $(".message p");
		var totalMessages = $messages.length;

		function msgLoop(i) {
			if (skipTriggered) return;
			if (i < totalMessages - 1) {
				$messages.eq(i).fadeIn('slow').delay(1600).fadeOut('slow').promise().done(function(){
					if (!skipTriggered) {
						msgTimeout = setTimeout(function(){ msgLoop(i + 1); }, 200);
					}
				});
			} else {
				showFinalStep();
			}
		}

		msgLoop(0);
	});

	// 10. Gift Box Tap to Open
	$('#gift-box').click(function(){
		$(this).addClass('open');
		if (typeof confetti === 'function') {
			burstConfetti();
		}
		// Hide Tom & Jerry for the modal
		if (window.TJGuide) TJGuide.hide();
		setTimeout(function(){
			$('#gift-modal').fadeIn('fast');
			checkMediaFile();
		}, 600);
	});

	// Check if Voice Note file exists
	function checkMediaFile(){
		var $audio = $('#voice-note-audio');
		var audioEl = $audio[0];
		if (!audioEl) return;
		
		fetch(CONFIG.voiceNotePath, { method: 'HEAD' })
			.then(function(res){
				if (res.ok) {
					$('#media-player-container').show();
				} else {
					$('#media-player-container').hide();
				}
			})
			.catch(function(){
				$('#media-player-container').hide();
			});
	}

	// Voice Note Custom Player
	var vnAudio = document.getElementById('voice-note-audio');
	if (vnAudio){
		$('#vn-play-btn').click(function(){
			if (vnAudio.paused){
				vnAudio.play();
				$(this).text('❚❚');
			} else {
				vnAudio.pause();
				$(this).text('▶');
			}
		});
		vnAudio.addEventListener('timeupdate', function(){
			if (vnAudio.duration){
				var pct = (vnAudio.currentTime / vnAudio.duration) * 100;
				$('#vn-fill').css('width', pct + '%');
				var mins = Math.floor(vnAudio.currentTime / 60);
				var secs = Math.floor(vnAudio.currentTime % 60);
				if (secs < 10) secs = '0' + secs;
				$('#vn-time, #vn-duration').text(mins + ':' + secs);
			}
		});
		vnAudio.addEventListener('ended', function(){
			$('#vn-play-btn').text('▶');
			$('#vn-fill').css('width', '0%');
		});
		$('#vn-track').click(function(e){
			if (vnAudio.duration){
				var pos = (e.pageX - $(this).offset().left) / $(this).width();
				vnAudio.currentTime = pos * vnAudio.duration;
			}
		});
	}

	// 11. Replay Entire Celebration Cleanly
	$('#replay-btn').click(function(){
		$('#gift-modal').fadeOut('fast');
		$('#gift-wrapper').hide();
		$('#gift-box').removeClass('open');
		$('#balloon-notes-container').empty();
		$('#reinflate-balloons').hide();
		$('.balloons').removeClass('popped pop-ready settled balloons-rotate-behaviour-one balloons-rotate-behaviour-two').removeAttr('style');
		$('.fuego').hide();
		$('.cake').hide();
		$('.message').hide();
		$('.message p').hide().removeClass('finale');
		$('#balloon-greeting').hide();
		$('#skip_message').hide();
		$('.bannar').removeClass('bannar-come');
		$('.polaroid').hide();
		$('.can-zoom').hide();
		
		$('.navbar-fixed-bottom button').hide();
		$('#turn_on').show();
		
		var song = $('.song')[0];
		if (song){
			song.pause();
			song.currentTime = 0;
		}
		if (vnAudio){
			vnAudio.pause();
			vnAudio.currentTime = 0;
			$('#vn-play-btn').text('▶');
		}
		
		$('body').removeClass('peach peach-after');
		placed = false;
		skipTriggered = false;
		poppedCount = 0;
		layout();
		// Reset Tom & Jerry guide to first pose
		if (window.TJGuide) TJGuide.setPose('turn_on');
	});

	// Polaroid Lightbox Zoom with Caption
	$('.polaroid').click(function(){
		var src = $(this).find('img').attr('src');
		var caption = $(this).attr('data-caption') || $(this).find('.polaroid-caption').text();
		$('#lightbox-img').attr('src', src);
		$('#lightbox-caption').text(caption);
		$('#lightbox').css('display', 'flex').hide().fadeIn('fast');
	});

	$('#lightbox-close').click(function(e){
		e.stopPropagation();
		$('#lightbox').fadeOut('fast');
	});

	$('#lightbox').click(function(e){
		if (e.target === this){
			$('#lightbox').fadeOut('fast');
		}
	});

});
