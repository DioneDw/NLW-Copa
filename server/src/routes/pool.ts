import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod';
import ShortUniqueID from 'short-unique-id';

export async function poolRoutes(fastify: FastifyInstance ){
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
 
  return reply.status(201).send({code})
  })
 
}