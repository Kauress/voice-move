function getResolution(container) {
  const width =
    container.clientWidth +
    container.style.marginLeft +
    container.style.marginRight;
  const height =
    container.clientHeight +
    container.style.marginTop +
    container.style.marginBottom;

  return {
    width,
    height,
  };
}

function getPixelPosition(positionInPercentage) {
  const { width, height } = getResolution(document.body);
  return {
    x: (positionInPercentage.x / 100) * width,
    y: (positionInPercentage.y / 100) * height,
  };
}

function getPercentagePosition(positionInPixel) {
  const { width, height } = getResolution(document.body);
  return {
    x: (positionInPixel.x / width) * 100,
    y: (positionInPixel.y / height) * 100,
  };
}

function getOrigin(el) {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2,
  };
}

function initializeOrigin(el) {
  if (!state.origin.x && !state.origin.y) {
    state.origin = getOrigin(el);
  }
}

function getNextCoordinates(event) {
  return {
    x: event.clientX - state.origin.x,
    y: event.clientY - state.origin.y,
  };
}

function enableDrag() {
  state.isDragging = true;
}

function disableDrag() {
  state.isDragging = false;
}

function movementHandler(event) {
  if (state.isDragging) {
    const movement = event.touches ? event.touches[0] : event;
    const newCoords = getNextCoordinates(movement);
    if (state.userCircle.el)
      state.userCircle.el.style.transform = `translate(${newCoords.x}px, ${newCoords.y}px)`;
    const posPer = getPercentagePosition(newCoords);
    socket.emit("movement", posPer);
    state.users[state.userCircle.index].position = posPer;
  }
}

function initializeMovementEvents() {
  const element = state.userCircle.el;
  element.addEventListener("mousedown", enableDrag);
  element.addEventListener("mousemove", movementHandler);
  element.addEventListener("mouseup", disableDrag);
  element.addEventListener("mouseleave", disableDrag);
  element.addEventListener("touchstart", enableDrag);
  element.addEventListener("touchmove", movementHandler);
  element.addEventListener("touchend", disableDrag);
  element.addEventListener("touchcancel", disableDrag);
}

function resetMovementEvents() {
  const element = state.userCircle.el;
  element.removeEventListener("mousedown", enableDrag);
  element.removeEventListener("mousemove", movementHandler);
  element.removeEventListener("mouseup", disableDrag);
  element.removeEventListener("mouseleave", disableDrag);
  element.removeEventListener("touchstart", enableDrag);
  element.removeEventListener("touchmove", movementHandler);
  element.removeEventListener("touchend", disableDrag);
  element.removeEventListener("touchcancel", disableDrag);
}
