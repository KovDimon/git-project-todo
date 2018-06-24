var Count = 0;
var CountActive = 0;
var MyValue;
var $MyDelete;
var $List = $('.list');
var todoList = [];
var index;

function doId(){
    return Math.random().toString(36).substr(2,16);
}

function element(elementText,numberId){
    var tmp = '<li id="<%-id%>"class="row justify-content-center">\
    <div class="row align-items-center line">\
        <input type="checkbox">\
        <label><%-text%></label>\
        <input name="todo" type="text">\
        <div class="delete"></div>\
    </div>\
</li>';
$List.append(_.template(tmp)({text : elementText, id : numberId}));
}

function selectElementToArray(array,id){
    for(var i = 0; i < array.length; i++){
        if(id != array[i].todoId) continue;
        break;
    }
    return i;
    
}
function createNewElement(){
    var MyNewTask = document.getElementById('new-task').value;
    if(MyNewTask == 0) return;
    
    document.getElementById('new-task').value='';

    var i = todoList.length;
    var todoObject = {
        todoId : doId(),
        todo : MyNewTask,
        check : false
    };
    todoList[i] = todoObject;
    element(todoList[i].todo, todoList[i].todoId);
    
console.log(todoList);
}

$("button").on("click", createNewElement);
$(document).keypress(function(event){

    if(event.which == 13){
        createNewElement();
    }
});

$List.on('click','li .delete', function(){
    var $li = $(this).closest('li');
    var i = selectElementToArray(todoList,$li.attr('id'));
    todoList.splice(i,1);
    $li.remove();
    console.log(todoList);
    console.log(i);
});
   
$List.on('dblclick','li div label', function(){
    var $Label = $(this);
    var $li = $(this).closest('li');
    var $Input = $Label.next();
    index = selectElementToArray(todoList,$li.attr('id'));

    $Input.val(todoList[index].todo);
    $Label.parent().toggleClass('edit');
    $Input.focus();
});
    
$List.on('blur','li div input', function(){
    var $Input = $(this);
    todoList[index].todo = $Input.val();
    $Input.prev().text(todoList[index].todo);
    $Input.parent().toggleClass('edit');
    console.log(todoList);
});

$List.on('click','li input[type="checkbox"]',function(){
    var $li = $(this).closest('li');
    var i = selectElementToArray(todoList,$li.attr('id'));
    todoList[i].check = 'true';
    $(this).next().toggleClass('line-through');
    console.log(todoList);
});




        /*var target = $(this).;
        target.removeAttribute('disabled');
        target.setAttribute('name','edit');
        if(window.getSelection()){
            window.getSelection().removeAllRanges();
        }
        $('input[name="edit"] + div').hide();*/
        //$MyDelete = $('input[name="edit"] + div').detach();
        //$('input[name="todo"]').prop("disabled", false);
        //alert("Hello");
        //target.setAttribute('autofocus', true);
        
/*
    $('input[name="todo"]').on("blur", function(){
        $('input[name="edit"]').prop("disabled", true);
        $('input[name="edit"] + div').show();
        //$MyDelete.insertAfter('input[name="edit"]');
        $('input[name="edit"]').attr("name","todo");
        //alert("Hello");
    });

    $(".delete").on("click", function(event){
        var target = event.target;
        MyDelete=target.closest('.list');
        console.log(document.getElementsByClassName('input')[0]);
        MyDelete.remove();
    });

    $('input[type="checkbox"]').on("click", function(event){
        var target = event.target;
        var MyDecoration=target.closest('.list');
        if(target.checked){
            MyDecoration.children[1].children[0].classList.add('list-input-text-style');
        }else{
            MyDecoration.children[1].children[0].classList.remove('list-input-text-style');
        }
        console.log(MyDecoration.children);
        return false;
    });

    $(".all-checkbox").on("click", function(){
        var MyAllCheckbox = document.getElementsByClassName('all-checkbox')[0];
        if(MyAllCheckbox.classList.contains("all-checkbox-marker")){
            //$MyAllCheckbox.removeClass("all-checkbox-marker");
           // $(".all-checkbox").removeClass("all-checkbox-marker");
            $('input[type="checkbox"]').prop("checked", false);
        }else{
            //$MyAllCheckbox.addClass("all-checkbox-marker");
            //$(".all-checkbox").addClass("all-checkbox-marker");
            $('input[type="checkbox"]').prop("checked", true);
        }
        MyAllCheckbox.classList.toggle("all-checkbox-marker");
        $('input[type="checkbox"]').trigger("click");
        return false;
    });    

    //document.getElementsByClassName('wrapper').onsele

    $(".wrapper").on("mousedown", function(){
        //return false;
    });

    
    /*document.getElementsByName('todo')[Count].ondblclick = function(){
        alert("Hello");
    }*/
    //$(".notes input:last-child").prop("disabled", true);*/
    /*$("#create").text("");
    document.getElementById('create').value='';
    Count++;*/
