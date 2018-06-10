var Count = 0;
var CountActive = 0;
var MyValue;
var $MyDelete;

document.getElementById('create').oninput = function(){
    document.getElementById('create').innerHTML = document.getElementById('create').value;
}

$("button").on("click", function(){ 
    MyValue = $("#create").text();
    if(MyValue == 0) return;

    $(".notes").append("<div>");
    var $MyDivLastChild = $(".notes > div:last-child");
    $MyDivLastChild.addClass("row justify-content-center list");
    $MyDivLastChild.append("<input>");
    $MyDivLastChild.find("input:last-child").attr("type","checkbox");
    $MyDivLastChild.find("input:last-child").addClass("col-md-1 align-self-center");
    $MyDivLastChild.append("<input>");
    $MyDivLastChild.find("input:last-child").attr({"name":"todo", "type":"text", "value":MyValue});
    $MyDivLastChild.find("input:last-child").prop("disabled", true);
    $MyDivLastChild.find("input:last-child").wrap('<div class="wrapper col-md-11"></div>');
    $MyDivLastChild.find(".wrapper").append("<div>");
    $(".wrapper div").addClass("delete");
    //$(".notes > div:last-child").addClass("row justify-content-center list");
    //$(".notes > div:last-child").append("<input>");
    //$(".notes > div:last-child input:last-child").attr("type","checkbox");
    //$(".notes > div:last-child input:last-child").addClass("col-md-1 align-self-center");
    //$(".notes > div:last-child").append("<input>");
    //$(".notes > div:last-child input:last-child").attr({"name":"todo", "type":"text", "value":MyValue});
    /*$(".notes div:last-child input:last-child").addClass("col-md-11");*/
    //$(".notes > div:last-child input:last-child").prop("disabled", true);
    //$(".notes > div:last-child input:last-child").wrap('<div class="wrapper col-md-11"></div>');
    //$(".notes > div:last-child .wrapper").append("<div>");
    //$Myinput.append("<input>");
    
    //$(".notes input:last-child").attr({"name":"todo", "type":"text", "value":MyValue});
    //$(".notes input:last-child").prop("disabled", true);

    $(".wrapper").on("dblclick", function(event){
        var target = event.target;
        target.removeAttribute('disabled');
        target.setAttribute('name','edit');
        if(window.getSelection()){
            window.getSelection().removeAllRanges();
        }
        $('input[name="edit"] + div').hide();
        //$MyDelete = $('input[name="edit"] + div').detach();
        //$('input[name="todo"]').prop("disabled", false);
        //alert("Hello");
        //target.setAttribute('autofocus', true);
    });

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
    //$(".notes input:last-child").prop("disabled", true);
    $("#create").text("");
    document.getElementById('create').value='';
    Count++;
});



console.log(MyValue);