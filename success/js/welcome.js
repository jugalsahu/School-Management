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
            var fee_object_store = access.put(fee_object);
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

                        td_edit_icon.onclick = function () {
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
                            for (i = 0; i < th.length - 2; i++) {
                                $(".add_field_btn").click();
                                course_name[i].value = th[i].innerHTML;
                                course_fee[i].value = td[i].innerHTML;
                            }
                            $("#fee_modal").modal("hide");
                            $(".set_fee").addClass("animate__animated animate__rubberBand");

                        };


                        // delete fee table 
                        var td_delete_icon = document.createElement("td");
                        td_delete_icon.className = "border-0";
                        td_delete_icon.innerHTML = `<span class="bi bi-trash-fill"></span>`;
                        tr_for_td.append(td_delete_icon);

                        td_delete_icon.onclick = function () {
                            var ul = this.parentElement.parentElement.previousSibling;
                            var a = ul.getElementsByTagName("a");
                            var key_name_width_number = a[0].innerHTML;
                            var key_name = key_name_width_number.split(" ");
                            var db_name = sessionStorage.getItem("db_name");
                            var database = window.indexedDB.open(db_name);
                            database.onsuccess = function (event) {
                                var idb = event.target.result;
                                var permission = idb.transaction("fee", "readwrite");
                                var access = permission.objectStore("fee");
                                var delete_notice = access.delete(key_name[2]);
                                delete_notice.onsuccess = function () {
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

// retrive class name

$(document).ready(function () {
    var db_name = sessionStorage.getItem("db_name");
    var database = window.indexedDB.open(db_name);
    database.onsuccess = function (event) {
        var idb = event.target.result;
        var permission = idb.transaction("fee", "readwrite");
        var access = permission.objectStore("fee");
        var key_name = access.getAllKeys();
        key_name.onsuccess = function (event) {
            var keys = event.target.result;
            for (var key_item of keys) {
                var option = document.createElement("option");
                option.value = key_item;
                option.innerHTML = key_item;
                $(".class_select").append(option);
            }
            for (var key_item of keys) {
                var option = document.createElement("option");
                option.value = key_item;
                option.innerHTML = key_item;
                $(".find-student").append(option);
            }
        };
    };
});

// upload and preview image

$(document).ready(function () {
    $(".upload_pic").on("change", function () {

        var file = this.files[0];
        var url = URL.createObjectURL(file);
        $(".show_pic").attr("src", url);
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (event) {
            sessionStorage.setItem("upload_pic", event.target.result);
        };

    });
});

// admission students

$(document).ready(function () {
    $(".Admit_btn").click(function () {
        var a_no, i, max = 0;
        var db_name = sessionStorage.getItem("db_name");
        var database = window.indexedDB.open(db_name);
        database.onsuccess = function (event) {
            var idb = event.target.result;
            var permission = idb.transaction("admission", "readwrite");
            var access = permission.objectStore("admission");
            var key_name = access.getAllKeys();
            key_name.onsuccess = function (event) {
                var keys_array = event.target.result;
                if (keys_array.length == 0) {
                    a_no = 1;
                }
                else {
                    for (i = 0; i < keys_array.length; i++) {
                        var number = Number(keys_array[i]);
                        if (number > max) {
                            max = number;
                        }
                    }
                    a_no = max + 1;
                }

                var date = new Date($(".dob").val());
                var dob_day = date.getDate();
                var dob_month = date.getMonth() + 1;
                var dob_year = date.getFullYear();
                var dob = `${dob_day}/${dob_month}/${dob_year}`;
                var c_date = new Date();
                var doa_day = c_date.getDate();
                var doa_month = c_date.getMonth() + 1;
                var doa_year = c_date.getFullYear();
                var doa = `${doa_day}/${doa_month}/${doa_year}`;

                if (sessionStorage.getItem("upload_pic") != null) {
                    var admission = {
                        adm_no: a_no,
                        s_name: $(".s_name").val(),
                        f_name: $(".f_name").val(),
                        m_name: $(".m_name").val(),
                        dob: dob,
                        gender: $(".gender").val(),
                        mobile_one: $(".number_one").val(),
                        mobile_two: $(".number_two").val(),
                        class: $(".class_select").val(),
                        admit_in: $(".admit_in").val(),
                        address: $(".address").val(),
                        doa: doa,
                        pic: sessionStorage.getItem("upload_pic"),
                        invoice: [],
                    };
                    sessionStorage.removeItem("upload_pic");
                    var db_name = sessionStorage.getItem("db_name");
                    var database = window.indexedDB.open(db_name);
                    database.onsuccess = function (event) {
                        var idb = event.target.result;
                        var permission = idb.transaction("admission", "readwrite");
                        var access = permission.objectStore("admission")
                        var check_admission = access.add(admission);
                        check_admission.onsuccess = function () {
                            var alerts = `
                            <div class="alert alert-success alert-dismissible fade show" role="alert">
                            <b>Admission Success</b> <a href="admission_slip.html">Get Admission Document</a>
                            <button type="button" class="btn-close" data-bs-dismiss="alert">
                            </button>
                            </div>
                            `;
                            $(".admit_notice").html(alerts);
                            adm_no();
                        };

                        check_admission.error = function () {
                            var alerts = `
                            <div class="alert alert-warnig alert-dismissible fade show" role="alert">
                            <b>Admission Failed</b>
                            <button type="button" class="btn-close" data-bs-dismiss="alert">
                            </button>
                            </div>
                            `;
                            $(".admit_notice").html(alerts);
                        };
                    };
                }
                else {
                    alert("Please upload student pic");

                }

            };
        };
    });
});

// sidebar school management

$(document).ready(function () {
    var db_name = sessionStorage.getItem("db_name");
    document.querySelector(".school_name").innerHTML = db_name.toUpperCase();
    var database = window.indexedDB.open(db_name);
    database.onsuccess = function (event) {
        var idb = event.target.result;
        var permission = idb.transaction("about_school", "readwrite");
        var access = permission.objectStore("about_school");
        var check_data = access.get(db_name);
        check_data.onsuccess = function (event) {
            var schol_imformation = event.target.result;
            $(".tag_line").html(schol_imformation.tag_line);
        }
    };
});

// admission number
function adm_no() {
    var max_no = 0;
    var db_name = sessionStorage.getItem("db_name");
    var database = window.indexedDB.open(db_name);
    database.onsuccess = function (event) {
        var idb = event.target.result;
        var permission = idb.transaction("admission", "readwrite");
        var access = permission.objectStore("admission");
        var check_data = access.getAllKeys();
        check_data.onsuccess = function (event) {
            var keys_array = event.target.result;
            for (var keys_item of keys_array) {
                if (keys_item > max_no) {
                    max_no = keys_item;
                }
            }
            var a_no = max_no + 1;
            sessionStorage.setItem("a_no", max_no);
            $(".a_no").html(`A/NO : ${a_no}`);
        };
    };
};

adm_no();

// find students

$(document).ready(function () {
    $(".find_btn").click(function () {
        var a_no = $(".find_admission_number").val();
        sessionStorage.setItem("a_no", a_no);
        window.location = "admission_slip.html";
    });
});

// show director signature and logo 
$(document).ready(function () {
    var db_name = sessionStorage.getItem("db_name");
    var database = window.indexedDB.open(db_name);
    database.onsuccess = function (event) {
        var idb = event.target.result;
        var permission = idb.transaction("about_school", "readwrite");
        var access = permission.objectStore("about_school");
        var check_data = access.get(db_name);
        check_data.onsuccess = function (event) {
            var data = event.target.result;
            if (data.director_signature == "") {
                $(".d_sign_input").removeClass("d-none");
            }
            else {
                $(".d_sign_con").removeClass("d-none");
                var signature = data.director_signature;
                var image = new Image();
                image.src = signature;
                image.width = "150";
                image.height = "50";
                $(".d_sign").html(image);
            }
        };
    };
});

// upload director signature
$(document).ready(function () {
    $("#diresctor").on("change", function () {
        var file = this.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (event) {
            var signature = event.target.result;
            var db_name = sessionStorage.getItem("db_name");
            var database = window.indexedDB.open(db_name);
            database.onsuccess = function (event) {
                var idb = event.target.result;
                var permission = idb.transaction("about_school", "readwrite");
                var access = permission.objectStore("about_school");
                var check_data = access.get(db_name);
                check_data.onsuccess = function () {
                    var data = this.result;
                    data.director_signature = signature;
                    var updatee = access.put(data); /*update a single data you have to assign data before put() method*/
                    updatee.onsuccess = function () {
                        window.location = location.href;
                    };
                    updatee.onerror = function () {
                        alert("signature update failed");
                    };
                };
            };
        };
    });
});


// delete director signature
$(document).ready(function () {
    $(".d_sign_icon").on("click", function () {
        var db_name = sessionStorage.getItem("db_name");
        var database = window.indexedDB.open(db_name);
        database.onsuccess = function (event) {
            var idb = event.target.result;
            var permission = idb.transaction("about_school", "readwrite");
            var access = permission.objectStore("about_school");
            var check_data = access.get(db_name);
            check_data.onsuccess = function () {
                var data = this.result;
                data.director_signature = "";
                var updatee = access.put(data); /*update a single data you have to assign data before put() method*/
                updatee.onsuccess = function () {
                    window.location = location.href;
                };
                updatee.onerror = function () {
                    alert("signature update failed");
                };
            };
        };
    });
});


// show princiapl signature and logo 
$(document).ready(function () {
    var db_name = sessionStorage.getItem("db_name");
    var database = window.indexedDB.open(db_name);
    database.onsuccess = function (event) {
        var idb = event.target.result;
        var permission = idb.transaction("about_school", "readwrite");
        var access = permission.objectStore("about_school");
        var check_data = access.get(db_name);
        check_data.onsuccess = function (event) {
            var data = event.target.result;
            if (data.principal_signature == "") {
                $(".p_sign_input").removeClass("d-none");
            }
            else {
                $(".p_sign_con").removeClass("d-none");
                var signature = data.principal_signature;
                var image = new Image();
                image.src = signature;
                image.width = "150";
                image.height = "50";
                $(".p_sign").html(image);
            }
        };
    };
});

// upload principal signature
$(document).ready(function () {
    $("#principal").on("change", function () {
        var file = this.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (event) {
            var signature = event.target.result;
            var db_name = sessionStorage.getItem("db_name");
            var database = window.indexedDB.open(db_name);
            database.onsuccess = function (event) {
                var idb = event.target.result;
                var permission = idb.transaction("about_school", "readwrite");
                var access = permission.objectStore("about_school");
                var check_data = access.get(db_name);
                check_data.onsuccess = function () {
                    var data = this.result;
                    data.principal_signature = signature;
                    var updatee = access.put(data); /*update a single data you have to assign data before put() method*/
                    updatee.onsuccess = function () {
                        window.location = location.href;
                    };
                    updatee.onerror = function () {
                        alert("signature update failed");
                    };
                };
            };
        };
    });
});


// delete principal signature
$(document).ready(function () {
    $(".p_sign_icon").on("click", function () {
        var db_name = sessionStorage.getItem("db_name");
        var database = window.indexedDB.open(db_name);
        database.onsuccess = function (event) {
            var idb = event.target.result;
            var permission = idb.transaction("about_school", "readwrite");
            var access = permission.objectStore("about_school");
            var check_data = access.get(db_name);
            check_data.onsuccess = function () {
                var data = this.result;
                data.principal_signature = "";
                var updatee = access.put(data); /*update a single data you have to assign data before put() method*/
                updatee.onsuccess = function () {
                    window.location = location.href;
                };
                updatee.onerror = function () {
                    alert("signature update failed");
                };
            };
        };
    });
});

// upload school logo

$(document).ready(function () {
    $(".school_input").on("change", function () {
        var file = this.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (event) {
            var logo = event.target.result;
            var db_name = sessionStorage.getItem("db_name");
            var database = window.indexedDB.open(db_name);
            database.onsuccess = function (event) {
                var idb = event.target.result;
                var permission = idb.transaction("about_school", "readwrite");
                var access = permission.objectStore("about_school");
                var check_data = access.get(db_name);
                check_data.onsuccess = function (event) {
                    var data = event.target.result;
                    data.school_logo = logo;
                    var update = access.put(data);
                    update.onsuccess = function () {
                        window.location = location.href;
                    };
                    update.onerror = function () {
                        alert("update school logo failed");
                    };
                };
            };
        };
    });
});

// show school logo 
$(document).ready(function () {
    var db_name = sessionStorage.getItem("db_name");
    var database = window.indexedDB.open(db_name);
    database.onsuccess = function (event) {
        var idb = event.target.result;
        var permission = idb.transaction("about_school", "readwrite");
        var access = permission.objectStore("about_school");
        var check_data = access.get(db_name);
        check_data.onsuccess = function (event) {
            var data = event.target.result;
            if (data.school_logo != "") {
                var logo = data.school_logo;
                var image = new Image();
                image.src = logo;
                image.width = "110";
                image.height = "100";
                $(".show_picc").html(image);
            }
        };
    };
});

// invoice generate
$(document).ready(function () {
    $(".invoice_btn").click(function () {
        var a_no = Number($(".admission_number").val());
        //var invoice_date = $(".invoice_date").val();
        var invoice_date = new Date($(".invoice_date").val());
        var invoice_day = invoice_date.getDate();
        var invoice_month = invoice_date.getMonth() + 1;
        var invoice_year = invoice_date.getFullYear();
        var invoice_dob = `${invoice_day}/${invoice_month}/${invoice_year}`;
        var db_name = sessionStorage.getItem("db_name");
        var database = window.indexedDB.open(db_name);
        database.onsuccess = function (event) {
            var idb = event.target.result;
            var permission = idb.transaction("admission", "readwrite");
            var access = permission.objectStore("admission");
            var check_data = access.get(a_no);
            check_data.onsuccess = function (event) {
                var data = event.target.result;
                if (data) {
                    var class_name = data.class;
                    var fee_permission = idb.transaction("fee", "readwrite");
                    var fee_access = fee_permission.objectStore("fee");
                    var check_fee_data = fee_access.get(class_name);
                    check_fee_data.onsuccess = function (event) {
                        var fee_data = event.target.result;
                        if (fee_data) {
                            var invoice_no;
                            if (data.invoice.length == 0) {
                                invoice_no = 1;
                            }
                            else {
                                invoice_no = data.invoice.length + 1;

                            }
                            var invoice_data = {
                                invoice_no: invoice_no,
                                invoice_date: invoice_dob,
                                course_name: fee_data.course_name,
                                course_fee: fee_data.course_fee,
                            };
                            var update_permission = idb.transaction("admission", "readwrite");
                            var update_access = update_permission.objectStore("admission");
                            var update_check_data = update_access.get(a_no);
                            update_check_data.onsuccess = function (event) {
                                var update_object = event.target.result;
                                update_object.invoice.push(invoice_data);
                                var update = update_access.put(update_object);
                                update.onsuccess = function () {
                                    sessionStorage.setItem("invoice_a_no",a_no);
                                    window.location = "invoice.html";
                                };
                                update.onerror = function () {
                                    alert("Invoice Failed");
                                };
                            };
                        }
                        else {
                            alert("fee not found please set the fee")
                        };
                    };
                }
                else {
                    alert("student not found");
                }
            };
        }
    });
});

// find students by class

$(document).ready(function(){
    $(".find-student").on("change",function(){
        sessionStorage.setItem("student_class",this.value);
        window.location = "students.html";
    });
});
