const CARD_BORDER_GRADIENTS = [
   'linear-gradient(90deg, #00c7bf 0%, #2771ff 100%)',
   'linear-gradient(102.49deg, #F567F9 24.68%, #3DADFF 73.25%)',
   'linear-gradient(102.49deg, #F567F9 24.68%, #FF2727 73.25%)'
]

let gradientQueue = []

const shuffleGradients = () => {
   gradientQueue = [...CARD_BORDER_GRADIENTS]

   for (let i = gradientQueue.length - 1; i > 0; i -= 1) {
      const randomIndex = Math.floor(Math.random() * (i + 1))
      const current = gradientQueue[i]
      gradientQueue[i] = gradientQueue[randomIndex]
      gradientQueue[randomIndex] = current
   }
}

export const getDefaultCardBorderGradient = () => CARD_BORDER_GRADIENTS[0]

export const getNextCardBorderGradient = () => {
   if (!gradientQueue.length) {
      shuffleGradients()
   }

   return gradientQueue.pop()
}
