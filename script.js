AFRAME.registerComponent('item', {
	schema: {
		offset: {default: '0 4 -1.5' },
		target: {default: '#camera'}
	},
	init: function (){
		this.el.addEventListener('mouseenter', this.onEnter.bind(this));
		this.el.addEventListener('mouseleave', this.onLeave.bind(this));

		this.data.borders = [];

		var sides = [
			{animationStart: 'growY', animationLeave: 'shrinkY', position: '-2.4 -2 4'},
			{animationStart: 'growY', animationLeave: 'shrinkY', position: '2.4 -2 4'},
			{animationStart: 'growX', animationLeave: 'shrinkX', position: '0 -4.4 4'},
			{animationStart: 'growX', animationLeave: 'shrinkX', position: '0 0.4 4'},
		]

		var entity = document.createElement('a-entity');
		entity.setAttribute('position', this.data.offset);

		sides.forEach((side,index) => {
			var box = document.createElement('a-box');
			box.setAttribute('mixin', 'border');
			box.setAttribute('position', side.position);
			var animation = document.createElement('a-animation');
			animation.setAttribute('mixin', side.animationStart);
			var animationLeave = document.createElement('a-animation');
			animationLeave.setAttribute('mixin', side.animationLeave);

			box.appendChild(animation);
			box.appendChild(animationLeave);
			entity.appendChild(box);

			this.data.borders.push(box);
		});

		this.el.appendChild(entity);
	},
	onEnter: function (){
		this.data.borders.forEach((border) => {
			border.emit('open')	
		})
	},
	onLeave: function (){
		this.data.borders.forEach((border) => {
			border.emit('close')	
		})
	},
});

AFRAME.registerComponent('main-item', {
	schema: {
		target: {default: '#camera'}
	},
	init: function () {
		this.el.addEventListener('click', this.onClick.bind(this));
	},
	onClick: function (){

		var camera = this.el.sceneEl.querySelector(this.data.target);
		var childrenCenter = this.el.parentElement.querySelector('.childrenCenter');
		var vector = childrenCenter.object3D.matrixWorld.getPosition();

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
		url: {default: 'http://jssolichin.com'},
		target: {default: '.icon'},
		from: {default: '90 10 0'},
		to: {default: '90 720 0'}
	},
	init: function () {

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
		});

		this.el.addEventListener('mouseleave', function (a){
			if(animator)
				icon.removeChild(animator);
		});

	}
});
