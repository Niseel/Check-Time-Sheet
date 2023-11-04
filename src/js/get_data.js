import generateCpf from "./cpf.js"
import download from "./downloader.js"


$(document).ready(function () {
  getInfoOnLoad();

  $("#genBtn").click(function (ev) {
    ev.preventDefault();
    getr();
  });

  $("#downUser").click(function (ev) {
    ev.preventDefault();
    download(
      "user.txt",
      `{
        \r'nome':  ${$("#name").val()},
      \r'eMail': ${$("#email").val()},
      \r'apelido': ${$("#nickname").val()},
      \r'cpf': ${$("#cpf").val()},
      \r'cidade': ${$("#city").val()},
      \r'rua': ${$("#street").val()},
      \r'estado': ${$("#state").val()},
      \r'telefone': ${$("#phone").val()},
      \r'dataDeNascimento: ${$("#dob").val()},
      \r'imagemDoUsuario': ${$("#user_img").attr("src")}
    \r}
      `
    );
  });

  $("button[id*='copy-btn']").click(function (ev) {
    ev.preventDefault();
    $(".msg-warning").css("display", "block");
    $(".msg-warning").delay(2000).fadeOut("slow");
  });

  new ClipboardJS("#copy-btn");
});

function getr() {
  $.ajax({
    url: "https://randomuser.me/api/?nat=br",
    dataType: "json",
    success: function (data) {
      buildUser(data);
    },
  });
}

function buildUser(data) {
  console.log(data.results[0])
  const user_name = data.results[0].name.first + " " + data.results[0].name.last;
  const user_email = data.results[0].email;
  const user_nick = data.results[0].login.username;
  const user_location = data.results[0].location.street.name;
  const user_city = data.results[0].location.city;
  const user_state = data.results[0].location.state;
  const user_phone = data.results[0].phone;
  const user_dob = data.results[0].dob.date;
  const user_img = data.results[0].picture.medium;

  let formate_date = new Date(user_dob).toISOString().split("T")[0];
  let cpf_value = generateCpf();

  $("#name").val(user_name);
  localStorage.setItem("person_name", user_name);

  $("#email").val(user_email);
  localStorage.setItem("person_email", user_email);

  $("#nickname").val(user_nick);
  localStorage.setItem("person_name", user_name);

  $("#street").val(user_location);
  localStorage.setItem("person_street", user_location);

  $("#city").val(user_city);
  localStorage.setItem("person_city", user_city);

  $("#state").val(user_state);
  localStorage.setItem("person_state", user_state);

  $("#phone").val(user_phone);
  localStorage.setItem("person_phone", user_phone);

  $("#dob").val(formate_date);
  localStorage.setItem("person_dob", formate_date);

  $("#cpf").val(cpf_value);
  localStorage.setItem("person_cpf", cpf_value);

  $("#user_img").attr("src", user_img);
  localStorage.setItem("person_img", user_img);
}

function getInfoOnLoad() {
  $("#name").val(localStorage.getItem("person_name"));
  $("#email").val(localStorage.getItem("person_email"));
  $("#nickname").val(localStorage.getItem("person_name"));
  $("#street").val(localStorage.getItem("person_street"));
  $("#city").val(localStorage.getItem("person_city"));
  $("#state").val(localStorage.getItem("person_state"));
  $("#phone").val(localStorage.getItem("person_phone"));
  $("#dob").val(localStorage.getItem("person_dob"));
  $("#cpf").val(localStorage.getItem("person_cpf"));

  let localImage = localStorage.getItem("person_img");

  if (localImage == null) {
    $("#user_img").attr(
      "src",
      "https://randomuser.me/api/portraits/lego/1.jpg"
    );
  } else {
    $("#user_img").attr("src", localImage);
  }
}
