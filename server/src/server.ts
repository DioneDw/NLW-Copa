import Fastify from "fastify";
import { PrismaClient} from '@prisma/client';
import { z } from 'zod';
import ShortUniqueID from 'short-unique-id';


import cors from '@fastify/cors';

const prisma = new PrismaClient({
  log: ['query'],

})

async function bootstrap(){
 
  const fastify = Fastify({
    logger: true,
  })


await fastify.register(cors, {
  origin: true,
})

// Primeira porta - bolão
fastify.get('/pools/count', async ()=> {
 const count= await prisma.pool.count()

  return {count}
})

// Criando um bolão 
fastify.post('/pools', async (request, reply)=> {
 const createdPoolBody = z.object({
  title: z.string(),
 })
 const {title} = createdPoolBody.parse(request.body)

 const generate = new ShortUniqueID({length:6})
 const code= String(generate()).toUpperCase() 

 await prisma.pool.create({
  data: {
    title,
    code
  }
 })

  reply.status(201).send(code)

 return { code }
 })

// Contagens de usuário - bolão
fastify.get('/users/count', async ()=> {
  const count= await prisma.user.count()
 
   return {count}
 })

// Contagens de palpites - bolão
fastify.get('/guesses/count', async ()=> {
  const count= await prisma.guess.count()
 
   return {count}
 })



await fastify.listen({ port:3333})

// , host:'0.0.0.0'

}
bootstrap()

