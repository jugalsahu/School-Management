// add field

$(document).ready(function () {
    $(".add_field_btn").click(function () {
        var add_element = `
        <div class="input-group mb-4">
        <input type="text" name="course-name" class="form-control border border-2 course_name" placeholder="Hostel Fee">
        <input type="text" name="course-fee" class="form-control border border-2 course_fee" placeholder="500">
        <span class="input-group-text bg-warning">Monthly</span>
        </div>
        `;

        $(".add_field_area").append(add_element);
    });
});

//set fee

$(document).ready(function () {
    $(".set_fee_btn").click(function () {
        var class_name = $(".class_name").val();
        var course_name = [];
        var course_fee = [];
        var i;
        $(".course_name").each(function (i) {
            course_name[i] = $(this).val();
        });
        $(".course_fee").each(function (i) {
            course_fee[i] = $(this).val();
        });

        var fee_object = {
            class_name: class_name,
            course_name: course_name,
            course_fee: course_fee,
        };
        // store data in database 
        var db_name = sessionStorage.getItem("db_name");
        var database = window.indexedDB.open(db_name);
        database.onsuccess = function (event) {
            var idb = event.target.result;
            var permission = idb.transaction("fee", "readwrite");
            var access = permission.objectStore("fee");
            var fee_object_store = access.add(fee_object);
            fee_object_store.onsuccess = function () {
                alert("success");
            };
            fee_object_store.onerror = function () {
                alert("failed");
            };
        };
    });
});

// show fee 

$(document).ready(function () {
    $("#fee_menu").click(function () {
        $("#show_fee_modal_body").html('');
        $("#fee_modal").modal("show");
        var db_name = sessionStorage.getItem("db_name");
        var database = window.indexedDB.open(db_name);
        database.onsuccess = function (event) {
            var idb = event.target.result;
            var permission = idb.transaction("fee", "readwrite");
            var access = permission.objectStore("fee");
            var get_all_keys = access.getAllKeys();
            get_all_keys.onsuccess = function () {
                var keys = this.result;
                for (var item of keys) {
                    var key_data = access.get(item);
                    key_data.onsuccess = function () {
                        var fee = this.result;
                        var ul = document.createElement("ul");
                        ul.className = "nav nav-tabs";
                        var li = document.createElement("li");
                        li.className = "nav-item";
                        var a = document.createElement("a");
                        a.classList = "nav-link active";
                        a.href = "#";
                        a.innerHTML = `Class - ${fee.class_name}`;
                        li.append(a);
                        ul.append(li);
                        $("#show_fee_modal_body").append(ul);
                        // create th for course name
                        var table = document.createElement("table");
                        table.className = "table border-start border-end border-bottom text-center";
                        var tr_for_th = document.createElement("tr");
                        var tr_for_td = document.createElement("tr");
                        for (var courseName of fee.course_name) {
                            var th = document.createElement("th");
                            th.className = "border-0";
                            th.innerHTML = courseName;
                            tr_for_th.append(th);
                        };
                        var th_edit = document.createElement("th");
                        th_edit.className = "border-0";
                        th_edit.innerHTML = "edit";
                        tr_for_th.append(th_edit);

                        var th_delete = document.createElement("th");
                        th_delete.className = "border-0";
                        th_delete.innerHTML = "delete";
                        tr_for_th.append(th_delete);

                        // create td for course fee

                        for (var courseFee of fee.course_fee) {
                            var td = document.createElement("td");
                            td.className = "border-0";
                            td.innerHTML = courseFee;
                            tr_for_td.append(td);
                        }

                        // edit fee table
                        var td_edit_icon = document.createElement("td");
                        td_edit_icon.className = "border-0";
                        td_edit_icon.innerHTML = `<span class="bi bi-pencil-square"></span>`;
                        tr_for_td.append(td_edit_icon);
                        
                        td_edit_icon.onclick = function(){
                            var table = this.parentElement.parentElement;
                            var ul = table.previousSibling;
                           var a = ul.getElementsByTagName("a");
                            var class_name = a[0].innerHTML.split(" ");
                            $(".class_name").val(class_name[2]);
                            var tr = table.getElementsByTagName("tr");
                            var th = tr[0].getElementsByTagName("th");
                            var td = tr[1].getElementsByTagName("td");
                            var course_name = document.getElementsByClassName("course_name");
                            var course_fee = document.getElementsByClassName("course_fee");
                            course_name[0].parentElement.remove();
                            var i;
                            for(i=0;i<th.length-2;i++)
                            {
                                $(".add_field_btn").click();
                                course_name[i].value = th[i].innerHTML ;
                                course_fee[i].value = td[i].innerHTML;
                            }
                            $("#fee_modal").modal("hide");
                            
                        };


                        // delete fee table 
                        var td_delete_icon = document.createElement("td");
                        td_delete_icon.className = "border-0";
                        td_delete_icon.innerHTML = `<span class="bi bi-trash-fill"></span>`;
                        tr_for_td.append(td_delete_icon);

                        td_delete_icon.onclick = function(){
                            var ul = this.parentElement.parentElement.previousSibling;
                            var a = ul.getElementsByTagName("a");
                            var key_name_width_number = a[0].innerHTML;
                            var key_name = key_name_width_number.split(" ");
                            var db_name = sessionStorage.getItem("db_name");
                            var database = window.indexedDB.open(db_name);
                            database.onsuccess = function(event){
                                var idb = event.target.result;
                                var permission =  idb.transaction("fee","readwrite"); 
                                var  access = permission.objectStore("fee");
                                var delete_notice = access.delete(key_name[2]);
                                delete_notice.onsuccess = function(){
                                    alert("success");
                                    td_delete_icon.parentElement.parentElement.previousSibling.remove();
                                    td_delete_icon.parentElement.parentElement.remove();
                                };
                            };
                        };

                        table.append(tr_for_th);
                        table.append(tr_for_td);
                        $("#show_fee_modal_body").append(table);
                    };
                };
            };
        };
    });
});