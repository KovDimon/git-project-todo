class TodoView {
	constructor(){
		this.$footer = $('.footer');
        this.$allCheckbox = $('.main-all-checkbox');
		this.$clearCompleted = $('#clear-completed');
		this.$list = $('.list');
		this.$paginator = $('.paginator');
		this.$allItems = $('.all-items');
		this.templateElement = $('#line-template').html();
		this.templatePaginator = $('#paginator-element').html();
        this.$completedItems = $('.completed-items');
        this.$add = $("#add");
        this.$footerButtons = $('.footer-buttons');
        this.$newTask = $('#new-task');
	}
	
	showElements(items) {
		let html = _.template(this.templateElement)({items});
        this.$list.html(html);
		$('li .delete').hide();
		$('li input[type="checkbox"]').hide();
	}
	
	showCountersAndButtons(countAll, countCompleted, toggleButtons, allCheckboxButton){
     
        if(countAll){
            this.$footer.show();
            this.$allCheckbox.show();
        }else{
            this.$footer.hide();
            this.$allCheckbox.hide();
        }

        (countCompleted === 0) ? this.$clearCompleted.hide() : this.$clearCompleted.show();

        if(allCheckboxButton){
            this.$allCheckbox.addClass('main-all-checkbox-marker');
        }else{
            this.$allCheckbox.removeClass('main-all-checkbox-marker');
        }
        
        this.$allItems.text(countAll);
        this.$completedItems.text(countCompleted);
        $('#'+ toggleButtons).prop('checked',true);
    }

    showPaginator(numPages, numberPage){
        let html = '';
        let pages = [];

        if(numPages > 1){
            for(let i = 1; i <= numPages; i++){
                pages.push(i);
            }
            html = _.template(this.templatePaginator)({pages});
        }
        this.$paginator.html(html);
	    
        this.$paginator.children().eq(numberPage-1).addClass('current-page');
    }
    showEdit($this){
            $this.parent().toggleClass('edit');
            $this.next().focus();
    }
}

class TodoModel {
    constructor(view){
        this.view = view;
        this.todoList = JSON.parse(localStorage.getItem('todo')) || [];
        this.pages;
    }

    makeId(){
        return Math.random().toString(36).substr(2,16);
    }

    filterArray(toggleButtons, countCompleted, numberPage){
        let array;
        let tempNumber;
        switch(toggleButtons){
			case 'active': array = this.todoList.filter(function(obj){
										return obj.completed === false;
                                    });
                tempNumber = this.todoList.length - countCompleted;
                break;
			case 'completed': array = this.todoList.filter(function(obj){
										return obj.completed === true;
                                    });
                tempNumber = countCompleted; 
                break;
            default: array = this.todoList;
                tempNumber = this.todoList.length;
        }
        this.pages = Math.ceil(tempNumber/5);
        if(numberPage > this.pages){
                numberPage -= numberPage - this.pages;
            }
        if(numberPage <= 0){
            numberPage = 1;
        }
        return array.slice(5*(numberPage-1), 5*numberPage);
    }

    addElement(newTask, toggleButtons, countCompleted, numberPage){
		return new Promise ((resolve, reject) => {
			let items;
        let todoObject = {
            todoId : this.makeId(),
            todo : newTask,
            completed : false
        };
		this.todoList.push(todoObject);
        items = this.filterArray(toggleButtons, countCompleted, numberPage);
        localStorage.setItem('todo',JSON.stringify(this.todoList));
        let obj = {array : items, numPages : this.pages};
		resolve(obj);
		});
    }
    removeElement(id, toggleButtons, countCompleted, numberPage){
        return new Promise ((resolve, reject) => {
            let i = this.todoList.findIndex(x => x.todoId === id);
            if(this.todoList[i].completed){
                countCompleted--;
            }
            this.todoList.splice(i,1);
            let items = this.filterArray(toggleButtons, countCompleted, numberPage);
            localStorage.setItem('todo',JSON.stringify(this.todoList));
            let obj1 = {array : items, numPages : this.pages, countCompl : countCompleted};
            resolve(obj1);
        });
    }

    setButtons(id, Button, toggleButtons, countCompleted, numberPage){
        return new Promise ((resolve, reject) => {
            switch(Button){
                case 1:
                    let i = this.todoList.findIndex(x => x.todoId === id);
                    if(this.todoList[i].completed){
                        this.todoList[i].completed = false;
                        countCompleted--;
                    }else{
                        this.todoList[i].completed = true;
                        countCompleted++;
                    } break;
                case 2:
                    this.todoList = this.todoList.filter(function(obj) {
                        return obj.completed === false;
                    }); break;
                case 3:
                    this.todoList.forEach(function(obj) {
                        obj.completed = false;
                    }); break;
                case 4:
                    this.todoList.forEach(function(obj){
                        obj.completed = true;
                    }); break;
            }
            
            let items = this.filterArray(toggleButtons, countCompleted, numberPage);
            localStorage.setItem('todo',JSON.stringify(this.todoList));
            let obj = {array : items, numPages : this.pages, countCompl : countCompleted};
            resolve(obj);
        });
    }

    editElement($this, task){
		return new Promise ((resolve, reject) => {
            let i = this.todoList.findIndex(x => x.todoId === $this.closest('li').attr('id'));
            this.todoList[i].todo = task;
            localStorage.setItem('todo',JSON.stringify(this.todoList));
            resolve(task);
        });
    }
}

class TodoController{

    constructor (model, view) {
        this.view = view;
        this.model = model;
        this.numberPage = JSON.parse(localStorage.getItem('numberPage'));
        this.toggleButtons = localStorage.getItem('toggleButtons') || 'all';
        this.countAll = this.model.todoList.length;
        this.countCompleted = this.model.todoList.filter(function(obj) {
			return obj.completed === true;
		}).length;
        this.allCheckboxButton = JSON.parse(localStorage.getItem('allCheckboxButton')) || false;
        this.initEvents();
    }
    clickBtnAdd(event){
        event.preventDefault();
        let newTask = this.view.$newTask.val();
        if(newTask == 0) return;
        this.view.$newTask.val('');
        this.countAll++;
        this.numberPage = Math.ceil(this.countAll/5);
		this.model.addElement(newTask, this.toggleButtons, this.countCompleted, this.numberPage)
            .then(obj => {this.view.showElements(obj.array);
                this.view.showCountersAndButtons(this.countAll, this.countCompleted,
                this.toggleButtons, this.allCheckboxButton); this.view.showPaginator(
                    obj.numPages, this.numberPage); })
            .catch(error => { console.log('ERROR'); });
    }
	clickBtnRemove(event) {
        let id = $(event.target).closest('li').attr('id');
        this.countAll--;
        this.allCheckboxButton = false;
        this.model.removeElement(id, this.toggleButtons, this.countCompleted, this.numberPage)
        .then(obj1 => {this.countCompleted = obj1.countCompl; this.view.showElements(obj1.array);
            this.view.showCountersAndButtons(this.countAll, this.countCompleted,
            this.toggleButtons, this.allCheckboxButton);
            (this.numberPage > obj1.numPages) ? this.numberPage = obj1.numPages : this.numberPage;
            this.view.showPaginator(
                obj1.numPages, this.numberPage); })
        .catch(error => { console.log('ERROR'); });
		localStorage.setItem('allCheckboxButton',JSON.stringify(this.allCheckboxButton));
	}
	clickBtnComplet(event) {
        this.allCheckboxButton = false;
        let id = $(event.target).closest('li').attr('id');
        
        this.model.setButtons(id, 1, this.toggleButtons, this.countCompleted, this.numberPage)
        .then(obj => { this.countCompleted = obj.countCompl; this.view.showElements(obj.array);
            this.view.showCountersAndButtons(this.countAll, this.countCompleted,
            this.toggleButtons, this.allCheckboxButton); this.view.showPaginator(
                obj.numPages, this.numberPage); })
        .catch(error => { console.log('ERROR'); });
        localStorage.setItem('allCheckboxButton',JSON.stringify(this.allCheckboxButton));
    }
    
    clickBtnToggle(event){
        this.toggleButtons = $(event.target).attr('value');
        this.numberPage = 1;
        this.model.setButtons(0, 0, this.toggleButtons, this.countCompleted, this.numberPage)
        .then(obj => {this.countCompleted = obj.countCompl; this.view.showElements(obj.array); 
            this.view.showCountersAndButtons(this.countAll, this.countCompleted, 
                this.toggleButtons, this.allCheckboxButton); 
            this.view.showPaginator(obj.numPages, this.numberPage); })
        .catch(error => { console.log('ERROR'); });
        localStorage.setItem('toggleButtons', this.toggleButtons);
    }
    clickBtnAllCheckbox(){
        let Button = 4;
        if(this.allCheckboxButton) {
            this.allCheckboxButton = false;
            this.countCompleted = 0;
            Button = 3;
        }else{
            this.allCheckboxButton = true;
            this.countCompleted = this.countAll;
        }
        this.model.setButtons(0, Button, this.toggleButtons, this.countCompleted, this.numberPage)
        .then(obj => { this.countCompleted = obj.countCompl; this.view.showElements(obj.array);
            this.view.showCountersAndButtons(this.countAll, this.countCompleted,
            this.toggleButtons, this.allCheckboxButton); this.view.showPaginator(
                obj.numPages, this.numberPage); })
        .catch(error => { console.log('ERROR'); });
        localStorage.setItem('allCheckboxButton',JSON.stringify(this.allCheckboxButton));
    }
    clickBtnClearCompleted(event){
        event.preventDefault();
        this.allCheckboxButton = false;
        this.countAll-=this.countCompleted;
        this.countCompleted = 0;
        this.model.setButtons(0, 2, this.toggleButtons, this.countCompleted, this.numberPage)
        .then(obj => {this.countCompleted = obj.countCompl; this.view.showElements(obj.array);
            this.view.showCountersAndButtons(this.countAll, this.countCompleted,
            this.toggleButtons, this.allCheckboxButton); this.view.showPaginator(
                obj.numPages, this.numberPage); })
        .catch(error => { console.log('ERROR'); });
    }
    clickBtnPaginator(event){
        event.preventDefault();
        let $a = $(event.target);
        this.numberPage = $a.text();
        this.model.setButtons(0, 0, this.toggleButtons, this.countCompleted, this.numberPage)
        .then(obj => {this.countCompleted = obj.countCompl; this.view.showElements(obj.array);
            this.view.showCountersAndButtons(this.countAll, this.countCompleted,
            this.toggleButtons, this.allCheckboxButton); this.view.showPaginator(
                obj.numPages, this.numberPage); })
        .catch(error => { console.log('ERROR'); });
        localStorage.setItem('numberPage',JSON.stringify(this.numberPage));
    }
    dblclickElement(event){
        let $this = $(event.target);
        $this.next().val($this.text());
        this.view.showEdit($(event.target));
    }
    blurElement(event){
        let $this = $(event.target);
        let text = $this.val();
        $this.prev().text(text);
        this.model.editElement($this, text)
        .then(task => {this.view.showEdit($this);})
        .catch(error => { console.log('ERROR'); });
    }
	initEvents(){
        this.view.$add.on('click', event => this.clickBtnAdd(event));
        this.view.$list.on('click','li .delete', event => this.clickBtnRemove(event));
        this.view.$list.on('click','li input[type="checkbox"]', event => this.clickBtnComplet(event));
        this.view.$footerButtons.on('change','div input', event => this.clickBtnToggle(event));
        this.view.$allCheckbox.on('click', event => this.clickBtnAllCheckbox(event));
        this.view.$clearCompleted.on('click', event => this.clickBtnClearCompleted(event));
        this.view.$paginator.on('click', 'a', event => this.clickBtnPaginator(event));
        this.view.$list.on('dblclick','li div label', event => this.dblclickElement(event));
        this.view.$list.on('blur','li div input[name="todo"]', event => this.blurElement(event));
        this.view.$list.on('mouseover', 'li .line', function(){
	        $(this).children().first().addBack('.delete').show();
        });

        this.view.$list.on('mouseout', 'li .line', function(){
            $(this).children().first().addBack('.delete').hide();
        });
        this.model.setButtons(0, 0, this.toggleButtons, this.countCompleted, this.numberPage)
        .then(obj => {this.countCompleted = obj.countCompl; this.view.showElements(obj.array);
            this.view.showCountersAndButtons(this.countAll, this.countCompleted,
            this.toggleButtons, this.allCheckboxButton); this.view.showPaginator(
                obj.numPages, this.numberPage); })
        .catch(error => { console.log('ERROR'); });
	}
}
(function(){
    let view = new TodoView();
    let model = new TodoModel(view);
    let controller = new TodoController(model, view);
}());