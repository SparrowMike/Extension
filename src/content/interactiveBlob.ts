import { blobGreen } from "./blobs";
import { blobFirst } from "./blobs";
import { countdown } from "../utils/countdown";
import { v4 as uuidv4 } from 'uuid';

export function interactiveBlob() {
  let blob = blobGreen()

  const elemHtml = `
  <div id="work-wise__content-container">
    <div id="work-wise__input-wrapper" style="display: none">
      <input id="work-wise__my-input" type="text">
    </div>
    ${blob}
  </div>  
`

  if (!['WorkWise - Popup Extension', 'WorkWise - Options Extension'].includes(document.title)) {
    document.body.insertAdjacentHTML('beforeend', elemHtml);

    const container = document.getElementById('work-wise__content-container') as HTMLElement;
    const inputWrapper = document.getElementById('work-wise__input-wrapper') as HTMLElement;
    const input = document.getElementById('work-wise__my-input') as HTMLInputElement;
    
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;

    if (container && inputWrapper && input) {
      const userSelectStyle = window.getComputedStyle(container).userSelect;

      container.addEventListener('mousedown', (event) => {
        event.stopPropagation();
        isDragging = true;
        dragStartX = event.clientX;
        dragStartY = event.clientY;
      });

      document.addEventListener('mousemove', event => {
        if (isDragging) {
          container.classList.add('dragging');
          document.body.style.userSelect = "none";

          // Get the size of the container
          const containerWidth = container.offsetWidth;
          const containerHeight = container.offsetHeight;

          // Get the size of the viewport
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;

          // Calculate the maximum and minimum values for the left and top CSS properties
          const maxLeft = viewportWidth - containerWidth / 2;
          const maxTop = viewportHeight - containerHeight / 2;
          const minLeft = -containerWidth / 2;
          const minTop = -containerHeight / 2;

          // Update the left and top CSS properties of the container element
          let newLeft = container.offsetLeft + event.clientX - dragStartX;
          let newTop = container.offsetTop + event.clientY - dragStartY;

          // Adjust the maximum and minimum values for the left and top CSS properties
          if (newLeft > maxLeft) {
            newLeft = maxLeft;
          } else if (newLeft < minLeft) {
            newLeft = minLeft;
          }

          if (newTop > maxTop) {
            newTop = maxTop;
          } else if (newTop < minTop) {
            newTop = minTop;
          }

          container.style.left = `${newLeft}px`;
          container.style.top = `${newTop}px`;

          // Update the drag start position
          dragStartX = event.clientX;
          dragStartY = event.clientY;
        }
      });

      document.addEventListener('mouseup', event => {
        isDragging = false;
        document.body.style.userSelect = userSelectStyle;
        setTimeout(() => {
          container.classList.remove('dragging');
        }, 10);
      });

      container.addEventListener('click', (event) => {
        event.stopPropagation();
        if (!container.classList.contains('dragging') && !isDragging) {
          input.focus();
          container.classList.add('input-active');
          inputWrapper.style.display = "block";
        }
      })

      document.addEventListener('click', event => {
        inputWrapper.style.display = "none";
        input.value = "";
        container.classList.remove('input-active');
      });

      input.addEventListener('keyup', event => {
        if (event.key === 'Enter') {
          const inputValue = input.value.trim();
          if (inputValue !== "") {
            const id = uuidv4();
            chrome.runtime.sendMessage({ type: "SAVE_REMINDER", id, title: inputValue, timeLeft: 60 });
            inputWrapper.style.display = "none";
            input.value = "";
            container.classList.remove('input-active');
            // Start countdown
            countdown(1, id);
          }
        }
      });
    }
  }
}