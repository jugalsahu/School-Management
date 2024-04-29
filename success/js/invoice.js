$(document).ready(function () {
    var total = 0;
    var db_name = sessionStorage.getItem("db_name");
    var database = window.indexedDB.open(db_name);
    database.onsuccess = function (event) {
        var idb = event.target.result;
        var permission = idb.transaction("about_school", "readwrite");
        var access = permission.objectStore("about_school");
        var check_data = access.get(db_name);
        check_data.onsuccess = function (event) {
            var data = event.target.result;
            var logo_image = new Image();
            logo_image.src = data.school_logo;
            logo_image.width = "95";
            logo_image.height = "90";
            logo_image.className = "align-self-center";
            $(".school-logo").html(logo_image);
            $(".school-name").html(db_name);
            $(".tagline").html(data.tag_line);
            // principal-sign
            var p_image = new Image();
            p_image.src = data.principal_signature;
            p_image.width = "150";
            p_image.height = "50";
            $(".p-sign").html(p_image);
            $(".p-text").html("<br>PRINCIPAL SIGNATURE");

            // director-sign
            var d_image = new Image();
            d_image.src = data.director_signature;
            d_image.width = "150";
            d_image.height = "50";
            $(".d-sign").html(d_image);
            $(".d-text").html("<br>DIRECTOR SIGNATURE");
            // adddress
            $(".address").html(`VENUE : ${data.address}`);

            // student information
            var a_no = Number(sessionStorage.getItem("invoice_a_no"));
            var s_permission = idb.transaction("admission", "readwrite");
            var s_access = s_permission.objectStore("admission");
            var check_s_data = s_access.get(a_no);
            check_s_data.onsuccess = function(event){
                var student = event.target.result;
                $(".s-name").html(student.s_name);
                $(".f-name").html(student.f_name);
                $(".s-class").html(student.class);
                $(".invoice-date").html(student.invoice[student.invoice.length-1].invoice_date);
                $(".invoice-no").html(student.invoice[student.invoice.length-1].invoice_no);
                var i;
                for(i=0;i<student.invoice[student.invoice.length-1].course_name.length;i++)
                {
                    document.querySelector(".description").innerHTML += student.invoice[student.invoice.length-1].course_name[i]+"<hr>";

                    document.querySelector(".fee").innerHTML += student.invoice[student.invoice.length-1].course_fee[i]+"<hr>";

                    var fees = Number(student.invoice[student.invoice.length-1].course_fee[i]);
                    total += fees;
                }
                $(".total-count").html(total);
            };
        };
    }
});