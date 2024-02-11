import flatpickr from 'flatpickr';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import 'flatpickr/dist/flatpickr.min.css';

const dataTimePicker = document.getElementById('datetime-picker');
const startBtn = document.querySelector('[data-start]');
const dataDays = document.querySelector('[data-days]');
const dataHours = document.querySelector('[data-hours]');
const dataMinutes = document.querySelector('[data-minutes]');
const dataSeconds = document.querySelector('[data-seconds]');

let userSelectedDate;
let countdownInterval;

function toggleButton(state) {
  startBtn.disabled = !state;

  if (state) {
    startBtn.classList.add('button-active');
    startBtn.classList.remove('button-disabled');
  } else {
    startBtn.classList.remove('button-active');
    startBtn.classList.add('button-disabled');
  }
}

toggleButton(false);

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const currentDate = new Date();

    if (selectedDates[0] > currentDate) {
      userSelectedDate = selectedDates[0];
      toggleButton(true);
      iziToast.info({
        message: 'You can start the countdown',
        position: 'topRight',
      });
    } else {
      iziToast.error({
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      toggleButton(false);
    }
  },
};

flatpickr(dataTimePicker, options);

startBtn.addEventListener('click', function (event) {
  event.preventDefault();
  const now = new Date();

  if (!userSelectedDate || userSelectedDate <= now) {
    iziToast.error({
      message: 'Please choose a date in the future',
      position: 'topRight',
    });
    return;
  }

  toggleButton(false);
  dataTimePicker.disabled = true;
  if (countdownInterval) clearInterval(countdownInterval);
  countdownInterval = setInterval(updateTimer, 1000);
});

function updateTimer() {
  const timeDifference = userSelectedDate - new Date();
  if (timeDifference > 0) {
    const timeParts = convertMs(timeDifference);
    dataDays.textContent = addLeadingZero(timeParts.days);
    dataHours.textContent = addLeadingZero(timeParts.hours);
    dataMinutes.textContent = addLeadingZero(timeParts.minutes);
    dataSeconds.textContent = addLeadingZero(timeParts.seconds);
  } else {
    clearInterval(countdownInterval);
    iziToast.info({
      message: 'The countdown has ended',
      position: 'topRight',
    });
    toggleButton(false);
    dataTimePicker.disabled = false;
  }
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor((ms % hour) / minute);
  const seconds = Math.floor((ms % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}