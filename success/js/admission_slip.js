//
$(document).ready(function () {
    var db_name = sessionStorage.getItem("db_name");
    var a_no = sessionStorage.getItem("a_no");
    $(".school_name").html(db_name);
    var database = window.indexedDB.open(db_name);
    database.onsuccess = function (event) {
        var idb = event.target.result;
        var permission = idb.transaction("about_school", "readwrite");
        var access = permission.objectStore("about_school");
        var check_data = access.get(db_name);
        check_data.onsuccess = function (event) {
            var data = event.target.result;
            $(".tag_line").html(data.tag_line);
            $(".btn_call").html(`OFFICE CELL : ${data.mobile_number}, &nbsp;${data.phone_number}`);
            $(".address_office").html(`VENUE : ${data.address}`);
        };
        var s_permission = idb.transaction("admission", "readwrite");
        var s_access = s_permission.objectStore("admission");
        var check_admission = s_access.get(parseInt(a_no));
        check_admission.onsuccess = function (event) {
            var data = event.target.result;
            if (data) {
                var image = new Image();
                image.src = data.pic;
                image.width = "150";
                image.height = "150";
                $(".pic").html(image);
                $(".candidate_name").html(data.s_name);
                $(".dob").html(data.dob);
                $(".gender").html(data.gender);
                $(".ad_date").html(data.doa);
                $(".f_name").html(data.f_name);
                $(".admit_in").html(data.admit_in);
                $(".m_name").html(data.m_name);
                $(".mobile_one").html(data.mobile_one);
                $(".mobile_two").html(data.mobile_two);
                $(".address").html(data.address);
                console.log(data);
            }
            else{
                alert("student not found");
            }
        };
    };
});

