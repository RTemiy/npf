import './index.css'
import './scripts/GSAPI'
import GoogleAppScriptAPI from "./scripts/GSAPI";

const mainForm = document.forms.order
const leadForm = document.forms.lead
const specialCostElement = document.body.querySelector('#specialCost')
const miniForm = document.forms.mini
const popup = document.body.querySelector('.popup')
const statusTab = document.body.querySelector('.status-popup')
const statusTextElement = statusTab.querySelector('.status-popup__text')
const statusEmojiElement = statusTab.querySelector('.status-popup__emoji')
const API = new GoogleAppScriptAPI('https://script.google.com/macros/s/AKfycbzrjjzKbuSMgRIWF2sZqSV1ECWjNs3BVYcwGpigo7q5FloSHgtLjvU4q_OXPZFx18gH9w/exec')

const lighterCost = 530
const meterCost = 395
const baseCost = 0

document.body.querySelectorAll('.toFormButton').forEach(button => {
  button.onclick = () => {
    popup.classList.remove('popup_hide')
  }
})

mainForm.buttonClose.onclick = () => {
  popup.classList.add('popup_hide')
}

API.getData().then(res => {
  const discTitle = document.body.querySelector('.lead__discount-title')
  const discText = document.body.querySelector('.lead__discount-paragraph')
  const text1 = document.body.querySelector('#v1')
  const text2 = document.body.querySelector('#v2')
  const text3 = document.body.querySelector('#v3')
  const text4 = document.body.querySelector('#v4')
  const text5 = document.body.querySelector('#v5')
  discTitle.innerText = res.title
  discText.innerText = res.text
  text1.innerText = res.v1
  text2.innerText = res.v2
  text3.innerText = res.v3
  text4.innerText = res.v4
  text5.innerText = res.v5
  discTitle.classList.add('lead__discount-title_show')
  discText.classList.add('lead__discount-paragraph_show')
})

mainForm.addEventListener('submit', (e) => {
  e.preventDefault()
  showStatusTab()
  popup.classList.add('popup_hide')
  API.post({
    name: mainForm.name.value,
    tel: mainForm.tel.value,
    date: getTime().date
  }).then(res => {
    if (res.ok) {
      mainForm.reset()
      changeStatusTabText('Заявка успешно отправлена', '✔️')
    } else {
      changeStatusTabText('Что-то пошло не так', '❌')
    }
  }).catch(err => {
    console.log(err)
    changeStatusTabText('Что-то пошло не так', '❌')
  }).finally(() => {
    setTimeout(hideStatusTab, 1000)
  })
})

leadForm.addEventListener('submit', (e) => {
  e.preventDefault()
  showStatusTab()
  API.post({
    name: leadForm.name.value,
    tel: leadForm.tel.value,
    lights: leadForm.lights.value,
    area: leadForm.area.value,
    date: getTime().date
  }).then(res => {
    if (res.ok) {
      leadForm.reset()
      changeStatusTabText('Заявка успешно отправлена', '✔️')
    } else {
      changeStatusTabText('Что-то пошло не так', '❌')
    }
  }).catch(err => {
    console.log(err)
    changeStatusTabText('Что-то пошло не так', '❌')
  }).finally(() => {
    setTimeout(hideStatusTab, 1000)
  })
})

function makeFinalLeadCost () {
  const resultCost = (leadForm.area.value * meterCost) + (leadForm.lights.value * lighterCost) + baseCost
  specialCostElement.innerText = resultCost + '₽'
}

makeFinalLeadCost()

leadForm.addEventListener('change', () => {
  makeFinalLeadCost()
})

miniForm.addEventListener('submit', (e) => {
  e.preventDefault()
  showStatusTab()
  API.post({
    name: miniForm.name.value,
    tel: miniForm.tel.value,
    date: getTime().date
  }).then(res => {
    if (res.ok) {
      miniForm.reset()
      changeStatusTabText('Заявка успешно отправлена', '✔️')
    } else {
      changeStatusTabText('Что-то пошло не так', '❌')
    }
  }).catch(err => {
    console.log(err)
    changeStatusTabText('Что-то пошло не так', '❌')
  }).finally(() => {
    setTimeout(hideStatusTab, 1000)
  })
})

function showStatusTab() {
  changeStatusTabText('Заявка отправляется, подождите', '⏱')
  statusTab.classList.add('status-popup_show')
}

function hideStatusTab() {
  statusTab.classList.remove('status-popup_show')
}

function changeStatusTabText (text, emoji) {
  statusTextElement.innerText = text
  statusEmojiElement.innerText = emoji
}

function getTime () {
  let today = new Date()
  const dd = String(today.getDate()).padStart(2, '0')
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const yyyy = today.getFullYear()
  const nowTime =
    today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
  today = dd + '.' + mm + '.' + yyyy
  return {
    date: today,
    time: nowTime
  }
}
