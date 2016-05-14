(function(){
	var years = 50;
	var playSpeed = 0.05;
	var viewAngle = 0;

	/*
	Sun  	0	109	332,800	25-36*	9	---	---	---	1.410
	Mercury	0.39	0.38	0.05	58.8	0	7	0.2056	0.1°	5.43
	Venus	0.72	0.95	0.89	244	0	3.394	0.0068	177.4°	5.25
	Earth	1.0	1.00	1.00	1.00	1	0.000	0.0167	23.45°	5.52
	Mars	1.5	0.53	0.11	1.029	2	1.850	0.0934	25.19°	3.95
	Jupiter	5.2	11	318	0.411	16	1.308	0.0483	3.12°	1.33
	Saturn	9.5	9	95	0.428	18	2.488	0.0560	26.73°	0.69
	Uranus	19.2	4	17	0.748	15	0.774	0.0461	97.86°	1.29
	Neptune	30.1	4	17	0.802	8	1.774	0.0097	29.56°	1.64
	Pluto	39.5	0.18	0.002	0.267	1	17.15	0.2482	119.6°	2.03

	*/

	var planets = [

		{
			title: 'Sun',
			distance: '0.0001',
			radius: '109',
			color: 'yellow',
		},
		{
			title: 'Mercury',
			distance: '0.39',
			radius: '0.38',
			color: 'blue',
			period: 0.241
		},{
			title: 'Venus',
			distance: '0.72',
			radius: '0.95',
			color: 'orrange',
			period: 0.615
		},{
			title: 'Earth',
			distance: '1.0',
			radius: '1.0',
			color: 'blue',
			period: 1.0
		},{
			title: 'Mars',
			distance: '1.5',
			radius: '0.0934',
			color: 'red',
			period: 1.88
		},{
			title: 'Jupiter',
			distance: '5.2',
			radius: '11',
			color: 'yellow',
			period: 11.86
		},{
			title: 'Saturn',
			distance: '9.5',
			radius: '9',
			color: 'yellow',
			period: 29.46
		},{
			title: 'Uranus',
			distance: '19.2',
			radius: '4',
			color: 'blue',
			period: 84.01
		},{
			title: 'Neptune',
			distance: '30.1',
			radius: '4',
			color: 'blue',
			period: 164.79
		}	
	];


	function drawStar(ctx,r){
	  ctx.save();
	  ctx.beginPath()
	  ctx.moveTo(r,0);
	  for (i=0;i<9;i++){
	    ctx.rotate(Math.PI/5);
	    if(i%2 == 0) {
	      ctx.lineTo((r/0.525731)*0.200811,0);
	    } else {
	      ctx.lineTo(r,0);
	    }
	  }
	  ctx.closePath();
	  ctx.fill();
	  ctx.restore();
	}

	function drawArc(context, radius) {
		
	 
		// define center
		var centerX = 0;
		var centerY = 0;
	 
		context.beginPath();
		
		context.arc(centerX, centerY, radius, 0, Math.PI*2, true)
		context.lineWidth=1;
		context.strokeStyle="white"; 
		context.closePath();
		context.stroke();
	}

	function drawDisc(context, radius, x, y, color) {
		context.save();
		// define center of oval
		var centerX = 0 - x;
		var centerY = 0 - y;
	 

		context.beginPath();

		if (radius < 3) radius = 3;
		context.arc(centerX, centerY, radius, 0, Math.PI*2, true)
		context.scale(1,1);
		context.fillStyle=color;
		context.fill();
		context.closePath();
		context.restore();
	}

	window.onload = function init(){
		var canvas=document.getElementById("myCanvas");
		function mozillawheel(e){
			playSpeed = playSpeed + e.detail/150;
		}
		canvas.addEventListener('DOMMouseScroll', mozillawheel, false);

		function handleArrowKeys(evt) {
		    evt = (evt) ? evt : ((window.event) ? event : null);
		    if (evt) {
			switch (evt.keyCode) {
			    case 38:
				viewAngle = viewAngle - Math.PI/30
			        break;    
			    case 40:
				viewAngle = viewAngle + Math.PI/30
			        break;    
			 }
		    }
		}

		document.onkeyup = handleArrowKeys;


		var context=canvas.getContext("2d");
		context.translate(350,350);
		function drawFn(){
			context.save();
			context.beginPath();
			context.closePath();
			context.restore();
			context.clearRect(0, 0, 700, 700);
			//context.fillRect(0,0,700,700);
			  
			 
			// Create a circular clipping path
			context.beginPath();

			// draw background
			var lingrad = context.createLinearGradient(0,-350,0,350);
			lingrad.addColorStop(0, '#232256');
			lingrad.addColorStop(1, '#143778');

			context.fillStyle = lingrad;
			context.fillRect(-350,-350,700,700);
			// draw stars
			for (j=1;j<10;j++){
				context.save();
				context.fillStyle = '#fff';
				context.translate(350-Math.floor(Math.random()*700),350-Math.floor(Math.random()*700));
				drawStar(context,Math.floor(Math.random()*4)+2);
				context.restore();
			}
			tmpPlanets = planets.slice(0);
			firstPplanet = tmpPlanets.shift();
			context.save();
			if (viewAngle == 0) {
				viewAngle = -0.01
			}	
			var scale = Math.sin(viewAngle)
			var diskScale = Math.sin(viewAngle)

			context.scale(1,1 - Math.abs(scale));
			while (planet = tmpPlanets.shift()){
				var addoptedDistance = Math.sqrt(planet.distance)*50;

				drawArc(context, addoptedDistance);
				var arcSpeed = Math.PI*2/planet.period;
				var angle = years * arcSpeed;
				x = addoptedDistance*Math.cos(angle)
				y = addoptedDistance*Math.sin(angle)
				r = Math.sqrt(40)*50 - x*diskScale;
				var visibleDiskRadius = 40 * Math.sqrt((planet.radius*2)/(r + x*diskScale));//        (planet.radius)*4) * (2 - diskScale)*x
				drawDisc(context, visibleDiskRadius, x, y, planet.color);
			}

			context.restore();
			if (years > 1000){
				drawDisc(context, Math.log(firstPplanet.radius)*4 + (years - 1000)*(years - 1000) , 0, 0, 'red');
			} else {
				drawDisc(context, Math.log(firstPplanet.radius)*4, 0, 0, firstPplanet.color);
			}
			years = years + playSpeed;
			setTimeout(function() { drawFn() }, 100);
		}
		drawFn();
	}
})();