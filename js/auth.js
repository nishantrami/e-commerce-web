// Simple frontend auth + cart demo using localStorage
const AUTH_USERS_KEY = 'fashion_users';
const AUTH_SESSION_KEY = 'fashion_session';
const CART_KEY = 'fashion_cart';

function getUsers() {
  return JSON.parse(localStorage.getItem(AUTH_USERS_KEY) || '[]');
}

function saveUsers(users) {
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
}

function getSession() {
  return JSON.parse(localStorage.getItem(AUTH_SESSION_KEY) || 'null');
}

function setSession(user) {
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(AUTH_SESSION_KEY);
}

function isLoggedIn() {
  return !!getSession();
}

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function addToCart(item) {
  const cart = getCart();
  const exist = cart.find(i => i.id === item.id);
  if (exist) {
    exist.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  saveCart(cart);
  toast('Item added to cart');
}

function removeFromCart(itemId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== itemId);
  saveCart(cart);
  renderCartPage();
}

function updateQty(itemId, qty) {
  if (qty < 1) return;
  const cart = getCart();
  const item = cart.find(i => i.id === itemId);
  if (item) {
    item.qty = qty;
    saveCart(cart);
    renderCartPage();
  }
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  $('#cart-count, .cart-count-badge').text(count);
}

function getCartTotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.qty * parseFloat(item.price), 0);
}

function toast(message, type = 'success') {
  const id = 'cart-toast';
  let el = $('#' + id);
  if (!el.length) {
    $('body').append('<div id="'+id+'" class="toastify"></div>');
    el = $('#' + id);
  }
  el.text(message).attr('class', 'toastify toastify-'+type).show();
  window.setTimeout(() => el.fadeOut(), 1600);
}

function renderCartPage() {
  if (!$('#cart-items').length) return;

  const cart = getCart();
  if (!cart.length) {
    $('#cart-table').hide();
    $('#cart-empty-message').show();
    $('#cart-total').text('₹0.00');
    $('#btn-checkout').prop('disabled', true);
    return;
  }

  $('#cart-empty-message').hide();
  $('#cart-table').show();
  $('#btn-checkout').prop('disabled', false);

  const $tbody = $('#cart-items');
  $tbody.empty();

  cart.forEach(item => {
    const subtotal = (item.qty * parseFloat(item.price)).toFixed(2);
    $tbody.append(`
      <tr class="animate__animated animate__fadeIn">
        <td><img src="${item.img}" alt="${item.name}" class="cart-thumb"> ${item.name}</td>
        <td>₹${parseFloat(item.price).toFixed(2)}</td>
        <td><input type="number" min="1" class="form-control cart-qty" data-id="${item.id}" value="${item.qty}"></td>
        <td>₹${subtotal}</td>
        <td><button class="btn btn-sm btn-danger btn-remove" data-id="${item.id}">Remove</button></td>
      </tr>
    `);
  });

  $('#cart-total').text('₹' + getCartTotal().toFixed(2));
}

function updateAuthNav() {
  const user = getSession();
  if (user) {
    $('.guest-item').hide();
    $('.auth-item').show();
    $('#nav-user-name').text(user.name).parent().show();
    if (user.role === 'admin') {
      $('#admin-panel-link').show();
    }
  } else {
    $('.guest-item').show();
    $('.auth-item').hide();
    $('#nav-user-name').parent().hide();
  }
}

$(document).on('click', '#logout-btn', (e) => {
  e.preventDefault();
  clearSession();
  window.location.href = 'index.html';
});

$(document).on('click', '.add-to-cart-btn', function() {
  const item = {
    id: $(this).data('id'),
    name: $(this).data('name'),
    price: $(this).data('price'),
    img: $(this).data('img')
  };
  addToCart(item);
});

$(document).on('click', '.btn-remove', function() {
  removeFromCart($(this).data('id'));
});

$(document).on('change', '.cart-qty', function() {
  updateQty($(this).data('id'), parseInt($(this).val()));
});

// Init
$(document).ready(() => {
  updateAuthNav();
  updateCartCount();
  renderCartPage();
});

// ── PASS TOGGLE ──
$(document).on('click', '.password-toggle', function() {
  const targetId = $(this).data('target');
  const input = $('#' + targetId);
  const type = input.attr('type') === 'password' ? 'text' : 'password';
  input.attr('type', type);
  $(this).find('i').toggleClass('fa-eye fa-eye-slash');
});

// ── LOGIN ──
$(document).on('submit', '#login-form', function(e) {
  e.preventDefault();
  const email = $('#login-email').val().trim().toLowerCase();
  const password = $('#login-password').val();
  const msgEl = $('#login-message');
  const btn = $(this).find('button[type="submit"]');

  msgEl.text('').removeClass('text-danger text-success');
  btn.find('.spinner-border').removeClass('d-none');
  btn.prop('disabled', true);

  setTimeout(() => {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      setSession({ name: user.name, email: user.email, role: user.role });
      msgEl.text('Login successful! Redirecting...').addClass('text-success animate__shakeX');
      setTimeout(() => {
        window.location.href = user.role === 'admin' ? 'dashboard.html' : 'index.html';
      }, 1500);
    } else {
      msgEl.text('Invalid email or password.').addClass('text-danger animate__shakeX');
      btn.find('.spinner-border').addClass('d-none');
      btn.prop('disabled', false);
    }
  }, 1000);
});

// ── REGISTER ──
$(document).on('submit', '#register-form', function(e) {
  e.preventDefault();
  const name = $('#register-name').val().trim();
  const email = $('#register-email').val().trim().toLowerCase();
  const password = $('#register-password').val();
  const role = $('#register-role').val() || 'user';
  const msgEl = $('#register-message');
  const btn = $(this).find('button[type="submit"]');

  msgEl.text('').removeClass('text-danger text-success');
  btn.find('.spinner-border').removeClass('d-none');
  btn.prop('disabled', true);

  setTimeout(() => {
    const users = getUsers();
    if (users.some(u => u.email === email)) {
      msgEl.text('Email already registered!').addClass('text-danger animate__shakeX');
      btn.find('.spinner-border').addClass('d-none');
      btn.prop('disabled', false);
    } else {
      users.push({ name, email, password, role });
      saveUsers(users);
      msgEl.text('Account created! Please login.').addClass('text-success animate__shakeX');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);
    }
  }, 1000);
});
