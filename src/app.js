console.time()

function isNumber (s) { return !isNaN(s) }

function insertConsole () {
  const td = document.querySelector('#Layer1 > form > table > tbody > tr:nth-child(3) > td:nth-child(2)')
  if (!td) { return console.warn('找不到可以插入回饋方塊的位置。') }
  const inputBox = document.getElementById('seccode')
  const div = document.createElement('div')
  const br = document.createElement('br')
  div.innerText = '辨識中... 第一次使用需要花費較長時間'
  div.style.color = 'red'
  td.insertBefore(br, inputBox.nextSibling.nextSibling)
  td.insertBefore(div, br.nextSibling.nextSibling)
  return div
}

async function recoCaptcha () {
  const url = 'https://portal.nctu.edu.tw/captcha/claviska-simple-php-captcha/pic.php'
  const res = await fetch(url, { credentials: 'same-origin' })
  const blob = await res.blob()
  const result = await window.Tesseract.recognize(blob)
  const text = result.symbols.map((symbol) =>
    symbol.choices.find((choice) => isNumber(choice.text))) // 從各 choice 中挑選出信心度最高的「數字」
    .filter((choice) => choice) // 濾掉沒有帶數字的 choice
    .map((choice) => choice.text)
    .join('')
  if (text.length !== 4) {
    console.warn('辨識失敗，重新抓取圖片再試一次。', text)
    return recoCaptcha()
  }
  return text
}

async function __main__ () {
  const startTime = new Date()
  const consoleBox = insertConsole()
  const text = await recoCaptcha()
  console.timeEnd()
  const inputBox = document.getElementById('seccode')
  inputBox.value = text
  const consumeTime = new Date() - startTime
  consoleBox.innerText = `辨識成功，耗時：${consumeTime / 1000}秒`
}

__main__()
