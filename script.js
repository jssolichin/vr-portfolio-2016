AFRAME.registerComponent('item', {
	schema: {
		offset: {default: '0 4 -1.5' },
		target: {default: '#camera'}
	},
	update: function (oldData) {
		this.el.addEventListener('mouseenter', this.onEnter.bind(this));
		this.el.addEventListener('mouseleave', this.onLeave.bind(this));
		this.el.addEventListener('click', this.onClick.bind(this));
	},
	init: function (){
		var el = this.el;

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

		el.appendChild(entity);
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
	onClick: function (){
		var el = this.el;
		var camera = this.el.sceneEl.querySelectorAll(this.data.target)[0];
		var childrenCenter = this.el.querySelectorAll('.childrenCenter')[0];

		var vector = childrenCenter.object3D.matrixWorld.getPosition();
		
		camera.emit('moveHere', vector, false);
	},
});

AFRAME.registerComponent('click-listener', {
  init: function () {
    var el = this.el;

	el.addEventListener('moveHere', function (a,b,c) {

			var animation = document.createElement('a-animation');
			animation.setAttribute('attribute', 'position');
			animation.setAttribute('to', a.detail.x + ' ' + a.detail.y + ' ' + a.detail.z);
			animation.setAttribute('repeat', '0');

			el.appendChild(animation);

    });
  }
});
