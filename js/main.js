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
                $("#msg_box").append(`<strong>Success !</strong> Dear admin please login...`);
                $("#register_form").trigger("reset");
                setTimeout(() => {
                    $("#msg_box").addClass("d-none");
                    $(".nav-link[href='#login']").click();
                }, 2000);

            };

            database.onerror = function () {
                $("#msg_box").removeClass("d-none");
                $("#msg_box").addClass("alert-warning");
                $("#msg_box").append(`<strong>Oops !</strong> Something went wronge...`);
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
                object.add(data);
            }

            return false;
        });
    });
}

// login 

$(()=>{
    $("#login_form").on("submit",function(){
       
    });
});