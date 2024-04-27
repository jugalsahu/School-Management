// Browser compatibility
window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
// RedWrite permission
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.mozIDBTransaction || window.msIDBTransaction;
// Key Permission
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.mozIDBKeyRange || window.msIDBKeyRange

if (!window.indexedDB) {
    document.write("Please update your borwser");
}
else {
    $(function () {
        $("#register_form").on("submit", function () {
            var check_database = window.indexedDB.databases();
            check_database.then(function (db_list) {
                if (db_list.length == 0) {
                    register();
                }
                else {
                    $("#msg_box1").removeClass("d-none").addClass("alert-warning")
                    $("#msg_box1 span").html(`
                    <b>Registration Failed !</b> 
                    <a href='#' style='color:blue;font-weight:bold; text-decoration:none;'>Please purchage muti version</a> 
                    <span class="ms-4 bi bi-trash-fill" data-bs-toggle="tooltip" data-bs-placement="bottom" title="To manage another school record please delete currently used school database" id="tooltip_id"></span>
                    `);
                    $("#tooltip_id").tooltip();
                    $("#tooltip_id").click(function () {
                        $("#confirm").modal('show');
                        $("#delete_btn").click(function () {
                            var all_db = window.indexedDB.databases()
                            all_db.then(function (all_db_list) {
                                var verify_delete = window.indexedDB.deleteDatabase(all_db_list[0].name);
                                verify_delete.onsuccess = function () {
                                    $("#register_form").trigger("reset");
                                    $("#msg_box1").addClass("d-none");
                                    $(".delete_modal_msg").html("");
                                    $(".delete_success_alert").removeClass("d-none");
                                };
                            });
                        });
                    });
                }
            });
            return false;
        });

        function register() {
            var school_name = $("#school_name").val();
            var tag_line = $("#tag_line").val();
            var email_id = $("#email_id").val();
            var password = $("#password").val();
            var website_name = $("#website_name").val();
            var mobile_number = $("#mobile_number").val();
            var phone_number = $("#phone_number").val();
            var address = $("#address").val();
            // create database
            var database = window.indexedDB.open(school_name);
            database.onsuccess = function () {

                $("#msg_box").removeClass("d-none");
                $("#msg_box").addClass("alert-success");
                $("#msg_box span").html(`<strong>Success !</strong> Dear admin please login...`);
                $("#register_form").trigger("reset");
                setTimeout(() => {
                    $("#msg_box").addClass("d-none");
                    $(".nav-link[href='#login']").click();
                }, 2000);

            };

            database.onerror = function () {
                $("#msg_box").removeClass("d-none");
                $("#msg_box").addClass("alert-warning");
                $("#msg_box").html(`<strong>Oops !</strong> Something went wronge...`);
            }

            database.onupgradeneeded = function () {
                var data = {
                    school_name: school_name,
                    tag_line: tag_line,
                    email_id: email_id,
                    password: password,
                    website_name: website_name,
                    mobile_number: mobile_number,
                    phone_number: phone_number,
                    address: address
                }
                var idb = this.result;
                var object = idb.createObjectStore("about_school", { keyPath: "school_name" });
                idb.createObjectStore("fee", { keyPath: "class_name" });
                idb.createObjectStore("admission", { autoIncrement: true });
                object.add(data);
            }
        }
    });
}

// login 

$(() => {
    $("#login_form").submit(function () {
        var username = $("#username").val();
        var password = $("#login_password").val();
        var login_data = {
            username: username,
            password: password,
        };
        var json_data = JSON.stringify(login_data);
        sessionStorage.setItem("login", json_data);
        if (sessionStorage.getItem("login") != null) {
            //find users from database
            var user_database = window.indexedDB.databases();
            user_database.then((pending_obj) => {
                for (var item of pending_obj) {
                    var db_name = item.name;
                    // session storage
                    sessionStorage.setItem("db_name", db_name);
                    var database = window.indexedDB.open(db_name, 1); // Specifying version as 1
                    database.onerror = function (event) {
                        console.error("Error opening database", event.target.error);
                    };
                    database.onsuccess = function (event) {
                        var idb = event.target.result;
                        var permission = idb.transaction("about_school", "readwrite");
                        var access = permission.objectStore("about_school");
                        var json_data = access.get(db_name);
                        json_data.onsuccess = function () {
                            var user = this.result;
                            if (user) {
                                var db_username = user.email_id;
                                var db_password = user.password;
                                var session_data = JSON.parse(sessionStorage.getItem("login"));
                                if (session_data.username == db_username) {
                                    if (session_data.password == db_password) {

                                        window.location = "./success/welcome.html";
                                    }
                                    else {
                                        $("#login_msg_box").removeClass("d-none").addClass("alert-danger")
                                        $("#login_msg_box span").html("<b>Wronge Password </b> please try again..");
                                        setTimeout(() => {
                                            $("#login_msg_box").addClass("d-none");
                                            $("#login_form").trigger("reset");
                                        }, 2000);
                                    }
                                }
                                else {
                                    $("#login_msg_box").removeClass("d-none").addClass("alert-danger")
                                    $("#login_msg_box span").html("<b>User Not found !</b> please try again..");
                                    setTimeout(() => {
                                        $("#login_msg_box").addClass("d-none");
                                        $("#login_form").trigger("reset");
                                    }, 2000);
                                }
                            }
                            else {
                                alert("user not found");
                            }
                        };
                    };
                }
            });
        }
        else {

            $("#login_msg_box").removeClass("d-none").addClass("alert-danger")
            $("#login_msg_box span").html("<b>Session failed !</b> please try again..");
            setTimeout(() => {
                $("#login_msg_box").addClass("d-none");
                $("#login_form").trigger("reset");
            }, 2000);
        }

        return false;
    });
});