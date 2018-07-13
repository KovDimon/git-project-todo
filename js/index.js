class TodoView {
	constructor(){}
	
	showElements(items) {
		let html = '';
		let tmp = $('#line-template').html();
		html = _.template(tmp)({items});
        $('.list').html(html);
		$('li .delete').hide();
		$('li input[type="checkbox"]').hide();
	}
	
	showCountersAndButtons(countAll, countCompleted, toggleButtons, allCheckboxButton){
        let $footer = $('.footer');
        let $allCheckbox = $('.main-all-checkbox');
        let $clearCompleted = $('#clear-completed');

        if(countAll){
            $footer.show();
            $allCheckbox.show();
        }else{
            $footer.hide();
            $allCheckbox.hide();
        }

        (countCompleted === 0) ? $clearCompleted.hide() : $clearCompleted.show();

        if(allCheckboxButton){
            $allCheckbox.addClass('main-all-checkbox-marker');
        }else{
            $allCheckbox.removeClass('main-all-checkbox-marker');
        }
        
        $('.all-items').text(countAll);
        $('.completed-items').text(countCompleted);
        $('#'+ toggleButtons).prop('checked',true);
    }

    showPaginator(n, numberPage){
        let $paginator = $('.paginator');
        let html = '';
        let tmp = $('#paginator-element').html();
        let m = n/5;
        let pages = [];

        if(n > 5){
            for(let i = 1; i <= Math.ceil(m); i++){
                pages.push(i);
            }
            html = _.template(tmp)({pages});
        }
        $paginator.html(html);
	    
        $paginator.children().eq(numberPage-1).addClass('current-page');
    }
    showEdit($this){
            $this.parent().toggleClass('edit');
            $this.next().focus();
    }
}

class TodoModel {
    constructor(view, data){
        this.view = view;
        this.todoList = data.todoList;
        this.numberPage = data.numberPage;
        this.toggleButtons = data.toggleButtons;
        this.countAll = data.countAll;
        this.countCompleted = data.countCompleted;
        this.allCheckboxButton = data.allCheckboxButton;
        this.n;
    }

    makeId(){
        return Math.random().toString(36).substr(2,16);
    }

    filterArray(){
        let array;
        let items;
        switch(this.toggleButtons){
			case 'active': array = this.todoList.filter(function(obj){
										return obj.completed === false;
                                    });
                this.n = this.countAll - this.countCompleted;
                break;
			case 'completed': array = this.todoList.filter(function(obj){
										return obj.completed === true;
                                    });
                this.n = this.countCompleted; 
                break;
            default: array = this.todoList;
                this.n = this.countAll;
        }
        let m = Math.ceil(this.n/5);
        if(this.numberPage > m){
                this.numberPage-=this.numberPage - m;
            }
        if(this.numberPage <= 0){
            this.numberPage = 1;
        }
        console.log(this.numberPage);
        console.log(m);
        return items = array.slice(5*(this.numberPage-1),5*this.numberPage);
    }

    addAndRemoveElement(id, newTask){
        let items;
        let todoObject = {
            todoId : this.makeId(),
            todo : newTask,
            completed : false
        };
        if(newTask){
            this.todoList.push(todoObject);
            this.countAll++;
            this.numberPage = Math.ceil((this.n)/5);
        }else{
            let i = this.todoList.findIndex(x => x.todoId === id);
            if(this.todoList[i].completed){
                this.countCompleted--;
            }
            this.todoList.splice(i,1);
            this.countAll--;
            this.allCheckboxButton = false;
        }
        items = this.filterArray();
        this.view.showPaginator(this.n, this.numberPage);
        this.view.showElements(items);
        this.view.showCountersAndButtons(this.countAll, this.countCompleted, 
            this.toggleButtons, this.allCheckboxButton);
        

        localStorage.setItem('todo',JSON.stringify(this.todoList));
        localStorage.setItem('numberPage',JSON.stringify(this.numberPage));
    }

    setButtons(id, Button, numberPage){
        switch(Button){
            case 1:
                let i = this.todoList.findIndex(x => x.todoId === id);
                if(this.todoList[i].completed){
                    this.todoList[i].completed = false;
					this.countCompleted--;
                }else{
                    this.todoList[i].completed = true;
					this.countCompleted++;
                }
                this.allCheckboxButton = false;
                break;
            case 2:

                this.todoList = this.todoList.filter(function(obj) {
                    return obj.completed === false;
                });
                this.allCheckboxButton = false;
                this.countAll-=this.countCompleted;
                this.countCompleted = 0;
                break;
            case 3:

                if(this.allCheckboxButton) {
                    this.todoList.forEach(function(obj) {
                        obj.completed = false;
                    });
                    this.allCheckboxButton = false;
                    this.countCompleted = 0;
                }else{
                    this.todoList.forEach(function(obj){
                        obj.completed = true;
                    });
                    this.allCheckboxButton = true;
                    this.countCompleted = this.countAll;
                }
                break;
            case 4:
                this.numberPage = numberPage; break;
                
            default: this.toggleButtons = Button;
        }
        
        let items = this.filterArray();
        this.view.showPaginator(this.n, this.numberPage);
        this.view.showElements(items);
        this.view.showCountersAndButtons(this.countAll, this.countCompleted, 
            this.toggleButtons, this.allCheckboxButton);

        localStorage.setItem('todo',JSON.stringify(this.todoList));
        localStorage.setItem('allCheckboxButton',JSON.stringify(this.allCheckboxButton));
        localStorage.setItem('toggleButtons', this.toggleButtons);
        localStorage.setItem('numberPage',JSON.stringify(this.numberPage));
    }

    editElement($this, task){
        let i = this.todoList.findIndex(x => x.todoId === $this.closest('li').attr('id'));
        this.todoList[i].todo = task;
        this.view.showEdit($this);
        localStorage.setItem('todo',JSON.stringify(this.todoList));
    }
}

class TodoController{
    constructor (model, view) {
        this.view = view;
        this.model = model;
    }
    clickBtnAdd(event){
        event.preventDefault();
        let newTask = $('#new-task').val();
        if(newTask == 0) return;
        $('#new-task').val('');
		this.model.addAndRemoveElement(0, newTask);
    }
	clickBtnRemove($this) {
		let id = $this.closest('li').attr('id');
		this.model.addAndRemoveElement(id, '');
	}
	clickBtnComplet($this) {
		let id = $this.closest('li').attr('id');
		this.model.setButtons(id, 1, 0);
    }
    clickBtnToggle($this){
        let toggleButtons = $this.attr('value');
        this.model.setButtons(0, toggleButtons, 0);
    }
    clickBtnAllCheckbox(){
        this.model.setButtons(0, 3, 0);
    }
    clickBtnClearCompleted(event){
        event.preventDefault();
        this.model.setButtons(0, 2, 0);
    }
    clickBtnPaginator(event, $this){
        event.preventDefault();
        let $a = $this;
        let numberPage = $a.text();
        this.model.setButtons(0, 4, numberPage);
    }
    dblclickElement($this){
        $this.next().val($this.text());
        this.view.showEdit($this);
    }
    blurElement($this){
        let text = $this.val();
        $this.prev().text(text);
        this.model.editElement($this, text);
    }
}
let data = {};
(function(){
    let todoList = [];
    let toggleButtons = 'all';
    let allCheckboxButton = false;
    let numberPage = 1;
    if(localStorage.getItem('todo') != undefined) {
        todoList = JSON.parse(localStorage.getItem('todo'));
        toggleButtons = localStorage.getItem('toggleButtons');
        allCheckboxButton = JSON.parse(localStorage.getItem('allCheckboxButton'));
        numberPage = JSON.parse(localStorage.getItem('numberPage'));
    }
    data.todoList = todoList;
    data.numberPage = numberPage;
    data.toggleButtons = toggleButtons;
    data.allCheckboxButton = allCheckboxButton;
    data.countAll = todoList.length;
    data.countCompleted =todoList.filter(function(obj) {
        return obj.completed === true;
    }).length;
}());
let view = new TodoView();
console.log(data);
let model = new TodoModel(view, data);
view.showElements(model.filterArray());
view.showCountersAndButtons(data.countAll, data.countCompleted, data.toggleButtons,
    data.allCheckboxButton);
view.showPaginator(data.countAll, data.numberPage);
data = null;
let controller = new TodoController(model, view);
let $list = $('.list');
$("#add").on('click', function (event){ controller.clickBtnAdd(event); });
$list.on('click','li .delete', function(){ controller.clickBtnRemove($(this)); });
$list.on('click','li input[type="checkbox"]',function(){ controller.clickBtnComplet($(this)); });
$('.footer-buttons').on('change','div input', function(){ controller.clickBtnToggle($(this)); });
$('.main-all-checkbox').on('click', function() { controller.clickBtnAllCheckbox(); });
$('#clear-completed').on('click', function(event){ controller.clickBtnClearCompleted(event); });
$('.paginator').on('click', 'a', function(event){ controller.clickBtnPaginator(event, $(this)) });
$list.on('dblclick','li div label', function(){ controller.dblclickElement($(this)); });
$list.on('blur','li div input[name="todo"]', function(){ controller.blurElement($(this)); });
$list.on('mouseover', 'li .line', function(){
	$(this).children().first().addBack('.delete').show();
});

$list.on('mouseout', 'li .line', function(){
    $(this).children().first().addBack('.delete').hide();
});