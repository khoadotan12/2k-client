AOS.init({
	duration: 800,
	easing: 'slide',
	once: true
});

jQuery(document).ready(function ($) {

	"use strict";

	var slider = function () {
		$('.nonloop-block-3').owlCarousel({
			center: false,
			items: 1,
			loop: false,
			stagePadding: 15,
			margin: 20,
			nav: true,
			navText: ['<span class="icon-arrow_back">', '<span class="icon-arrow_forward">'],
			responsive: {
				600: {
					margin: 20,
					items: 2
				},
				1000: {
					margin: 20,
					items: 3
				},
				1200: {
					margin: 20,
					items: 3
				}
			}
		});
	};
	slider();


	var siteMenuClone = function () {

		$('<div class="site-mobile-menu"></div>').prependTo('.site-wrap');

		$('<div class="site-mobile-menu-header"></div>').prependTo('.site-mobile-menu');
		$('<div class="site-mobile-menu-close "></div>').prependTo('.site-mobile-menu-header');
		$('<div class="site-mobile-menu-logo"></div>').prependTo('.site-mobile-menu-header');

		$('<div class="site-mobile-menu-body"></div>').appendTo('.site-mobile-menu');



		$('.js-logo-clone').clone().appendTo('.site-mobile-menu-logo');

		$('<span class="ion-ios-close js-menu-toggle"></div>').prependTo('.site-mobile-menu-close');


		$('.js-clone-nav').each(function () {
			var $this = $(this);
			$this.clone().attr('class', 'site-nav-wrap').appendTo('.site-mobile-menu-body');
		});


		setTimeout(function () {

			var counter = 0;
			$('.site-mobile-menu .has-children').each(function () {
				var $this = $(this);

				$this.prepend('<span class="arrow-collapse collapsed">');

				$this.find('.arrow-collapse').attr({
					'data-toggle': 'collapse',
					'data-target': '#collapseItem' + counter,
				});

				$this.find('> ul').attr({
					'class': 'collapse',
					'id': 'collapseItem' + counter,
				});

				counter++;

			});

		}, 1000);

		$('body').on('click', '.arrow-collapse', function (e) {
			var $this = $(this);
			if ($this.closest('li').find('.collapse').hasClass('show')) {
				$this.removeClass('active');
			} else {
				$this.addClass('active');
			}
			e.preventDefault();

		});

		$(window).resize(function () {
			var $this = $(this),
				w = $this.width();

			if (w > 768) {
				if ($('body').hasClass('offcanvas-menu')) {
					$('body').removeClass('offcanvas-menu');
				}
			}
		})

		$('body').on('click', '.js-menu-toggle', function (e) {
			var $this = $(this);
			e.preventDefault();

			if ($('body').hasClass('offcanvas-menu')) {
				$('body').removeClass('offcanvas-menu');
				$this.removeClass('active');
			} else {
				$('body').addClass('offcanvas-menu');
				$this.addClass('active');
			}
		})

		// click outisde offcanvas
		$(document).mouseup(function (e) {
			var container = $(".site-mobile-menu");
			if (!container.is(e.target) && container.has(e.target).length === 0) {
				if ($('body').hasClass('offcanvas-menu')) {
					$('body').removeClass('offcanvas-menu');
				}
			}
		});
	};
	siteMenuClone();


	var sitePlusMinus = function () {
		$('.js-btn-minus').on('click', function (e) {
			e.preventDefault();
			if ($(this).closest('.input-group').find('.form-control').val() != 0) {
				$(this).closest('.input-group').find('.form-control').val(parseInt($(this).closest('.input-group').find('.form-control').val()) - 1);
			} else {
				$(this).closest('.input-group').find('.form-control').val(parseInt(0));
			}
		});
		$('.js-btn-plus').on('click', function (e) {
			e.preventDefault();
			$(this).closest('.input-group').find('.form-control').val(parseInt($(this).closest('.input-group').find('.form-control').val()) + 1);
		});
	};
	sitePlusMinus();

	function formatPrice(price) {
		return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	}
	var siteSliderRange = function () {
		$("#slider-range").slider({
			range: true,
			min: 1000,
			max: 40000000,
			values: [4000000, 20000000],
			slide: function (event, ui) {
				$("#amount").val(formatPrice(ui.values[0]) + "đ - " + formatPrice(ui.values[1]) + "đ");
			}
		});
		$("#amount").val(formatPrice($("#slider-range").slider("values", 0)) +
			"đ - " + formatPrice($("#slider-range").slider("values", 1)) + "đ");
	};
	siteSliderRange();


	var siteMagnificPopup = function () {
		$('.image-popup').magnificPopup({
			type: 'image',
			closeOnContentClick: true,
			closeBtnInside: false,
			fixedContentPos: true,
			mainClass: 'mfp-no-margins mfp-with-zoom', // class to remove default margin from left and right side
			gallery: {
				enabled: true,
				navigateByImgClick: true,
				preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
			},
			image: {
				verticalFit: true
			},
			zoom: {
				enabled: true,
				duration: 300 // don't foget to change the duration also in CSS
			}
		});

		$('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
			disableOn: 700,
			type: 'iframe',
			mainClass: 'mfp-fade',
			removalDelay: 160,
			preloader: false,

			fixedContentPos: false
		});
	};
	siteMagnificPopup();

});

function validateEmail() {
	const email = document.getElementById("email").value;
	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				document.getElementById("validateEmailFail").textContent = xhr.responseText;
			}
		}
	};
	xhr.open("POST", "/user/register/verifyEmail", true);
	xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	xhr.send(JSON.stringify({ "email": email }));
}

function checkPassword() {
	const password = document.getElementById("password").value;
	const repassword = document.getElementById("re_password").value;
	if (password !== "" && repassword != "") {
		if (password.length < 6) {
			document.getElementById("validatePasswordFail").textContent = "Mật khẩu phải có ít nhất 6 ký tự.";
			document.getElementById("submitButton").disabled = true;
		}
		else {
			if (password !== repassword) {
				document.getElementById("validatePasswordFail").textContent = "Xác nhận mật khẩu không chính xác.";
				document.getElementById("submitButton").disabled = true;
			}
			else {
				document.getElementById("validatePasswordFail").textContent = '';
				document.getElementById("submitButton").disabled = false;
			}
		}
	}
	else {
		document.getElementById("validatePasswordFail").textContent = "";
		document.getElementById("submitButton").disabled = false;
	}
}

function addAjax() {
	const id = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);
	const radio = document.querySelector('input[name="color"]:checked');
	if (!radio)
		return alert('Vui lòng chọn màu sản phẩm.');
	const color = radio.value;
	const count = parseInt(document.getElementById('count').value);
	if (count <= 0)
		return alert('Vui lòng chọn số lượng.');
	if (count > 10)
		return alert('Bạn chỉ được đặt tối đa là 10 sản phẩm.');


	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				let cartCount = document.getElementById("cartCount");
				const cart = cartCount.textContent;
				if (cart === '') {
					cartCount.classList.add("count");
					cartCount.textContent = count;
				}
				else {
					const num = parseInt(cart) + count;
					cartCount.textContent = num.toString();
				}
			}
			else {
				alert('Lỗi: ', xhr.responseText);
			}
		}
	};
	xhr.open("POST", "/cart/addCart", true);
	xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	xhr.send(JSON.stringify({ "id": id, "color": color, "count": count }));
}

function deleteItemCart(id, color) {
	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				location.reload();
			}
			else {
				alert('Lỗi: ', xhr.responseText);
			}
		}
	};
	xhr.open("DELETE", "/cart/delete", true);
	xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	xhr.send(JSON.stringify({ "id": id, "color": color }));
}

function updateCart() {
	const count = document.getElementsByName("numOfItems[]");
	let values = [];
	for (let i = 0; i < count.length; i++) {
		if (parseInt(count[i].value) > 10)
			return alert('Bạn chỉ được đặt tối đa là 10 sản phẩm.');
		values.push(parseInt(count[i].value));
	}
	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				location.reload();
			}
			else {
				alert('Lỗi: ', xhr.responseText);
			}
		}
	};
	xhr.open("POST", "/cart/updateCart", true);
	xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	xhr.send(JSON.stringify({ "values": values }));
}

function selectPage(page) {
	let url = new URL(window.location);
	url.searchParams.set('p', page);
	window.location = url;
}