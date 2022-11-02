import Fastify from "fastify";
import { PrismaClient} from '@Prisma/client';

const prisma = new PrismaClient({
  log: ['query'],

})


async function bootstrap(){
 
  const fastify = Fastify({
    logger: true,
  })

// Primeira porta - bolão
fastify.get('/pools/count', async ()=> {
 const count= await prisma.pool.count()

  return {count}
})





await fastify.listen({ port:3333 })


}
bootstrap()