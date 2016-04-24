AFRAME.registerComponent('item', {
	schema: {
		offset: {default: '0 2 0' }
	},
	update: function (oldData) {
		this.el.addEventListener('mouseenter', this.onEnter.bind(this));
		this.el.addEventListener('mouseleave', this.onLeave.bind(this));
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

		sides.forEach((side) => {
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
	}
});
