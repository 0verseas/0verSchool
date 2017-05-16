function deptFilter() {
	let input, filter, table, tr, code, name, i;
  input = document.getElementById("dept-filter-input");
  filter = input.value.toUpperCase();
  table = document.getElementById("dept-list");
  tr = table.getElementsByTagName("tr");

  for (i = 0; i < tr.length; i++) {
    code = tr[i].getElementsByTagName("td")[2]; // 代碼
    name = tr[i].getElementsByTagName("td")[3]; // 名稱

    if (code || name) {
      if (code.innerHTML.toUpperCase().indexOf(filter) > -1 || name.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    } 
  }
}

$(document).ready(function() {
    $('#dept-list').DataTable();
} );
