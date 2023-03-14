const swiperWrapper = document.querySelector(".swiper .swiper-wrapper"),
	swiper = document.querySelector(".swiper"),
	prevBtn = document.querySelector(".control .prev"),
	nextBtn = document.querySelector(".control .next");

var navigation = new Array();

var width,
	offset,
	activeDot = 1;

let currentOffset = 0;

var slides = document.querySelectorAll(".swiper .swiper-wrapper .swiper-item");

function initSlides() {
	// slides = document.querySelectorAll(".swiper .swiper-wrapper .swiper-item");

	[...slides].map((slide, index) => {
		let div = document.createElement("div");
		div.className = "dot";
		document.querySelector(".navigation").appendChild(div);
		slide.style.right = 0 + "px";
	});

	navigation = document.querySelectorAll(".dot");

	slides = document.querySelectorAll(".swiper .swiper-wrapper .swiper-item");
}

function cloneElement() {
	let firstSlide = slides[0];
	let lastSlide = slides[slides.length - 1];

	firstSlide.cloneNode(true);
	swiperWrapper.prepend(lastSlide.cloneNode(true));
	swiperWrapper.appendChild(firstSlide.cloneNode(true));
}

function initWidth() {
	width = swiper.clientWidth;

	swiperWrapper.style.width = width * slides.length + "px";
	swiperWrapper.style.transform = "translateX(-" + width * activeDot + "px)";
	offset = width;
	slides.forEach((item) => {
		item.style.width = width + "px";
		item.style.height = "auto";
		// item.style.right = width * activeDot + "px";
	});
}

const nextSlide = () => {
	var start = Date.now();

	activeDot++;

	navigation.forEach((dot) => {
		if (dot.classList.contains("inactive")) {
			dot.classList.remove("inactive");
		}
	});
	var timer = setInterval(() => {
		var timePassed = Date.now() - start;

		nextBtn.setAttribute("disabled", "true");
		prevBtn.setAttribute("disabled", "true");

		navigation.forEach((dot) => {
			dot.classList.add("inactive");
		});

		if (timePassed > width) {
			offset = width * activeDot;

			if (activeDot > slides.length - 3) {
				setTimeout(() => {
					resetTranslate();
				}, 1);
				activeDot = 0;
			}
			setTimeout(() => {
				nextBtn.removeAttribute("disabled");
				prevBtn.removeAttribute("disabled");
				navigation.forEach((dot) => {
					dot.classList.remove("inactive");
				});
			}, 100);
			clearInterval(timer);

			return;
		}

		draw(timePassed);
	}, 0);
	currentSlide(activeDot > slides.length - 3 ? 0 : activeDot);

	function draw(timePassed) {
		swiperWrapper.style.transform =
			"translateX(-" + (offset + timePassed) + "px)";
	}

	function resetTranslate() {
		swiperWrapper.style.transform = "translateX(-" + 0 + "px)";
	}
};

const prevSlide = () => {
	var start = Date.now();

	activeDot--;

	navigation.forEach((dot) => {
		if (dot.classList.contains("inactive")) {
			dot.classList.remove("inactive");
		}
	});

	var timer = setInterval(() => {
		var timePassed = Date.now() - start;

		prevBtn.setAttribute("disabled", "true");
		nextBtn.setAttribute("disabled", "true");

		navigation.forEach((dot) => {
			dot.classList.add("inactive");
		});

		if (timePassed > width + 1) {
			if (activeDot < 1) {
				setTimeout(() => {
					resetTranslate();
				}, 1);
				activeDot = slides.length - 2;
			}

			offset = width * activeDot;
			clearInterval(timer);
			setTimeout(() => {
				nextBtn.removeAttribute("disabled");
				prevBtn.removeAttribute("disabled");
				navigation.forEach((dot) => {
					dot.classList.remove("inactive");
				});
			}, 100);

			return;
		}
		draw(timePassed);
	}, 1);

	currentSlide(activeDot - 1 < 0 ? activeDot - slides.length - 3 : activeDot);

	function draw(timePassed) {
		swiperWrapper.style.transform =
			"translateX(" + (-offset + timePassed) + "px)";
	}

	function resetTranslate() {
		swiperWrapper.style.transform =
			"translateX(-" + (slides.length - 2) * width + "px)";
	}
};

function currentSlide(index) {
	for (let dot of navigation) {
		dot.classList.remove("active");
	}
	console.log(index);
	if (navigation[index]) {
		navigation[index].classList.add("active");
	} else {
		navigation[0].classList.add("active");
	}
}

// runtime
cloneElement();
initSlides();
initWidth();

nextBtn.addEventListener("click", nextSlide);
prevBtn.addEventListener("click", prevSlide);

navigation.forEach((dot, index) => {
	dot.addEventListener("click", () => {
		if (dot.classList.contains("inactive")) {
			console.log("Нельзя");
			return;
		}
		console.log("Можно");
		var buffIndex = activeDot;
		activeDot = index;
		console.log("Buff: %f", buffIndex);
		console.log("activeDot: %f", activeDot);

		if (activeDot == buffIndex) {
			return;
		}

		dot.classList.remove("active");
		currentSlide(activeDot);

		var start = Date.now();

		navigation.forEach((dot) => {
			if (dot.classList.contains("inactive")) {
				dot.classList.remove("inactive");
			}
		});

		var timer = setInterval(() => {
			var timePassed = Date.now() - start;

			nextBtn.setAttribute("disabled", "true");
			prevBtn.setAttribute("disabled", "true");

			navigation.forEach((dot) => {
				dot.classList.add("inactive");
			});

			if (timePassed > width) {
				offset = width * activeDot;

				console.log(offset);
				if (activeDot > slides.length - 3) {
					setTimeout(() => {
						resetTranslate();
					}, 1);
					activeDot = 0;
				}
				setTimeout(() => {
					nextBtn.removeAttribute("disabled");
					prevBtn.removeAttribute("disabled");
					navigation.forEach((dot) => {
						dot.classList.remove("inactive");
					});
				}, 100);
				clearInterval(timer);

				return;
			}

			draw(timePassed);
		}, 0);

		function draw(timePassed) {
			console.log(offset);
			if (activeDot < buffIndex) {
				swiperWrapper.style.transform =
					"translateX(" +
					(-offset + timePassed * Math.abs(activeDot - buffIndex)) +
					"px)";
			} else {
				swiperWrapper.style.transform =
					"translateX(-" +
					(offset + timePassed * Math.abs(activeDot - buffIndex)) +
					"px)";
			}
		}
	});

	if (navigation[activeDot]) {
		navigation[activeDot].classList.add("active");
	} else {
		navigation[0].classList.add("active");
	}
});
