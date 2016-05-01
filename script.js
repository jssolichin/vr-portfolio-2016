var gyroPresent = false;
window.addEventListener("devicemotion", function(event){
	var checkOther = document.querySelector('#check-other');
	if(event.rotationRate.alpha || event.rotationRate.beta || event.rotationRate.gamma){
		checkOther.innerHTML = "Visit on desktop to use the keyboard to travel this world!";
	}
	else{
		checkOther.innerHTML = "Visit on mobile to use the gyroscope for an immersive experience!";
	}
});

AFRAME.registerComponent('item', {
	schema: {
		offset: {default: '0 4 -1.5' },
		target: {default: '#camera'}
	},
	init: function (){
		this.el.addEventListener('mouseenter', this.onEnter.bind(this));
		this.el.addEventListener('mouseleave', this.onLeave.bind(this));

		// keep track of the borders we're going to construct
		this.data.borders = [];

		// depending on which side of the border, we have some different values
		this.data.sides = [
			{animationStart: 'growY', animationLeave: 'shrinkY', position: '-2.4 -2 5'},
			{animationStart: 'growY', animationLeave: 'shrinkY', position: '2.4 -2 5'},
			{animationStart: 'growX', animationLeave: 'shrinkX', position: '0 -4.4 5'},
			{animationStart: 'growX', animationLeave: 'shrinkX', position: '0 0.4 5'},
		]

		// create a container for the borders
		var entity = document.createElement('a-entity');
		entity.setAttribute('position', this.data.offset);

		// let's add the borders
		for(var i = 0; i < this.data.sides.length; i++){
			var side= this.data.sides[i]

			var box = document.createElement('a-box');
			box.setAttribute('mixin', 'border');
			box.setAttribute('position', side.position);

			entity.appendChild(box);
			this.data.borders.push(box);
		}

		// add the container to the scene
		this.el.appendChild(entity);
	},
	onEnter: function (){
		var sides = this.data.sides;

		for(var i = 0; i < this.data.borders.length; i++){
			var border= this.data.borders[i]

			// delete any existing animation to avoid conflict
			while (border.hasChildNodes()) {
			    border.removeChild(border.lastChild);
			}

			var animator = document.createElement('a-animation');
			animator.setAttribute('mixin', sides[i].animationStart);
			animator.addEventListener('animationend', function (){
				if(this.parentElement)
					this.parentElement.removeChild(this);
			})

			border.appendChild(animator);

		}
	},
	onLeave: function (){
		var sides = this.data.sides;

		for(var i = 0; i < this.data.borders.length; i++){
			var border= this.data.borders[i]
			
			// delete any existing animation to avoid conflict
			while (border.hasChildNodes()) {
			    border.removeChild(border.lastChild);
			}

			var animator = document.createElement('a-animation');
			animator.setAttribute('mixin', sides[i].animationLeave);
			animator.addEventListener('animationend', function (){
				if(this.parentElement)
					this.parentElement.removeChild(this);
			})

			border.appendChild(animator);

		}
	},
});

AFRAME.registerComponent('main-item', {
	schema: {
		target: {default: '#camera'}
	},
	init: function () {
		this.el.addEventListener('click', this.onClick.bind(this));
		this.el.addEventListener('cursor-click', this.onClick.bind(this));
	},
	onClick: function (){

		var camera = this.el.sceneEl.querySelector(this.data.target);
		var childrenCenter = this.el.parentElement.querySelector('.childrenCenter');
		var vector = new THREE.Vector3().setFromMatrixPosition(childrenCenter.object3D.matrixWorld)

		camera.emit('moveHere', vector, false);
	},
});

AFRAME.registerComponent('go-home', {
	schema: {
		target: {default: '#camera'}
	},
	init: function () {
		var vector = new THREE.Vector3(0,0,0);
		var camera = this.el.sceneEl.querySelector(this.data.target);

		var animator;

		this.el.addEventListener('mouseenter', function (a) {

			animator = document.createElement('a-animation');
			animator.setAttribute('attribute', 'rotation');
			animator.setAttribute('from', '-90 0 0');
			animator.setAttribute('to', '-90 0 360');
			animator.setAttribute('repeat', '0');
			animator.setAttribute('easing', 'ease-in');
			animator.setAttribute('dur', '2000');

			animator.addEventListener('animationend', function (){
				this.parentElement.removeChild(this);
			})

			this.appendChild(animator);
		
		});

		this.el.addEventListener('mouseleave', function (a) {

			if(animator)
				this.removeChild(animator);
		
		});

		this.el.addEventListener('click', function (a) {

			camera.emit('moveHere', vector, false);

		});
	}
});

AFRAME.registerComponent('click-listener', {
	init: function () {

		this.el.addEventListener('moveHere', function (a) {

			console.log('moveHere', a.detail)

			var animator = document.createElement('a-animation');
			animator.setAttribute('id', 'cameraMover');
			animator.setAttribute('attribute', 'position');
			animator.setAttribute('to', a.detail.x + ' ' + a.detail.y + ' ' + a.detail.z);
			animator.setAttribute('repeat', '0');

			animator.addEventListener('animationend', function (){
				this.parentElement.removeChild(this);
			})

			this.appendChild(animator);

		});
	}
});

AFRAME.registerComponent('go-to', {
	schema: {
		warning: {default: '#warning'},
		url: {default: 'http://jssolichin.com'},
		target: {default: '.icon'},
		from: {default: '90 10 0'},
		to: {default: '90 720 0'}
	},
	init: function () {

		var warning = document.querySelector(this.data.warning);
		var url = this.data.url
		var from = this.data.from
		var to = this.data.to

		var animator;
		var icon =this.el.querySelector(this.data.target);

		this.el.addEventListener('mouseenter', function (a){

			animator = document.createElement('a-animation');
			animator.setAttribute('attribute', 'rotation');
			animator.setAttribute('from', from);
			animator.setAttribute('to', to);
			animator.setAttribute('easing', 'ease-in');
			animator.setAttribute('fill', 'forwards');
			animator.setAttribute('dur', '2500');

			animator.addEventListener('animationend', function (){
				window.location = url;
			})

			icon.appendChild(animator);
			warning.style.display = "inline-block";
		});

		this.el.addEventListener('mouseleave', function (a){
			warning.style.display = "none";
			if(animator)
				icon.removeChild(animator);
		});

	}
});

AFRAME.registerComponent('go-to-project', {
	schema: {
		warning: {default: '#warning'},
		target: {default: '#camera'},
		item: {default: '.item'},
		url: {default: 'http://jssolichin.com'},
	},
	init: function () {
		var vector = new THREE.Vector3(0,0,0);
		var warning = document.querySelector(this.data.warning);
		var camera = this.el.sceneEl.querySelector(this.data.target);
		var item = this.el.querySelector(this.data.item);
		var url = this.data.url;

		var animator;

		this.el.addEventListener('mouseenter', function (a) {

			animator = document.createElement('a-animation');
			animator.setAttribute('attribute', 'width');
			animator.setAttribute('from', '0');
			animator.setAttribute('to', '18');
			animator.setAttribute('fill', 'backwards');
			animator.setAttribute('repeat', '0');
			animator.setAttribute('easing', 'ease-in');
			animator.setAttribute('dur', '2000');

			animator.addEventListener('animationend', function (){
				this.parentElement.removeChild(this);
			})

			item.appendChild(animator);
			warning.style.display = "inline-block";
		
		});

		this.el.addEventListener('mouseleave', function (a) {

			warning.style.display = "none";
			if(animator)
				item.removeChild(animator);
		
		});

		this.el.addEventListener('click', function (a) {

			window.location = url;

		});
	}
});
