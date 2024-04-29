$(document).ready(function () {
    var class_name = sessionStorage.getItem("student_class");
    var db_name = sessionStorage.getItem("db_name");
    var database = window.indexedDB.open(db_name);
    database.onsuccess = function (event) {
        var idb = event.target.result;
        var permission = idb.transaction("admission", "readwrite");
        var access = permission.objectStore("admission");
        var key_name = access.getAllKeys();
        key_name.onsuccess = function (event) {
            var keys_array = event.target.result;
            var i;
            for (i = 0; i < keys_array.length; i++) {
                var check_data = access.get(keys_array[i]);
                check_data.onsuccess = function (event) {
                    var data = event.target.result;
                    if (data.class == class_name) {
                        var image = new Image();
                        image.src = data.pic;
                        image.width = "80";
                        image.height = "80";
                        var table_document = `
                        <tr>
                            <td class="border border-1 d-flex justify-content-center"></td>
                            <td class="border border-1 text-center text-uppercase">${data.s_name}</td>
                            <td class="border border-1 text-center text-uppercase">${data.f_name}</td>
                            <td class="border border-1 text-center text-uppercase">${data.m_name}</td>
                            <td class="border border-1 text-center text-uppercase">${data.dob}</td>
                            <td class="border border-1 text-center text-uppercase">${data.doa}</td>
                            <td class="border border-1 text-center text-uppercase">${data.mobile_one}</td>
                            <td class="border border-1 text-center text-uppercase">${data.mobile_two}</td>
                            <td class="border border-1 text-center text-uppercase">${data.address}</td>
                        </tr>
                       `;
                        $(".student-table").append(table_document);
                        $(".student-table tr:last-child td:first-child").append(image); // review
                    }
                };
            } 
        };
    }
});
