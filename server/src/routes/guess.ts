import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { authenticate } from '../plugins/authenticate'
import { z } from 'zod'

export async function guessRoutes(fastify: FastifyInstance ){
// Contagens de palpites - bolão
fastify.get('/guesses/count', async ()=> {
  const count= await prisma.guess.count()
 
   return {count}
 })

// Criação de um bolão
fastify.post('/pools/:poolId/games/:gameId/guesses', {
  onRequest: [authenticate]
}, async (request, reply) => {
const createGuessParams = z.object({
  poolId: z.string(),
  gameId: z.string(),
})
const { poolId, gameId } = createGuessParams.parse(request.params)
console.log(poolId)
console.log(gameId)

const createGuessBody = z.object({
  firstTeamPoints: z.number(),
  secondTeamPoints: z.number()
})



const { firstTeamPoints, secondTeamPoints } = createGuessBody.parse(request.body)
console.log(firstTeamPoints)
console.log(secondTeamPoints)
return {
  poolId,
  gameId,
  firstTeamPoints,
  secondTeamPoints
}

})


}