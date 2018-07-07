let $list = $('.list');
let $footer = $('.footer');
let $allCheckbox = $('.main-all-checkbox');
let $clearCompleted = $('#clear-completed');
let $paginator = $('.paginator');
let todoList = [];
let index;
let toggleButtons = 'all';
let allCheckboxButton;
let numberPage = 1;

function makeId(){
    return Math.random().toString(36).substr(2,16);
}

function showCountersAndButtons(){
    let n = todoList.length;
    
    if(n){
        $footer.show();
        $allCheckbox.show();
    }else{
        $footer.hide();
        $allCheckbox.hide();
    }
    let m = todoList.filter(function(obj){
        return obj.completed === true;
    }).length;

    (m === 0) ? $clearCompleted.hide() : $clearCompleted.show();

    $('#'+ toggleButtons).prop('checked',true);
    $('.all-items').text(n);
    $('.completed-items').text(m);
}

function showElements(){
    let html = '';
    let array;
    let n;
    let tmp = $('#line-template').html();
    switch(toggleButtons){
        case 'active': array = todoList.filter(function(obj){
                                    return obj.completed === false;
                                }); break;
        case 'completed': array = todoList.filter(function(obj){
                                    return obj.completed === true;
                                }); break;
        default: array = todoList;
    }
    n = array.length;
    showPaginator(n);
    
	let items = array.slice(5*(numberPage-1),5*numberPage);
	html = _.template(tmp)({items});
    $list.html(html);
    showCountersAndButtons();
    $('li .delete').hide();
$('li input[type="checkbox"]').hide();
}

function showPaginator(n){
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
    if(numberPage > Math.ceil(m)){
        numberPage--;
    }
	if(numberPage <= 0){
		numberPage = 1;
	}
    $paginator.children().eq(numberPage-1).addClass('current-page');
}

function showLastPage(){
    $paginator.find('#'+ numberPage).removeClass('current-page');
    numberPage = Math.ceil(todoList.length/5);

    $('.container a:last-child').addClass('current-page');
}

$("#add").on("click", function(event){
    event.preventDefault();
    let newTask = $('#new-task').val();
    if(newTask == 0) return;
    
    $('#new-task').val('');

    let todoObject = {
        todoId : makeId(),
        todo : newTask,
        completed : false
    };
    todoList.push(todoObject);
    showLastPage();
    showElements();
    localStorage.setItem('todo',JSON.stringify(todoList));
    localStorage.setItem('numberPage',JSON.stringify(numberPage));
    
    
});

$list.on('click','li .delete', function(){
    let $li = $(this).closest('li');
    let i = todoList.findIndex(x => x.todoId === $li.attr('id'));
    todoList.splice(i,1);
	allCheckboxButton = false;
	$allCheckbox.removeClass('main-all-checkbox-marker');
    showElements();
    localStorage.setItem('todo',JSON.stringify(todoList));
});
   
$list.on('dblclick','li div label', function(){
    let $Label = $(this);
    let $li = $(this).closest('li');
    let $Input = $Label.next();
    index = todoList.findIndex(x => x.todoId === $li.attr('id'));
    $Input.val(todoList[index].todo);
    $Label.parent().toggleClass('edit');
    $Input.focus();
});
    
$list.on('blur','li div input[name="todo"]', function(){
    let $Input = $(this);
    todoList[index].todo = $Input.val();
    $Input.prev().text(todoList[index].todo);
    $Input.parent().toggleClass('edit');
    showElements();
    localStorage.setItem('todo',JSON.stringify(todoList));
});

$list.on('click','li input[type="checkbox"]',function(){
    let $li = $(this).closest('li');
    let i = todoList.findIndex(x => x.todoId === $li.attr('id'));
    
    if(todoList[i].completed){
        todoList[i].completed = false;
    }else{
        todoList[i].completed = true;
    }
    allCheckboxButton = false;
    showElements();
    $allCheckbox.removeClass('main-all-checkbox-marker');
    localStorage.setItem('todo',JSON.stringify(todoList));
    localStorage.setItem('allCheckboxButton',JSON.stringify(allCheckboxButton));
});

$('.footer-buttons').on('change','div input', function(){
    toggleButtons = $(this).attr('value');
    showElements();
    localStorage.setItem('toggleButtons', toggleButtons);
});

$allCheckbox.on('click', function() {
    let array;

    if(allCheckboxButton) {
        todoList.forEach(function(obj) {
            obj.completed = false;
        });
        allCheckboxButton = false;
    }else{
        todoList.forEach(function(obj){
            obj.completed = true;
        });
        allCheckboxButton = true;
    }
    
    $allCheckbox.toggleClass('main-all-checkbox-marker');
    showElements();
    localStorage.setItem('allCheckboxButton',JSON.stringify(allCheckboxButton));
    localStorage.setItem('todo',JSON.stringify(todoList));
});

$clearCompleted.on('click', function(event){
    event.preventDefault();
    todoList = todoList.filter(function(obj) {
        return obj.completed === false;
    });
	allCheckboxButton = false;
	$allCheckbox.removeClass('main-all-checkbox-marker');
    showElements();
    localStorage.setItem('todo',JSON.stringify(todoList));
});

$paginator.on('click', 'a', function(event){
    let $a = $(this);
    let id = $a.attr('id');
    event.preventDefault();
    numberPage = $a.text();
    showElements();
    localStorage.setItem('numberPage',JSON.stringify(numberPage));
});



$list.on('mouseover', 'li .line', function(){
    $(this).find('.delete').show();
    $(this).find('input[type="checkbox"]').show();
});

$list.on('mouseout', 'li .line', function(){
    $(this).find('.delete').hide();
    $(this).find('input[type="checkbox"]').hide();
});

if(localStorage.getItem('todo') != undefined) {
    
    todoList = JSON.parse(localStorage.getItem('todo'));
    toggleButtons = localStorage.getItem('toggleButtons');
    allCheckboxButton = JSON.parse(localStorage.getItem('allCheckboxButton'));
    numberPage = JSON.parse(localStorage.getItem('numberPage'));
    if(allCheckboxButton) {
        $allCheckbox.addClass('main-all-checkbox-marker');
    }
    showElements();
}