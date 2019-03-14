var model = {
	tasks:[],
	statuses:[],

	addStatus:function(name, status) {
		var date = new Date();
		var now = date.getHours() + ":" + date.getMinutes() + " - " + date.getDate()+ "." + date.getMonth()+ "." + date.getFullYear();
		this.statuses.push(status = {status: status, name: name, date: now});
		localStorage.setItem("statuses", JSON.stringify(this.statuses));

		return this.statuses;
	},

	addTask:function(name) {
		this.tasks.push(task = {name: name, id: this.tasks.length, mark: false});
		return this.tasks;
	},

	removeTask:function(id) {
		this.tasks.splice(id, 1);

		for (var i = 0; i < this.tasks.length; i++) {
			this.tasks[i].id = i;
		}

		return this.tasks;
	},

	editTask:function(id, name) {
		this.tasks[id].name = name;
		return this.tasks;
	},

	toggleMark:function(id) {
		if(this.tasks[id].mark == false) this.tasks[id].mark = true; else this.tasks[id].mark = false;
		return this.tasks;
	},

	sortTasksName:function() {
		this.tasks.sort(function(a, b) {
		  	var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
			if(nameA < nameB) return -1; else return 1;
			return 0;
		})

		for (var i = 0; i < this.tasks.length; i++) {
			this.tasks[i].id = i;
		}

		return this.tasks;
	},

	getTasks:function() {
		return this.tasks;
	},

	setStatuses:function(array) {
		this.statuses = array;
		return this.statuses;
	}

}

var controller = {

	onload: function() {
		if(localStorage.getItem("statuses")) {
			var statuses = model.setStatuses(JSON.parse(localStorage.getItem("statuses")));
			view.update(null, statuses);
		}
	},

	clearHistory: function() {
		localStorage.clear();
		document.querySelector('.statusesList').innerHTML = '';
	},

	closeModal: function(event) {
		var modal = event.target.parentElement;
		modal.setAttribute('style', "display: none;");
	},

	modalAddTask: function() {
		var modalAddTask = document.querySelector('.modalAddTask');
		modalAddTask.querySelector('input').value = '';
		modalAddTask.setAttribute('style', "display: block;");

		var modalEditTask = document.querySelector('.modalEditTask');
		modalEditTask.setAttribute('style', "display: none;");
	},

	modalEditTask: function(event) {
		var modalEditTask = document.querySelector('.modalEditTask');
		var id = event.target.closest('li').getAttribute('id');
		var name = event.target.closest('li').querySelector('p').innerHTML;

		modalEditTask.querySelector('input').value = name;
		modalEditTask.setAttribute('data_id', id);
		modalEditTask.setAttribute('style', "display: block;");

		var modalAddTask = document.querySelector('.modalAddTask');
		modalAddTask.setAttribute('style', "display: none;");
	},

	addTask: function(event) {
		var name = event.target.previousElementSibling.value;

		if(name != '') {
			var tasks = model.addTask(name);
			tasks = model.sortTasksName();
			var statuses = model.addStatus(name, 'added');
			view.update(tasks, statuses);
		} else {
			alert('Enter a name!');
			return false;
		}

		var modalAddTask = document.querySelector('.modalAddTask');
		modalAddTask.setAttribute('style', "display: none;");
	},

	editTask: function(event) {
		var id = document.querySelector('.modalEditTask').getAttribute('data_id');
		var name = event.target.previousElementSibling.value;

		if(name != '') {
			var tasks = model.editTask(id, name);
			tasks = model.sortTasksName();
			var statuses = model.addStatus(name, 'edited');
			view.update(tasks, statuses);
		} else {
			alert('Enter a name!');
			return false;
		}

		var modalEditTask = document.querySelector('.modalEditTask');
		modalEditTask.setAttribute('style', "display: none;");
	},

	removeTask: function(event) {
		var id = event.target.closest('li').getAttribute('id');
		var name = event.target.closest('li').querySelector('p').innerHTML;

		var confim = confirm('Are you sure delete - '+ name +'?');

		if(confim) {

			var tasks = model.removeTask(id);
			tasks = model.sortTasksName();
			var statuses = model.addStatus(name, 'removed');
			view.update(tasks, statuses); 
		} else {
			return false;
		}
	},

	toggleMark: function(event) {
		var id = event.target.closest('li').getAttribute('id');
		var name = event.target.closest('li').querySelector('p').innerHTML;

		var tasks = model.toggleMark(id);
		tasks = model.sortTasksName();
		var statuses = model.addStatus(name, 'marked');
		view.update(tasks, statuses);
	}

}

var view = {
	update:function(tasks, statuses) {
		var tasksList = document.querySelector('.tasksList');
		var statusesList = document.querySelector('.statusesList');
		tasksList.innerHTML = '';
		statusesList.innerHTML = '';
		
		if(statuses) {
			for (var i = 0; i < statuses.length; i++) {
				var statusBlock = document.createElement('li');
				var statusBlock_name = document.createElement('span');
				var statusBlock_status = document.createElement('span');
				var statusBlock_date = document.createElement('span');

				statusBlock_name.innerHTML = statuses[i].name;
				statusBlock_status.innerHTML = statuses[i].status;
				statusBlock_date.innerHTML = statuses[i].date;

				statusBlock.appendChild(statusBlock_name);
				statusBlock.appendChild(statusBlock_status);
				statusBlock.appendChild(statusBlock_date);
				statusesList.appendChild(statusBlock);
			}
		}

		if(tasks) {
			for (var i = 0; i < tasks.length; i++) {
				var taskBlock = document.createElement('li');
				var taskBlock_header = document.createElement('div');
				var taskBlock_marker = document.createElement('button');
				var taskBlock_edit = document.createElement('button');
				var taskBlock_remove = document.createElement('button');
				var taskBlock_body = document.createElement('div');
				var taskBlock_name = document.createElement('p');

				taskBlock_name.innerHTML = tasks[i].name;
				taskBlock_marker.innerHTML = '&#10004;';
				taskBlock_edit.innerHTML = '&#10000;';
				taskBlock_remove.innerHTML = '&#10008;';

				taskBlock.setAttribute('id', tasks[i].id);
				if(tasks[i].mark) taskBlock.setAttribute('class', 'mark'); else taskBlock.removeAttribute('class');
				taskBlock_marker.setAttribute('onclick', 'controller.toggleMark(event)');
				taskBlock_edit.setAttribute('onclick', 'controller.modalEditTask(event)');
				taskBlock_remove.setAttribute('onclick', 'controller.removeTask(event)');

				taskBlock_header.appendChild(taskBlock_marker);
				taskBlock_header.appendChild(taskBlock_edit);
				taskBlock_header.appendChild(taskBlock_remove);
				taskBlock_body.appendChild(taskBlock_name);
				taskBlock.appendChild(taskBlock_header);
				taskBlock.appendChild(taskBlock_body);
				tasksList.appendChild(taskBlock);
			}
		}
	}
}