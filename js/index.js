let $list = $('.list');
let $footer = $('.footer');
let $allCheckbox = $('.main-all-checkbox');
let $clearCompleted = $('#clear-completed');
let $paginator = $('.paginator');
let todoList = [];
let index;
let toggleButtons = 'all';
let allCheckboxButton;
//let numberPage = 1;
let allPage;
//
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
    let out = '';
    let check;
    let classAdd;
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
    for(let i = 5*(numberPage-1);i < 5*numberPage && i < n; i++){ //i < 5*numberPage-1 &&
        if(array[i].completed){
            check = 'checked';
            classAdd = 'line-through';
        }else{
            check = '';
            classAdd = '';
        }
        out += _.template(tmp)({text : array[i].todo, id : array[i].todoId, 
            checked : check, className : classAdd});
    }
    $list.html(out);
    console.log(todoList);
    showCountersAndButtons();
}

function showPaginator(number){
    let out = '';
    let tmp = $('#paginator-element').html();
    let n = todoList.length/5;

    for(let i = 1; i <= n; i++){
        out += _.template(tmp)({id : i, number : i});
    }
        
    $paginator.html(out);
    $paginator.children().eq(number-1).addClass('current-page');
    console.log(numberPage);
}

function showLastPage(){
    let n = todoList.length/5;
    $paginator.find('#'+ numberPage).removeClass('current-page');
    numberPage = Math.floor(todoList.length/5);
    if(n > numberPage){
        numberPage++;
    showPaginator(numberPage);
    }
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
    //$li.remove();
    showPaginator();
    showElements();
    localStorage.setItem('todo',JSON.stringify(todoList));
    console.log(todoList);
    console.log(i);
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
    console.log(todoList);
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
    //console.log(check);
    showElements();
    $allCheckbox.removeClass('main-all-checkbox-marker');
    localStorage.setItem('todo',JSON.stringify(todoList));
    localStorage.setItem('allCheckboxButton',JSON.stringify(allCheckboxButton));
    //$(this).next().toggleClass('line-through');
    console.log(todoList);
});

$('.footer-buttons').on('change','div input', function(){
    toggleButtons = $(this).attr('value');
    showElements();
    localStorage.setItem('toggleButtons', toggleButtons);
    console.log($(this).attr('value'));
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
    console.log(array);
});

$clearCompleted.on('click', function(event){
    event.preventDefault();
    todoList = todoList.filter(function(obj) {
        return obj.completed === false;
    });
    showElements();
    localStorage.setItem('todo',JSON.stringify(todoList));
});

$paginator.on('click', 'a', function(event){
    let $a = $(this);
    let id = $a.attr('id');
    event.preventDefault();
    //currentPage = numberPage;
    numberPage = $a.text();
    //$(this).text(currentPage);
    showPaginator(numberPage);
    showElements();
    localStorage.setItem('numberPage',JSON.stringify(numberPage));
})

if(localStorage.getItem('todo') != undefined) {
    
    todoList = JSON.parse(localStorage.getItem('todo'));
    toggleButtons = localStorage.getItem('toggleButtons');
    allCheckboxButton = JSON.parse(localStorage.getItem('allCheckboxButton'));
    numberPage = JSON.parse(localStorage.getItem('numberPage'));
    if(allCheckboxButton) {
        $allCheckbox.addClass('main-all-checkbox-marker');
    }
    showPaginator(numberPage);
    showElements();
    console.log(toggleButtons);
}
