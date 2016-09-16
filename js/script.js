if (window.openDatabase) {
    var mydb = openDatabase("guests_db", "0.1", "A Database of Guests", 1024 * 1024);
    mydb.transaction(function (t) {
        t.executeSql("CREATE TABLE IF NOT EXISTS guest_table (id INTEGER PRIMARY KEY ASC, make TEXT, model INTEGER)");
    });



} else {
    alert("WebSQL is not supported by your browser!");
}



function updateGuestList(transaction, results) {
    var listitems = "";
    var listholder = document.getElementById("carlist");
    listholder.innerHTML = "";

    var i;
    for (i = 0; i < results.rows.length; i++) {
        var row = results.rows.item(i);
        listholder.innerHTML += "<li>" + row.make + " - " + row.model + " (<a href='javascript:void(0);' onclick='deleteGuest(" + row.id + ");'>Delete Guest Data</a>)";
    }

}

function outputGuests() {
    if (mydb) {
        mydb.transaction(function (t) {
            t.executeSql("SELECT * FROM guest_table", [], updateGuestList);
        });
    } else {
        alert("db not found, your browser does not support web sql!");
    }
}


function addGuest() {
    if (mydb) {
        var make = document.getElementById("last_name").value;
        var model = document.getElementById("number").value;
        if (make !== "" && model !== "") {
            mydb.transaction(function (t) {
                t.executeSql("INSERT INTO guest_table (make, model) VALUES (?, ?)", [make, model]);
                outputGuests();
            });
        } else {
            alert("Invalid Submission!");
        }
    } else {
        alert("db not found, your browser does not support web sql!");
    }
}


function deleteGuest(id) {
    if (mydb) {
        mydb.transaction(function (t) {
            t.executeSql("DELETE FROM guest_table WHERE id=?", [id], outputGuests);
        });
    } else {
        alert("db not found, your browser does not support web sql!");
    }
}

outputGuests();