const slider = (function () {
  const state = {
    duration: 0,
    mode: 'play',
    numberOfSlides: 0,
    elements: {
      container: null,
      items: null,
      list: null,
      points: { container: null, items: null },
      buttons: { prev: null, next: null, play: null },
    },
    currentIndex: 0,

    setNumberOfSlides() {
      this.numberOfSlides = this.elements.items.length;
    },

    increaseIndex() {
      return ++this.currentIndex;
    },
    decreaseIndex() {
      return --this.currentIndex;
    },
    getIndex() {
      return this.currentIndex;
    },
    setIndex(index) {
      this.currentIndex = index;
      return this.currentIndex;
    },

    setElements(elements) {
      this.elements.container = document.querySelector(elements.container);
      this.elements.items = document.querySelectorAll(elements.items);
    },

    generatePoints() {
      const pointsTemplate = new Array(this.numberOfSlides)
        .fill()
        .reduce((template, _, index) => {
          return `${template}<span data-index='${index}'></span>`;
        }, '');
      this.elements.points.container.innerHTML = pointsTemplate;
      this.elements.points.items = this.elements.points.container.children;
    },

    initElements(elements) {
      this.elements.list = document.getElementById('slider-list');
      this.elements.buttons.play = document.getElementById('slider-play');
      this.elements.buttons.prev = document.getElementById('slider-prev');
      this.elements.buttons.next = document.getElementById('slider-next');
      this.elements.points.container = document.getElementById('slider-points');

      this.setElements(elements);
      this.setNumberOfSlides();
      this.generatePoints();
    },
    toggleMode() {
      this.mode = this.mode === 'play' ? 'pause' : 'play';
      return this.mode;
    },
  };

  const events = (function () {
    let prev = null;
    let next = null;
    let play = null;
    let timer = null;
    let points = null;
    let slides = null;

    let prevFn = null;
    let nextFn = null;
    let playFn = null;
    let pointsFn = null;
    let mouseupFn = null;
    let mousedownFn = null;
    let keydownFn = null;

    const clickEvents = {
      onPrev(handlePrev) {
        prevFn = handlePrev;
        prev.addEventListener('click', prevFn);
      },
      onNext(handleNext) {
        nextFn = handleNext;
        next.addEventListener('click', nextFn);
      },
      onPlay(handlePlay) {
        playFn = () => {
          handlePlay(state.toggleMode());
        };
        play.addEventListener('click', playFn);
      },

      onPoint(handlePoint) {
        pointsFn = (event) => {
          event.target.closest('span') &&
            handlePoint(event.target.dataset.index);
        };
        points.container.addEventListener('click', pointsFn);
      },
    };

    const intervalEvents = {
      start(handleInterval, duration) {
        timer = setInterval(handleInterval, duration);
      },
      stop() {
        clearInterval(timer);
      },
    };

    const swipesEvents = (swipes) => {
      let startPositionX = 0;
      const getX = (e) => e.offsetX || e.changeTouches?.[0].pageX;

      mousedownFn = (e) => {
        e.preventDefault();
        startPositionX = getX(e);
      };
      mouseupFn = (e) => {
        e.preventDefault();
        getX(e) < startPositionX ? swipes.toLeft() : swipes.toRight();
        startPositionX = 0;
      };
      slides.addEventListener('mousedown', mousedownFn);
      slides.addEventListener('mouseup', mouseupFn);
      slides.addEventListener('touchstart', mousedownFn);
      slides.addEventListener('touchend', mouseupFn);
    };

    const keyboardEvents = {
      onArrows(handlePrev, handleNext) {
        keydownFn = (e) => {
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            handlePrev();
          }

          if (e.key === 'ArrowRight') {
            e.preventDefault();
            handleNext();
          }
        };

        document.addEventListener('keydown', keydownFn);
      },
    };

    const init = () => {
      next = state.elements.buttons.next;
      prev = state.elements.buttons.prev;
      play = state.elements.buttons.play;
      points = state.elements.points;
      slides = state.elements.list;

      return {
        click: clickEvents,
        interval: intervalEvents,
        swipes: swipesEvents,
        keyboard: keyboardEvents,
      };
    };

    return {
      init,
      destroy() {
        prev.removeEventListener('click', prevFn);
        next.removeEventListener('click', nextFn);
        play.removeEventListener('click', playFn);
        points.container.removeEventListener('click', pointsFn);
        document.removeEventListener('keydown', keydownFn);

        intervalEvents.stop();

        prev = null;
        next = null;
        play = null;
        timer = null;
        points = null;
        slides = null;

        prevFn = null;
        nextFn = null;
        playFn = null;
        pointsFn = null;
        mousedownFn = null;
        mouseupFn = null;
        keydownFn = null;
      },
    };
  })();

  const getStep = (index) => {
    return (
      ((index % state.numberOfSlides) + state.numberOfSlides) %
      state.numberOfSlides
    );
  };
  const prevStep = () => getStep(state.decreaseIndex());
  const nextStep = () => getStep(state.increaseIndex());
  const getCurrentStep = () => getStep(state.getIndex());
  const moveTo = (index) => getStep(state.setIndex(index));

  const render = (action = () => {}) => {
    const prevIndex = getCurrentStep();
    action();
    const currentIndex = getCurrentStep();
    renderSlide(prevIndex, currentIndex);
    renderPoints(prevIndex, currentIndex);
  };

  const renderSlide = (prevIndex, currentIndex) => {
    state.elements.items[prevIndex].style.opacity = 0;
    state.elements.items[currentIndex].style.opacity = 1;
  };
  const renderPoints = (prevIndex, currentIndex) => {
    state.elements.points.items[prevIndex].classList.remove('active');
    state.elements.points.items[currentIndex].classList.add('active');
  };

  const renderPlay = () => {
    const iconTag = state.elements.buttons.play.children[0];

    iconTag.classList.toggle('fa-circle-pause');
    iconTag.classList.toggle('fa-circle-play');
  };

  const init = (elements, options = { duration: 1000 }) => {
    state.initElements(elements);

    const eventsInstance = events.init();

    render();

    eventsInstance.click.onPrev(() => {
      render(prevStep);
    });
    eventsInstance.click.onNext(() => {
      render(nextStep);
    });
    eventsInstance.click.onPlay((mode) => {
      if (mode === 'pause') {
        eventsInstance.interval.stop();
      } else {
        eventsInstance.interval.start(() => {
          render(nextStep);
        }, options.duration);
      }
      renderPlay(mode);
    });

    eventsInstance.click.onPoint((index) => {
      render(() => moveTo(index));
    });

    eventsInstance.interval.start(() => {
      render(nextStep);
    }, options.duration);

    eventsInstance.swipes({
      toLeft: () => render(prevStep),
      toRight: () => render(nextStep),
    });
    render(nextStep);

    eventsInstance.keyboard.onArrows(
      () => render(prevStep),
      () => render(nextStep)
    );
  };

  return {
    init,
    destroy() {
      events.destroy();
    },
  };
})();
