$(function () {
  //   alert('works');
  const socket = io();

  //obtaining DOM elements from the interface
  const $messageForm = $('#message-form');
  const $messageBox = $('#message');
  const $chat = $('#chat');

  //obtaining DOM elements from the nicknameForm
  const $nickForm = $('#nickForm');
  const $nickError = $('#nickError');
  const $nickname = $('#nickname');

  const $users = $('#usernames');
  const $alert = $('#alert');

  $nickForm.submit((e) => {
    e.preventDefault();
    socket.emit('new user', $nickname.val(), (data) => {
      if (data) {
        $('#nickWrap').hide();
        $('#contentWrap').show();
        setTimeout(() => {
          $alert.fadeIn('slow');
          setTimeout(() => {
            $alert.fadeOut('slow');
          },10000);
        },5000);
      } else {
        $nickError.html(`
          <div class="alert alert-danger">
             El usuario ya existe.
          </div>
        `);
      }
      $nickname.val('');
    });
  });

  // events
  $messageForm.submit((e) => {
    e.preventDefault();
    $messageBox.val();
    socket.emit('send message', $messageBox.val(), (data) => {
      $chat.append(`<p class="error">${data}</p>`);
    });
    $messageBox.val('');
  });

  socket.on('new message', (data) => {
    $chat.append(`<b>${data.user}</b>: ${data.msg}<br/>`);
  });

  socket.on('usernames', (data) => {
    let html = '';
    for (let i = 0; i < data.length; i++) {
      html += `<p><i class="fas fa-user"></i> ${data[i]}</p>`;
    }
    $users.html(html);
  });

  function displayMsg(data) {
    $chat.append(`<p class="msg"><b>${data.user}:</b> ${data.msg}</p>`);
  }

  socket.on('private', (data) => {
    $chat.append(`<p class="private"><b>${data.user}:</b> ${data.msg}</p>`);
  });
  socket.on('load old msgs', (msgs) => {
    for (let i = 0; i < msgs.length; i++) {
      displayMsg(msgs[i]);
    }
  });
});
