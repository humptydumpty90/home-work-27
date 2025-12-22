const slider = (function () {
  let index = 0;
  const items = document.querySelectorAll(".slider__item");
  const next = document.getElementById("slider-next");
  const prev = document.getElementById("slider-prev");

  const getStep = (index) => {
    return ((index % 5) + 5) % 5;
  };
  const prevStep = () => getStep(--index);
  const nextStep = () => getStep(++index);
  const getCurrentStep = () => getStep(index);

  prev.addEventListener("click", () => {
    const prevIndex = getCurrentStep();
    prevStep();
    const currentIndex = getCurrentStep();

    items[prevIndex].style.opacity = 0;
    items[currentIndex].style.opacity = 1;
  });

  next.addEventListener("click", () => {
    const prevIndex = getCurrentStep();
    nextStep();
    const currentIndex = getCurrentStep();

    items[prevIndex].style.opacity = 0;
    items[currentIndex].style.opacity = 1;
  });

  const renderSlide = (action) => {};

  setInterval(() => {});

  const init = () => {};

  return { init };
})();
