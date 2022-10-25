import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")
//seletores ate chegar na propiedade

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    elo: ["#F50303", "#349DA4"],
    hipercard: ["#522018", "#822324"],
    amex: ["#0677A6", "#1351BA"],
    diners: ["#1351BA", "#373E93"],
    jcb: ["#231F20", "#FCB031"],
    maestro: ["#3A9BD9", "#CD3A32"],
    default: ["black", "gray"],
  }

  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}
setCardType("default") //a prop. do obj colors que eu passar esta se tornando = parametro type.

globalThis.setCardType = setCardType
//adicionando a minha função sem executa deixando ela de forma global. isso permite exe. na DOM

//CVC
//Restringi o input -> max de 4 num | não permite letras
const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "0000", //0 equivale aos digitos
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

//EXPIRAÇÃO
const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear() - 5).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

//NÚMERO CARTÃO
const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardType: "visa",
    },

    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardType: "mastercard",
    },

    {
      mask: "0000 0000 0000 0000",
      regex: /^6\d{0,15}/,
      cardType: "elo",
    },

    {
      mask: "0000 0000 0000 0000",
      regex: /^7\d{0,15}/,
      cardType: "hipercard",
    },

    {
      mask: "0000 000000 00000",
      regex: /^3[4-7]\d{0,13}/,
      cardType: "amex",
    },

    {
      mask: "0000 000000 0000",
      regex: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
      cardType: "diners",
    },

    {
      mask: "0000 0000 0000 0000",
      regex: /^(?:5[0-6-7-8]\d{0,2}|6304|67\d{0,2})\d{0,12}/,
      cardType: "maestro",
    },

    {
      mask: "0000 0000 0000 0000",
      cardType: "default",
    },
  ],

  //appended = toda vez que clicar/digitar dispara a função
  dispatch: function (appended, dynamicMasked) {
    //filtragem pra so pegar números
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      //significa = encontre | esta disponivel em todos os arrays | verifica se o item é igual
      return number.match(item.regex)
    })
    //console.log(foundMask)
    return foundMask
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

//SUBSTITUINDO VALORES DENTRO DO CARTÃO

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
  alert("Cartão adicionado com sucesso!")
})
//remove o comportamento padrão do nav de att a pgn assim que clicar no btn
document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})
//substitui o valor do label "fulano" p/ o valor do input
const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")
  ccHolder.innerText =
    cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value
})

//substitui o valor do label "123" p/ o valor do input
//on = funciona de forma similar que o addEventListener
//accept = se o valor do input está de acordo com a mascara (Imask) ele permite a entrada de dados
securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value") //label
  ccSecurity.innerText = code.length === 0 ? "123" : code
}

//substitui o valor do label "DO CARTÃO" p/ o valor do input

cardNumberMasked.on("accept", () => {
  //att o tipo do cartão ln- 128 e 129 | ln-128 caminho ate tipo do cartão
  const cardType = cardNumberMasked.masked.currentMask.cardType
  setCardType(cardType)
  updateCcNumber(cardNumberMasked.value)
})

function updateCcNumber(number) {
  const ccNumber = document.querySelector(".cc-number")
  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

//substitui o valor do label "da expedição" p/ o valor do input

expirationDateMasked.on("accept", () => {
  updateExperationDate(expirationDateMasked.value)
})

function updateExperationDate(date) {
  const ccExpiration = document.querySelector(".cc-expiration .value")
  ccExpiration.innerText = date.length === 0 ? "02/32" : date
}
