import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod';
import ShortUniqueID from 'short-unique-id';
import { authenticate } from '../plugins/authenticate';
import { Prisma } from '@prisma/client';

export async function poolRoutes(fastify: FastifyInstance ){
// Contando bolões
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
 
  try{
    await request.jwtVerify()
    await prisma.pool.create({
      data: {
        title,
        code,
        ownerId: request.user.sub,

        participants: {
          create: {
            userId: request.user.sub
          }
        }
      }
    })
  } catch{
    await prisma.pool.create({
      data: {
        title,
        code
      }
     })
  }

  return reply.status(201).send({code})
  })

// Entrando em um bolão
fastify.get('/pools/join', {
    onRequest: [authenticate]
  }, 
  async (request)=> {
   const pools = await prisma.pool.findMany({
    where: {
      participants: {
        some: {
          userId: request.user.sub, 
        }
      }
    },
    include: {
      _count: {
       select:{
        participants: true,
       }
      },
      participants:{
        select:{
          id: true,
          user:{
            select:{
              avatarUrl: true,
            }
          }
        },
        take: 4,
      },
      owner: {
        select: {
          id: true,
          name: true,
        }
      }
    }
  
  
  
   })
   return { pools }
  
  })

// Detalhes de um bolão
fastify.get('/pools/:id', {
  onRequest: [authenticate]
}, async (request) => {
 const getPoolParams = z.object({
  id: z.string(),
 })

 const { id } = getPoolParams.parse(request.params)
 
 const pool = await prisma.pool.findUnique({
 where: {
  id,
},
include: {
  _count: {
   select:{
    participants: true,
   }
  },
  participants:{
    select:{
      id: true,
      user:{
        select:{
          avatarUrl: true,
        }
      }
    },
    take: 4,
  },
  owner: {
    select: {
      id: true,
      name: true,
    }
  }
}
})

return { pool }
})





}