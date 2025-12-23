const slider = (function () {
  const state = {
    duration: 1000,
    numberOfSlides: 0,
    elements: {
      container: null,

      items: null,
      // points: { container: null, items: null },
      // buttons: { prev: null, next: null, play: null },
    },
    currentIndex: 0,

    increaseIndex() {
      return ++this.currentIndex;
    },
    decreaseIndex() {
      return --this.currentIndex;
    },
    getIndex() {
      return this.currentIndex;
    },

    setElements(elements) {
      this.elements.container = document.querySelector(elements.container);
      this.elements.items = document.querySelector(elements.items);
    },
  };

  const items = document.querySelectorAll(".slider__item");
  //   const next = document.getElementById("slider-next");
  //   const prev = document.getElementById("slider-prev");

  const events = (function () {
    let prev = null;
    let next = null;
    let timer = null;

    let prevFn = null;
    let nextFn = null;

    const clickEvents = {
      onPrev(handlePrev) {
        prevFn = handlePrev;
        prev.addEventListener("click", prevFn);
      },
      onNext(handleNext) {
        nextFn = handleNext;
        next.addEventListener("click", nextFn);
      },
    };

    const intervalEvents = {
      start(handleInterval, duration = 1000) {
        timer = setInterval(handleInterval, duration);
      },
      stop() {
        clearInterval(timer);
      },
    };

    const init = () => {
      next = document.getElementById("slider-next");
      prev = document.getElementById("slider-prev");
      return { click: clickEvents, interval: intervalEvents };
    };

    return { init };
  })();

  const getStep = (index) => {
    return ((index % 5) + 5) % 5;
  };
  const prevStep = () => getStep(state.decreaseIndex());
  const nextStep = () => getStep(state.increaseIndex());
  const getCurrentStep = () => getStep(state.getIndex());

  const eventsInstance = events.init();

  eventsInstance.click.onPrev(() => {
    renderSlide(prevStep);
  });
  eventsInstance.click.onNext(() => {
    renderSlide(nextStep);
  });

  eventsInstance.interval.start(() => {
    renderSlide(nextStep);
  });

  //   prev.addEventListener("click", () => {
  //     renderSlide(prevStep);
  //   });

  //   next.addEventListener("click", () => {
  //     renderSlide(nextStep);
  //   });

  //   setInterval(() => {
  //     renderSlide(nextStep);
  //   }, 1000);

  const renderSlide = (action) => {
    const prevIndex = getCurrentStep();
    action();
    const currentIndex = getCurrentStep();

    state.elements.items[prevIndex].style.opacity = 0;
    state.elements.items[currentIndex].style.opacity = 1;
  };
  const init = (elements) => {
    state.setElements(elements);
  };

  return {
    init,
  };
})();
