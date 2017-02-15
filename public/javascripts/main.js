$(document).ready(function(){
    const pre = Prelodr();
    var next = 1;
    $(".add-more").click(function(e){
        e.preventDefault();
        var addto = "#field" + next;
        var addRemove = "#field" + (next);
        next = next + 1;
        var newIn = '<input autocomplete="off" class="input form-control text" id="field' + next + '" name="field' + next + '" type="text" placeholder="Link goes here">';
        var newInput = $(newIn);
        var removeBtn = '<button id="remove' + (next - 1) + '" class="btn btn-danger remove-me" >-</button></div><div id="field">';
        var removeButton = $(removeBtn);
        $(addto).after(newInput);
        $(addRemove).after(removeButton);
        $("#field" + next).attr('data-source',$(addto).attr('data-source'));
        $("#count").val(next);  
        
            $('.remove-me').click(function(e){
                e.preventDefault();
                var fieldNum = this.id.charAt(this.id.length-1);
                var fieldID = "#field" + fieldNum;
                $(this).remove();
                $(fieldID).remove();
            });
    })

    $("#minify-button").click(function(){
        pre.show('Please wait it will take a while...');
        var ele = document.getElementsByClassName('text');
        var urls = [];
        for(var i=0;i < ele.length;i++){
            urls.push(ele[i].value);
        }
        var d = {
            "links" : urls
        }
          var xhr = new XMLHttpRequest();
          xhr.open("post", "http://localhost:3000/users/minify", true);
          xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

          

            xhr.onreadystatechange = function() {//Call a function when the state changes.
                if(xhr.readyState == 4 && xhr.status == 200) {
                    console.log(xhr.responseText);
                    window.open('http://localhost:3000/users/downloadFile');
                }
            }
            // send the collected data as JSON
          xhr.send(JSON.stringify(d));


          xhr.onloadend = function () {
           
            // done
           pre.hide();
          };
    })


    
});
